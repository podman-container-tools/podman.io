import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import tabData from './data';

const TAB_ICONS = [
  'material-symbols:search-rounded',
  'material-symbols:play-arrow-rounded',
  'material-symbols:build-rounded',
  'material-symbols:share-rounded',
];

function FeaturesCarousel(): JSX.Element {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const currentTab = tabData[activeTabIndex] ?? tabData[0];

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % tabData.length;
      setActiveTabIndex(nextIndex);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prevIndex = (currentIndex - 1 + tabData.length) % tabData.length;
      setActiveTabIndex(prevIndex);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
      {/* Unified Segmented Row Tab Navigation with Vertical Separators */}
      <div
        role="tablist"
        aria-label="Podman CLI command workflows"
        className="mx-auto mb-8 flex w-full max-w-xl overflow-hidden rounded-2xl bg-[#892CA0] shadow-[0_8px_24px_rgba(137,44,160,0.22),0_3px_8px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        {tabData.map((tab, index) => {
          const isActive = activeTabIndex === index;
          return (
            <React.Fragment key={index}>
              {index > 0 && <div className="w-px self-stretch bg-white/20 dark:bg-black/40" />}
              <button
                key={index}
                type="button"
                role="tab"
                id={`cli-tab-${index}`}
                aria-selected={isActive}
                aria-controls={`cli-tabpanel-${index}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => setActiveTabIndex(index)}
                onKeyDown={e => handleKeyDown(e, index)}
                style={{ WebkitTapHighlightColor: 'transparent' }}
                className={`group flex flex-1 select-none flex-col items-center justify-center border-none px-1.5 py-3 text-center text-white outline-none transition-[background-color,box-shadow,color,transform] duration-200 ease-in-out focus:outline-none focus:ring-0 focus-visible:outline-none sm:px-3 sm:py-3.5 ${
                  isActive
                    ? 'bg-[#65187c] shadow-[inset_0_5px_12px_rgba(0,0,0,0.52),inset_0_2px_4px_rgba(0,0,0,0.35)]'
                    : 'bg-[#892CA0] hover:bg-[#9630af]'
                }`}>
                <Icon
                  icon={TAB_ICONS[index] || 'material-symbols:terminal-rounded'}
                  className="text-xl text-white transition-transform duration-200 group-hover:scale-110 sm:text-2xl"
                  aria-hidden="true"
                />
                <span className="mt-1.5 font-display text-xs font-bold text-white sm:text-sm">{tab.label}</span>
                <span className="text-purple-200 mt-0.5 max-w-full truncate font-mono text-[10px] tracking-tight sm:text-[11px]">
                  {tab.commands[0]}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Main Terminal Showcase Card (Dual-Shade Purple Gradient Container) */}
      <div
        role="tabpanel"
        id={`cli-tabpanel-${activeTabIndex}`}
        aria-labelledby={`cli-tab-${activeTabIndex}`}
        className="overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-[#892CA0] to-[#451254] p-6 text-white shadow-[0_8px_32px_rgba(75,18,92,0.35)] transition-all duration-300 dark:border-purple-500/20 dark:from-[#661d7a] dark:to-[#280833] sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Command Details */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-5">
            <div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <Icon
                  icon={TAB_ICONS[activeTabIndex] || 'material-symbols:terminal-rounded'}
                  className="text-sm text-purple-100"
                  aria-hidden="true"
                />
                <span>
                  Workflow Step {activeTabIndex + 1} of {tabData.length}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold tracking-tight !text-white dark:!text-white sm:text-2xl">
                {currentTab.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-purple-100 dark:text-purple-100 sm:text-base">
                {currentTab.description}
              </p>
            </div>

            {/* Terminal Command Box */}
            <div className="overflow-hidden rounded-xl border border-white/15 bg-black/40 p-4 text-left font-mono text-xs shadow-inner backdrop-blur-sm sm:text-sm">
              <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2 text-[11px] text-purple-100">
                <span className="flex items-center gap-1.5">
                  <span className="bg-emerald-400 h-2 w-2 rounded-full" aria-hidden="true"></span>
                  terminal
                </span>
                <span className="text-[10px] uppercase tracking-wider text-purple-300/80">CLI command</span>
              </div>
              <div className="space-y-1.5">
                {(currentTab.commands || []).map((cmd, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="select-none font-bold text-purple-300" aria-hidden="true">
                      $
                    </span>
                    <span className="font-medium text-white">{cmd}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mascot note + Prev/Next buttons */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2.5">
                <img
                  src="images/optimized/podman-selkie-385w-358h.webp"
                  alt="Podman Selkie Mascot"
                  className="h-9 w-9 object-contain drop-shadow"
                  loading="lazy"
                  decoding="async"
                />
                <span className="text-xs font-medium text-purple-100">Rootless &amp; daemonless</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTabIndex(activeTabIndex > 0 ? activeTabIndex - 1 : tabData.length - 1)}
                  aria-label="Previous command workflow"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/15 text-white transition-colors hover:bg-white/25 active:scale-95">
                  <Icon icon="material-symbols:arrow-back-rounded" className="text-base" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTabIndex(activeTabIndex < tabData.length - 1 ? activeTabIndex + 1 : 0)}
                  aria-label="Next command workflow"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/15 text-white transition-colors hover:bg-white/25 active:scale-95">
                  <Icon icon="material-symbols:arrow-forward-rounded" className="text-base" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Terminal Window Mockup */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-xl border border-white/20 bg-[#18181b] shadow-2xl ring-1 ring-black/30">
              {/* macOS/Linux Terminal Titlebar */}
              <div className="border-gray-800 flex items-center justify-between border-b bg-[#1e1e24] px-4 py-2.5">
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                  <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="font-mono text-xs text-gray-300">
                  podman — {(currentTab.label || '').toLowerCase()}
                </span>
                <div className="w-10"></div>
              </div>

              {/* Terminal Screen Body */}
              <div className="relative flex items-center justify-center bg-[#141416] p-3 sm:p-5">
                <img
                  src={currentTab.image?.src || 'images/optimized/cli-screens/cli-find-image.webp'}
                  alt={currentTab.image?.alt || 'Podman CLI command screen'}
                  className="w-full rounded-lg object-contain shadow-sm"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturesCarousel;
