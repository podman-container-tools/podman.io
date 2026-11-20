import React from 'react';
import { Icon } from '@iconify/react';
import TranscriptViewer, {
  ChatLogViewer,
  isTranscriptContent,
  isChatContent,
  isNotCapturedContent,
} from '@site/src/components/content/TranscriptViewer';
import {
  extractTimestampSeconds,
  dispatchSeekMeetingVideo,
  formatVideoOffsetDisplay,
} from '@site/src/utils/communityMeetings';
import { VideoOffsetContext } from '@site/src/utils/VideoOffsetContext';

/**
 * Extracts plain text recursively from React nodes (used for MDX code blocks).
 */
function extractTextContent(node: React.ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (!node) return '';
  if (Array.isArray(node)) return node.map(extractTextContent).join('');
  if (React.isValidElement(node)) {
    return extractTextContent((node.props as { children?: React.ReactNode }).children);
  }
  return '';
}

export function scrollToTranscriptContainer(): void {
  let attempts = 0;
  const checkAndScroll = () => {
    attempts++;
    const containers = document.querySelectorAll('#transcript-viewer-container');
    let el: HTMLElement | null = null;
    for (let i = 0; i < containers.length; i++) {
      const item = containers[i] as HTMLElement;
      if (item.offsetWidth > 0 && item.offsetHeight > 0) {
        el = item;
        break;
      }
    }
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    } else if (attempts < 25) {
      setTimeout(checkAndScroll, 40);
    }
  };
  checkAndScroll();
}

/**
 * Renders an MDX anchor tag. If the link or its text represents a video timestamp,
 * renders an interactive button that jumps within the in-page video player.
 */
