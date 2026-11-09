import React from 'react';
import clsx from 'clsx';
import { useThemeConfig } from '@docusaurus/theme-common';
import { useHideableNavbar } from '@docusaurus/theme-common/internal';
import type { Props } from '@theme/DocSidebar';
import ModernDocSidebar from '@site/src/components/docs/ModernDocSidebar';

export default function DocSidebar(props: Props): JSX.Element {
  const {
    navbar: { hideOnScroll },
  } = useThemeConfig();
  const { isNavbarVisible } = useHideableNavbar(hideOnScroll);

  return (
    <div
      className={clsx(
        'doc-sidebar-container flex h-full w-full flex-col transition-[padding-top] duration-200 ease-out',
        hideOnScroll && !isNavbarVisible ? 'pt-3.5' : 'pt-[var(--ifm-navbar-height,3.75rem)]',
      )}>
      <ModernDocSidebar currentPath={props.path} />
    </div>
  );
}
