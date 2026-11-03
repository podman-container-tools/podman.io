import React from 'react';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { Icon } from '@iconify/react';
import WaveBorder from '@site/src/components/shapes/WaveBorder';
import CommunityMeetingsCardGrid from '@site/src/components/layout/CommunityMeetingsCardGrid';
import { communityMeetings } from '@site/static/data/community';
import sponsorData from '@site/src/components/content/ThankYouSection/data';

/* -------------------------------------------------------------------------- */
/* Social & Chat Channels (Circular Purple Containers with White Icons)       */
/* -------------------------------------------------------------------------- */
const chatChannels = [
  {
    name: 'Matrix',
    handle: '#podman:matrix.org',
    url: 'https://matrix.to/#/#podman:matrix.org',
    icon: 'simple-icons:matrix',
  },
  {
    name: 'Discord',
    handle: 'discord.gg/podman',
    url: 'https://discord.com/invite/x5Gzfd6Che',
    icon: 'simple-icons:discord',
  },
  {
    name: 'Libera IRC',
    handle: '#podman',
    url: 'https://web.libera.chat/#podman',
    icon: 'material-symbols:terminal-rounded',
  },
  {
    name: 'Discussions',
    handle: 'containers/podman',
    url: 'https://github.com/containers/podman/discussions',
    icon: 'simple-icons:github',
  },
];

/* -------------------------------------------------------------------------- */
/* Optically Balanced Supporting Organization Logos                           */
/* -------------------------------------------------------------------------- */
const sponsorLogos = [
  { ...sponsorData[0], heightClass: 'h-8 sm:h-9' }, // Red Hat
  { ...sponsorData[1], heightClass: 'h-5 sm:h-6' }, // Amadeus
  { ...sponsorData[2], heightClass: 'h-6 sm:h-7' }, // SUSE
  { ...sponsorData[3], heightClass: 'h-10 sm:h-11' }, // Motorola Solutions
  { ...sponsorData[4], heightClass: 'h-7 sm:h-8' }, // NTT
  { ...sponsorData[5], heightClass: 'h-7 sm:h-8' }, // IBM
  { ...sponsorData[6], heightClass: 'h-9 sm:h-10' }, // Debian
];

