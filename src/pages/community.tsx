import React, { useState, useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import useBaseUrl, { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
import { Icon } from '@iconify/react';
import WaveBorder from '@site/src/components/shapes/WaveBorder';
import CommunityMeetingsCardGrid from '@site/src/components/layout/CommunityMeetingsCardGrid';
import { communityChat, communityMeetings, mailingList, submittingIssues } from '@site/static/data/community';
import sponsorData from '@site/src/components/content/ThankYouSection/data';
import DateTimeBox from '@site/src/components/content/DateTimeBox';

/* -------------------------------------------------------------------------- */
/* Action Dropdown for Repo Issues                                             */
/* -------------------------------------------------------------------------- */
function ActionDropdown({
  buttonText,
  icon,
  links,
}: {
  buttonText: string;
  icon?: string;
  links: Array<{ text: string; path: string }>;
}): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        style={{ textDecoration: 'none', backgroundColor: '#892CA0', color: '#ffffff' }}
        className="shadow-xs inline-flex items-center gap-2 rounded-md bg-[#892CA0] px-4 py-2.5 !text-sm font-bold text-white transition hover:bg-[#77218d]">
        {icon && <Icon icon={icon} className="text-base text-white" />}
        <span className="text-white">{buttonText}</span>
        <Icon
          icon="material-symbols:arrow-drop-down-rounded"
          className={`text-lg text-white transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-72 rounded-md bg-white p-2 shadow-2xl ring-1 ring-black/5 dark:bg-[#201c2e] dark:ring-white/10 sm:w-80">
          <ul className="m-0 list-none p-0">
            {links.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-800 dark:text-gray-200 flex items-center justify-between rounded-md px-3.5 py-2.5 !text-sm font-semibold transition hover:bg-purple-100 hover:text-[#892CA0] dark:hover:bg-white/10 dark:hover:text-purple-300">
                  <span>{link.text}</span>
                  <Icon icon="material-symbols:arrow-outward-rounded" className="text-xs opacity-60" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Social & Chat Channels (Circular Purple Containers with White Icons)       */
/* -------------------------------------------------------------------------- */
/** Display name + icon only; URL/handle come from communityChat.links */
const chatChannelMeta: Record<string, { name: string; icon: string }> = {
  'https://matrix.to/#/#podman:fedoraproject.org': { name: 'Matrix', icon: 'simple-icons:matrix' },
  'https://web.libera.chat/#podman': { name: 'Libera IRC', icon: 'material-symbols:terminal-rounded' },
  'https://github.com/containers/podman/discussions': { name: 'Discussions', icon: 'simple-icons:github' },
  'https://discord.gg/vwpj7K6gW5': { name: 'Discord', icon: 'simple-icons:discord' },
};

const chatChannels = communityChat.links.map(link => {
  const meta = chatChannelMeta[link.path] ?? {
    name: link.text,
    icon: 'material-symbols:forum-rounded',
  };
  return {
    name: meta.name,
    handle: link.text,
    url: link.path,
    icon: meta.icon,
  };
});

/* -------------------------------------------------------------------------- */
/* Optically Balanced Supporting Organization Logos (2-Row Marquee)          */
/* -------------------------------------------------------------------------- */
const SPONSOR_LOGOS_ROW_1 = [
  { ...sponsorData[3], sizeClass: 'h-11 sm:h-12' }, // Motorola Solutions
  { ...sponsorData[2], sizeClass: 'h-7 sm:h-8' }, // SUSE
  { ...sponsorData[0], sizeClass: 'h-10 sm:h-12' }, // Red Hat
  { ...sponsorData[5], sizeClass: 'h-8 sm:h-9' }, // IBM
  { ...sponsorData[4], sizeClass: 'h-8 sm:h-9' }, // NTT
  { ...sponsorData[1], sizeClass: 'h-5 sm:h-6' }, // Amadeus
  { ...sponsorData[6], sizeClass: 'h-11 sm:h-12' }, // Debian
];

const SPONSOR_LOGOS_ROW_2 = [
  SPONSOR_LOGOS_ROW_1[3], // IBM
  SPONSOR_LOGOS_ROW_1[6], // Debian
  SPONSOR_LOGOS_ROW_1[5], // Amadeus
  SPONSOR_LOGOS_ROW_1[0], // Motorola Solutions
  SPONSOR_LOGOS_ROW_1[4], // NTT
  SPONSOR_LOGOS_ROW_1[2], // Red Hat
  SPONSOR_LOGOS_ROW_1[1], // SUSE
];

const SPONSOR_MARQUEE_ROWS = [
  { id: 'row-1', logos: SPONSOR_LOGOS_ROW_1, animClass: 'animate-logo-marquee-left' },
  { id: 'row-2', logos: SPONSOR_LOGOS_ROW_2, animClass: 'animate-logo-marquee-right' },
];

/* -------------------------------------------------------------------------- */
/* Community Page — Modern, Balanced, Matches downloads.tsx & meetings.tsx    */
/* -------------------------------------------------------------------------- */
export default function Community(): JSX.Element {
  const { withBaseUrl } = useBaseUrlUtils();
  const desktopLogoSrc = useBaseUrl('logos/optimized/podman-desktop-logo-200w-198h.webp');
  const mailingListImageSrc = useBaseUrl(mailingList.extraInfo.image.path);

  return (
    <Layout
      title="Podman Community Hub"
      description="Connect with the Podman open source container engine community across chat, meetings, and GitHub.">
      {/* ============================================================
          HERO: 2-Column Balanced Hero (Matches meetings.tsx)
      ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-700 pb-16 pt-10 text-white dark:from-blue-700 dark:to-purple-900 md:pb-24 md:pt-14">
        <div className="container mx-auto px-4 lg:px-8 xl:max-w-[1240px]">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            {/* Left Column: Title & Subtitle */}
            <div className="lg:col-span-7">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                <Icon icon="material-symbols:groups-rounded" className="text-base text-white" />
                <span className="text-white">Podman Community Hub</span>
              </div>
              <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white dark:text-gray-50 sm:text-4xl lg:text-5xl lg:leading-tight">
                Join the Podman Community
              </h1>
              <p className="max-w-2xl !text-base font-medium leading-relaxed text-white/90 dark:text-gray-100 sm:!text-lg">
                Join developers worldwide to chat, attend meetings, share feedback, and contribute to the Podman
                container ecosystem.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 !text-xs font-semibold text-white/90">
                <Icon icon="material-symbols:handshake-rounded" className="text-base text-white" />
                <span>We expect all who participate to adhere to our</span>
                <a
                  href="https://github.com/containers/common/blob/main/CODE-OF-CONDUCT.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#ffffff', fontSize: 'inherit' }}
                  className="!text-xs font-bold underline underline-offset-2 transition hover:text-white/80">
                  Code of Conduct &rarr;
                </a>
              </div>
            </div>

            {/* Right Column: Active Hours Card (Balances Hero Layout) */}
            <div className="lg:col-span-5 lg:flex lg:justify-end">
              <div className="w-full max-w-sm rounded-md bg-white/15 p-6 backdrop-blur-md dark:bg-black/25">
                <div className="mb-3 flex items-center gap-2">
                  <Icon icon="material-symbols:schedule-rounded" className="text-lg text-white" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">Global Community</span>
                </div>
                <p className="m-0 text-justify !text-sm leading-relaxed text-white/85">
                  Podman community members and maintainers collaborate across{' '}
                  <strong>Central European Time (CET)</strong> and <strong>US Eastern Time (ET)</strong>.
                </p>
                <div className="mt-5 flex items-center justify-between rounded-md bg-white/10 px-4 py-2.5 text-xs font-medium text-white backdrop-blur-sm">
                  <span className="font-semibold">Current Time</span>
                  <a
                    href="#current-time"
                    style={{ color: '#ffffff', fontSize: 'inherit' }}
                    className="!text-xs font-bold hover:underline">
                    View local clocks &darr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Wave Border */}
        <WaveBorder
          className="pointer-events-none absolute bottom-0 left-0 z-10 h-8 w-full sm:h-12 md:h-14 lg:h-16"
          preserveAspectRatio="none"
        />
      </section>

      {/* ============================================================
          SECTION 1: COMMUNITY CHAT & SOCIAL LINKS
          Circular Purple Containers with White Icons
      ============================================================ */}
      <section id="community-chat" className="bg-white py-12 dark:bg-[#120f1d] sm:py-16">
        <div className="container mx-auto px-4 lg:px-8 xl:max-w-[1240px]">
          <div className="mb-8 text-center sm:mb-12">
            <div
              style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
              className="shadow-xs mb-3 inline-flex items-center gap-2 rounded-full bg-[#892CA0] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              <Icon icon="material-symbols:forum-rounded" className="text-base text-white" />
              <span className="text-white">Live Chat &amp; Discussions</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Connect With the Community
            </h2>
            <p className="text-gray-600 mx-auto mt-2 max-w-xl text-justify !text-base font-medium leading-relaxed dark:text-gray-300">
              Join maintainers and container enthusiasts across our real-time bridged chat channels and community
              forums.
            </p>
          </div>

          {/* Social Media & Chat Channels */}
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-8">
              {chatChannels.map((channel, idx) => (
                <a
                  key={idx}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  className="group flex flex-col items-center text-center">
                  {/* Clickable Circular Purple Container */}
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#892CA0] text-white shadow-md transition-all duration-200 group-hover:-translate-y-1.5 group-hover:bg-[#77218d] group-hover:shadow-xl active:scale-95 sm:h-24 sm:w-24">
                    <Icon
                      icon={channel.icon}
                      className="text-3xl text-white transition-transform duration-200 group-hover:scale-110 sm:text-4xl"
                    />
                  </div>

                  <h3 className="mb-0 mt-3 text-base font-bold text-gray-900 transition-colors group-hover:text-[#892CA0] dark:text-white dark:group-hover:text-purple-300 sm:text-lg">
                    {channel.name}
                  </h3>
                  <span className="dark:text-gray-400 font-mono text-xs font-medium text-gray-500">
                    {channel.handle}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: CURRENT TIME & MAINTAINER AVAILABILITY
          Horizontal Split: Left = Heading & Subheading; Right = Vertically Stacked Clocks
      ============================================================ */}
      <section id="current-time" className="sm:py-18 bg-white py-14 dark:bg-[#120f1d]">
        <div className="container mx-auto px-4 lg:px-8 xl:max-w-[1240px]">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Heading & Subheading */}
            <div className="lg:col-span-5">
              <div
                style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                className="shadow-xs mb-3 inline-flex items-center gap-2 rounded-full bg-[#892CA0] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                <Icon icon="material-symbols:schedule-rounded" className="text-base text-white" />
                <span className="text-white">Current Time</span>
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Community Time Zones
              </h2>
              <p className="text-gray-600 mt-3 text-justify !text-base font-medium leading-relaxed dark:text-gray-300">
                Podman maintainers and contributors collaborate across global time zones. Check the current local times
                across our primary hubs in Europe and the Americas before reaching out in real-time chat.
              </p>
            </div>

            {/* Right Column: Vertically Stacked Container */}
            <div className="lg:col-span-7 lg:flex lg:justify-end">
              <div className="w-full max-w-xl">
                <DateTimeBox />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 3: SUPPORTING ORGANIZATIONS (Matches Homepage 2-Col Marquee)
      ============================================================ */}
      <section aria-label="Supporting Organizations" className="mx-auto my-14 max-w-6xl px-4 lg:my-20">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Heading & Subheading */}
          <header className="text-left lg:col-span-4">
            <h2 className="m-0 font-bold text-gray-900 dark:text-gray-50">Supporting Organizations</h2>
            <p className="mb-0 mt-3 leading-relaxed text-gray-700 dark:text-gray-100">
              Podman thrives thanks to the continuous contributions from leading open source organizations.
            </p>
          </header>

          {/* Right Column: 2-Row Moving Logo Marquee */}
          <div className="relative min-w-0 space-y-8 overflow-hidden py-2 sm:space-y-10 lg:col-span-8">
            {/* Soft Edge Fade Masks */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent dark:from-[#1B1B1D] sm:w-16"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent dark:from-[#1B1B1D] sm:w-16"
              aria-hidden="true"
            />

            {SPONSOR_MARQUEE_ROWS.map(row => (
              <div key={row.id} className={`${row.animClass} flex w-max items-center`}>
                {[0, 1].map(loopIdx => (
                  <div
                    key={loopIdx}
                    aria-hidden={loopIdx === 1}
                    className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
                    {row.logos.map(sponsor => (
                      <a
                        key={`${row.id}-${loopIdx}-${sponsor.label}`}
                        href={sponsor.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={sponsor.label}
                        tabIndex={loopIdx === 1 ? -1 : undefined}
                        className="inline-flex shrink-0 items-center justify-center transition-transform duration-200 hover:scale-105">
                        <img
                          src={withBaseUrl(sponsor.src)}
                          alt={loopIdx === 0 ? sponsor.alt : ''}
                          loading="lazy"
                          decoding="async"
                          className={`${sponsor.sizeClass} w-auto object-contain brightness-0 dark:invert`}
                        />
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: COMMUNITY MEETINGS (STRICTLY PRESERVED INTACT)
          Light purple container (#f3e8ff/50)
      ============================================================ */}
      <section id="community-meetings" className="bg-purple-100/50 py-12 dark:bg-[#161222] sm:py-16">
        <div className="container mx-auto px-4 lg:px-8 xl:max-w-[1240px]">
          <div className="mb-8 text-center sm:mb-10">
            <div
              style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
              className="shadow-xs mb-3 inline-flex items-center gap-2 rounded-full bg-[#892CA0] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              <Icon icon="material-symbols:video-camera-front-rounded" className="text-base text-white" />
              <span className="text-white">Live Meetings &amp; Syncs</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {communityMeetings.title}
            </h2>
            <p className="text-gray-600 mx-auto mt-2 max-w-xl text-center !text-base font-medium leading-relaxed dark:text-gray-300">
              {communityMeetings.subtitle}
            </p>
          </div>

          {/* Preserved CommunityMeetingsCardGrid intact as requested */}
          <CommunityMeetingsCardGrid cards={communityMeetings.cards} />
        </div>
      </section>

      {/* ============================================================
          SECTION 5: PODMAN DESKTOP CALLOUT (Matching downloads.tsx)
          Solid light purple container (#f3e8ff), NO gradient
      ============================================================ */}
      <section className="bg-white py-10 dark:bg-[#120f1d] sm:py-14">
        <div className="container mx-auto px-4 lg:px-8 xl:max-w-[1240px]">
          <div className="flex flex-col justify-between gap-6 rounded-md border border-black/[0.08] bg-purple-100 p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] dark:border-white/[0.08] dark:bg-[#1e172a] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-start gap-4 sm:items-center">
              <img
                src={desktopLogoSrc}
                alt="Podman Desktop Logo"
                className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
              />
              <div className="space-y-1">
                <div
                  style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                  className="shadow-xs inline-flex items-center gap-1.5 rounded-md bg-[#892CA0] px-2.5 py-0.5 text-xs font-bold text-white">
                  <Icon icon="material-symbols:desktop-windows-rounded" className="text-sm text-white" />
                  <span className="text-white">Podman Desktop GUI Community</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  Prefer a Graphical Desktop Interface?
                </h3>
                <p className="text-gray-600 m-0 max-w-xl text-justify !text-sm font-medium leading-relaxed dark:text-gray-300">
                  Participate in monthly community meetings, release demos, and desktop extension syncs on the official
                  Podman Desktop platform.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <a
                href="https://podman-desktop.io/community#community-events"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', backgroundColor: '#892CA0', color: '#ffffff' }}
                className="shadow-xs inline-flex items-center gap-2 rounded-md bg-[#892CA0] px-4 py-2.5 !text-sm font-bold text-white !no-underline transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#77218d] hover:!text-white hover:shadow-md">
                <span className="text-white">Desktop Events</span>
                <Icon icon="material-symbols:arrow-outward-rounded" className="text-base text-white" />
              </a>
              <a
                href="https://podman-desktop.io"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
                className="shadow-xs hover:bg-purple-200 inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2.5 !text-sm font-bold text-[#892CA0] !no-underline transition-all duration-150 hover:text-[#77218d] dark:bg-white/10 dark:text-purple-300 dark:hover:bg-white/15">
                <span>Official Website</span>
                <Icon icon="material-symbols:arrow-outward-rounded" className="text-base" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 6: FULL MAILING LIST SECTION (Restored from Original)
      ============================================================ */}
      <section id="mailing-list" className="bg-white py-16 dark:bg-[#120f1d] sm:py-20">
        <div className="container mx-auto px-4 lg:px-8 xl:max-w-[1240px]">
          <div className="mb-10 text-center sm:mb-12">
            <div
              style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
              className="shadow-xs mb-3 inline-flex items-center gap-2 rounded-full bg-[#892CA0] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              <Icon icon="material-symbols:mail-outline-rounded" className="text-base text-white" />
              <span className="text-white">Email Discussions</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {mailingList.title}
            </h2>
            <p className="text-gray-600 mx-auto mt-2 max-w-xl text-justify !text-base font-medium leading-relaxed dark:text-gray-300">
              {mailingList.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Column: Subscribe Options (Full Height Card in bg-purple-100/70 with Unified Drop Shadow) */}
            <div className="flex h-full flex-col justify-between rounded-md border border-black/[0.08] bg-purple-100/70 p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] dark:border-white/[0.08] dark:bg-[#1e172a] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] sm:p-9 lg:col-span-7">
              <div>
                <div className="flex items-center gap-3">
                  <div className="shadow-xs flex h-11 w-11 items-center justify-center rounded-md bg-[#892CA0] text-white">
                    <Icon icon="material-symbols:mark-email-read-rounded" className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="m-0 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                      {mailingList.subscribeInfo.title}
                    </h3>
                  </div>
                </div>

                <p className="mt-3 text-justify !text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                  Participate in technical discussions, project announcements, and community proposals. Choose your
                  preferred way to subscribe:
                </p>

                <div className="mt-5 flex flex-col gap-4">
                  {/* Option 1: Email */}
                  <div className="shadow-2xs flex flex-col justify-between gap-3 rounded-md bg-[#EBD6F5] p-5 dark:bg-white/10 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="material-symbols:mail-outline-rounded"
                          className="text-base text-[#892CA0] dark:text-purple-300"
                        />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#892CA0] dark:text-purple-300">
                          {mailingList.subscribeInfo.options[0].title} &bull; Email Subscription
                        </span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 m-0 !text-sm leading-relaxed">
                        Send an email to{' '}
                        <code
                          style={{ fontSize: '0.82rem' }}
                          className="rounded bg-[#DEC2EE] px-1.5 py-0.5 font-mono font-semibold text-[#5F246B] dark:bg-white/10 dark:text-purple-300">
                          podman-join@lists.podman.io
                        </code>{' '}
                        with &ldquo;Subscribe&rdquo; in the subject line.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <a
                        href={mailingList.subscribeInfo.options[0].button.path}
                        style={{ textDecoration: 'none', backgroundColor: '#892CA0', color: '#ffffff' }}
                        className="shadow-xs inline-flex items-center gap-1.5 rounded-md bg-[#892CA0] px-4 py-2.5 !text-sm font-bold text-white transition hover:bg-[#77218d]">
                        <Icon icon="material-symbols:mail-rounded" className="text-xs text-white" />
                        <span className="text-white">{mailingList.subscribeInfo.options[0].button.text}</span>
                      </a>
                    </div>
                  </div>

                  {/* Option 2: Web Form */}
                  <div className="shadow-2xs flex flex-col justify-between gap-3 rounded-md bg-[#EBD6F5] p-5 dark:bg-white/10 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Icon
                          icon="material-symbols:language-rounded"
                          className="text-base text-[#892CA0] dark:text-purple-300"
                        />
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#892CA0] dark:text-purple-300">
                          {mailingList.subscribeInfo.options[1].title} &bull; Web Sign-Up Form
                        </span>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 m-0 !text-sm leading-relaxed">
                        Enter your email address directly at the bottom of the official sign-up page and click
                        Subscribe.
                      </p>
                    </div>
                    <div className="shrink-0">
                      <a
                        href={mailingList.subscribeInfo.options[1].button.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none', backgroundColor: '#892CA0', color: '#ffffff' }}
                        className="shadow-xs inline-flex items-center gap-1.5 rounded-md bg-[#892CA0] px-4 py-2.5 !text-sm font-bold text-white transition hover:bg-[#77218d]">
                        <span className="text-white">{mailingList.subscribeInfo.options[1].button.text}</span>
                        <Icon icon="material-symbols:arrow-outward-rounded" className="text-xs text-white" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmation Instructions Box */}
              <div className="p-4.5 shadow-2xs mt-5 rounded-md bg-[#EBD6F5] dark:bg-white/10 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#892CA0] text-white">
                    <Icon icon="material-symbols:verified-rounded" className="text-lg text-white" />
                  </div>
                  <div>
                    <h4 className="m-0 text-sm font-bold text-gray-900 dark:text-white">
                      Confirmation &amp; Direct Posting
                    </h4>
                    <p className="text-gray-800 dark:text-gray-200 m-0 mt-1 text-justify !text-sm font-medium leading-relaxed">
                      Regardless of which method you use, a confirmation email will be sent to you. After you reply
                      back, you&rsquo;ll be able to send mail directly to{' '}
                      <code
                        style={{ fontSize: '0.82rem' }}
                        className="rounded bg-[#DEC2EE] px-1.5 py-0.5 font-mono font-semibold text-[#5F246B] dark:bg-white/10 dark:text-purple-300">
                        podman@lists.podman.io
                      </code>{' '}
                      and manage your subscription preferences.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Screenshot Image + Browse Inside + Node 1 (Equal Height) */}
            <div className="flex h-full flex-col justify-between gap-6 lg:col-span-5">
              {/* Image & Browse Archive Card */}
              <div className="flex flex-1 flex-col justify-between rounded-md border border-black/[0.08] bg-purple-100/70 p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] dark:border-white/[0.08] dark:bg-[#1e172a] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] sm:p-7">
                <div>
                  {/* Screenshot Image with controlled height */}
                  <div className="shadow-2xs overflow-hidden rounded-md border border-black/5 dark:border-white/10">
                    <img
                      src={mailingListImageSrc}
                      alt={mailingList.extraInfo.image.alt}
                      className="h-36 w-full object-cover object-top sm:h-40"
                    />
                  </div>

                  {/* Browse Mailing List Section Inside Below Image */}
                  <div className="mt-5">
                    <div className="flex items-center gap-3">
                      <div className="shadow-xs flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#892CA0] text-white">
                        <Icon icon="material-symbols:folder-open-rounded" className="text-xl text-white" />
                      </div>
                      <div>
                        <h3 className="m-0 text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                          {mailingList.browseInfo.title}
                        </h3>
                      </div>
                    </div>
                    <p className="mt-2.5 text-justify !text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                      Visit the Podman mailing list website to browse or search decades of public postings and release
                      announcements.
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <a
                    href="https://lists.podman.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', backgroundColor: '#892CA0', color: '#ffffff' }}
                    className="shadow-xs inline-flex items-center gap-2 rounded-md bg-[#892CA0] px-4 py-2.5 !text-sm font-bold text-white transition hover:bg-[#77218d]">
                    <span className="text-white">Browse Archives</span>
                    <Icon icon="material-symbols:arrow-outward-rounded" className="text-xs text-white" />
                  </a>
                </div>
              </div>

              {/* Node 1: Please Note Callout */}
              <div className="rounded-md border border-black/[0.08] bg-purple-100/70 p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] dark:border-white/[0.08] dark:bg-[#1e172a] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] sm:p-6">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#892CA0] text-white">
                    <Icon icon="material-symbols:info-rounded" className="text-lg text-white" />
                  </div>
                  <div>
                    <h4 className="m-0 text-base font-bold text-gray-900 dark:text-white">
                      {mailingList.extraInfo.note.title}
                    </h4>
                    <p className="m-0 mt-1.5 text-justify !text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                      {mailingList.extraInfo.note.text}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 7: SUBMITTING ISSUES & PRS (Restored from Original)
      ============================================================ */}
      <section id="contribute" className="bg-purple-100/50 py-16 dark:bg-[#161222] sm:py-20">
        <div className="container mx-auto px-4 lg:px-8 xl:max-w-[1240px]">
          <div className="mb-10 text-center sm:mb-12">
            <div
              style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
              className="shadow-xs mb-3 inline-flex items-center gap-2 rounded-full bg-[#892CA0] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              <Icon icon="material-symbols:code-rounded" className="text-base text-white" />
              <span className="text-white">Issues &amp; Contributions</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {submittingIssues[0].title}
            </h2>
            <p className="text-gray-600 mx-auto mt-2 max-w-2xl text-center !text-base font-medium leading-relaxed dark:text-gray-300">
              A quick guide to reporting bugs, requesting features, and submitting pull requests.
            </p>
          </div>

          <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2 lg:gap-10">
            {/* Card 1: Submitting Issues */}
            <div className="flex h-full flex-col justify-between rounded-md border border-black/[0.08] bg-white p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] dark:border-white/[0.08] dark:bg-[#1e172a] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] sm:p-9">
              <div>
                <div className="flex items-center gap-3">
                  <div className="shadow-xs flex h-11 w-11 items-center justify-center rounded-md bg-[#892CA0] text-white">
                    <Icon icon="material-symbols:bug-report-rounded" className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="m-0 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                      {submittingIssues[1].title}
                    </h3>
                  </div>
                </div>

                {/* Privacy Warning Pill */}
                <div className="mt-4 flex items-center gap-2 rounded-md bg-purple-100 px-4 py-2.5 !text-sm font-semibold text-[#892CA0] dark:bg-white/10 dark:text-purple-300">
                  <Icon icon="material-symbols:lock-outline-rounded" className="shrink-0 text-base" />
                  <span>{submittingIssues[1].subtitle}</span>
                </div>

                {/* Subsection A: Check Backlog */}
                <div className="mt-6">
                  <p className="m-0 text-justify !text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                    <strong>Before reporting an issue</strong>, check our backlog of open issues to see if someone else
                    has already reported it:
                  </p>
                  <ul className="mb-4 ml-4 mt-2 list-disc space-y-1.5 !text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {submittingIssues[1].sections[0].checkList.map((item, idx) => (
                      <li key={idx} className="text-justify !text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <ActionDropdown
                    buttonText={submittingIssues[1].sections[0].button.text}
                    icon="material-symbols:search-rounded"
                    links={submittingIssues[1].sections[0].button.links}
                  />
                </div>

                {/* Clearly Visible Divider Line */}
                <div className="my-8 h-px w-full bg-purple-300 dark:bg-white/10" />

                {/* Subsection B: File a New Issue */}
                <div>
                  <p className="m-0 text-justify !text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                    <strong>If you find a new issue</strong>, we&rsquo;d love to hear about it! Please include enough
                    information for us to reproduce it:
                  </p>
                  <ul className="mb-4 ml-4 mt-2 list-disc space-y-1.5 !text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {submittingIssues[1].sections[1].checkList.map((item, idx) => (
                      <li key={idx} className="text-justify !text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                  <ActionDropdown
                    buttonText={submittingIssues[1].sections[1].button.text}
                    icon="material-symbols:add-circle-outline-rounded"
                    links={submittingIssues[1].sections[1].button.links}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Submitting Pull Requests */}
            <div className="flex h-full flex-col justify-between rounded-md border border-black/[0.08] bg-white p-7 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] dark:border-white/[0.08] dark:bg-[#1e172a] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] sm:p-9">
              <div>
                <div className="flex items-center gap-3">
                  <div className="shadow-xs flex h-11 w-11 items-center justify-center rounded-md bg-[#892CA0] text-white">
                    <Icon icon="material-symbols:merge-rounded" className="text-2xl text-white" />
                  </div>
                  <div>
                    <h3 className="m-0 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                      Submitting Pull Requests
                    </h3>
                  </div>
                </div>

                {/* Subtitle Banner — Matching Card 1 styling and font size */}
                <div className="mt-4 flex items-center gap-2 rounded-md bg-purple-100 px-4 py-2.5 !text-sm font-semibold text-[#892CA0] dark:bg-white/10 dark:text-purple-300">
                  <Icon icon="material-symbols:celebration-rounded" className="shrink-0 text-base" />
                  <span>No Pull Request (PR) is too small &mdash; it&rsquo;s all welcome!</span>
                </div>

                {/* Descriptions — Exactly matched to Card 1 typography */}
                <div className="mt-6 space-y-3">
                  <p className="m-0 text-justify !text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                    {submittingIssues[2].description[0]}
                  </p>
                  <p className="m-0 text-justify !text-sm font-medium leading-relaxed text-gray-700 dark:text-gray-300">
                    {submittingIssues[2].description[1]}
                  </p>
                </div>

                {/* Checklist — Exactly matched to Card 1 typography */}
                <div className="shadow-2xs mt-5 rounded-md bg-purple-100/50 p-4 dark:bg-white/5">
                  <p className="m-0 !text-sm font-bold text-gray-900 dark:text-white">
                    All Pull Requests should include:
                  </p>
                  <ul className="mb-0 ml-4 mt-2 list-disc space-y-1.5 !text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {submittingIssues[2].checkList.map((item, idx) => (
                      <li key={idx} className="text-justify !text-sm">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <a
                  href={submittingIssues[2].button.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', backgroundColor: '#892CA0', color: '#ffffff' }}
                  className="shadow-xs inline-flex items-center gap-2 rounded-md bg-[#892CA0] px-5 py-3 !text-sm font-bold text-white transition hover:bg-[#77218d]">
                  <span className="text-white">{submittingIssues[2].button.text}</span>
                  <Icon icon="material-symbols:arrow-outward-rounded" className="text-xs text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
