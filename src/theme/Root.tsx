import React from 'react';
import { DocSubmenuProvider } from '@site/src/context/DocSubmenuContext';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return <DocSubmenuProvider>{children}</DocSubmenuProvider>;
}
