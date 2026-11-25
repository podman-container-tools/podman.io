import React, { useState } from 'react';
import type { DocManifest } from '@site/src/services/docsTypes';

interface OverviewContentProps {
  manifest: DocManifest | null;
  onSelectCommand: (slug: string) => void;
}

const COMMON_COMMANDS = [
  { slug: 'podman-run', cmd: 'podman run', desc: 'Run a command in a new container' },
  { slug: 'podman-ps', cmd: 'podman ps', desc: 'List running or all containers' },
  { slug: 'podman-exec', cmd: 'podman exec', desc: 'Execute a command in a running container' },
  { slug: 'podman-logs', cmd: 'podman logs', desc: 'Fetch the logs of a container' },
  { slug: 'podman-stop', cmd: 'podman stop', desc: 'Stop one or more running containers' },
  { slug: 'podman-rm', cmd: 'podman rm', desc: 'Remove one or more containers' },
  { slug: 'podman-build', cmd: 'podman build', desc: 'Build an image using instructions from Containerfiles' },
  { slug: 'podman-images', cmd: 'podman images', desc: 'List images in local storage' },
  { slug: 'podman-pull', cmd: 'podman pull', desc: 'Pull an image from a remote registry' },
  { slug: 'podman-pod-create', cmd: 'podman pod create', desc: 'Create a new pod for co-located containers' },
  { slug: 'podman-kube-play', cmd: 'podman kube play', desc: 'Create pods and containers based on Kubernetes YAML' },
  { slug: 'podman-network-create', cmd: 'podman network create', desc: 'Create a user-defined network' },
  { slug: 'podman-volume-create', cmd: 'podman volume create', desc: 'Create a new storage volume' },
  {
    slug: 'podman-machine-start',
    cmd: 'podman machine start',
    desc: 'Start a Podman virtual machine (macOS & Windows)',
  },
];

