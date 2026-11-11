import {
  extractYouTubeId,
  parseTimeString,
  parseUrlTimestamp,
  formatVideoOffsetDisplay,
  resolveMeetingUrlState,
  getCategoryDefaultMeeting,
  buildMeetingUrlSearchParams,
} from '../communityMeetings';

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`[FAIL] ${message}: expected ${String(expected)}, got ${String(actual)}`);
  }
  console.log(`[PASS] ${message}`);
}

export function runCommunityMeetingsTests() {
  // extractYouTubeId tests
  assertEqual(
    extractYouTubeId('https://www.youtube.com/watch?v=dQw4w9WgXcQ'),
    'dQw4w9WgXcQ',
    'extracts ID from standard YouTube URL',
  );
  assertEqual(
    extractYouTubeId('https://youtu.be/dQw4w9WgXcQ'),
    'dQw4w9WgXcQ',
    'extracts ID from shortened youtu.be URL',
  );
  assertEqual(
    extractYouTubeId('https://www.youtube.com/embed/dQw4w9WgXcQ'),
    'dQw4w9WgXcQ',
    'extracts ID from embed URL',
  );
  assertEqual(
    extractYouTubeId('https://www.youtube.com/watch?feature=shared&v=dQw4w9WgXcQ&t=120s'),
    'dQw4w9WgXcQ',
    'extracts ID with extra parameters',
  );
  assertEqual(
    extractYouTubeId('https://lfx.linuxfoundation.org/meetings/12345'),
    null,
    'returns null for LFX video URL',
  );
  assertEqual(extractYouTubeId('https://cncfsandbox.com/video/67890'), null, 'returns null for CNCF video URL');
  assertEqual(extractYouTubeId('https://bluejeans.com/s/xyz123'), null, 'returns null for BlueJeans URL');
  assertEqual(extractYouTubeId(undefined), null, 'returns null for undefined URL');

  // parseTimeString tests
  assertEqual(parseTimeString('01:29'), 89, 'parses MM:SS format');
  assertEqual(parseTimeString('17:30'), 1050, 'parses 17:30 to seconds');
  assertEqual(parseTimeString('1:23:45'), 5025, 'parses HH:MM:SS format');
  assertEqual(parseTimeString('Watch Recording'), null, 'returns null when no timestamp present');

  // parseUrlTimestamp tests
  assertEqual(parseUrlTimestamp('https://youtube.com/watch?v=123&t=89s'), 89, 'parses t=89s');
  assertEqual(parseUrlTimestamp('https://youtube.com/watch?v=123&t=1m29s'), 89, 'parses t=1m29s');

  // formatVideoOffsetDisplay tests
  assertEqual(formatVideoOffsetDisplay(777), '12 min 57 sec', 'formats offset seconds to min/sec');
  assertEqual(formatVideoOffsetDisplay(0), '0 sec', 'formats 0 offset');

  // Regression tests for URL state synchronization & category switching
  const mockCommunityMeetings = [{ id: '2026-08-04' }, { id: '2026-06-02' }, { id: '2026-04-07' }];
  const mockCabalMeetings = [{ id: '2026-05-05' }, { id: '2026-03-03' }];

  // 1. shared link with ?type=community&date=...&tab=transcript
  const sharedLinkState = resolveMeetingUrlState(
    '?type=community&date=2026-06-02&tab=transcript',
    mockCommunityMeetings,
    mockCabalMeetings,
  );
  assertEqual(sharedLinkState.activeType, 'community', 'shared link preserves active type community');
  assertEqual(sharedLinkState.selectedMeetingId, '2026-06-02', 'shared link preserves specified date');
  assertEqual(sharedLinkState.activeTab, 'transcript', 'shared link preserves active tab transcript');

  // 2. invalid date param falling back to default selection
  const invalidDateState = resolveMeetingUrlState(
    '?type=community&date=invalid-date-9999&tab=transcript',
    mockCommunityMeetings,
    mockCabalMeetings,
  );
  assertEqual(invalidDateState.selectedMeetingId, '2026-08-04', 'invalid date param falls back to default selection');
  assertEqual(invalidDateState.activeTab, 'transcript', 'invalid date preserves specified tab');

  const invalidCabalDateState = resolveMeetingUrlState(
    '?type=cabal&date=2026-06-02&tab=notes',
    mockCommunityMeetings,
    mockCabalMeetings,
  );
  assertEqual(
    invalidCabalDateState.selectedMeetingId,
    '2026-05-05',
    'date from wrong category falls back to category default',
  );

  // 3. switching categories resets to the correct first meeting
  const defaultCabalMeeting = getCategoryDefaultMeeting('cabal', mockCommunityMeetings, mockCabalMeetings);
  assertEqual(defaultCabalMeeting?.id, '2026-05-05', 'switching to cabal resets to first cabal meeting');

  const defaultCommunityMeeting = getCategoryDefaultMeeting('community', mockCommunityMeetings, mockCabalMeetings);
  assertEqual(defaultCommunityMeeting?.id, '2026-08-04', 'switching to community resets to first community meeting');

  const cabalUrlState = resolveMeetingUrlState('?type=cabal', mockCommunityMeetings, mockCabalMeetings);
  assertEqual(cabalUrlState.activeType, 'cabal', 'URL with ?type=cabal resolves category correctly');
  assertEqual(cabalUrlState.selectedMeetingId, '2026-05-05', 'URL with ?type=cabal selects first cabal meeting');

  // 4. centralized URL search params builder & stale param removal
  const paramsWithFallback = buildMeetingUrlSearchParams('?type=community&date=2026-08-04&tab=notes', {
    date: '2026-06-02',
  });
  assertEqual(paramsWithFallback.get('date'), '2026-06-02', 'updates date query parameter on filter fallback');

  const paramsOnCollapse = buildMeetingUrlSearchParams('?type=community&date=2026-08-04&tab=notes', {
    date: null,
  });
  assertEqual(paramsOnCollapse.has('date'), false, 'removes date parameter when accordion is collapsed');
  assertEqual(paramsOnCollapse.get('type'), 'community', 'preserves category type when collapsing');
}
