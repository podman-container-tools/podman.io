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
  isPaused?: boolean;
  statusNote?: string;
  buttons: Array<{
    text: string;
    path: string;
  }>;
};

const CARD_META = [
  { icon: 'material-symbols:groups-rounded', label: 'Community Meeting' },
  { icon: 'material-symbols:shield-rounded', label: 'Cabal Meeting' },
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
  const meta = CARD_META[index] ?? CARD_META[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalHeader, setModalHeader] = useState<ReactNode | undefined>(undefined);
  const [meetinNotesMD, setMeetinNotesMD] = useState<ReactNode | undefined>(undefined);
  const meetingMinutesRef = [useRef(), useRef()];
  const modalRef = useRef<HTMLDialogElement>(null);

  toggleModalOpen(modalRef, () => setIsModalOpen(false));

  useEffect(() => {
    const dialogEl = modalRef.current;
    if (!dialogEl) {
      return;
    }
    if (isModalOpen && !dialogEl.open) {
      dialogEl.showModal();
    } else if (!isModalOpen && dialogEl.open) {
      dialogEl.close();
    }
  }, [isModalOpen]);

  const prepareModalHeader = (text: string, date: string) => {
    const modalHeader: ReactNode = (
      <div className="modal-header dark:bg-gray-500 dark:shadow-none">
        <h3 className="modal-header-title dark:text-gray-900">{text}</h3>
        <h3 className="modal-header-date dark:text-gray-900">{date}</h3>
        <button
          type="button"
          className="cursor-pointer border-0 bg-transparent p-0"
          onClick={() => setIsModalOpen(false)}
          aria-label="Close meeting minutes">
          <CloseIcon />
        </button>
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
    <div className="justify-content-center align-items-center custom-card-grid-root flex">
      {cards.map((card: CommunityMeetingsCardProps, index: number) => {
        let meetingsData = index == 1 ? CabalMeetingsData : communityMeetingsData;
        return (
          <div
            key={`card-container-${index}`}
            className="align-items-center card-container mb-4 flex flex-1 flex-col flex-wrap justify-center transition duration-150 ease-linear lg:mb-6">
            <CustomCard
              key={`custom-card-${index}`}
              title={card?.title}
              subtitle={card?.date}
              details={card?.timeZone}
              text={card?.subtitle}
              data={card?.buttons}
              primary={true}
            />
            <SectionHeader
              title=""
              description="Most Recent meetings"
              textGradientStops="from-purple-500 to-purple-700 dark:text-purple-500"
              textGradient={false}
            />
            <SubcardGrid key={`subcard-grid-${index}`} cards={meetingsData} toggleIsModalOpen={toggleIsModalOpen} />
            <Dropdown
              options={getDropdownOption(index == 1 ? [...cabalDropdownOptions] : [...MeetingDropdownOptions])}
              dropdownRef={meetingMinutesRef[index]}
              text="Older meeting details"
            />
            <dialog
              className="bg-stone-200 w-90-screen h-80-screen fixed top-20 z-50 max-h-screen w-fit border-4 border-purple-100"
              ref={modalRef}
              onClose={() => setIsModalOpen(false)}>
              <div className="modal-content flex flex-col">
                {modalHeader}
                <div className="md-wrapper overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 dark:bg-gray-700  dark:text-gray-50 dark:shadow-none">
                  {meetinNotesMD}
                </div>
              </div>
            </dialog>
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
