import React from 'react';
import Link from '@docusaurus/Link';
import { Icon } from '@iconify/react';
import Markdown from '@site/src/components/utilities/Markdown';
import './styles.css';

type CommunityMeetingsCardProps = {
  title: string;
  subtitle: string;
  date: string;
  timeZone: string;
  badge?: {
    icon: string;
    label: string;
  };
  isPaused?: boolean;
  statusNote?: string;
  buttons: Array<{
    text: string;
    path: string;
  }>;
};

const CARD_META = [
  { icon: 'material-symbols:groups-rounded', label: 'Community Meeting' },
  { icon: 'material-symbols:forum-rounded', label: 'Office Hours' },
];

/** Converts **bold** markdown to inline <strong> — avoids block-level <p> breaking flex layouts */
function parseBold(text: string): JSX.Element {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-bold">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function MeetingCard({
  card,
  index,
  isSingle,
}: {
  card: CommunityMeetingsCardProps;
  index: number;
  isSingle?: boolean;
}) {
  const meta = card.badge ?? CARD_META[index] ?? CARD_META[0];

  return (
    <div
      className={`meeting-card flex w-full flex-1 flex-col rounded-2xl p-6 sm:p-7 ${isSingle ? 'max-w-4xl' : 'max-w-[540px]'}`}>
      {/* Top Row: Badge on left, Time on right top */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5">
        <div className="meeting-badge shadow-xs inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold">
          <Icon icon={meta.icon} className="text-sm" />
          <span>{meta.label}</span>
        </div>

        {/* Time at top right — clean text & icon without container */}
        <div className="meeting-time-indicator inline-flex items-center gap-1.5 text-xs font-semibold">
          <Icon icon="material-symbols:schedule-rounded" className="shrink-0 text-sm" />
          <span>{card.timeZone}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
        {card.title}
      </h3>

      {/* Cadence / Date */}
      <div className="meeting-cadence mb-4 flex items-center gap-2">
        <Icon
          icon={card.isPaused ? 'material-symbols:hourglass-empty-rounded' : 'material-symbols:calendar-today-rounded'}
          className={`shrink-0 text-base ${card.isPaused ? 'text-amber-600 dark:text-amber-400' : ''}`}
        />
        <p className="text-sm font-semibold">{parseBold(card.date)}</p>
      </div>

      {/* Description — compact typography with subtle purple links and underline */}
      <div className="meeting-card-body flex-1">
        <Markdown text={card.subtitle} styles="meeting-card-body" />
      </div>

      {/* Buttons — guaranteed breathing room above and pinned to bottom */}
      <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-6">
        {/* Join Meeting / Action buttons */}
        {card.buttons.map((btn, i) => (
          <Link
            key={i}
            to={btn.path}
            style={{ textDecoration: 'none' }}
            className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold !no-underline ${
              i === 0 && !card.isPaused ? 'meeting-btn-join shadow-sm' : 'meeting-btn-agenda shadow-xs'
            }`}>
            <Icon
              icon={
                btn.text.toLowerCase().includes('join')
                  ? 'material-symbols:video-camera-front-rounded'
                  : btn.text.toLowerCase().includes('calendar')
                    ? 'material-symbols:calendar-month-rounded'
                    : 'material-symbols:article-outline-rounded'
              }
              className="text-sm"
            />
            <span>{btn.text}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function CommunityMeetingsCardGrid({ cards }: { cards: CommunityMeetingsCardProps[] }): JSX.Element {
  const isSingle = cards.length === 1;
  return (
    <div className="mt-4 w-full md:mt-6">
      {/* Meeting Cards */}
      <div
        className={`mb-12 flex flex-col items-center justify-center gap-6 ${isSingle ? 'lg:flex-row' : 'lg:flex-row lg:items-stretch lg:gap-8'}`}>
        {cards.map((card, index) => (
          <MeetingCard key={index} card={card} index={index} isSingle={isSingle} />
        ))}
      </div>

      {/* Integrated CTA Archive Callout — directs users to full meeting archive */}
      <div className="mx-auto mb-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-r from-purple-700 to-purple-900 shadow-md">
        <div className="flex flex-col items-start justify-between gap-5 p-6 md:flex-row md:items-center md:px-8">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold text-white">
              <Icon icon="material-symbols:history-edu" className="text-sm" />
              <span>Full Meeting Archive</span>
            </div>
            <h3 style={{ color: '#ffffff' }} className="meeting-archive-title text-lg font-bold !text-white text-white">
              Previous meetings, transcripts &amp; minutes
            </h3>
            <p
              style={{ color: 'rgba(255, 255, 255, 0.85)' }}
              className="meeting-archive-desc mt-0.5 text-sm !text-white/85 text-white/85">
              Recordings, notes and searchable transcripts from all past sessions.
            </p>
          </div>
          <Link
            to="/community/meetings"
            style={{ textDecoration: 'none', color: '#ffffff', borderColor: 'rgba(255,255,255,0.7)' }}
            className="meeting-archive-cta group inline-flex shrink-0 items-center gap-2 rounded-xl border-2 bg-transparent px-5 py-2.5 text-sm font-bold !text-white text-white !no-underline transition-all duration-150 hover:border-white hover:bg-white/10 hover:text-white hover:!no-underline">
            <span className="!text-white text-white">Explore Old Meetings</span>
            <Icon
              icon="material-symbols:arrow-forward-rounded"
              className="text-base !text-white text-white transition-transform duration-150 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CommunityMeetingsCardGrid;