export default function OverviewContent({ manifest, onSelectCommand }: OverviewContentProps): JSX.Element {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const quickStartSnippet = `# Run an official Apache HTTP server container
podman run -dt -p 8080:80/tcp docker.io/library/httpd

# List running containers
podman ps

# Test the running container
curl http://localhost:8080`;

  return (
    <div className="space-y-10">
      {/* Title & Introduction */}
      <div>
        <h1 className="mb-4 !border-b-0 !border-none !text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white md:!text-4xl">
          What is Podman?
        </h1>

        <div className="mb-6">
          <img
            src="/logos/optimized/podman-logo-orig-884w-293h.webp"
            alt="Podman logo"
            className="block h-auto max-w-full dark:hidden"
          />
          <img
            src="/logos/optimized/podman-logo-dark-884w-293h.webp"
            alt="Podman logo"
            className="hidden h-auto max-w-full dark:block"
          />
        </div>

        <p className="text-gray-800 mb-4 !text-[15px] leading-relaxed dark:text-zinc-200 sm:!text-base">
          <strong>Podman</strong> (the POD MANager) is a daemonless, open source, Linux native tool designed to make it
          easy to find, run, build, share and deploy applications using Open Containers Initiative (OCI) Containers and
          Container Images.
        </p>

        <p className="!text-[15px] leading-relaxed text-gray-700 dark:text-zinc-300 sm:!text-base">
          Podman provides a command-line interface (CLI) familiar to anyone who has used the Docker Container Engine.
          Most users can simply alias Docker to Podman (<code className="inline-code-var">alias docker=podman</code>)
          without issues. Similar to other common Container Engines, Podman relies on an OCI-compliant Container Runtime
          (<code className="inline-code-var">crun</code>, <code className="inline-code-var">runc</code>) to interface
          with the operating system and manage running containers.
        </p>
      </div>

      {/* Architecture Highlights */}
      <div>
        <h2 className="mb-4 !border-b-0 !border-none !text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:!text-2xl">
          Architecture & Key Features
        </h2>

        <div className="space-y-3 text-gray-700 dark:text-zinc-300 [&_p]:!text-[15px] [&_p]:leading-relaxed sm:[&_p]:!text-base">
          <p>
            <strong className="text-gray-900 dark:text-white">Daemonless Architecture:</strong> Unlike Docker, Podman
            does not require a running background daemon (like <code className="inline-code-var">dockerd</code>) to
            manage containers. Containers are child processes of Podman, launched directly via an OCI runtime.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Rootless Containers:</strong> Containers can be run either
            by root or by an unprivileged user using user namespaces for enhanced security without sacrificing features.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Pods Management:</strong> Utilizing the{' '}
            <code className="inline-code-var">libpod</code> library, Podman manages the entire container ecosystem,
            including pods (groups of containers sharing network, IPC, and storage volumes, identical to Kubernetes
            pods).
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Kubernetes Integration:</strong> Seamlessly move between
            local development and Kubernetes with native <code className="inline-code-var">podman play kube</code> and{' '}
            <code className="inline-code-var">podman generate kube</code> commands.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">Systemd & Quadlet:</strong> First-class integration with
            systemd. Generate declarative production systemd unit files using Quadlet with automatic socket activation.
          </p>
          <p>
            <strong className="text-gray-900 dark:text-white">RESTful API:</strong> Docker-compatible REST service with
            remote clients for Linux, macOS, and Windows.
          </p>
        </div>
      </div>

      {/* Quick Start Example */}
      <div>
        <h2 className="mb-3 !border-b-0 !border-none !text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:!text-2xl">
          Quick Start
        </h2>
        <p className="text-gray-600 mb-4 !text-[15px] leading-relaxed dark:text-zinc-400 sm:!text-base">
          Start your first container in seconds without needing a daemon:
        </p>
        <div className="shadow-2xs group relative overflow-hidden rounded-lg border border-[#e2e8f0] bg-[#f8fafc] font-mono text-xs text-slate-800 transition-colors hover:border-[#cbd5e1] dark:border-[#27272a] dark:bg-[#18181b] dark:text-zinc-100 dark:hover:border-[#3f3f46] sm:rounded-xl sm:text-[13px]">
          <button
            type="button"
            onClick={() => handleCopy(quickStartSnippet, 'quickstart')}
            title={copiedCode === 'quickstart' ? 'Copied!' : 'Copy to clipboard'}
            aria-label="Copy code"
            className="absolute right-2.5 top-2.5 z-10 flex cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-transparent px-2 py-1.5 text-slate-400 transition-all hover:bg-black/5 hover:text-slate-700 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-100 sm:right-3 sm:top-3">
            {copiedCode === 'quickstart' ? (
              <>
                <svg className="h-4 w-4 text-emerald-500 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-sans text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                  Copied!
                </span>
              </>
            ) : (
              <svg
                className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-600 dark:text-zinc-400 dark:group-hover:text-zinc-200"
                viewBox="0 0 24 24"
                fill="currentColor">
                <path d="M15 1H4c-1.1 0-2 .9-2 2v13c0 .55.45 1 1 1s1-.45 1-1V3h11c.55 0 1-.45 1-1s-.45-1-1-1zm4 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z" />
              </svg>
            )}
          </button>
          <div className="sm:p-4.5 overflow-x-hidden p-4 pr-14 leading-relaxed">
            <pre className="!m-0 whitespace-pre-wrap break-words !border-0 !bg-transparent !p-0 font-mono text-xs leading-relaxed text-slate-800 dark:text-zinc-100 sm:text-[13px]">
              <code className="whitespace-pre-wrap break-words">
                {quickStartSnippet.split('\n').map((line, idx) => {
                  const isComment = line.trim().startsWith('#');
                  return (
                    <div
                      key={idx}
                      className={
                        isComment ? 'text-gray-400 italic leading-relaxed dark:text-zinc-500' : 'leading-relaxed'
                      }>
                      {line || '\u00A0'}
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>
        </div>
      </div>

      {/* Common Commands Reference Table */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="m-0 !border-b-0 !border-none !text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:!text-2xl">
            Common Commands
          </h2>
          {manifest && (
            <span className="text-xs text-gray-500 dark:text-zinc-400">
              {manifest.totalCount} commands available in sidebar
            </span>
          )}
        </div>

        <div className="inline-block max-w-full overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-[#18181b]">
          <table className="m-0 table w-auto border-separate border-spacing-0 text-left text-[13px]">
            <thead>
              <tr className="bg-white dark:bg-[#18181b]">
                <th className="whitespace-nowrap border-0 border-b border-slate-200 px-5 py-3.5 pr-10 font-bold text-slate-900 dark:border-zinc-800 dark:text-white">
                  Command
                </th>
                <th className="border-0 border-b border-slate-200 px-5 py-3.5 font-bold text-slate-900 dark:border-zinc-800 dark:text-white">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {COMMON_COMMANDS.map((item, idx) => (
                <tr
                  key={item.slug}
                  className="group bg-slate-50/75 transition-colors hover:bg-slate-100/80 dark:bg-[#1f1f23] dark:hover:bg-zinc-800/60">
                  <td
                    className={`px-5 py-3.5 align-top font-mono ${
                      idx < COMMON_COMMANDS.length - 1
                        ? 'border-0 border-b border-slate-200 dark:border-zinc-800'
                        : 'border-0'
                    }`}>
                    <button
                      type="button"
                      onClick={() => onSelectCommand(item.slug)}
                      className="cursor-pointer rounded-md border-0 bg-slate-200/80 px-2 py-0.5 text-left font-mono text-xs font-semibold text-slate-800 transition-colors hover:bg-sky-100 hover:text-sky-700 dark:bg-zinc-800 dark:text-blue-300 dark:hover:bg-zinc-700">
                      {item.cmd}
                    </button>
                  </td>
                  <td
                    className={`px-5 py-3.5 align-top text-slate-700 dark:text-zinc-300 ${
                      idx < COMMON_COMMANDS.length - 1
                        ? 'border-0 border-b border-slate-200 dark:border-zinc-800'
                        : 'border-0'
                    }`}>
                    {item.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Versioned Docs CTA */}
      <div className="flex flex-col items-start justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-600 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 sm:flex-row sm:items-center sm:px-5">
        <span>Showing the latest documentation. Looking for older Podman versions?</span>
        <a
          href="https://docs.podman.io/en/latest/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold !text-slate-800 !no-underline transition-colors hover:border-slate-300 hover:bg-slate-100 hover:!text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:!text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-700">
          <span>docs.podman.io</span>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}
