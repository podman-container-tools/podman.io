import type { ComponentType } from 'react';
import * as markDownFiles from '@site/static/data/meetings/notes/index';

export type MeetingItem = {
  id: string; // e.g. "2026-08-04"
  title: string;
  isCabal: boolean;
  date: string; // e.g. "Aug 4, 2026"
  day: string; // e.g. "Tuesday"
  year: number;
  fullDate: string; // e.g. "Aug 4, 2026 11:00 a.m. Eastern (UTC-4)"
  recordingUrl?: string;
  recordingText?: string;
  searchIndex?: string;
  Component?: ComponentType<unknown>;
  topics: string[];
  hasTranscript: boolean;
  /**
   * How many seconds the Zoom/Meet transcript timestamps are ahead of the
   * YouTube recording start.  YouTube sometimes cuts the first N minutes of a
   * meeting, so transcript time 0:07:37 corresponds to video time 0:00:00.
   * Leave undefined (or omit from the map below) to use 0 — no adjustment.
   */
  videoOffset: number;
};

/**
 * Per-meeting video offset registry.
 *
 * KEY  — meeting id in "YYYY-MM-DD" format
 * VALUE — offset in SECONDS (transcript time − this value = YouTube seek time)
 *
 * Example: the 2024-04-16 Cabal meeting transcript starts ~7 min 37 s before
 * the YouTube recording, so we set 457 (= 7*60 + 37).
 *
 * How to add a new entry:
 *   '2026-06-03': 7 * 60 + 37,   // 7 min 37 s
 */
export const MEETING_VIDEO_OFFSETS: Record<string, number> = {
  // Cabal
  '2025-09-02': 12 * 60 + 57, // 12 min 57 s
  '2025-11-04': 10 * 60 + 58, // 10 min 58 s
  '2026-03-03': 7 * 60 + 15, // 7 min 15 s
  '2026-05-05': 10 * 60 + 15, // 10 min 15 s

  // Community
  '2025-10-07': 10 * 60 + 55, // 10 min 55 s
  '2025-12-02': 7 * 60 + 36, // 7 min 36 s
  '2026-02-03': 7 * 60 + 14, // 7 min 14 s
  '2026-04-07': 6 * 60 + 2, // 6 min 2 s
  '2026-06-02': 4 * 60 + 24, // 4 min 24 s
  '2026-08-04': 10 * 60 + 52, // 10 min 52 s
  '2026-10-06': 4 * 60 + 43, // 4 min 43 s
};

/**
 * Frontmatter shape written at the top of each meeting .md file.
 * New meetings should declare these; old ones are handled by the MDX tree fallback.
 */
type MeetingFrontMatter = {
  recording?: string;
  recordingText?: string;
  isCabal?: boolean;
};

type RecordingInfo = {
  url: string;
  text: string;
};

/** Typed shape of an imported MDX/MD module from Docusaurus. */
type MdxModule = {
  contentTitle?: string;
  toc?: Array<{ value?: string }>;
  frontMatter?: MeetingFrontMatter;
  /** Some Docusaurus MDX pipelines nest front matter here */
  metadata?: { frontMatter?: MeetingFrontMatter };
  default?: (ref: unknown) => unknown;
};

const RECORDING_HREF_RE = /(?:youtube\.com|youtu\.be|bluejeans\.com|drive\.google\.com)/i;
const YOUTUBE_ID_RE = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
const TIME_STRING_RE = /\b(?:(\d{1,2}):)?(\d{1,2}):(\d{2})\b/;
const URL_TIMESTAMP_RE = /[?&](?:t|start)=([0-9hms:]+)/i;
const DIGITS_ONLY_S_RE = /^\d+s?$/i;
const HOURS_RE = /(\d+)h/i;
const MINUTES_RE = /(\d+)m/i;
const SECONDS_RE = /(\d+)s/i;

const GENERIC_HEADING_PATTERNS = [
  /attendee/i,
  /meeting notes/i,
  /quick recap/i,
  /next steps/i,
  /^topics$/i,
  /raw (?:meeting )?chat/i,
  /raw .*transcript/i,
  /next (?:community )?meeting/i,
  /possible topics/i,
  /^[0-9]{1,2}:[0-9]{2}/,
  /^[A-Za-z]+ \d{1,2}, \d{4}/,
  /^video recording/i,
];

/** Read recording info directly from frontmatter — fast and reliable. */
function extractRecordingFromFrontMatter(fm?: MeetingFrontMatter): RecordingInfo | undefined {
  if (!fm?.recording) return undefined;
  return { url: fm.recording, text: fm.recordingText || 'Watch Recording' };
}

