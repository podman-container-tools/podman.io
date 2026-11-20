import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { useThemeConfig } from '@docusaurus/theme-common';
import type { Props } from '@theme/DocSidebar';
import ModernDocSidebar from '@site/src/components/docs/ModernDocSidebar';

export default function DocSidebar(props: Props): JSX.Element {
  const {
    navbar: { hideOnScroll },
  } = useThemeConfig();

  const [navbarVisible, setNavbarVisible] = useState<boolean>(true);

  useEffect(() => {
    if (!hideOnScroll) return;

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
      observer.observe(navbarEl, {
        attributes: true,
        attributeFilter: ['class', 'style', 'aria-hidden'],
      });
      checkNavbar();
    }

    const handleScroll = () => {
      if (window.pageYOffset <= 10) {
        setNavbarVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hideOnScroll]);

  return (
    <div
      className={clsx(
        'doc-sidebar-container flex h-full w-full flex-col transition-[padding-top] duration-200 ease-out',
        hideOnScroll && !navbarVisible ? 'pt-2' : 'pt-[var(--ifm-navbar-height,3.75rem)]',
      )}>
      <ModernDocSidebar currentPath={props.path} />
    </div>
  );
}