/* -------------------------------------------------------------------------- */
/* Community Page — Modern, Balanced, Matches downloads.tsx & meetings.tsx    */
/* -------------------------------------------------------------------------- */
export default function Community(): JSX.Element {
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
              <p className="max-w-2xl text-base font-medium leading-relaxed text-white/90 dark:text-gray-100 sm:text-lg">
                Connect with maintainers, join discussions, contribute code, and participate in community events.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-white/90">
                <Icon icon="material-symbols:handshake-rounded" className="text-base text-white" />
                <span>We follow the open source</span>
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
              <div className="w-full max-w-sm rounded-2xl bg-white/15 p-5 backdrop-blur-md dark:bg-black/25">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon="material-symbols:schedule-rounded" className="text-lg text-white" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Active Hours</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="bg-emerald-400 h-2 w-2 animate-pulse rounded-full"></span>
                    <span className="text-emerald-200 text-xs font-semibold">Online</span>
                  </div>
                </div>
                <p className="m-0 text-xs leading-relaxed text-white/85">
                  Maintainers are typically active <strong>Monday through Friday</strong> during business hours in{' '}
                  <strong>Central European Time (CET)</strong> and <strong>US Eastern Time (ET)</strong>.
                </p>
                <div className="mt-4 flex items-center justify-between rounded-xl bg-white/10 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-sm">
                  <span>Chat &amp; Discussions</span>
                  <a
                    href="#community-chat"
                    style={{ color: '#ffffff', fontSize: 'inherit' }}
                    className="!text-xs font-bold hover:underline">
                    Jump to channels &darr;
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
      <section id="community-chat" className="bg-white py-12 dark:bg-gray-900 sm:py-16">
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
            <p className="text-gray-600 mx-auto mt-2 max-w-xl text-base font-medium leading-relaxed dark:text-gray-300">
              Join maintainers and container enthusiasts across our real-time bridged chat channels and forums.
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
                    <Icon icon={channel.icon} className="text-3xl text-white sm:text-4xl" />
                  </div>
                  {/* Channel Name */}
                  <span className="mt-4 text-base font-bold text-gray-900 transition-colors group-hover:text-[#892CA0] dark:text-white dark:group-hover:text-purple-300 sm:text-lg">
                    {channel.name}
                  </span>
                  {/* Channel Handle */}
                  <span className="dark:text-gray-400 mt-0.5 font-mono text-xs text-gray-500">{channel.handle}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2: COMMUNITY MEETINGS (STRICTLY PRESERVED INTACT)
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
            <p className="text-gray-600 mx-auto mt-2 max-w-xl text-base font-medium leading-relaxed dark:text-gray-300">
              {communityMeetings.subtitle}
            </p>
          </div>

          {/* Preserved CommunityMeetingsCardGrid intact as requested */}
          <CommunityMeetingsCardGrid cards={communityMeetings.cards} />
        </div>
      </section>

      {/* ============================================================
          SECTION 3: PODMAN DESKTOP CALLOUT (Matching downloads.tsx)
          Solid light purple container (#f3e8ff), NO gradient
      ============================================================ */}
      <section className="bg-white py-10 dark:bg-gray-900 sm:py-14">
        <div className="container mx-auto px-4 lg:px-8 xl:max-w-[1240px]">
          <div className="flex flex-col justify-between gap-6 rounded-2xl bg-purple-100 p-6 shadow-md dark:bg-[#1e172a] sm:flex-row sm:items-center sm:p-8">
            <div className="flex items-start gap-4 sm:items-center">
              <img
                src={useBaseUrl('logos/optimized/podman-desktop-logo-200w-198h.webp')}
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white sm:text-xl">
                  Prefer a Graphical Desktop Interface?
                </h3>
                <p className="text-gray-600 m-0 max-w-xl text-xs font-medium leading-relaxed dark:text-gray-300 sm:text-sm">
                  Participate in monthly community meetings, release demos, and desktop extension syncs.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <a
                href="https://podman-desktop.io/community#community-events"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', backgroundColor: '#892CA0', color: '#ffffff' }}
                className="shadow-xs inline-flex items-center gap-2 rounded-xl bg-[#892CA0] px-4 py-2.5 !text-xs font-bold text-white !no-underline transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#77218d] hover:!text-white hover:shadow-md sm:!text-sm">
                <span className="text-white">Desktop Events</span>
                <Icon icon="material-symbols:arrow-outward-rounded" className="text-base text-white" />
              </a>
              <a
                href="https://podman-desktop.io"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
                className="shadow-xs hover:bg-purple-200 inline-flex items-center gap-1.5 rounded-xl bg-white px-4 py-2.5 !text-xs font-bold text-[#892CA0] !no-underline transition-all duration-150 hover:text-[#77218d] dark:bg-white/10 dark:text-purple-300 dark:hover:bg-white/15 sm:!text-sm">
                <span>Official Website</span>
                <Icon icon="material-symbols:arrow-outward-rounded" className="text-base" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 4: ASYNC (Mailing List & Contributing Cards)
      ============================================================ */}
      <section className="bg-purple-100/50 py-12 dark:bg-[#161222] sm:py-16">
        <div className="container mx-auto px-4 lg:px-8 xl:max-w-[1240px]">
          <div className="mb-10 text-center sm:mb-12">
            <div
              style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
              className="shadow-xs mb-3 inline-flex items-center gap-2 rounded-full bg-[#892CA0] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              <Icon icon="material-symbols:hub-rounded" className="text-base text-white" />
              <span className="text-white">Async Collaboration</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Mailing List &amp; Contributions
            </h2>
            <p className="text-gray-600 mx-auto mt-2 max-w-xl text-base font-medium leading-relaxed dark:text-gray-300">
              Engage through email discussions, report issues, and submit code to Podman repositories.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Card 1: Mailing List */}
            <div className="flex flex-col justify-between rounded-2xl bg-white p-7 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:bg-[#1e1b29]">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="shadow-xs flex h-11 w-11 items-center justify-center rounded-xl bg-[#892CA0] text-white">
                    <Icon icon="material-symbols:mail-outline-rounded" className="text-xl text-white" />
                  </div>
                  <span
                    style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                    className="inline-flex items-center rounded-md bg-[#892CA0] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                    Email Hub
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">Podman Mailing List</h3>
                <p className="mt-1 font-mono text-xs font-semibold text-[#892CA0] dark:text-purple-300">
                  podman@lists.podman.io
                </p>
                <p className="text-gray-600 mt-2 text-xs font-medium leading-relaxed dark:text-gray-300">
                  Join async email discussions on technical proposals and release updates, or search decades of public
                  archives.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <a
                  href="mailto:podman-join@lists.podman.io?subject=subscribe"
                  style={{ textDecoration: 'none', backgroundColor: '#892CA0', color: '#ffffff' }}
                  className="shadow-xs inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#892CA0] px-4 py-2.5 !text-xs font-bold text-white !no-underline transition hover:bg-[#77218d]">
                  <Icon icon="material-symbols:send-rounded" className="text-xs text-white" />
                  <span className="text-white">Subscribe via Email</span>
                </a>
                <a
                  href="https://lists.podman.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  className="hover:bg-purple-200 inline-flex items-center justify-center gap-1 rounded-xl bg-purple-100 px-4 py-2.5 !text-xs font-bold text-[#892CA0] !no-underline transition dark:bg-white/10 dark:text-purple-300 dark:hover:bg-white/15">
                  <span>Browse Archives</span>
                  <Icon icon="material-symbols:arrow-outward-rounded" className="text-xs" />
                </a>
              </div>
            </div>

            {/* Card 2: Contributing */}
            <div className="flex flex-col justify-between rounded-2xl bg-white p-7 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl dark:bg-[#1e1b29]">
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="shadow-xs flex h-11 w-11 items-center justify-center rounded-xl bg-[#892CA0] text-white">
                    <Icon icon="material-symbols:code-rounded" className="text-xl text-white" />
                  </div>
                  <span
                    style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                    className="inline-flex items-center rounded-md bg-[#892CA0] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                    Open Source
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                  Contribute Code &amp; Docs
                </h3>
                <p className="mt-1 font-mono text-xs font-semibold text-[#892CA0] dark:text-purple-300">
                  containers/podman
                </p>
                <p className="text-gray-600 mt-2 text-xs font-medium leading-relaxed dark:text-gray-300">
                  Open issues for bugs or submit pull requests with DCO sign-off (
                  <code className="rounded bg-purple-100 px-1 py-0.5 font-mono text-[11px] text-[#892CA0] dark:bg-white/10 dark:text-purple-300">
                    git commit -s
                  </code>
                  ).
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <a
                  href="https://github.com/containers/podman/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', backgroundColor: '#892CA0', color: '#ffffff' }}
                  className="shadow-xs inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#892CA0] px-4 py-2.5 !text-xs font-bold text-white !no-underline transition hover:bg-[#77218d]">
                  <span className="text-white">Contribution Guide</span>
                  <Icon icon="material-symbols:arrow-outward-rounded" className="text-xs text-white" />
                </a>
                <a
                  href="https://github.com/containers/podman/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none' }}
                  className="hover:bg-purple-200 inline-flex items-center justify-center gap-1 rounded-xl bg-purple-100 px-4 py-2.5 !text-xs font-bold text-[#892CA0] !no-underline transition dark:bg-white/10 dark:text-purple-300 dark:hover:bg-white/15">
                  <span>GitHub Issues</span>
                  <Icon icon="material-symbols:arrow-outward-rounded" className="text-xs" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 5: SUPPORTING ORGANIZATIONS (Unified Logo Ribbon)
      ============================================================ */}
      <section className="bg-purple-100/40 py-12 dark:bg-[#161222] sm:py-16">
        <div className="container mx-auto px-4 lg:px-8 xl:max-w-[1240px]">
          <div className="mb-8 text-center sm:mb-10">
            <div
              style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
              className="shadow-xs mb-3 inline-flex items-center gap-2 rounded-full bg-[#892CA0] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
              <Icon icon="material-symbols:star-rounded" className="text-base text-white" />
              <span className="text-white">Special Thanks</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Supporting Organizations
            </h2>
            <p className="text-gray-600 mx-auto mt-2 max-w-xl text-base font-medium leading-relaxed dark:text-gray-300">
              Podman thrives thanks to the continuous contributions from leading open source organizations.
            </p>
          </div>

          {/* Unified Seamless Logo Banner — Optically Balanced, Zero Individual Boxes */}
          <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-white sm:p-8 md:p-10">
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 md:justify-between lg:gap-12">
              {sponsorLogos.map((sponsor, index) => (
                <a
                  key={index}
                  href={sponsor.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={sponsor.label}
                  className="flex items-center justify-center p-2 transition-transform duration-200 hover:-translate-y-1 hover:opacity-80">
                  <img
                    src={useBaseUrl(sponsor.src)}
                    alt={sponsor.alt}
                    className={`${sponsor.heightClass} w-auto object-contain transition-transform duration-200 hover:scale-105`}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
