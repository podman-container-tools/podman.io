import React, { useEffect } from 'react';
import { Redirect, useLocation } from '@docusaurus/router';

function commandsTarget(search: string, hash: string): string {
  const params = new URLSearchParams(search || '');
  const cmd = params.get('cmd');
  const hashSuffix = hash || '';
  if (cmd) {
    params.delete('cmd');
    const qs = params.toString();
    return `/docs/commands/${encodeURIComponent(cmd)}${qs ? `?${qs}` : ''}${hashSuffix}`;
  }
  return `/docs/commands${search || ''}${hashSuffix}`;
}

export default function CommandsRedirect(): JSX.Element {
  const location = useLocation();
  const target = commandsTarget(location.search || '', location.hash || '');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace(target);
    }
  }, [target]);

  return <Redirect to={target} />;
}
