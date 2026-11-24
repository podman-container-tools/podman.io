import React from 'react';
import { Icon } from '@iconify/react';

const dotGridStyle: React.CSSProperties = {
  backgroundImage: 'radial-gradient(rgba(120, 120, 130, 0.16) 1px, transparent 1px)',
  backgroundSize: '16px 16px',
};

const CARD_BASE_CLASS =
  'group flex flex-col justify-between overflow-hidden rounded-md border border-black/[0.08] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] dark:border-white/[0.08] dark:bg-[#242328] dark:shadow-[0_2px_10px_rgba(0,0,0,0.22)]';

const OS_PILLS = [
  { name: 'Linux', icon: 'fa6-brands:linux', delay: 'delay-0' },
  { name: 'macOS', icon: 'fa6-brands:apple', delay: 'delay-75' },
  { name: 'Windows', icon: 'fa6-brands:microsoft', delay: 'delay-150' },
] as const;

const POD_CONTAINERS = [
  { name: 'app', icon: 'lucide:box', delay: 'delay-0' },
  { name: 'worker', icon: 'lucide:cpu', delay: 'delay-75' },
  { name: 'db', icon: 'lucide:database', delay: 'delay-150' },
] as const;

function WhyPodmanSection(): JSX.Element {
  return (
    <section className="mx-auto my-14 max-w-6xl px-4 lg:my-20">
      <header className="mb-10 text-center">
        <h2 className="m-0 font-bold text-gray-900 dark:text-gray-50">Built for safer, lighter containers</h2>
        <p className="mx-auto mb-0 mt-3 max-w-3xl leading-relaxed text-gray-700 dark:text-gray-100">
          Daemonless, rootless, and Kubernetes-ready out of the box—built on native Linux primitives and open OCI
          standards.
        </p>
      </header>

      {/* 5-Card Asymmetric Bento Grid (Row 1: 7+5, Row 2: 5+7, Row 3: 12) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* CARD 1 (7 cols): Containers & Native Pods (Two Distinct Side-by-Side First-Class Units) */}
        <article className={`${CARD_BASE_CLASS} p-5 sm:p-6 lg:col-span-7`}>
          <div className="relative mb-6 flex min-h-[14rem] items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-white via-[#f2f3f5] to-white px-4 py-6 dark:from-[#1f1f23] dark:via-[#151518] dark:to-[#1f1f23] sm:h-56 sm:px-6 sm:py-0">
            <div style={dotGridStyle} className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.92),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_70%)]"
              aria-hidden="true"
            />

            {/* Combined Frosted-Glass Visual: Standalone Container + 3 Animated Curved S-Branches + Multi-Container Pod */}
            <div className="relative z-10 flex w-full max-w-xl flex-col items-center justify-center gap-5 sm:flex-row sm:gap-0">
              {/* Left: Frosted-Glass Standalone Container Card */}
              <div className="relative w-48 shrink-0 sm:w-44">
                <div
                  className="pointer-events-none absolute -bottom-2 -left-2 h-[82%] w-[82%] rounded-md bg-purple-700 shadow-lg transition-transform duration-500 ease-out group-hover:-translate-x-1 group-hover:translate-y-0.5 dark:bg-purple-700"
                  aria-hidden="true"
                />
                <div className="relative z-10 overflow-hidden rounded-md bg-white/65 shadow-[0_14px_34px_rgba(0,0,0,0.09)] backdrop-blur-md transition-transform duration-500 ease-out group-hover:-translate-y-1 dark:bg-white/[0.1] dark:shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
                  <div className="p-2.5">
                    <div className="space-y-2 rounded border border-black/[0.06] bg-white/75 p-2.5 font-mono dark:border-white/10 dark:bg-[#1b1b20]/85">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
                        <Icon icon="lucide:box" className="h-3.5 w-3.5 shrink-0 text-purple-700 dark:text-purple-300" />
                        <span className="truncate">nginx</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-300">
                        <span>podman run</span>
                        <span className="rounded bg-purple-100/70 px-1.5 py-0.5 font-semibold text-purple-900 dark:bg-white/10 dark:text-purple-100">
                          OCI
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/45 px-3 py-2 font-mono backdrop-blur-sm dark:bg-white/[0.06]">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-900 dark:text-white">
                      <Icon icon="lucide:box" className="h-3.5 w-3.5 text-purple-700 dark:text-purple-300" />
                      Container
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-purple-900 shadow-sm dark:bg-white/10 dark:text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-700 dark:bg-purple-300" aria-hidden="true" />
                      Up
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle: 3 Individual Curved S-Branching Connectors Animated on Hover */}
              <svg
                viewBox="0 0 60 120"
                className="relative z-0 -mx-1 hidden h-[120px] w-16 shrink-0 overflow-visible sm:block"
                aria-hidden="true">
                {/* Resting subtle tracks */}
                <path
                  d="M 0 60 C 28 60, 26 22, 60 22"
                  fill="none"
                  strokeWidth="1.8"
                  className="stroke-purple-700/25 dark:stroke-purple-300/25"
                />
                <path
                  d="M 0 60 L 60 60"
                  fill="none"
                  strokeWidth="1.8"
                  className="stroke-purple-700/25 dark:stroke-purple-300/25"
                />
                <path
                  d="M 0 60 C 28 60, 26 98, 60 98"
                  fill="none"
                  strokeWidth="1.8"
                  className="stroke-purple-700/25 dark:stroke-purple-300/25"
                />
                {/* Hover-drawn Brand Purple animated flow lines */}
                <path
                  d="M 0 60 C 28 60, 26 22, 60 22"
                  fill="none"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray="100"
                  className="stroke-purple-700 transition-[stroke-dashoffset] duration-700 ease-out [stroke-dashoffset:100] group-hover:[stroke-dashoffset:0] dark:stroke-purple-300"
                />
                <path
                  d="M 0 60 L 60 60"
                  fill="none"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray="100"
                  className="stroke-purple-700 transition-[stroke-dashoffset] delay-75 duration-700 ease-out [stroke-dashoffset:100] group-hover:[stroke-dashoffset:0] dark:stroke-purple-300"
                />
                <path
                  d="M 0 60 C 28 60, 26 98, 60 98"
                  fill="none"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  pathLength={100}
                  strokeDasharray="100"
                  className="stroke-purple-700 transition-[stroke-dashoffset] delay-150 duration-700 ease-out [stroke-dashoffset:100] group-hover:[stroke-dashoffset:0] dark:stroke-purple-300"
                />
                <circle cx="2" cy="60" r="3" className="fill-purple-700 dark:fill-purple-300" />
              </svg>

              {/* Right: Frosted-Glass Multi-Container Pod Shell */}
              <div className="relative w-48 shrink-0">
                <div
                  className="pointer-events-none absolute -bottom-2 -right-2 h-[88%] w-[88%] rounded-md bg-purple-700 shadow-lg transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:translate-y-0.5 dark:bg-purple-700"
                  aria-hidden="true"
                />
                <div className="relative z-10 overflow-hidden rounded-md bg-white/55 shadow-[0_14px_34px_rgba(0,0,0,0.09)] backdrop-blur-md transition-transform duration-500 ease-out group-hover:-translate-y-1 dark:bg-white/[0.1] dark:shadow-[0_14px_34px_rgba(0,0,0,0.45)]">
                  <div className="p-2.5">
                    <div className="space-y-1.5 rounded border border-dashed border-purple-700/30 bg-white/30 p-2 transition-colors duration-500 group-hover:border-purple-700/60 dark:border-white/20 dark:bg-white/[0.04] dark:group-hover:border-purple-300/60">
                      {POD_CONTAINERS.map(c => (
                        <div
                          key={c.name}
                          className={`flex items-center gap-2 rounded bg-white/85 px-2.5 py-1 font-mono text-xs font-bold text-gray-900 shadow-sm ring-1 ring-black/[0.05] backdrop-blur-sm transition-transform duration-300 ease-out group-hover:-translate-y-0.5 dark:bg-[#1b1b20]/85 dark:text-white dark:ring-white/10 ${c.delay}`}>
                          <Icon icon={c.icon} className="h-3.5 w-3.5 shrink-0 text-gray-900 dark:text-white" />
                          <span>{c.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-white/45 px-3 py-2 font-mono backdrop-blur-sm dark:bg-white/[0.06]">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-900 dark:text-white">
                      <Icon icon="lucide:boxes" className="h-3.5 w-3.5 text-purple-700 dark:text-purple-300" />
                      Pod
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-semibold text-purple-900 shadow-sm dark:bg-white/10 dark:text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-700 dark:bg-purple-300" aria-hidden="true" />
                      Running
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="m-0 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Containers &amp; Native Pods
            </h3>
            <p className="mb-0 mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-100">
              Run standalone OCI containers with familiar commands, or group tightly coupled containers into a Pod
              sharing one network namespace and lifecycle—both natively supported.
            </p>
          </div>
        </article>

        {/* CARD 2 (5 cols): Runs Everywhere (Frosted Glass OS Pills + 3D Spherical Wireframe Globe) */}
        <article className={`${CARD_BASE_CLASS} p-6 lg:col-span-5`}>
          <div className="relative mb-6 flex h-56 items-center justify-start overflow-hidden rounded-md bg-gradient-to-br from-white via-[#f2f3f5] to-white px-5 dark:from-[#1f1f23] dark:via-[#151518] dark:to-[#1f1f23]">
            {/* Subtle White Radial Highlight + Dot Grid */}
            <div style={dotGridStyle} className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.95),transparent_65%)] dark:bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_65%)]"
              aria-hidden="true"
            />

            {/* 3D Perspective Tilted Wireframe Globe Anchored to Bottom-Right Edge */}
            <svg
              viewBox="0 0 280 280"
              className="pointer-events-none absolute -bottom-16 -right-12 h-56 w-56 -rotate-[20deg] transition-transform duration-1000 ease-out group-hover:-rotate-[36deg] group-hover:scale-105 sm:-bottom-24 sm:-right-16 sm:h-72 sm:w-72"
              aria-hidden="true">
              <defs>
                <clipPath id="podman-globe-clip">
                  <circle cx="140" cy="140" r="126" />
                </clipPath>
              </defs>
              {/* Subtle outer orbital rim rotating counter to the globe */}
              <circle
                cx="140"
                cy="140"
                r="134"
                fill="none"
                strokeWidth="1"
                strokeDasharray="3 5"
                className="origin-center stroke-black/[0.12] transition-transform duration-1000 ease-out group-hover:rotate-[45deg] dark:stroke-white/15"
              />
              {/* Clean White Sphere Base */}
              <circle
                cx="140"
                cy="140"
                r="126"
                strokeWidth="1.2"
                className="fill-white stroke-black/[0.18] dark:fill-[#1f1f24] dark:stroke-white/20"
              />
              {/* Curved 3D Longitude & Latitude Arcs (all pinned cleanly to the poles) */}
              <g
                clipPath="url(#podman-globe-clip)"
                fill="none"
                strokeWidth="1.1"
                className="stroke-black/[0.14] dark:stroke-white/15">
                {/* Pole-pinned Meridians */}
                <ellipse cx="140" cy="140" rx="108" ry="126" />
                <ellipse cx="140" cy="140" rx="82" ry="126" />
                <ellipse cx="140" cy="140" rx="54" ry="126" />
                <ellipse cx="140" cy="140" rx="26" ry="126" />
                <line x1="140" y1="14" x2="140" y2="266" />
                {/* Curved 3D Latitude Arcs */}
                <path d="M 14 140 Q 140 168 266 140" />
                <path d="M 22 104 Q 140 132 258 104" />
                <path d="M 42 70 Q 140 94 238 70" />
                <path d="M 74 38 Q 140 56 206 38" />
                <path d="M 22 176 Q 140 204 258 176" />
                <path d="M 42 210 Q 140 234 238 210" />
              </g>
            </svg>

            {/* Vertically Stacked Frosted Glass OS Pills Overlapping a Brand Purple Backing Card */}
            <div className="relative z-10 flex items-center pl-4">
              {/* Brand Purple Backing Plate Behind the Frosted Glass Pills */}
              <div
                className="pointer-events-none absolute left-0 top-1/2 h-36 w-16 -translate-y-1/2 rounded-md bg-purple-700 shadow-lg transition-transform duration-500 ease-out group-hover:-translate-x-1 dark:bg-purple-700"
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col gap-2.5">
                {OS_PILLS.map(os => (
                  <div
                    key={os.name}
                    className={`flex w-28 items-center gap-2 rounded-full bg-white/55 px-3.5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur-md transition-transform duration-300 ease-out group-hover:translate-x-2 dark:bg-white/[0.1] dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${os.delay}`}>
                    <Icon icon={os.icon} className="h-4 w-4 shrink-0 text-[#45145F] dark:text-white" />
                    <span className="font-mono text-xs font-bold text-[#45145F] dark:text-white">{os.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="m-0 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Runs Everywhere You Build
            </h3>
            <p className="mb-0 mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-100">
              Native on Linux, with seamless lightweight VM support on macOS and Windows via Podman Machine and Podman
              Desktop.
            </p>
          </div>
        </article>

        {/* CARD 3 (5 cols): Rootless User Namespaces (Frosted Glass Isolation Shield over White Gradient) */}
        <article className={`${CARD_BASE_CLASS} p-6 lg:col-span-5`}>
          <div className="relative mb-6 flex h-56 items-center justify-center overflow-hidden rounded-md bg-gradient-to-b from-white via-[#f2f3f5] to-white px-5 dark:from-[#1f1f23] dark:via-[#151518] dark:to-[#1f1f23]">
            {/* Subtle White Radial Highlight + Dot Grid */}
            <div style={dotGridStyle} className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.95),transparent_65%)] dark:bg-[radial-gradient(circle_at_75%_25%,rgba(255,255,255,0.06),transparent_65%)]"
              aria-hidden="true"
            />

            {/* Layered Glass Isolation Visual (Smooth Position Swap on Hover) */}
            <div className="relative h-36 w-[270px] max-w-full scale-90 sm:scale-100">
              {/* Back Layer: Brand Purple Isolated Container Core */}
              <div className="absolute left-0 top-2 flex h-24 w-36 flex-col justify-between rounded-md bg-purple-700 p-3.5 font-mono text-white shadow-lg transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-8 dark:bg-purple-700">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-100">Container</span>
                <span className="text-base font-extrabold tracking-tight text-white">uid 0</span>
              </div>

              {/* Front Layer: Frosted Glass Host UserNS Shield */}
              <div className="absolute bottom-2 right-0 z-10 flex h-24 w-44 flex-col justify-between rounded-md bg-white/55 p-3.5 font-mono shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-md transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-8 dark:bg-white/[0.08] dark:shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    Host
                  </span>
                  <Icon
                    icon="material-symbols:shield-lock-outline-rounded"
                    className="h-4 w-4 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-gray-900 dark:text-white">uid 1000</span>
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-[10px] font-bold text-gray-900 dark:bg-white/10 dark:text-white">
                    Rootless
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="m-0 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Rootless User Namespaces
            </h3>
            <p className="mb-0 mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-100">
              Map container root safely to an unprivileged host user by default—paired with SELinux and seccomp to keep
              workloads isolated from your kernel.
            </p>
          </div>
        </article>

        {/* CARD 4 (7 cols): Daemonless Fork / Exec (Depth-Stacked Container Processes) */}
        <article className={`${CARD_BASE_CLASS} p-6 lg:col-span-7`}>
          <div className="relative mb-6 flex h-56 flex-col items-center justify-end overflow-hidden rounded-md bg-gradient-to-br from-white via-[#f2f3f5] to-white px-5 pt-6 dark:from-[#1f1f23] dark:via-[#151518] dark:to-[#1f1f23]">
            <div style={dotGridStyle} className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />

            {/* Back Process 3 (Lighter Podman Purple) */}
            <div className="relative z-10 -mb-3 w-[80%] translate-y-4 rounded-t-md bg-purple-500 px-4 pb-5 pt-2.5 opacity-80 blur-[2.5px] transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-hover:blur-0 dark:bg-purple-500/80">
              <div className="flex items-center justify-between font-mono text-[11px] font-semibold text-white">
                <span>podman-db</span>
                <span className="text-purple-100">conmon · 2.1 MB</span>
              </div>
            </div>

            {/* Middle Process 2 (Brand Purple) */}
            <div className="relative z-10 -mb-2 w-[90%] translate-y-2 rounded-t-md bg-purple-700 px-4 pb-5 pt-3 opacity-95 shadow-sm blur-[1.4px] transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-hover:blur-0 dark:bg-purple-700">
              <div className="flex items-center justify-between font-mono text-xs font-bold text-white">
                <span>podman-api</span>
                <span className="text-[11px] font-semibold text-purple-100">crun · PID 4822</span>
              </div>
            </div>

            {/* Front Process 1 (Frosted White) */}
            <div className="relative z-20 -mb-2 w-full rounded-t-md bg-white/80 px-4 pb-6 pt-4 shadow-[0_-6px_24px_rgba(0,0,0,0.08)] backdrop-blur-md transition-transform duration-500 ease-out group-hover:-translate-y-1 dark:bg-[#27272a]/85 dark:shadow-none">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-700 dark:bg-purple-300" aria-hidden="true" />
                  <span className="font-mono text-xs font-bold text-gray-900 dark:text-white">podman-web</span>
                </div>
                <span className="rounded bg-purple-700 px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                  FORK / EXEC
                </span>
              </div>
              <div className="flex flex-wrap gap-2 font-mono text-[11px] font-semibold">
                <span className="inline-flex items-center gap-1 rounded bg-purple-100/60 px-2.5 py-1 text-purple-900 dark:bg-white/[0.08] dark:text-purple-100">
                  <Icon
                    icon="material-symbols:deployed-code-outline"
                    className="h-3.5 w-3.5 text-purple-700 dark:text-purple-300"
                  />
                  crun
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2.5 py-1 text-blue-900 dark:bg-white/[0.08] dark:text-blue-100">
                  <Icon
                    icon="material-symbols:memory-rounded"
                    className="h-3.5 w-3.5 text-blue-700 dark:text-blue-300"
                  />
                  0 MB idle
                </span>
                <span className="inline-flex items-center gap-1 rounded bg-purple-100/60 px-2.5 py-1 text-purple-900 dark:bg-white/[0.08] dark:text-purple-100">
                  no daemon
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="m-0 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Daemonless Fork &amp; Exec
            </h3>
            <p className="mb-0 mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-100">
              Every container launches directly as a standard child process monitored by lightweight conmon—eliminating
              the central daemon bottleneck and idle RAM footprint.
            </p>
          </div>
        </article>

        {/* CARD 5 (12 cols): Kubernetes Ready (Wide Horizontal Bento Card) */}
        <article className="group grid grid-cols-1 items-center gap-6 overflow-hidden rounded-md border border-black/[0.08] bg-white p-6 shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] dark:border-white/[0.08] dark:bg-[#242328] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] lg:col-span-12 lg:grid-cols-12">
          {/* Left Copy */}
          <div className="order-2 lg:order-1 lg:col-span-5 lg:pr-4">
            <h3 className="m-0 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Kubernetes Ready</h3>
            <p className="mb-0 mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-100">
              Create, start, and manage pods—play or generate Kubernetes YAML directly with Podman to move seamlessly
              from local development to cluster.
            </p>
          </div>

          {/* Right Layered Glass Kubernetes Visual */}
          <div className="relative order-1 flex h-56 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-white via-[#f2f3f5] to-white px-3 dark:from-[#1f1f23] dark:via-[#151518] dark:to-[#1f1f23] sm:px-6 lg:order-2 lg:col-span-7">
            {/* Subtle White Radial Vignette + Monochrome Architectural Grid */}
            <div style={dotGridStyle} className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.95),transparent_65%)] dark:bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.06),transparent_65%)]"
              aria-hidden="true"
            />

            {/* Layered Glass Composition (Smooth Diagonal Swap on Hover) */}
            <div className="relative h-40 w-full max-w-[310px] sm:max-w-md">
              {/* Back Layer: Brand Purple Kubernetes YAML Card */}
              <div className="absolute left-1 top-1 w-52 rounded-md bg-purple-700 px-3.5 py-2.5 font-mono text-[10px] text-white shadow-lg transition-transform duration-[1100ms] ease-in-out group-hover:translate-x-[88px] group-hover:translate-y-12 dark:bg-purple-700 sm:left-2 sm:w-64 sm:px-4 sm:py-3 sm:text-[11px] sm:group-hover:translate-x-[176px] sm:group-hover:translate-y-14">
                <div className="flex items-center justify-between border-b border-white/20 pb-2 text-[10px] text-purple-100">
                  <span className="font-semibold text-white">pod.yaml</span>
                  <span>Kubernetes</span>
                </div>
                <div className="mt-2 space-y-1 text-[10px] leading-relaxed text-purple-100 sm:text-[11px]">
                  <div className="font-semibold text-white">kind: Pod</div>
                  <div className="truncate">image: quay.io/podman/hello</div>
                </div>
              </div>

              {/* Front Layer: Frosted Glass Kubernetes Pod Card overlapping the purple card */}
              <div className="absolute bottom-2 right-1 z-10 w-60 rounded-md bg-white/60 px-3 py-3 shadow-[0_12px_32px_rgba(0,0,0,0.08)] backdrop-blur-md transition-transform duration-[1100ms] ease-in-out group-hover:-translate-x-[56px] group-hover:-translate-y-[74px] dark:bg-white/[0.08] dark:shadow-[0_12px_32px_rgba(0,0,0,0.35)] sm:right-2 sm:w-72 sm:px-4 sm:py-3.5 sm:group-hover:-translate-x-[144px] sm:group-hover:-translate-y-[84px]">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/85 shadow-sm dark:bg-white/10 sm:h-8 sm:w-8">
                      <Icon icon="devicon:kubernetes" className="h-4 w-4 sm:h-5 sm:w-5" />
                    </span>
                    <div className="min-w-0 font-mono">
                      <div className="truncate text-[11px] font-bold text-gray-900 dark:text-white sm:text-xs">
                        hello-pod
                      </div>
                      <div className="truncate text-[9px] text-gray-500 dark:text-gray-300 sm:text-[10px]">
                        podman kube play
                      </div>
                    </div>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/75 px-2 py-0.5 font-mono text-[9px] font-semibold text-gray-900 dark:bg-white/10 dark:text-white sm:gap-1.5 sm:px-2.5 sm:text-[10px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-700 dark:bg-purple-300" aria-hidden="true" />
                    running
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

export default React.memo(WhyPodmanSection);
