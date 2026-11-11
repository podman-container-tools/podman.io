import React, { useState } from 'react';
import clsx from 'clsx';
import { useAnnouncementBar, useScrollPosition } from '@docusaurus/theme-common/internal';
import type { Props } from '@theme/DocSidebar/Desktop/Content';
import ModernDocSidebar from '@site/src/components/docs/ModernDocSidebar';

function useShowAnnouncementBar() {
  const { isActive } = useAnnouncementBar();
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(isActive);
  useScrollPosition(
    ({ scrollY }) => {
      if (isActive) {
        setShowAnnouncementBar(scrollY === 0);
      }
    },
    [isActive],
  );
  return isActive && showAnnouncementBar;
}

export default function DocSidebarDesktopContent({ path, className }: Props): JSX.Element {
  const showAnnouncementBar = useShowAnnouncementBar();

  return (
    <nav
      aria-label="Docs sidebar"
      className={clsx(
        'flex h-full w-full flex-col overflow-hidden',
        showAnnouncementBar && 'mb-[var(--docusaurus-announcement-bar-height)]',
        className,
      )}>
      <ModernDocSidebar currentPath={path} />
    </nav>
  );
}
