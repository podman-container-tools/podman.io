import React, { useState } from 'react';
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
            else if (p.toLowerCase().includes('podman') || p.includes('RedHat') || p.includes('hello-world'))
              color = '#4ade80';
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
    <div className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm transition-all duration-200 dark:border-white/10 dark:bg-[#201f27] md:p-8">
      {/* 1. Header with Badge, Title & All Distros Link */}
      <div className="flex flex-col justify-between gap-4 border-b border-black/[0.06] pb-6 dark:border-white/10 sm:flex-row sm:items-center">
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
                    : 'text-purple-950 border border-black/[0.06] bg-white shadow-sm hover:border-black/[0.14] hover:bg-purple-50/40 hover:shadow-md dark:border-white/10 dark:bg-[#25242b] dark:text-white dark:hover:border-white/20'
                }`}>
                <div className="flex items-center justify-between gap-2">
                  <div
                    style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#892CA0] text-white shadow-md shadow-[#892ca0]/20">
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
        <div className="border-t border-black/[0.06] pt-6 dark:border-white/10">
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
/*  Resource Card — True Bluish-Purple Developer Hub Card               */
/* ------------------------------------------------------------------ */
interface ResourceCardProps {
  badge: string;
  badgeColor: string;
  icon: string;
  iconBg: string;
  title: string;
  desc: string;
  href: string;
  cta: string;
  tags: string[];
}

function ResourceCard({ badge, badgeColor, icon, iconBg, title, desc, href, cta, tags }: ResourceCardProps) {
  return (
    <div
      onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
      role="link"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter') window.open(href, '_blank', 'noopener,noreferrer');
      }}
      className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-black/[0.06] bg-white p-7 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-black/[0.14] hover:shadow-md dark:border-white/10 dark:bg-[#201f27] dark:hover:border-white/20">
      <div>
        {/* Top bar: Badge + Icon */}
        <div className="flex items-center justify-between gap-3">
          <div
            style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBg} shadow-md shadow-[#892ca0]/25`}>
            <Icon icon={icon} className="text-2xl text-white" />
          </div>
          <span
            style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
            className={`rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider ${badgeColor}`}>
            {badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-purple-950 mb-2.5 mt-5 p-0 text-xl font-bold tracking-tight transition-colors duration-150 group-hover:text-[#892CA0] dark:text-white dark:group-hover:text-purple-300">
          {title}
        </h3>

        {/* Description */}
        <p className="m-0 text-sm font-medium leading-relaxed text-purple-900/90 dark:text-purple-100/90">{desc}</p>

        {/* Feature Tags / Topics */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
              className="shadow-xs rounded-lg bg-[#892CA0] px-2.5 py-1 text-xs font-bold text-white">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer link */}
      <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-4 text-sm font-bold text-[#892CA0] transition-colors duration-150 group-hover:text-purple-900 dark:border-white/10 dark:text-purple-300 dark:group-hover:text-white">
        <span className="font-bold text-[#892CA0] group-hover:text-purple-900 dark:text-purple-300 dark:group-hover:text-white">
          {cta}
        </span>
        <div
          style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#892CA0] text-white transition-all duration-200 group-hover:bg-[#77218d]">
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

/* ------------------------------------------------------------------ */
/*  Hero CLI Terminal — Interactive, OS-responsive CLI showcase        */
/* ------------------------------------------------------------------ */
function HeroCliTerminal({ os }: { os: OS }) {
  const getCliDetails = () => {
    switch (os) {
      case 'windows':
        return {
          installCmd: 'winget install RedHat.Podman',
          step1Label: '# 1. Install Podman CLI on Windows',
          step1Cmd: 'winget install RedHat.Podman',
          step2Label: '# 2. Initialize Podman machine & run rootless',
          step2Cmd: 'podman machine init && podman machine start',
          step3Cmd: 'podman run -d -p 8080:80 nginx',
          output: '✔ Container 4f8b9e2c started (daemonless & rootless)',
        };
      case 'mac':
        return {
          installCmd: 'brew install podman',
          step1Label: '# 1. Install Podman CLI on macOS',
          step1Cmd: 'brew install podman',
          step2Label: '# 2. Initialize Podman machine & run container',
          step2Cmd: 'podman machine init && podman machine start',
          step3Cmd: 'podman run -d -p 8080:80 nginx',
          output: '✔ Container 4f8b9e2c started (daemonless & rootless)',
        };
      case 'linux':
      default:
        return {
          installCmd: 'sudo dnf install podman',
          step1Label: '# 1. Install Podman CLI natively',
          step1Cmd: 'sudo dnf install podman  # or apt / pacman',
          step2Label: '# 2. Run container without a daemon (rootless)',
          step2Cmd: 'podman run -d -p 8080:80 nginx',
          step3Cmd: 'podman ps',
          output: '4f8b9e2c1a0d  nginx:latest  Up 2s  0.0.0.0:8080->80/tcp',
        };
    }
  };

  const details = getCliDetails();

  return (
    <div className="relative w-full max-w-lg lg:max-w-xl">
      {/* Ambient glowing border */}
      <div className="from-purple-400/30 to-blue-400/30 pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-r blur-lg" />

      <div
        className="relative overflow-hidden rounded-2xl border border-white/25 shadow-2xl backdrop-blur-xl"
        style={{ background: 'rgba(12, 9, 25, 0.94)' }}>
        {/* Terminal Header Bar */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ background: 'rgba(23, 17, 44, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>
            <div className="text-purple-200 flex items-center gap-1.5 font-mono text-xs font-semibold">
              <Icon icon="material-symbols:terminal-rounded" className="text-purple-400 text-sm" />
              <span>podman-cli &bull; {os}</span>
            </div>
          </div>

          <CopyIconButton text={details.installCmd} />
        </div>

        {/* Terminal Code Body */}
        <div className="p-5 font-mono text-xs leading-relaxed text-white sm:text-[13px]">
          {/* Step 1 */}
          <div className="text-purple-200 select-none text-[11px] font-semibold sm:text-xs">{details.step1Label}</div>
          <div className="mt-1 flex items-center gap-2">
            <span className="select-none font-bold text-purple-300">$</span>
            <span className="text-emerald-300 font-bold">{details.step1Cmd}</span>
          </div>

          {/* Step 2 */}
          <div className="text-purple-200 mt-3.5 select-none text-[11px] font-semibold sm:text-xs">
            {details.step2Label}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="select-none font-bold text-purple-300">$</span>
            <span className="text-cyan-300 font-bold">{details.step2Cmd}</span>
          </div>

          {/* Step 3 */}
          <div className="mt-2.5 flex items-center gap-2">
            <span className="select-none font-bold text-purple-300">$</span>
            <span className="font-bold text-white">{details.step3Cmd}</span>
          </div>

          {/* Output */}
          <div className="text-emerald-300 mt-2 rounded-lg bg-black/60 px-3 py-2 text-[11px] font-bold sm:text-xs">
            {details.output}
          </div>
        </div>

        {/* Terminal Footer Status */}
        <div
          className="text-purple-200 flex items-center justify-between px-4 py-2 font-mono text-[11px]"
          style={{ background: 'rgba(16, 12, 32, 0.8)', borderTop: '1px solid rgba(255, 255, 255, 0.15)' }}>
          <span className="flex items-center gap-1.5">
            <span className="bg-emerald-400 h-1.5 w-1.5 animate-ping rounded-full" />
            <span className="text-emerald-300 font-bold">daemonless</span>
            <span className="text-purple-300">&bull;</span>
            <span className="font-bold text-purple-100">rootless</span>
          </span>
          <span className="font-bold text-white">v{LATEST_VERSION}</span>
        </div>
      </div>
    </div>
  );
}

export default function DownloadsPage(): JSX.Element {
  const [os, setOs] = useState<OS>('windows');
  const [distro, setDistro] = useState('fedora');

  return (
    <Layout
      title="Download Podman"
      description="Download Podman CLI for Windows, macOS, and Linux. Free, open-source, daemonless container engine.">
      {/* ============================================================
          HERO SECTION (Prominent 2-Column Hero: Download Podman CLI + Live Terminal)
      ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-700 pb-16 pt-10 dark:from-blue-700 dark:to-purple-900 sm:pb-20 md:pt-14 lg:pb-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Column: Details & OS Switcher */}
            <div className="relative z-30 text-center lg:col-span-6 lg:text-left xl:col-span-6">
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
                className="mb-3 text-3xl font-extrabold tracking-tight !text-white dark:!text-white sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl">
                Download Podman
              </h1>
              <p
                style={{ color: 'rgba(255, 255, 255, 0.95)' }}
                className="mb-8 max-w-xl text-base leading-relaxed !text-white/95 dark:!text-white/95 sm:text-lg">
                The daemonless, open-source container engine. Develop, manage, and run OCI containers and pods without a
                background daemon and without root privileges.
              </p>

              {/* OS Selector — clean segmented control matching MeetingTypeSwitcher */}
              <div className="flex justify-center lg:justify-start">
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

            {/* Right Column: Interactive CLI Terminal Showcase */}
            <div className="relative z-10 flex items-center justify-center lg:col-span-6 lg:justify-end xl:col-span-6">
              <HeroCliTerminal os={os} />
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
              <div className="flex flex-col justify-between rounded-2xl border border-black/[0.06] bg-white p-7 shadow-sm transition-all duration-200 hover:border-black/[0.14] hover:shadow-md dark:border-white/10 dark:bg-[#201f27] dark:hover:border-white/20">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div
                      style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#892CA0] text-white shadow-md shadow-[#892ca0]/25">
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
                      <span>Signed by Red Hat with checksum verification</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3 border-t border-black/[0.06] pt-5 dark:border-white/10">
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
              <div className="flex flex-col justify-between rounded-2xl border border-black/[0.06] bg-white p-7 shadow-sm transition-all duration-200 hover:border-black/[0.14] hover:shadow-md dark:border-white/10 dark:bg-[#201f27] dark:hover:border-white/20">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div
                      style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#892CA0] text-white shadow-md shadow-[#892ca0]/25">
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
                    <Terminal command="winget install RedHat.Podman" label="WinGet" />
                    <Terminal command="choco install podman" label="Chocolatey" />
                  </div>
                </div>

                <div className="mt-8 border-t border-black/[0.06] pt-6 dark:border-white/10">
                  <Terminal
                    command="podman machine init && podman machine start"
                    label="Next step after installation"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==========================================================
              MACOS: 2-Column Balanced Showcase (PKG vs Homebrew)
          ========================================================== */}
          {os === 'mac' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
              {/* Card 1: Universal PKG Installer */}
              <div className="flex flex-col justify-between rounded-2xl border border-black/[0.06] bg-white p-7 shadow-sm transition-all duration-200 hover:border-black/[0.14] hover:shadow-md dark:border-white/10 dark:bg-[#201f27] dark:hover:border-white/20">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div
                      style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#892CA0] text-white shadow-md shadow-[#892ca0]/25">
                      <Icon icon="fa-brands:apple" className="text-2xl text-white" />
                    </div>
                    <span
                      style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                      className="shadow-xs rounded-full bg-[#892CA0] px-3 py-1 text-xs font-bold uppercase tracking-wider !text-white">
                      Recommended
                    </span>
                  </div>

                  <h3 className="text-purple-950 mb-2 mt-5 p-0 text-xl font-bold dark:text-white">
                    Universal PKG Installer
                  </h3>
                  <p className="m-0 text-sm font-medium leading-relaxed text-purple-900/90 dark:text-purple-100">
                    Single graphical installer package (.pkg) optimized for both Apple Silicon (M1/M2/M3/M4) and Intel
                    64-bit Macs.
                  </p>

                  <div className="text-purple-950 mt-5 space-y-2 text-xs font-semibold dark:text-purple-100">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="material-symbols:check-circle-rounded"
                        className="text-base text-[#892CA0] dark:text-purple-300"
                      />
                      <span>Universal Binary (Apple Silicon &amp; Intel x86_64)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="material-symbols:check-circle-rounded"
                        className="text-base text-[#892CA0] dark:text-purple-300"
                      />
                      <span>Includes Podman CLI, machine helpers &amp; man pages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon
                        icon="material-symbols:check-circle-rounded"
                        className="text-base text-[#892CA0] dark:text-purple-300"
                      />
                      <span>Cryptographically signed by Red Hat</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t border-black/[0.06] pt-5 dark:border-white/10">
                  <DownloadBtn
                    href={`https://github.com/podman-container-tools/podman/releases/download/v${LATEST_VERSION}/podman-installer-macos-arm64.pkg`}
                    primary
                    title="macOS Universal Installer"
                    sub={`v${LATEST_VERSION} · Universal PKG (Apple Silicon & Intel)`}
                  />
                </div>
              </div>

              {/* Card 2: Homebrew Package Manager */}
              <div className="flex flex-col justify-between rounded-2xl border border-black/[0.06] bg-white p-7 shadow-sm transition-all duration-200 hover:border-black/[0.14] hover:shadow-md dark:border-white/10 dark:bg-[#201f27] dark:hover:border-white/20">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div
                      style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#892CA0] text-white shadow-md shadow-[#892ca0]/25">
                      <Icon icon="simple-icons:homebrew" className="text-2xl text-white" />
                    </div>
                    <span
                      style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                      className="shadow-xs rounded-full bg-[#892CA0] px-3 py-1 text-xs font-bold uppercase tracking-wider !text-white">
                      Package Manager
                    </span>
                  </div>

                  <h3 className="text-purple-950 mb-2 mt-5 p-0 text-xl font-bold dark:text-white">
                    Install via Homebrew
                  </h3>
                  <p className="m-0 text-sm font-medium leading-relaxed text-purple-900/90 dark:text-purple-100">
                    Quick CLI setup using macOS's standard developer package manager. Handles updates automatically.
                  </p>

                  <div className="mt-5">
                    <Terminal command="brew install podman" label="Homebrew" />
                  </div>
                </div>

                <div className="mt-8 border-t border-black/[0.06] pt-6 dark:border-white/10">
                  <Terminal
                    command="podman machine init && podman machine start"
                    label="Next step to start your machine"
                  />
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
      <section className="bg-white pb-14 pt-2 dark:bg-gray-900 sm:pb-16 sm:pt-4">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-black/[0.06] bg-gradient-to-r from-[#1d1135] via-[#241344] to-[#140b29] p-8 text-white shadow-xl dark:border-white/10 sm:p-10 lg:p-12">
            {/* Ambient subtle glow */}
            <div className="bg-purple-600/20 pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full blur-3xl" />
            <div className="bg-blue-600/15 pointer-events-none absolute -bottom-12 -left-12 h-64 w-64 rounded-full blur-3xl" />

            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              {/* Left Side: Info */}
              <div className="max-w-2xl space-y-3.5">
                <div
                  style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
                  className="inline-flex items-center gap-2 rounded-full border-0 bg-[#892CA0] px-3.5 py-1 text-xs font-bold uppercase tracking-wider !text-white shadow-sm">
                  <Icon icon="material-symbols:desktop-windows-rounded" className="text-base text-white" />
                  <span className="!text-white">Podman Desktop &bull; v{LATEST_DESKTOP_VERSION}</span>
                </div>

                <h2 className="m-0 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                  Prefer a Graphical Interface?
                </h2>

                <p className="m-0 text-sm font-medium leading-relaxed text-purple-100/90 sm:text-base">
                  Podman Desktop provides a rich, intuitive GUI to manage containers, inspect logs, build images, and
                  work with Kubernetes effortlessly &mdash; all daemonless and local.
                </p>

                {/* Feature checklist chips */}
                <div className="text-purple-200 flex flex-wrap items-center gap-2 pt-1 text-xs font-bold">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1">
                    <Icon icon="material-symbols:check-circle-rounded" className="text-emerald-400" />
                    One-click container engine
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1">
                    <Icon icon="material-symbols:check-circle-rounded" className="text-emerald-400" />
                    Kubernetes &amp; Kind ready
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1">
                    <Icon icon="material-symbols:check-circle-rounded" className="text-emerald-400" />
                    100% Free &amp; Open Source
                  </span>
                </div>
              </div>

              {/* Right Side: CTA Action Buttons */}
              <div className="flex shrink-0 flex-wrap items-center gap-3 sm:flex-nowrap">
                <a
                  href="https://podman-desktop.io/downloads"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: '#5f246b' }}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black !text-purple-900 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:bg-purple-50 hover:!text-purple-900 hover:shadow-2xl sm:text-base">
                  <Icon
                    icon="material-symbols:download-rounded"
                    className="text-xl !text-purple-900 sm:text-2xl"
                    style={{ color: '#5f246b' }}
                  />
                  <span className="font-black !text-purple-900" style={{ color: '#5f246b' }}>
                    Download Podman Desktop
                  </span>
                </a>
                <a
                  href="https://podman-desktop.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: 'none', color: '#ffffff' }}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/30 bg-white/10 px-4 py-3.5 text-sm font-bold !text-white transition-all hover:border-white/60 hover:bg-white/20 hover:!text-white">
                  <span className="!text-white" style={{ color: '#ffffff' }}>
                    Learn more
                  </span>
                  <Icon
                    icon="material-symbols:arrow-forward-rounded"
                    className="text-base !text-white"
                    style={{ color: '#ffffff' }}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          RELEASES & RESOURCES (True Bluish-Purple Developer Hub Cards)
      ============================================================ */}
      <section className="bg-white pb-20 pt-4 dark:bg-gray-900 sm:pb-28 sm:pt-6">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div
              style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#892CA0] px-4 py-1.5 text-xs font-black uppercase tracking-wider !text-white shadow-sm">
              <Icon icon="material-symbols:library-books-outline-rounded" className="text-base text-white" />
              <span className="!text-white">Developer Hub</span>
            </div>
            <h2 className="text-purple-950 text-3xl font-black tracking-tight dark:text-white sm:text-4xl">
              Releases &amp; Resources
            </h2>
            <p className="text-purple-800 mx-auto mt-2 max-w-xl text-base font-bold dark:text-purple-300">
              Explore official release archives, configuration guides, and in-depth documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <ResourceCard
              badge="Archive & Binaries"
              badgeColor="bg-[#892CA0] text-white shadow-xs"
              icon="fa-brands:github"
              iconBg="bg-[#892CA0]"
              title="GitHub Releases"
              desc="Access all historical releases, release notes, changelogs, and binary tarballs directly on GitHub."
              href="https://github.com/containers/podman/releases"
              cta="Browse all releases"
              tags={['v5.4+ Releases', 'Source Code', 'Checksums']}
            />
            <ResourceCard
              badge="Setup & Support"
              badgeColor="bg-[#892CA0] text-white shadow-xs"
              icon="material-symbols:help-outline-rounded"
              iconBg="bg-[#892CA0]"
              title="Troubleshooting Guide"
              desc="Solutions for common installation issues, rootless container setups, WSL2 errors, and socket configuration."
              href="https://github.com/containers/podman/blob/main/troubleshooting.md"
              cta="Read troubleshooting guide"
              tags={['WSL2 Fixes', 'Rootless FAQ', 'Socket Issues']}
            />
            <ResourceCard
              badge="Guides & Reference"
              badgeColor="bg-[#892CA0] text-white shadow-xs"
              icon="material-symbols:article-outline"
              iconBg="bg-[#892CA0]"
              title="Official Documentation"
              desc="Complete man pages, CLI command references, architecture guides, and container tutorials."
              href="https://docs.podman.io"
              cta="Explore documentation"
              tags={['CLI Man Pages', 'Pod Tutorials', 'Architecture']}
            />
          </div>
        </div>
      </section>
    </Layout>
  );
}
