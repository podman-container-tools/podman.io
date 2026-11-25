import React, { useState, useEffect } from 'react';
import ModernDocSidebar from './ModernDocSidebar';

interface MobileDocsMenuProps {
  currentPath: string;
  currentCommandSlug?: string;
  activeLabel?: string;
}

export default function MobileDocsMenu({
  currentPath,
  currentCommandSlug,
  activeLabel,
}: MobileDocsMenuProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(true);

  // Track Docusaurus hide-on-scroll navbar so the sticky bar never gets covered by it
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const navbarEl = document.querySelector('nav.navbar');
    const checkNavbar = () => {
      if (!navbarEl) return;
      const isHidden =
        navbarEl.classList.toString().includes('navbarHidden') ||
        navbarEl.classList.contains('navbar--hidden') ||
        navbarEl.getAttribute('aria-hidden') === 'true';
      setNavbarVisible(!isHidden);
    };

    let observer: MutationObserver | null = null;
    if (navbarEl) {
      observer = new MutationObserver(checkNavbar);
      observer.observe(navbarEl, { attributes: true, attributeFilter: ['class', 'style', 'aria-hidden'] });
      checkNavbar();
    }

    const handleScroll = () => {
      if (window.pageYOffset <= 10) setNavbarVisible(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [currentPath, currentCommandSlug]);

  // Lock body scroll and listen for Escape while drawer is open
  useEffect(() => {
    if (!open || typeof document === 'undefined') return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* Sticky Mobile Docs Navigation Bar (visible whenever desktop sidebar is hidden: <= 996px) */}
      <div
        className={`sticky z-30 -mx-4 mb-5 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-2.5 backdrop-blur-sm transition-[top] duration-200 dark:border-zinc-800 dark:bg-[#18181b]/95 sm:-mx-6 sm:px-6 min-[997px]:hidden ${
          navbarVisible ? 'top-[var(--ifm-navbar-height,3.75rem)]' : 'top-0'
        }`}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open documentation navigation"
          aria-expanded={open}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
          <svg
            className="h-4 w-4 text-slate-600 dark:text-zinc-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h12" />
          </svg>
          <span>Menu</span>
        </button>

        {activeLabel && (
          <span className="min-w-0 truncate text-right font-mono text-xs font-medium text-slate-600 dark:text-zinc-400">
            {activeLabel}
          </span>
        )}
      </div>

      {/* Full-Height Slide-Over Sidebar Drawer */}
      {open && (
        <div className="fixed inset-0 z-[300] flex min-[997px]:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="relative flex h-full w-[85vw] max-w-[320px] flex-col overflow-hidden border-r border-slate-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-[#18181b]">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-zinc-800">
              <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Documentation</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close documentation navigation"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              <ModernDocSidebar
                currentPath={currentPath}
                currentCommandSlug={currentCommandSlug}
                onItemClick={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
