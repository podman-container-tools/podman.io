import React from 'react';
import { NavbarSecondaryMenuFiller } from '@docusaurus/theme-common';
import { useNavbarMobileSidebar } from '@docusaurus/theme-common/internal';
import type { Props } from '@theme/DocSidebar/Mobile';
import ModernDocSidebar from '@site/src/components/docs/ModernDocSidebar';

const DocSidebarMobileSecondaryMenu = ({ path }: Props): JSX.Element => {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <div className="p-2">
      <ModernDocSidebar currentPath={path} onItemClick={() => mobileSidebar.toggle()} />
    </div>
  );
};

export default function DocSidebarMobile(props: Props): JSX.Element {
  return <NavbarSecondaryMenuFiller component={DocSidebarMobileSecondaryMenu} props={props} />;
}
