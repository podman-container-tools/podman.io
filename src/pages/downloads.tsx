import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { Icon } from '@iconify/react';
import WaveBorder from '@site/src/components/shapes/WaveBorder';
import { LATEST_VERSION, LATEST_DESKTOP_VERSION } from '@site/static/data/global';

/* ------------------------------------------------------------------ */
/*  Data                                                                */
/* ------------------------------------------------------------------ */
interface LinuxDistro {
  id: string;
  name: string;
  icon: string;
  pkgMgr: string;
  command: string;
  note: string;
}

const linuxDistros: LinuxDistro[] = [
  {
    id: 'fedora',
    name: 'Fedora / RHEL',
    icon: 'simple-icons:fedora',
    pkgMgr: 'dnf',
    command: 'sudo dnf install -y podman',
    note: 'Fedora 38+, RHEL 8/9, CentOS Stream, AlmaLinux, Rocky Linux.',
  },
  {
    id: 'ubuntu',
    name: 'Ubuntu / Debian',
    icon: 'simple-icons:ubuntu',
    pkgMgr: 'apt',
    command: 'sudo apt update && sudo apt install -y podman',
    note: 'Ubuntu 22.04 LTS+, Debian 11/12 (Bullseye/Bookworm).',
  },
  {
    id: 'arch',
    name: 'Arch Linux',
    icon: 'simple-icons:archlinux',
    pkgMgr: 'pacman',
    command: 'sudo pacman -S --noconfirm podman',
    note: 'Always rolling latest stable release from official extra repo.',
  },
  {
    id: 'opensuse',
    name: 'openSUSE',
    icon: 'simple-icons:opensuse',
    pkgMgr: 'zypper',
    command: 'sudo zypper install -y podman',
    note: 'openSUSE Tumbleweed and Leap 15.5+.',
  },
];

