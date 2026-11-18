import React, { useState, useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';
import { useHistory } from '@docusaurus/router';
import { docsService } from '@site/src/services/docsService';
import type { DocManifest } from '@site/src/services/docsTypes';

interface SearchItem {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  type: 'command' | 'guide';
}

const STATIC_GUIDES: SearchItem[] = [
  {
    id: 'getting-started',
    title: 'Getting Started with Podman',
    category: 'Guides',
    description: 'Learn the basics of Podman, container management, and rootless mode.',
    url: '/docs',
    type: 'guide',
  },
  {
    id: 'installation',
    title: 'Installation Instructions',
    category: 'Guides',
    description: 'Install Podman on Linux, macOS, and Windows with package managers.',
    url: '/docs/installation',
    type: 'guide',
  },
  {
    id: 'checkpoint',
    title: 'Checkpoint & Restore',
    category: 'Guides',
    description: 'Checkpoint, restore, and migrate running containers with CRIU.',
    url: '/docs/checkpoint',
    type: 'guide',
  },
  {
    id: 'what-is-podman',
    title: 'What is Podman? (Overview)',
    category: 'CLI Commands',
    description: 'Daemonless, rootless architecture, pods, and Docker compatibility.',
    url: '/docs/commands',
    type: 'guide',
  },
];

interface TopDocsSearchProps {
  className?: string;
  onSelectCommand?: (slug: string) => void;
}

export default function TopDocsSearch({ className, onSelectCommand }: TopDocsSearchProps): JSX.Element {
  const history = useHistory();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [manifest, setManifest] = useState<DocManifest | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load manifest once for command searches
  useEffect(() => {
    let mounted = true;
    docsService.getManifest().then(m => {
      if (mounted) setManifest(m);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Global hotkey: '/' or 'Ctrl+K' / 'Cmd+K' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' && document.activeElement !== inputRef.current) ||
        ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')
      ) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute matched items
  const results = useMemo<SearchItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matchedGuides = STATIC_GUIDES.filter(
      g =>
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q),
    );

    const matchedCommands: SearchItem[] = [];
    if (manifest) {
      for (const cat of manifest.categories) {
        for (const item of cat.items) {
          if (
            item.slug.toLowerCase().includes(q) ||
            item.title.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
          ) {
            matchedCommands.push({
              id: item.slug,
              title: item.title,
              category: cat.name,
              description: item.description,
              url: `/docs/commands?cmd=${encodeURIComponent(item.slug)}`,
              type: 'command',
            });
            if (matchedCommands.length >= 25) break;
          }
        }
        if (matchedCommands.length >= 25) break;
      }
    }

    return [...matchedGuides, ...matchedCommands].slice(0, 15);
  }, [query, manifest]);

  const handleSelect = (item: SearchItem) => {
    setIsOpen(false);
    setQuery('');
    if (item.type === 'command' && onSelectCommand) {
      onSelectCommand(item.id);
    } else {
      history.push(item.url);
    }
  };

  return (
    <div ref={wrapperRef} className={clsx('relative w-full sm:w-auto', className)}>
      {/* Search Input Box - Prominent & Highly Visible */}
      <div className="relative flex w-full items-center">
        <svg
          className="text-gray-400 pointer-events-none absolute left-3.5 h-4 w-4 transition-colors dark:text-zinc-400 sm:left-4 sm:h-5 sm:w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={e => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search commands & docs..."
          className="top-docs-search-input h-10 w-full rounded-full pl-9 pr-10 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 dark:text-zinc-100 dark:placeholder:text-zinc-400 sm:w-64 sm:pl-10 sm:pr-12 sm:text-[13px] md:w-72 lg:w-80"
        />

        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className="text-gray-400 absolute right-3 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-sm transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            title="Clear search">
            ✕
          </button>
        ) : (
          /* Hidden on light theme (removed per user request); subtle pill on dark theme */
          <kbd className="shadow-2xs pointer-events-none absolute right-3 hidden items-center justify-center rounded border border-zinc-700 bg-zinc-800/90 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-400 dark:sm:inline-flex">
            /
          </kbd>
        )}
      </div>

      {/* Floating Results Dropdown */}
      {isOpen && query.trim() && (
        <div className="no-scrollbar animate-in fade-in slide-in-from-top-1 absolute right-0 top-full z-50 mt-2 max-h-[26rem] w-full overflow-y-auto rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl duration-150 dark:border-zinc-800 dark:bg-zinc-900 sm:w-80 md:w-96">
          <div className="mb-1 flex items-center justify-between border-b border-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:border-zinc-800/80 dark:text-zinc-500">
            <span>Commands & Guides</span>
            <span>
              {results.length} result{results.length === 1 ? '' : 's'}
            </span>
          </div>

          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-xs text-slate-500 dark:text-zinc-400">
              No matching commands or documentation found for{' '}
              <strong className="text-slate-900 dark:text-white">"{query}"</strong>.
            </div>
          ) : (
            <ul className="m-0 list-none space-y-1 p-0">
              {results.map(item => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="group flex w-full cursor-pointer flex-col gap-1 rounded-xl border-0 bg-transparent p-2.5 text-left transition-colors hover:bg-slate-100/80 dark:hover:bg-zinc-800/80 sm:p-3">
                    <div className="flex w-full items-center justify-between gap-2">
                      <span
                        className={clsx(
                          'truncate text-xs font-semibold text-slate-900 transition-colors dark:text-white sm:text-sm',
                          item.type === 'command' && 'font-mono',
                        )}>
                        {item.title}
                      </span>
                      <span className="font-sans shrink-0 rounded-full bg-[#0284c7]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#0284c7] dark:bg-[#1eccff]/20 dark:text-[#1eccff]">
                        {item.category}
                      </span>
                    </div>
                    {item.description && (
                      <p className="m-0 line-clamp-1 text-[11px] text-slate-500 dark:text-zinc-400 sm:text-xs">
                        {item.description}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
