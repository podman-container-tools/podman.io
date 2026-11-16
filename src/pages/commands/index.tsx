import React, { useEffect } from 'react';
import { Redirect, useLocation } from '@docusaurus/router';

export default function CommandsRedirect(): JSX.Element {
  const location = useLocation();
  const search = location.search || '';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.replace(`/docs/commands${search}`);
    }
  }, [search]);

  return <Redirect to={`/docs/commands${search}`} />;
}
