import React, { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { translate } from '@docusaurus/Translate';
import type { Props } from '@theme/CodeBlock/CopyButton';

export default function CopyButton({ code, className }: Props): JSX.Element {
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeout = useRef<number | undefined>(undefined);

  const handleCopyCode = useCallback(() => {
    const cleanToCopy = code
      .split('\n')
      .map(line => (line.startsWith('$ ') ? line.slice(2) : line))
      .join('\n');

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(cleanToCopy).catch(() => undefined);
    }

    setIsCopied(true);
    window.clearTimeout(copyTimeout.current);
    copyTimeout.current = window.setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [code]);

  useEffect(() => () => window.clearTimeout(copyTimeout.current), []);

  return (
    <button
      type="button"
      aria-label={
        isCopied
          ? translate({
              id: 'theme.CodeBlock.copied',
              message: 'Copied',
              description: 'The copied button label on code blocks',
            })
          : translate({
              id: 'theme.CodeBlock.copyButtonAriaLabel',
              message: 'Copy code to clipboard',
              description: 'The ARIA label for copy code blocks button',
            })
      }
      title={
        isCopied
          ? translate({
              id: 'theme.CodeBlock.copied',
              message: 'Copied',
              description: 'The copied button label on code blocks',
            })
          : translate({
              id: 'theme.CodeBlock.copy',
              message: 'Copy',
              description: 'The copy button label on code blocks',
            })
      }
      className={clsx(
        'clean-btn flex cursor-pointer items-center gap-1.5 rounded-lg border-0 bg-transparent px-2 py-1.5 text-slate-400 transition-all hover:bg-black/5 hover:text-slate-700 dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-zinc-100',
        className,
      )}
      onClick={handleCopyCode}>
      {isCopied ? (
        <>
          <svg className="h-4 w-4 text-emerald-500 dark:text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-sans text-[11px] font-medium text-emerald-600 dark:text-emerald-400">Copied!</span>
        </>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M15 1H4c-1.1 0-2 .9-2 2v13c0 .55.45 1 1 1s1-.45 1-1V3h11c.55 0 1-.45 1-1s-.45-1-1-1zm4 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2z" />
        </svg>
      )}
    </button>
  );
}
