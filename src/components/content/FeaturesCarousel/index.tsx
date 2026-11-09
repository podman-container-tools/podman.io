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
      document.getElementById(`cli-tab-${nextIndex}`)?.focus();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const prevIndex = (currentIndex - 1 + tabData.length) % tabData.length;
      setActiveTabIndex(prevIndex);
      document.getElementById(`cli-tab-${prevIndex}`)?.focus();
    }
  };

  return (
    <div className="w-full bg-white dark:bg-black">
      {/* 1. Top Section (White in Light Mode, Black in Dark Mode) */}
      <div className="bg-white pb-0 pt-12 text-gray-900 dark:bg-black dark:text-white sm:pt-16 lg:pt-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Section Heading (Purple Text, No Background Container) */}
          <div className="mb-6 text-center sm:mb-8">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-purple-700 dark:text-purple-700 sm:text-4xl lg:text-5xl">
              Podman Command-Line
            </h2>
          </div>

          {/* Mascot & Description Row */}
          <div className="mx-auto mb-6 flex max-w-3xl flex-col items-center justify-center gap-6 text-center sm:mb-8 sm:flex-row sm:text-left">
            <img
              src="images/optimized/podman-selkie-385w-358h.webp"
              alt="Podman Selkie Mascot"
              className="h-24 w-auto object-contain drop-shadow-md sm:h-32"
              loading="lazy"
              decoding="async"
            />
            <p className="text-gray-800 dark:text-gray-200 max-w-xl text-base leading-relaxed sm:text-lg">
              Podman&apos;s command-line interface allows you to find, run, build, and share containers with a familiar,
              daemonless CLI — no background daemon required.
            </p>
          </div>
        </div>

        {/* Overlapping Buttons Row (Half on Upper Section, Half on Purple Section below) */}
        <div
          role="tablist"
          aria-label="Podman CLI command workflows"
          className="relative z-20 mx-auto -mb-10 max-w-3xl px-3 sm:-mb-12 sm:px-6 lg:-mb-14 lg:max-w-4xl">
          <div className="grid grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
            {tabData.map((tab, index) => {
              const isActive = activeTabIndex === index;
              return (
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
                  style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                  className={`group relative flex h-full select-none flex-col items-center justify-center rounded-xl px-2.5 py-4 text-center outline-none transition-all duration-300 ease-out focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 sm:rounded-2xl sm:px-3 sm:py-6 md:px-4 md:py-7 ${
                    isActive
                      ? 'z-10 border-none bg-[#009FFF] text-white shadow-lg shadow-black/20 hover:bg-[#008fe6] dark:bg-[#009FFF] dark:shadow-md dark:shadow-black/30 dark:hover:bg-[#008fe6]'
                      : 'border-none bg-[#dcf0fe] text-[#009FFF] shadow hover:bg-[#cde7fc] hover:shadow-md dark:bg-[#18181c] dark:text-white dark:shadow-sm dark:shadow-black/20 dark:hover:bg-[#222228]'
                  }`}>
                  <div className="flex w-full items-center justify-center gap-1.5 text-center sm:gap-2">
                    <Icon
                      icon={TAB_ICONS[index] || 'material-symbols:terminal-rounded'}
                      className={`text-base transition-transform duration-200 sm:text-2xl ${
                        isActive ? 'text-white' : 'text-[#009FFF] dark:text-white'
                      }`}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-center font-display text-xs font-bold sm:text-base lg:text-lg ${
                        isActive ? 'text-white' : 'text-[#009FFF] dark:text-white'
                      }`}>
                      {tab.label}
                    </span>
                  </div>
                  <div className="mt-2 hidden w-full flex-col items-center justify-center text-center font-mono text-[11px] sm:mt-2.5 sm:flex lg:text-xs">
                    <span
                      className={`block w-full truncate text-center ${
                        isActive ? 'text-white/95' : 'text-[#0284c7] dark:text-white'
                      }`}>
                      {tab.commands[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Full Width & Height Slideshow Container */}
      <section
        role="tabpanel"
        id={`cli-tabpanel-${activeTabIndex}`}
        aria-labelledby={`cli-tab-${activeTabIndex}`}
        className="relative -mt-px w-full bg-gradient-to-br from-[#892CA0] to-[#451254] pb-16 pt-24 text-white dark:from-[#661d7a] dark:to-[#280833] sm:pb-20 sm:pt-28 lg:pb-24 lg:pt-32">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left Column: Command Details */}
            <div className="flex flex-col justify-between space-y-6 lg:col-span-6">
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
                <h3 className="font-display text-2xl font-bold tracking-tight !text-white dark:!text-white sm:text-3xl lg:text-4xl">
                  {currentTab.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-purple-100 dark:text-purple-100 sm:text-lg">
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/15 text-white transition-colors hover:bg-white/25 active:scale-95">
                    <Icon icon="material-symbols:arrow-back-rounded" className="text-lg" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTabIndex(activeTabIndex < tabData.length - 1 ? activeTabIndex + 1 : 0)}
                    aria-label="Next command workflow"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/15 text-white transition-colors hover:bg-white/25 active:scale-95">
                    <Icon icon="material-symbols:arrow-forward-rounded" className="text-lg" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Terminal Window Mockup */}
            <div className="flex justify-center lg:col-span-6">
              <div className="w-full max-w-lg overflow-hidden rounded-xl border border-white/20 bg-[#18181b] shadow-2xl ring-1 ring-black/30 xl:max-w-[520px]">
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
                <div className="relative flex aspect-[16/10] w-full items-center justify-center bg-[#141416] p-2.5 sm:p-4">
                  <img
                    src={currentTab.image?.src || 'images/optimized/cli-screens/cli-find-image.webp'}
                    alt={currentTab.image?.alt || 'Podman CLI command screen'}
                    className="max-h-[380px] w-full rounded-lg object-contain shadow-sm"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FeaturesCarousel;
