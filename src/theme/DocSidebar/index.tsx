import React from 'react';
import type { Props } from '@theme/DocSidebar';
import ModernDocSidebar from '@site/src/components/docs/ModernDocSidebar';

export default function DocSidebar(props: Props): JSX.Element {
  return (
    <div className="flex h-full w-full flex-col pt-[var(--ifm-navbar-height,3.75rem)]">
      <ModernDocSidebar currentPath={props.path} />
    </div>
  );
}