/** Recursively collect all text from a React-like node tree. */
function collectText(node: unknown): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(collectText).join('');
  if (typeof node === 'object' && node !== null && 'props' in node) {
    const props = (node as { props?: { children?: unknown } }).props;
    return collectText(props?.children);
  }
  return '';
}

/**
 * Fallback for meetings without frontmatter: recursively walk the rendered MDX
 * tree and return the first <a href> pointing at a known recording host.
 * Unlike the old children[0]/children[1] walk, this is structure-agnostic and
 * will not break if someone formats the paragraph differently.
 */
export function extractRecordingFromMdxTree(root: unknown): RecordingInfo | undefined {
  const visit = (node: unknown): RecordingInfo | undefined => {
    if (node == null) return undefined;
    if (Array.isArray(node)) {
      for (const child of node) {
        const found = visit(child);
        if (found) return found;
      }
      return undefined;
    }
    if (typeof node !== 'object' || !('props' in node)) return undefined;
    const el = node as { props?: { href?: string; children?: unknown } };
    const href = el.props?.href;
    if (typeof href === 'string' && href) {
      const label = collectText(el.props?.children).trim() || 'Watch Recording';
      if (RECORDING_HREF_RE.test(href) || /recording|bluejeans|video/i.test(label)) {
        return { url: href, text: label };
      }
    }
    return visit(el.props?.children);
  };
  return visit(root);
}

/** Resolve recording info: frontmatter first, MDX tree walk as fallback. */
function resolveRecording(file: MdxModule): RecordingInfo | undefined {
  const fm = file.frontMatter ?? file.metadata?.frontMatter;
  const fromFrontMatter = extractRecordingFromFrontMatter(fm);
  if (fromFrontMatter) return fromFrontMatter;

  if (typeof file.default !== 'function') return undefined;
  try {
    return extractRecordingFromMdxTree(file.default({ current: null }));
  } catch {
    return undefined;
  }
}

/**
 * Extract clean, reader-friendly discussion topic titles from MDX table-of-contents headings.
 */
export function extractMeetingTopics(toc?: Array<{ value?: string }>): string[] {
  if (!Array.isArray(toc)) return [];

  const topics: string[] = [];

  for (const item of toc) {
    const raw = typeof item?.value === 'string' ? item.value.trim() : '';
    if (!raw) continue;

    if (GENERIC_HEADING_PATTERNS.some(pattern => pattern.test(raw))) {
      continue;
    }

    let cleaned = raw
      .replace(/^\d+[.)]\s*/, '')
      .replace(/\s*\(?\s*\[?\d{1,2}:\d{2}(?::\d{2})?\]?.*$/i, '')
      .trim();

    cleaned = cleaned
      .replace(/\s+-\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:,\s*[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)*\s*$/, '')
      .replace(/\s*-\s*$/, '')
      .trim();

    if (cleaned && cleaned.length > 2 && !topics.includes(cleaned)) {
      topics.push(cleaned);
    }
  }

  return topics;
}

export function detectMeetingHasTranscript(toc?: Array<{ value?: string }>): boolean {
  if (!Array.isArray(toc)) return false;
  return toc.some(item => {
    const v = typeof item?.value === 'string' ? item.value.toLowerCase() : '';
    return v.includes('transcript') || v.includes('raw meeting chat') || v.includes('chat:');
  });
}

let cachedMeetings: MeetingItem[] | null = null;