const MeetingAnchor: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({ href, children, ...restProps }) => {
  let textContent = '';
  if (typeof children === 'string') {
    textContent = children.trim();
  } else if (Array.isArray(children)) {
    textContent = children
      .filter(c => typeof c === 'string')
      .join('')
      .trim();
  }

  const timestampSeconds = extractTimestampSeconds(href, textContent);
  const isYouTubeLink = href ? /(?:youtube\.com|youtu\.be)/i.test(href) : false;
  const isTimestamp = timestampSeconds !== null || isYouTubeLink;
  const targetSeconds = timestampSeconds ?? 0;
  const isTimeString = Boolean(textContent && /\b\d{1,2}:\d{2}(?::\d{2})?\b/.test(textContent));

  if (isTimestamp) {
    const handleSeekClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dispatchSeekMeetingVideo(targetSeconds, 0, false);
      window.dispatchEvent(new CustomEvent('switchMeetingTab', { detail: { tab: 'transcript' } }));
      window.dispatchEvent(new CustomEvent('scrollToTranscriptSeconds', { detail: { seconds: targetSeconds } }));
      scrollToTranscriptContainer();
    };

    if (isTimeString) {
      return (
        <button
          type="button"
          onClick={handleSeekClick}
          title={`Jump to ${textContent} in video`}
          style={{ border: 'none', outline: 'none', textDecoration: 'none' }}
          className="dark:hover:bg-purple-600 mx-1 inline-flex cursor-pointer items-center gap-1 rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-900 !no-underline shadow-sm transition hover:bg-purple-700 hover:text-white hover:!no-underline dark:bg-purple-700 dark:text-white dark:hover:text-white">
          <Icon
            icon="material-symbols:play-circle-outline-rounded"
            className="text-sm text-purple-900 dark:text-white"
          />
          <span>{children}</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={handleSeekClick}
        title={`Jump to ${timestampSeconds}s in video`}
        style={{ border: 'none', outline: 'none', textDecoration: 'none' }}
        className="inline-flex cursor-pointer items-center gap-1 border-0 bg-transparent p-0 font-semibold text-purple-700 !no-underline transition hover:text-purple-900 hover:!no-underline dark:text-purple-300 dark:hover:text-purple-100">
        <Icon icon="material-symbols:play-circle-outline-rounded" className="text-sm" />
        <span>{children}</span>
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-semibold text-purple-700 underline decoration-purple-300 underline-offset-4 transition hover:text-purple-900 dark:text-purple-300 dark:decoration-purple-500 dark:hover:text-purple-100"
      {...restProps}>
      {children}
    </a>
  );
};

const IsInsidePreContext = React.createContext(false);

export const meetingMdxComponents = {
  h1: () => null,
  h2: () => null,
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = typeof children === 'string' ? children : '';

    let icon = 'material-symbols:article-outline';
    if (/attendee/i.test(text)) icon = 'material-symbols:group-outline';
    else if (/note/i.test(text)) icon = 'material-symbols:edit-note-rounded';
    else if (/topic/i.test(text)) icon = 'material-symbols:topic-outline';
    else if (/chat/i.test(text)) icon = 'material-symbols:chat-bubble-outline';
    else if (/transcript/i.test(text)) icon = 'material-symbols:subtitles-outline';
    else if (/next/i.test(text)) icon = 'material-symbols:event-upcoming-outline';

    return (
      <div className="mb-4 mt-8 pb-1">
        <h3
          className="m-0 flex items-center gap-2.5 text-xl font-bold tracking-tight text-[#892ca0] dark:text-[#a542c3]"
          {...props}>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#892ca0] text-white dark:bg-[#892ca0] dark:text-white">
            <Icon icon={icon} className="text-lg text-white" />
          </span>
          <span>{children}</span>
        </h3>
      </div>
    );
  },
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="mb-2 mt-6 text-base font-bold text-gray-900 dark:text-white" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className="mb-2 mt-4 text-sm font-bold text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </h5>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="my-3 text-justify text-[15px] leading-relaxed text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </p>
  ),
  a: MeetingAnchor,
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-3 list-disc space-y-1 pl-6 text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="my-1.5 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300" {...props}>
      {children}
    </li>
  ),
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    const rawText = extractTextContent(children);

    if (isNotCapturedContent(rawText)) {
      return (
        <div className="dark:bg-purple-950/20 dark:text-purple-200 my-4 flex items-center gap-3 rounded-xl border border-purple-100 bg-purple-50/50 p-4 text-sm text-purple-900 shadow-sm dark:border-purple-900/30">
          <Icon
            icon="material-symbols:info-outline"
            className="text-purple-600 dark:text-purple-400 shrink-0 text-xl"
          />
          <span className="font-medium">{rawText.trim()}</span>
        </div>
      );
    }

    if (isChatContent(rawText)) {
      return <ChatLogViewer rawText={rawText} />;
    }

    if (isTranscriptContent(rawText)) {
      return <TranscriptViewer rawText={rawText} />;
    }

    return (
      <div className="relative my-4 overflow-hidden rounded-xl border border-black/[0.08] bg-gray-900 shadow-sm dark:border-white/10">
        <pre className="max-h-96 overflow-auto p-5 font-mono text-xs leading-relaxed text-gray-100" {...props}>
          <IsInsidePreContext.Provider value={true}>{children}</IsInsidePreContext.Provider>
        </pre>
      </div>
    );
  },
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInsidePre = React.useContext(IsInsidePreContext);
    if (isInsidePre) {
      return (
        <code className={className || 'font-mono text-xs text-gray-100'} {...props}>
          {children}
        </code>
      );
    }
    return (
      <code
        className="rounded-md bg-purple-50 px-1.5 py-0.5 font-mono text-xs font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300"
        {...props}>
        {children}
      </code>
    );
  },
  wrapper: ({ children }: { children?: React.ReactNode }) => {
    const { activeTab } = React.useContext(MeetingTabContext);
    const videoOffset = React.useContext(VideoOffsetContext);
    const childArray = React.Children.toArray(children);

    const notesElements: React.ReactNode[] = [];
    const transcriptElements: React.ReactNode[] = [];
    let isTranscriptSection = false;

    for (const child of childArray) {
      if (React.isValidElement(child)) {
        const text = extractTextContent(child).trim();
        const mdxType = (child.props as { mdxType?: string })?.mdxType || '';
        const isHeading =
          mdxType === 'h2' ||
          mdxType === 'h3' ||
          mdxType === 'h4' ||
          (typeof child.type === 'string' && /^h[2-4]$/.test(child.type));

        if (isHeading && (/raw (?:meeting )?chat/i.test(text) || /transcript/i.test(text))) {
          isTranscriptSection = true;
        } else if (isHeading && isTranscriptSection && !/raw (?:meeting )?chat|transcript/i.test(text)) {
          isTranscriptSection = false;
        }

        if (isTranscriptSection) {
          transcriptElements.push(child);
        } else {
          // Check if a pre element is actually a raw transcript or chat block even without a preceding heading
          if (mdxType === 'pre' || child.type === 'pre') {
            const rawPre = extractTextContent(child);
            if (isTranscriptContent(rawPre) || isChatContent(rawPre)) {
              transcriptElements.push(child);
              continue;
            }
          }
          notesElements.push(child);
        }
      } else {
        if (isTranscriptSection) {
          transcriptElements.push(child);
        } else {
          notesElements.push(child);
        }
      }
    }

    if (activeTab === 'transcript') {
      if (transcriptElements.length === 0) {
        return (
          <div className="dark:bg-gray-800/40 my-8 rounded-xl border border-black/[0.08] bg-gray-50/60 p-8 text-center dark:border-white/10">
            <Icon icon="material-symbols:subtitles-off-outline" className="text-gray-400 mx-auto mb-2 text-4xl" />
            <h4 className="text-gray-800 dark:text-gray-200 text-base font-bold">No Transcript or Chat Available</h4>
            <p className="dark:text-gray-400 mt-1 text-sm text-gray-500">
              A full transcript or chat log was not captured or recorded for this session. Please switch to the Meeting
              Notes tab to review the session minutes and discussion points.
            </p>
          </div>
        );
      }
      return (
        <div className="meeting-transcript-section space-y-6">
          {videoOffset > 0 &&
            (() => {
              const mins = Math.floor(videoOffset / 60);
              const secs = videoOffset % 60;
              const timestampLabel =
                mins > 0 && secs > 0
                  ? `${mins}:${String(secs).padStart(2, '0')}`
                  : mins > 0
                    ? `${mins}:00`
                    : `0:${String(secs).padStart(2, '0')}`;
              const handleNoticeClick = (e: React.MouseEvent) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('switchMeetingTab', { detail: { tab: 'transcript' } }));
                dispatchSeekMeetingVideo(0, 0, false);
                window.dispatchEvent(
                  new CustomEvent('scrollToTranscriptSeconds', { detail: { seconds: videoOffset } }),
                );
                scrollToTranscriptContainer();
              };
              return (
                <div className="mb-6 rounded-xl bg-white p-4 shadow dark:bg-[#1a1025] dark:shadow-[0_1px_6px_rgba(0,0,0,0.4)]">
                  <div className="flex items-start gap-3.5">
                    <div className="shadow-xs flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#892ca0] text-white">
                      <Icon icon="material-symbols:schedule-outline-rounded" className="text-xl text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[#892ca0] dark:text-[#a542c3]">
                        Recording Timeline Offset
                      </p>
                      <p className="mb-3 text-xs leading-relaxed text-gray-700 dark:text-gray-300 sm:text-sm">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatVideoOffsetDisplay(videoOffset)}
                        </span>{' '}
                        of this meeting were not captured in the YouTube recording — the video was cut short at the
                        start. Video start (0:00) redirects to transcript timestamp{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">{timestampLabel}</span>.
                      </p>
                      <button
                        type="button"
                        onClick={handleNoticeClick}
                        title={`Start video at 0:00 and jump to transcript at ${timestampLabel}`}
                        style={{ border: 'none', outline: 'none', textDecoration: 'none' }}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#892ca0] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#722387] dark:bg-[#892ca0] dark:hover:bg-[#a542c3]">
                        <Icon icon="material-symbols:play-circle-outline-rounded" className="text-base" />
                        Start video from 0:00 and jump to transcript at {timestampLabel}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          {transcriptElements}
        </div>
      );
    }

    return <div className="meeting-notes-section">{notesElements}</div>;
  },
};

export type MeetingTabType = 'notes' | 'transcript';

export interface MeetingTabContextValue {
  activeTab: MeetingTabType;
}

export const MeetingTabContext = React.createContext<MeetingTabContextValue>({
  activeTab: 'notes',
});
