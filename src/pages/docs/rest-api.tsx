import React from 'react';
import Layout from '@theme/Layout';

const PODMAN_REST_API_URL = 'https://docs.podman.io/en/latest/_static/api.html';

export default function RestApiDocsPage(): JSX.Element {
  return (
    <Layout
      title="Podman REST API Reference"
      description="Interactive Podman REST API reference documentation."
      noFooter>
      <div className="h-[calc(100vh-64px)] w-full bg-white">
        <iframe
          src={PODMAN_REST_API_URL}
          title="Podman REST API Reference"
          className="h-full w-full border-0 bg-white"
        />
      </div>
    </Layout>
  );
}