export function getAllMeetings(): MeetingItem[] {
  if (cachedMeetings) {
    return cachedMeetings;
  }

  const list: MeetingItem[] = [];

  Object.entries(markDownFiles).forEach(([key, mdFile]: [string, unknown]) => {
    if (!mdFile) return;

    const file = mdFile as MdxModule;
    const frontMatter = file.frontMatter ?? file.metadata?.frontMatter;

    // key is like "F20260804"
    const rawDateStr = key.replace(/^F/, '');
    const yearStr = rawDateStr.slice(0, 4);
    const monthStr = rawDateStr.slice(4, 6);
    const dayStr = rawDateStr.slice(6, 8);
    const id = `${yearStr}-${monthStr}-${dayStr}`;
    const year = parseInt(yearStr, 10);

    const title: string = file.contentTitle || 'Podman Community Meeting Notes';
    const isCabal = frontMatter?.isCabal ?? title.toLowerCase().includes('cabal');

    const tocVal: string = (file.toc?.[0]?.value as string) || '';
    const datePart = tocVal.split(/[0-9]{1,2}:[0-9]{2}/)[0].trim() || id;

    // Calculate day of the week
    let day = 'Tuesday';
    try {
      const dateObj = new Date(`${yearStr}-${monthStr}-${dayStr}T12:00:00Z`);
      if (!isNaN(dateObj.getTime())) {
        day = dateObj.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
      }
    } catch {
      // fallback
    }

    // Prefer frontmatter; fall back to a structure-agnostic MDX link walk.
    const recording = resolveRecording(file);
    const recordingUrl = recording?.url;
    const recordingText = recording?.text || 'Watch Recording';

    const tocHeadings = Array.isArray(file.toc)
      ? file.toc.map(item => (typeof item?.value === 'string' ? item.value : '')).filter(Boolean)
      : [];
    const topics = extractMeetingTopics(file.toc);
    const hasTranscript = detectMeetingHasTranscript(file.toc);
    const searchIndex = [id, datePart, day, title, tocVal, ...tocHeadings, ...topics].join(' ').toLowerCase();

    list.push({
      id,
      title,
      isCabal,
      date: datePart,
      day,
      year,
      fullDate: tocVal || datePart,
      recordingUrl,
      recordingText,
      searchIndex,
      Component: file.default as ComponentType<unknown> | undefined,
      topics,
      hasTranscript,
      videoOffset: MEETING_VIDEO_OFFSETS[id] ?? 0,
    });
  });

  // Sort descending by id (YYYY-MM-DD)
  list.sort((a, b) => b.id.localeCompare(a.id));

  cachedMeetings = list;
  return cachedMeetings;
}

export function getCommunityMeetings(): MeetingItem[] {
  return getAllMeetings().filter(m => !m.isCabal);
}

export function getCabalMeetings(): MeetingItem[] {
  return getAllMeetings().filter(m => m.isCabal);
}

export function getRecentCommunityMeetings(count = 4): MeetingItem[] {
  return getCommunityMeetings().slice(0, count);
}

export function getRecentCabalMeetings(count = 4): MeetingItem[] {
  return getCabalMeetings().slice(0, count);
}

export function getMeetingById(id: string): MeetingItem | undefined {
  return getAllMeetings().find(m => m.id === id);
}

/**
 * Extracts YouTube video ID (11 characters) from standard and shortened YouTube URLs.
 */
export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(YOUTUBE_ID_RE);
  return match ? match[1] : null;
}

/**
 * Automatically parses time patterns like "01:29", "17:30", "1:35", "1:23:45"
 * from text into total seconds.
 */
export function parseTimeString(timeStr: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.match(TIME_STRING_RE);
  if (!match) return null;

  const [, hStr, mStr, sStr] = match;
  const m = parseInt(mStr, 10);
  const s = parseInt(sStr, 10);
  if (isNaN(m) || isNaN(s)) return null;

  if (hStr !== undefined) {
    const h = parseInt(hStr, 10);
    if (!isNaN(h)) {
      return h * 3600 + m * 60 + s;
    }
  }
  return m * 60 + s;
}

/**
 * Extracts timestamp in seconds from a URL parameter (t=... or start=...).
 * Supports "89s", "89", "1h2m3s", "1m29s", etc.
 */
export function parseUrlTimestamp(url: string): number | null {
  if (!url) return null;
  const match = url.match(URL_TIMESTAMP_RE);
  if (match) {
    const val = match[1];
    if (DIGITS_ONLY_S_RE.test(val)) {
      return parseInt(val.replace(/s$/i, ''), 10);
    }
    let total = 0;
    let matched = false;
    const h = val.match(HOURS_RE);
    if (h) {
      total += parseInt(h[1], 10) * 3600;
      matched = true;
    }
    const m = val.match(MINUTES_RE);
    if (m) {
      total += parseInt(m[1], 10) * 60;
      matched = true;
    }
    const s = val.match(SECONDS_RE);
    if (s) {
      total += parseInt(s[1], 10);
      matched = true;
    }
    if (matched) return total;

    const fromColon = parseTimeString(val);
    if (fromColon !== null) return fromColon;
  }
  return null;
}

/**
 * Automatically detects and extracts the target timestamp in seconds.
 *
 * The visible link text (e.g. "17:30", "01:29", "08:47") is always prioritized
 * as the user-visible ground truth. This automatically detects where to jump in the
 * YouTube timeline even if a markdown URL has no timestamp or has a copy-pasted wrong parameter.
 * If the link text is regular words (e.g. "demonstrated" or "here"), it falls back to URL parameters.
 */