/* ------------------------------------------------------------------ */
/*  Terminal component                                                  */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/* ------------------------------------------------------------------ */
/*  Copy Icon Button (Icon Only, Official Brand Purple #892CA0)        */
/* ------------------------------------------------------------------ */
function CopyIconButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={copy}
      type="button"
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
      title={copied ? 'Copied!' : 'Copy'}
      style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
      className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-[#892CA0] text-white transition-all duration-150 hover:bg-[#77218d] active:scale-95 ${className}`}>
      <Icon
        icon={copied ? 'material-symbols:check-rounded' : 'material-symbols:content-copy-outline'}
        className="text-sm text-white"
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Terminal component (Clean & Vibrant — Heading + Copy on Right)     */
/* ------------------------------------------------------------------ */
function Terminal({ command, label }: { command: string; label?: string }) {
  const parts = command.split(' ');

  return (
    <div className="overflow-hidden rounded-xl border-0 bg-[#0e0a1a] shadow-sm dark:bg-[#120c22]">
      <div className="bg-purple-950/50 flex items-center justify-between border-b border-white/10 px-4 py-2">
        <div className="flex items-center gap-2">
          <Icon icon="material-symbols:terminal-rounded" className="text-base text-purple-300" />
          {label && <span className="font-mono text-xs font-bold text-white">{label}</span>}
        </div>
        <CopyIconButton text={command} />
      </div>
      <div className="flex items-center gap-3 overflow-x-auto px-5 py-3.5 font-mono text-[13px] text-white">
        <span className="shrink-0 select-none font-bold text-purple-300">$</span>
        <div className="whitespace-nowrap">
          {parts.map((p, i) => {
            let color = '#ffffff';
            if (
              i === 0 ||
              p === 'install' ||
              p === 'update' ||
              p === 'run' ||
              p === 'machine' ||
              p === 'init' ||
              p === 'start'
            )
              color = '#38bdf8';
            else if (p.toLowerCase().includes('podman') || p.includes('hello-world')) color = '#4ade80';
            else if (p.startsWith('-') || p === '&&') color = '#c084fc';
            return (
              <span key={i} style={{ color, fontWeight: i === 0 || p === '&&' ? 700 : 500 }}>
                {p}{' '}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Linux Distro Workspace (Meeting Page Inspired Containers)          */
/* ------------------------------------------------------------------ */
function LinuxDistroWorkspace({
  distros,
  selectedId,
  onSelectDistro,
}: {
  distros: LinuxDistro[];
  selectedId: string;
  onSelectDistro: (id: string) => void;
}) {
  const current = distros.find(d => d.id === selectedId) || distros[0];

  return (
    <div className="overflow-hidden rounded-2xl border border-purple-100/60 bg-white/80 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.07)] backdrop-blur-md transition-all duration-200 dark:border-white/10 dark:bg-[#1e1b29] dark:bg-gradient-to-br dark:from-[#2a173d] dark:via-[#1e1b29] dark:to-[#161420] dark:shadow-none md:p-8">
      {/* 1. Header with Badge, Title & All Distros Link */}
      <div className="flex flex-col justify-between gap-4 border-b border-purple-100/60 pb-6 dark:border-white/10 sm:flex-row sm:items-center">
        <div>
          <div
            style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
            className="shadow-xs inline-flex items-center gap-2 rounded-md bg-[#892CA0] px-3 py-1.5 text-xs font-bold text-white">
            <Icon icon="simple-icons:linux" className="text-sm text-white" />
            <span className="text-white">Linux Package Repositories</span>
          </div>
          <h3 className="text-purple-950 mt-2 p-0 text-2xl font-extrabold tracking-tight dark:text-white sm:text-3xl">
            Choose Your Distribution
          </h3>
          <p className="mt-1 text-sm font-medium text-purple-900/90 dark:text-purple-100">
            Podman is officially pre-packaged and maintained across all major Linux distributions.
          </p>
        </div>

        <a
          href="/docs/installation#installing-on-linux"
          style={{ textDecoration: 'none', backgroundColor: '#892CA0', color: '#ffffff' }}
          className="inline-flex shrink-0 items-center gap-2 rounded-xl border-0 bg-[#892CA0] px-4 py-2.5 text-sm font-bold text-white !no-underline shadow-sm transition-all duration-150 hover:bg-[#77218d] hover:!text-white hover:shadow">
          <span style={{ color: '#ffffff' }} className="font-bold !text-white">
            View all distributions
          </span>
          <Icon
            icon="material-symbols:arrow-forward-rounded"
            className="text-base text-white"
            style={{ color: '#ffffff' }}
          />
        </a>
      </div>

      {/* 2. Distro Selector Grid — Inspo from Meeting SessionCard */}
      <div className="mt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {distros.map(d => {
            const isSelected = d.id === current.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => onSelectDistro(d.id)}
                className={`group flex cursor-pointer select-none flex-col justify-between rounded-xl p-4 text-left outline-none transition-all duration-150 ${
                  isSelected
                    ? 'border border-[#892CA0] bg-[#892CA0] text-white shadow-sm'
                    : 'text-purple-950 border border-purple-100/60 bg-white shadow-sm hover:border-purple-300 hover:bg-purple-50/40 hover:shadow-md dark:border-white/10 dark:bg-[#25242b] dark:text-white dark:hover:border-white/20'
                }`}>
                <div className="flex items-center justify-between gap-2">
                  <div
                    style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#892CA0] text-white shadow-md shadow-[#892ca0]/20 dark:shadow-none">
                    <Icon icon={d.icon} className="text-2xl text-white" />
                  </div>
                  <span
                    style={isSelected ? undefined : { backgroundColor: '#892CA0', color: '#ffffff' }}
                    className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold uppercase transition-colors ${
                      isSelected ? 'bg-white/20 text-white' : 'shadow-xs bg-[#892CA0] text-white'
                    }`}>
                    {d.pkgMgr}
                  </span>
                </div>
                <div className="mt-3">
                  <div className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-purple-950 dark:text-white'}`}>
                    {d.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Selected Distro Command Box — Inspo from Meeting Containers */}
      <div className="mt-6 space-y-4">
        <div className="overflow-hidden rounded-xl border-0 bg-[#0e0a1a] shadow-sm dark:bg-[#120c22]">
          <div className="bg-purple-950/50 flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Icon icon="material-symbols:terminal-rounded" className="text-base text-purple-300" />
              <span className="font-mono text-white">
                {current.name} &bull; {current.pkgMgr}
              </span>
            </div>
            <CopyIconButton text={current.command} />
          </div>

          <div className="flex items-center gap-3 overflow-x-auto p-5 font-mono text-sm leading-relaxed text-white">
            <span className="select-none font-bold text-purple-300">$</span>
            <span className="text-emerald-300 font-bold">{current.command}</span>
          </div>

          <div className="bg-purple-950/30 flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-5 py-3 text-xs text-purple-100">
            <div className="flex items-center gap-2">
              <Icon icon="material-symbols:info-outline-rounded" className="shrink-0 text-base text-purple-300" />
              <span className="font-semibold text-purple-100">{current.note}</span>
            </div>
            <div className="text-emerald-300 flex items-center gap-1.5 text-[11px] font-bold">
              <Icon icon="material-symbols:verified-rounded" className="text-sm" />
              <span>Official Repository</span>
            </div>
          </div>
        </div>

        {/* Verification and Next Step — Full Container */}
        <div className="border-t border-purple-100 pt-6 dark:border-white/10">
          <div className="overflow-hidden rounded-xl border-0 bg-[#0e0a1a] shadow-sm dark:bg-[#120c22]">
            <div className="bg-purple-950/50 flex items-center justify-between border-b border-white/10 px-4 py-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Icon icon="material-symbols:terminal-rounded" className="text-base text-purple-300" />
                <span className="font-mono text-white">Verify Installation</span>
              </div>
              <CopyIconButton text="podman --version && podman run --rm hello-world" />
            </div>

            <div className="flex items-center gap-3 overflow-x-auto p-5 font-mono text-sm leading-relaxed text-white">
              <span className="select-none font-bold text-purple-300">$</span>
              <span className="text-emerald-300 font-bold">
                podman --version &amp;&amp; podman run --rm hello-world
              </span>
            </div>

            <div className="bg-purple-950/30 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-3 text-xs text-purple-100">
              <div className="flex items-center gap-2">
                <Icon icon="material-symbols:check-circle-rounded" className="text-emerald-400 shrink-0 text-base" />
                <span className="font-semibold text-purple-100">Confirms daemonless engine &amp; rootless runtime</span>
              </div>
              <a
                href="https://docs.podman.io/en/latest/Introduction.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', backgroundColor: '#892CA0', color: '#ffffff' }}
                className="shadow-xs inline-flex shrink-0 items-center gap-1.5 rounded-lg border-0 bg-[#892CA0] px-3.5 py-1.5 text-xs font-bold text-white !no-underline transition-colors hover:bg-[#77218d] hover:!text-white">
                <span style={{ color: '#ffffff' }} className="font-bold !text-white">
                  Read Getting Started
                </span>
                <Icon
                  icon="material-symbols:arrow-outward-rounded"
                  className="text-sm text-white"
                  style={{ color: '#ffffff' }}
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Download Button (Sleek, Modern Action Button)                      */
/* ------------------------------------------------------------------ */
function DownloadBtn({ href, title, sub }: { href: string; primary?: boolean; title: string; sub: string }) {
  return (
    <a
      href={href}
      style={{ textDecoration: 'none', backgroundColor: '#892CA0', color: '#ffffff' }}
      className="group flex w-full items-center justify-between rounded-xl bg-[#892CA0] px-5 py-3 text-sm font-bold text-white !no-underline shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#77218d] hover:!text-white hover:shadow-md">
      <div className="flex items-center gap-3">
        <Icon icon="material-symbols:download-rounded" className="shrink-0 text-xl text-white" />
        <div className="text-left">
          <div className="text-sm font-bold leading-tight !text-white">{title}</div>
          <div className="!text-purple-200 mt-0.5 text-xs font-medium">{sub}</div>
        </div>
      </div>
      <Icon
        icon="material-symbols:arrow-forward-rounded"
        className="shrink-0 text-base text-white transition-transform duration-150 group-hover:translate-x-1"
      />
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Resource Card — Consistent Brand Card Matching Page UI            */
/* ------------------------------------------------------------------ */
interface ResourceCardProps {
  badge: string;
  icon: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
}

function ResourceCard({ badge, icon, title, desc, href, cta }: ResourceCardProps) {
  return (
    <div
      onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
      role="link"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter') window.open(href, '_blank', 'noopener,noreferrer');
      }}
      className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-purple-100/60 bg-white/80 p-7 text-left shadow-[0_4px_20px_rgba(0,0,0,0.07)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(137,44,160,0.12)] dark:border-white/10 dark:bg-[#1e1b29] dark:bg-gradient-to-br dark:from-[#2a173d] dark:via-[#1e1b29] dark:to-[#161420] dark:shadow-none">
      <div>
        {/* Top Header: Icon + Badge */}
        {/* Top Header: Icon + Badge */}
        <div className="flex items-center justify-between gap-3">
          <div
            style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#892CA0] text-white shadow-md shadow-[#892ca0]/25 dark:shadow-none">
            <Icon icon={icon} className="text-2xl text-white" />
          </div>
          <span
            style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
            className="shadow-xs rounded-full bg-[#892CA0] px-3.5 py-1 text-xs font-bold uppercase tracking-wider !text-white">
            {badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-purple-950 mb-2 mt-5 p-0 text-xl font-bold tracking-tight transition-colors group-hover:text-[#892CA0] dark:text-white dark:group-hover:text-purple-300">
          {title}
        </h3>

        {/* Description */}
        <p className="m-0 text-sm font-medium leading-relaxed text-purple-900/90 dark:text-purple-100">{desc}</p>
      </div>

      {/* Footer Action Link */}
      <div className="mt-8 flex items-center justify-between border-t border-purple-100/60 pt-4 dark:border-white/10">
        <span className="text-sm font-bold text-[#892CA0] transition-colors group-hover:text-[#77218d] dark:text-purple-300 dark:group-hover:text-white">
          {cta}
        </span>
        <div
          style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#892CA0] text-white shadow-sm transition-all duration-200 group-hover:bg-[#77218d]">
          <Icon
            icon="material-symbols:arrow-outward-rounded"
            className="text-base text-white transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */
type OS = 'windows' | 'mac' | 'linux';

const OS_OPTIONS: { id: OS; label: string; icon: string }[] = [
  { id: 'windows', label: 'Windows', icon: 'fa-brands:windows' },
  { id: 'mac', label: 'macOS', icon: 'fa-brands:apple' },
  { id: 'linux', label: 'Linux', icon: 'fa-brands:linux' },
];

const detectOperatingSystem = (): OS => {
  if (typeof window === 'undefined') return 'windows';
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes('win')) {
    return 'windows';
  }
  if (userAgent.includes('mac') || userAgent.includes('darwin')) {
    return 'mac';
  }
  if (userAgent.includes('linux') || userAgent.includes('x11')) {
    return 'linux';
  }
  return 'windows';
};

export default function DownloadsPage(): JSX.Element {
  const [os, setOs] = useState<OS>('windows');
  const [distro, setDistro] = useState('fedora');

  useEffect(() => {
    const detected = detectOperatingSystem();
    setOs(detected);
  }, []);

  return (
    <Layout
      title="Download Podman"
      description="Download Podman CLI for Windows, macOS, and Linux. Free, open-source, daemonless container engine.">
      {/* ============================================================
          HERO SECTION (Clean Centered Hero: Download Podman CLI & OS Switcher)
      ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-700 pb-16 pt-10 dark:from-blue-700 dark:to-purple-900 sm:pb-20 md:pt-14 lg:pb-24">
        <div className="container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="relative z-30 mx-auto max-w-3xl text-center">
            {/* Release version badge */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              <span style={{ color: '#ffffff' }} className="!text-white dark:!text-white">
                Latest release &mdash; v{LATEST_VERSION}
              </span>
            </div>

            {/* Headline */}
            <h1
              style={{ color: '#ffffff' }}
              className="mb-3 text-3xl font-extrabold tracking-tight !text-white dark:!text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Download Podman
            </h1>
            <p
              style={{ color: 'rgba(255, 255, 255, 0.95)' }}
              className="mx-auto mb-8 max-w-2xl text-base leading-relaxed !text-white/95 dark:!text-white/95 sm:text-lg">
              The daemonless, open-source container engine. Develop, manage, and run OCI containers and pods without a
              background daemon and without root privileges.
            </p>

            {/* OS Selector — clean segmented control matching MeetingTypeSwitcher */}
            <div className="flex justify-center">
              <div
                role="tablist"
                aria-label="Select operating system"
                className="relative inline-flex w-fit rounded-2xl border border-white/25 bg-black/20 p-1.5 backdrop-blur-md">
                {OS_OPTIONS.map(({ id, label, icon }) => {
                  const isActive = os === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setOs(id)}
                      style={{ border: 'none', outline: 'none', textDecoration: 'none' }}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold !no-underline transition-all duration-200 ${
                        isActive
                          ? 'bg-white text-purple-900 shadow-sm'
                          : 'bg-transparent text-white hover:text-white/80'
                      }`}>
                      <Icon icon={icon} className={`text-xl ${isActive ? 'text-purple-900' : 'text-white'}`} />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* WaveBorder bottom transition to content area — matching background below */}
        <WaveBorder
          light="fill-white"
          dark="dark:fill-gray-900"
          className="pointer-events-none absolute -bottom-0.5 left-0 z-20 h-8 w-full sm:h-10 md:h-12 lg:h-14 xl:h-16"
          preserveAspectRatio="none"
        />
      </section>

      {/* ============================================================
          INSTALL PANEL (Clean, Balanced & Modern Layout)
      ============================================================ */}
      <section className="bg-white py-14 dark:bg-gray-900 sm:py-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Section Header — Matching Meeting Page Typography & Badges */}
          <div className="mb-10 text-center sm:mb-12">
            <div
              style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#892CA0] px-3.5 py-1 text-xs font-bold uppercase tracking-wider !text-white shadow-sm">
              <Icon
                icon={os === 'windows' ? 'fa-brands:windows' : os === 'mac' ? 'fa-brands:apple' : 'fa-brands:linux'}
                className="text-base text-white"
              />
              <span className="!text-white">
                {os === 'windows'
                  ? 'Windows Installation'
                  : os === 'mac'
                    ? 'macOS Installation'
                    : 'Linux Package Repositories'}
              </span>
            </div>
            <h2 className="text-purple-950 text-3xl font-extrabold tracking-tight dark:text-white sm:text-4xl">
              {os === 'windows' && 'Podman for Windows'}
              {os === 'mac' && 'Podman for macOS'}
              {os === 'linux' && 'Podman for Linux'}
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-base font-medium leading-relaxed text-purple-900/90 dark:text-purple-100">
              {os === 'windows' &&
                'Official standalone MSI installers for 64-bit and ARM64, or silent install via package manager.'}
              {os === 'mac' &&
                'Universal PKG installer for Apple Silicon and Intel, or one-command setup via Homebrew.'}
              {os === 'linux' &&
                'Natively available, tested, and maintained across all major Linux distribution repositories.'}
            </p>
          </div>

          {/* ==========================================================
              WINDOWS: 2-Column Balanced Showcase (MSI vs Package Managers)
          ========================================================== */}
          {os === 'windows' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
              {/* Card 1: Standalone MSI Installers */}
              <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-purple-100/60 bg-white/80 p-7 shadow-[0_4px_20px_rgba(0,0,0,0.07)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(137,44,160,0.12)] dark:border-white/10 dark:bg-[#1e1b29] dark:bg-gradient-to-br dark:from-[#2a173d] dark:via-[#1e1b29] dark:to-[#161420] dark:shadow-none">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div
                      style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#892CA0] text-white shadow-md shadow-[#892ca0]/25 dark:shadow-none">
                      <Icon icon="fa-brands:windows" className="text-2xl text-white" />
                    </div>
                    <span
                      style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                      className="shadow-xs rounded-full bg-[#892CA0] px-3 py-1 text-xs font-bold uppercase tracking-wider !text-white">
                      Official Installers
                    </span>
                  </div>

                  <h3 className="text-purple-950 mb-2 mt-5 p-0 text-xl font-bold dark:text-white">
                    Windows MSI Packages
                  </h3>
                  <p className="m-0 text-sm font-medium leading-relaxed text-purple-900/90 dark:text-purple-100">
                    Standalone MSI installers with automated WSL 2 integration and background machine setup.
                  </p>

                  <div className="text-purple-950 mt-5 space-y-2 text-xs font-semibold dark:text-purple-100">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="material-symbols:check-circle-rounded"
                        className="text-base text-[#892CA0] dark:text-purple-300"
                      />
                      <span>WSL 2 based container machine engine</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="material-symbols:check-circle-rounded"
                        className="text-base text-[#892CA0] dark:text-purple-300"
                      />
                      <span>Docker CLI compatible alias &amp; compose support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="material-symbols:check-circle-rounded"
                        className="text-base text-[#892CA0] dark:text-purple-300"
                      />
                      <span>Cryptographically signed with checksum verification</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3 border-t border-purple-100/60 pt-5 dark:border-white/10">
                  <DownloadBtn
                    href={`https://github.com/podman-container-tools/podman/releases/download/v${LATEST_VERSION}/podman-installer-windows-amd64.msi`}
                    primary
                    title="Windows x64 Installer"
                    sub=".msi · 64-bit Intel / AMD"
                  />
                  <DownloadBtn
                    href={`https://github.com/podman-container-tools/podman/releases/download/v${LATEST_VERSION}/podman-installer-windows-arm64.msi`}
                    title="Windows ARM64 Installer"
                    sub=".msi · ARM64 Copilot+ PCs"
                  />
                </div>
              </div>

              {/* Card 2: Package Managers (WinGet & Chocolatey) */}
              <div className="flex flex-col justify-between overflow-hidden rounded-2xl border border-purple-100/60 bg-white/80 p-7 shadow-[0_4px_20px_rgba(0,0,0,0.07)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(137,44,160,0.12)] dark:border-white/10 dark:bg-[#1e1b29] dark:bg-gradient-to-br dark:from-[#2a173d] dark:via-[#1e1b29] dark:to-[#161420] dark:shadow-none">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div
                      style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#892CA0] text-white shadow-md shadow-[#892ca0]/25 dark:shadow-none">
                      <Icon icon="material-symbols:terminal-rounded" className="text-2xl text-white" />
                    </div>
                    <span
                      style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                      className="shadow-xs rounded-full bg-[#892CA0] px-3 py-1 text-xs font-bold uppercase tracking-wider !text-white">
                      Command Line
                    </span>
                  </div>

                  <h3 className="text-purple-950 mb-2 mt-5 p-0 text-xl font-bold dark:text-white">Package Managers</h3>
                  <p className="m-0 text-sm font-medium leading-relaxed text-purple-900/90 dark:text-purple-100">
                    Silent, scriptable installation directly from PowerShell or Windows Terminal.
                  </p>

                  <div className="mt-5 space-y-3">
                    <Terminal command="winget install podman" label="WinGet" />
                    <Terminal command="choco install podman" label="Chocolatey" />
                  </div>
                </div>

                <div className="mt-8 border-t border-purple-100 pt-6 dark:border-white/10">
                  <Terminal
                    command="podman machine init && podman machine start"
                    label="Next step after installation"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              MACOS: Unified Single Container Showcase (Official PKG + Homebrew Notice)
          ========================================================== */}
          {os === 'mac' && (
            <div className="mx-auto max-w-3xl">
              <div className="overflow-hidden rounded-2xl border border-purple-100/60 bg-white/80 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.07)] backdrop-blur-md transition-all duration-200 dark:border-white/10 dark:bg-[#1e1b29] dark:bg-gradient-to-br dark:from-[#2a173d] dark:via-[#1e1b29] dark:to-[#161420] dark:shadow-none md:p-8">
                {/* Top Header Card */}
                <div className="flex flex-col justify-between gap-4 border-b border-purple-100/60 pb-6 dark:border-white/10 sm:flex-row sm:items-center">
                  <div>
                    <div
                      style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                      className="shadow-xs inline-flex items-center gap-2 rounded-md bg-[#892CA0] px-3 py-1.5 text-xs font-bold text-white">
                      <Icon icon="fa-brands:apple" className="text-sm text-white" />
                      <span className="text-white">Official macOS Package</span>
                    </div>
                    <h3 className="text-purple-950 mt-2 p-0 text-2xl font-extrabold tracking-tight dark:text-white sm:text-3xl">
                      Universal PKG Installer
                    </h3>
                    <p className="mt-1 text-sm font-medium text-purple-900/90 dark:text-purple-100">
                      Single graphical installer package (.pkg) optimized for both Apple Silicon (M1/M2/M3/M4) and Intel
                      64-bit Macs.
                    </p>
                  </div>

                  <span
                    style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                    className="shadow-xs shrink-0 rounded-full bg-[#892CA0] px-3.5 py-1 text-xs font-bold uppercase tracking-wider !text-white">
                    Recommended Method
                  </span>
                </div>

                {/* Main Download Section */}
                <div className="mt-6">
                  {/* High-Contrast Feature Points (No background blur or grey pills) */}
                  <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="flex items-center gap-2.5">
                      <Icon
                        icon="material-symbols:check-circle-rounded"
                        className="dark:text-purple-400 shrink-0 text-lg text-[#892CA0]"
                      />
                      <span className="text-gray-800 text-xs font-bold dark:text-gray-100">
                        Universal Binary (Apple &amp; Intel)
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Icon
                        icon="material-symbols:check-circle-rounded"
                        className="dark:text-purple-400 shrink-0 text-lg text-[#892CA0]"
                      />
                      <span className="text-gray-800 text-xs font-bold dark:text-gray-100">
                        Includes CLI &amp; machine helpers
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Icon
                        icon="material-symbols:check-circle-rounded"
                        className="dark:text-purple-400 shrink-0 text-lg text-[#892CA0]"
                      />
                      <span className="text-gray-800 text-xs font-bold dark:text-gray-100">
                        Signed installer package
                      </span>
                    </div>
                  </div>

                  <DownloadBtn
                    href={`https://github.com/podman-container-tools/podman/releases/download/v${LATEST_VERSION}/podman-installer-macos-arm64.pkg`}
                    primary
                    title="Download macOS Universal PKG Installer"
                    sub={`v${LATEST_VERSION} · Universal PKG (.pkg)`}
                  />
                </div>

                {/* Next Step Terminal */}
                <div className="mt-5">
                  <Terminal
                    command="podman machine init && podman machine start"
                    label="Next step after installation"
                  />
                </div>

                {/* High-Contrast Low-Attention Homebrew Note */}
                <div className="mt-6 border-t border-purple-100/60 pt-4 dark:border-white/10">
                  <div className="flex flex-col items-start justify-between gap-2 text-xs font-medium sm:flex-row sm:items-center">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Icon
                        icon="material-symbols:info-outline-rounded"
                        className="dark:text-gray-400 shrink-0 text-base text-gray-500"
                      />
                      <span>
                        <strong className="font-bold text-gray-900 dark:text-gray-100">
                          Alternative option (Not recommended):
                        </strong>{' '}
                        <span className="text-gray-700 dark:text-gray-300">Homebrew formula</span>{' '}
                        <span className="dark:bg-gray-800 dark:text-emerald-400 inline-flex items-center rounded border border-gray-300 bg-gray-100 px-2 py-0.5 font-mono text-[12px] font-bold text-gray-900 dark:border-gray-700">
                          brew install podman
                        </span>
                      </span>
                    </div>
                    <CopyIconButton text="brew install podman" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              LINUX: Clean Distro Showcase Card (Meeting Page Consistent)
          ========================================================== */}
          {os === 'linux' && (
            <LinuxDistroWorkspace distros={linuxDistros} selectedId={distro} onSelectDistro={setDistro} />
          )}
        </div>
      </section>

      {/* ============================================================
          PODMAN DESKTOP (Secondary GUI Callout Banner)
      ============================================================ */}
      <section className="bg-white pb-12 pt-2 dark:bg-gray-900 sm:pb-16 sm:pt-4">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl border border-purple-100/60 bg-white/80 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.07)] backdrop-blur-md transition-all duration-200 hover:shadow-[0_8px_30px_rgba(137,44,160,0.12)] dark:border-white/10 dark:bg-[#1e1b29] dark:bg-gradient-to-br dark:from-[#2a173d] dark:via-[#1e1b29] dark:to-[#161420] dark:shadow-none sm:flex-row sm:items-center sm:p-7">
            <div className="max-w-xl space-y-1.5">
              <div
                style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                className="shadow-xs inline-flex items-center gap-2 rounded-md bg-[#892CA0] px-3 py-1 text-xs font-bold text-white">
                <Icon icon="material-symbols:desktop-windows-rounded" className="text-sm text-white" />
                <span className="text-white">Podman Desktop GUI &bull; v{LATEST_DESKTOP_VERSION}</span>
              </div>
              <h3 className="text-purple-950 mt-2 p-0 text-xl font-bold dark:text-white sm:text-2xl">
                Looking for a Graphical Interface?
              </h3>
              <p className="m-0 text-sm font-medium leading-relaxed text-purple-900/90 dark:text-purple-100">
                Manage containers, inspect logs, build images, and run Kubernetes effortlessly with the official Podman
                Desktop app.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <a
                href="https://podman-desktop.io/downloads"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', backgroundColor: '#892CA0', color: '#ffffff' }}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#892CA0] px-5 py-3 text-sm font-bold text-white !no-underline shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#77218d] hover:!text-white hover:shadow-md">
                <span style={{ color: '#ffffff' }} className="font-bold !text-white">
                  Get Podman Desktop
                </span>
                <Icon
                  icon="material-symbols:arrow-outward-rounded"
                  className="text-base text-white"
                  style={{ color: '#ffffff' }}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          RELEASES & RESOURCES (Consistent Section Layout)
      ============================================================ */}
      <section className="bg-white pb-20 pt-4 dark:bg-gray-900 sm:pb-28 sm:pt-6">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div
              style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#892CA0] px-3.5 py-1 text-xs font-bold uppercase tracking-wider !text-white shadow-sm">
              <Icon icon="material-symbols:library-books-outline-rounded" className="text-base text-white" />
              <span className="!text-white">Developer Resources</span>
            </div>
            <h2 className="text-purple-950 text-3xl font-extrabold tracking-tight dark:text-white sm:text-4xl">
              Releases &amp; Documentation
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-base font-medium leading-relaxed text-purple-900/90 dark:text-purple-100">
              Explore official release archives, troubleshooting guides, and in-depth documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <ResourceCard
              badge="Archive & Binaries"
              icon="fa-brands:github"
              title="GitHub Releases"
              desc="Access all historical releases, release notes, changelogs, and binary tarballs directly on GitHub."
              href="https://github.com/containers/podman/releases"
              cta="Browse all releases"
            />
            <ResourceCard
              badge="Setup & Support"
              icon="material-symbols:help-outline-rounded"
              title="Troubleshooting Guide"
              desc="Solutions for common installation issues, rootless container setups, WSL2 errors, and socket configuration."
              href="https://github.com/containers/podman/blob/main/troubleshooting.md"
              cta="Read troubleshooting guide"
            />
            <ResourceCard
              badge="Guides & Reference"
              icon="material-symbols:article-outline"
              title="Official Documentation"
              desc="Complete man pages, CLI command references, architecture guides, and container tutorials."
              href="https://docs.podman.io"
              cta="Explore documentation"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