export function extractTimestampSeconds(href?: string, text?: string): number | null {
  // 1. Text is ALWAYS the user-facing truth!
  if (text) {
    const fromText = parseTimeString(text);
    if (fromText !== null) return fromText;
  }

  // 2. Fallback to URL parameters (e.g. &t=492s)
  if (href) {
    const fromUrl = parseUrlTimestamp(href);
    if (fromUrl !== null) return fromUrl;
  }

  return null;
}

/**
 * Event name for seeking the embedded meeting video player.
 */
export const SEEK_MEETING_VIDEO_EVENT = 'seekMeetingVideo';

export interface SeekMeetingVideoDetail {
  seconds: number;
  scrollPlayer?: boolean;
}

/**
 * Dispatches a typed custom event to seek the active embedded video player.
 *
 * @param transcriptSeconds — raw timestamp from the transcript (in seconds)
 * @param videoOffset       — how many seconds the transcript is ahead of the
 *                            YouTube recording (from MeetingItem.videoOffset).
 *                            Defaults to 0 (no adjustment).
 * @param scrollPlayer      — whether to scroll the video player into view (default: true)
 *
 * The player will seek to max(0, transcriptSeconds − videoOffset).
 */
export function dispatchSeekMeetingVideo(transcriptSeconds: number, videoOffset = 0, scrollPlayer = true): void {
  if (typeof window === 'undefined') return;
  const targetSeconds = Math.max(0, Math.floor(transcriptSeconds - videoOffset));
  window.dispatchEvent(
    new CustomEvent<SeekMeetingVideoDetail>(SEEK_MEETING_VIDEO_EVENT, {
      detail: { seconds: targetSeconds, scrollPlayer },
    }),
  );
}

/**
 * Formats a video offset in seconds into a human-readable duration like "10 min 55 sec".
 */
export function formatVideoOffsetDisplay(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds <= 0) return '0 sec';
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  if (m > 0 && s > 0) return `${m} min ${s} sec`;
  if (m > 0) return `${m} min`;
  return `${s} sec`;
}

export interface MeetingUrlState {
  activeType: 'community' | 'cabal';
  selectedMeetingId: string;
  activeTab: 'notes' | 'transcript';
}

/**
 * Resolves the meeting view state from URL query parameters.
 * Validates that the requested date exists within the selected category's meetings,
 * falling back to the first available meeting if the date is invalid or absent.
 */
export function resolveMeetingUrlState(
  search: string | URLSearchParams,
  communityMeetings: Array<{ id: string }>,
  cabalMeetings: Array<{ id: string }>,
): MeetingUrlState {
  const params = typeof search === 'string' ? new URLSearchParams(search) : search;
  const typeParam = params.get('type');
  const dateParam = params.get('date');
  const tabParam = params.get('tab');

  const activeType: 'community' | 'cabal' = typeParam === 'cabal' ? 'cabal' : 'community';
  const targetList = activeType === 'cabal' ? cabalMeetings : communityMeetings;

  let selectedMeetingId = '';
  if (dateParam && targetList.some(m => m.id === dateParam)) {
    selectedMeetingId = dateParam;
  } else if (targetList.length > 0) {
    selectedMeetingId = targetList[0].id;
  }

  const activeTab: 'notes' | 'transcript' = tabParam === 'transcript' ? 'transcript' : 'notes';

  return {
    activeType,
    selectedMeetingId,
    activeTab,
  };
}

/**
 * Returns the default meeting to select when switching meeting categories.
 */
export function getCategoryDefaultMeeting<T extends { id: string }>(
  type: 'community' | 'cabal',
  communityMeetings: T[],
  cabalMeetings: T[],
): T | undefined {
  const targetList = type === 'cabal' ? cabalMeetings : communityMeetings;
  return targetList[0];
}

/**
 * Builds or updates URL search parameters for meetings page state transitions.
 * Ensures stale parameters are properly cleared (e.g. date parameter when collapsed).
 */
export function buildMeetingUrlSearchParams(
  currentSearch: string | URLSearchParams,
  updates: { date?: string | null; type?: 'community' | 'cabal'; tab?: 'notes' | 'transcript' },
): URLSearchParams {
  const params = new URLSearchParams(typeof currentSearch === 'string' ? currentSearch : currentSearch.toString());
  if (updates.type !== undefined) {
    params.set('type', updates.type);
  }
  if (updates.date !== undefined) {
    if (updates.date) {
      params.set('date', updates.date);
    } else {
      params.delete('date');
    }
  }
  if (updates.tab !== undefined) {
    params.set('tab', updates.tab);
  }
  return params;
}
