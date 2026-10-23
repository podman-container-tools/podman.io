import React from 'react';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import { Icon } from '@iconify/react';
/* COMPONENTS */
import SectionHeader from '@site/src/components/layout/SectionHeader';
import PageHeader from '@site/src/components/layout/PageHeader';
import WaveBorder from '@site/src/components/shapes/WaveBorder';
import CodeExampleSection from '@site/src/components/content/CodeExampleSection';
/* PAGE DATA */
import { header, getHelp } from '@site/static/data/get-started';

/* PAGE COMPONENTS */
const GetHelpSection = () => {
  return (
    <section className="colored-glass-section bg-gradient-to-br from-purple-900 to-purple-500/75">
      <SectionHeader title={getHelp.title} textColor="!text-blue-500" />
      <div className="container mx-auto my-8 max-w-4xl px-4">
        <header className="mb-8 text-center">
          <h3 className="text-2xl font-bold text-white">{getHelp.subtitle}</h3>
        </header>

        <div className="space-y-6">
          {/* Manpages */}
          <div className="grid grid-cols-1 items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-md sm:p-6 lg:grid-cols-12 lg:gap-6">
            <div className="text-left lg:col-span-5">
              <h4 className="mb-1 text-lg font-bold text-white">Manpages</h4>
              <p className="text-sm leading-relaxed text-white/90 sm:text-base">
                For complete command details and options, review the{' '}
                <a
                  href="https://docs.podman.io/en/latest/Commands.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-blue-500 underline underline-offset-4 hover:text-white dark:text-blue-500 dark:hover:text-white sm:text-base">
                  Podman manpages
                </a>
                .
              </p>
            </div>
            <div className="lg:col-span-7">
              {/* prettier-ignore */}
              <CodeBlock language="bash" showLineNumbers className="w-full text-left rounded-xl shadow-md no-scrollbar">
                $ man podman {'\n'} 
                $ man podman subcommand
              </CodeBlock>
            </div>
          </div>

          {/* Built-in Help */}
          <div className="grid grid-cols-1 items-center gap-4 rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg backdrop-blur-md sm:p-6 lg:grid-cols-12 lg:gap-6">
            <div className="text-left lg:col-span-5">
              <h4 className="mb-1 text-lg font-bold text-white">Built-in Help</h4>
              <p className="text-sm leading-relaxed text-white/90 sm:text-base">
                To explore all commands or inspect options for a specific subcommand directly in your terminal:
              </p>
            </div>
            <div className="lg:col-span-7">
              {/* prettier-ignore */}
              <CodeBlock language="bash" showLineNumbers className="w-full text-left rounded-xl shadow-md no-scrollbar">
                $ podman --help # list all commands {'\n'}
                $ podman subcommand --help # get info on a command
              </CodeBlock>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-5 py-2.5 text-sm text-white backdrop-blur-md sm:text-base">
            <Icon icon="material-symbols:help-outline-rounded" className="shrink-0 text-lg text-blue-500" />
            <span>
              Looking for troubleshooting? Visit the{' '}
              <a
                href="https://github.com/containers/podman/blob/main/troubleshooting.md"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-blue-500 underline underline-offset-4 hover:text-white dark:text-blue-500 dark:hover:text-white sm:text-base">
                Podman Troubleshooting Guide
              </a>
              .
            </span>
          </div>
        </div>
      </div>
      <WaveBorder className="-mb-1 block w-full" />
    </section>
  );
};

const SearchPullListSection = () => {
  return (
    <section>
      <SectionHeader textColor="text-purple-700 dark:text-purple-500" title="Searching, pulling, and listing images" />
      <CodeExampleSection />
    </section>
  );
};

const StickyNote = ({ children, title = 'Note' }: { children: React.ReactNode; title?: string }) => {
  return (
    <div className="sticky-note shadow-xs relative mt-5 rounded-xl border border-white/25 bg-white/25 p-5 backdrop-blur-md transition-all sm:p-6">
      <div className="sticky-note-header mb-2.5 flex items-center gap-2 font-bold">
        <Icon icon="material-symbols:sticky-note-2-rounded" className="shrink-0 text-xl" />
        <span className="text-xs font-extrabold uppercase tracking-wider">{title}:</span>
      </div>
      <div className="text-justify text-sm leading-relaxed sm:text-base">{children}</div>
    </div>
  );
};

const RunListContainersSection = () => {
  return (
    <section className="colored-glass-section bg-gradient-to-br from-blue-500/75 to-blue-700 pb-16 pt-6">
      <SectionHeader
        textColor="!text-gray-900 dark:!text-white"
        title="Running a container &amp; listing running containers"
      />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="section-subtitle mb-10 text-center text-lg leading-relaxed !text-gray-900 dark:!text-white/90">
          This sample container will run a basic httpd server that serves its default index page.
        </p>

        <div className="space-y-8">
          {/* Step 1: Running a container */}
          <div className="step-card rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="step-badge shadow-xs flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/25 text-sm font-bold">
                1
              </span>
              <h3 className="text-xl font-bold sm:text-2xl">Running a container</h3>
            </div>
            <p className="mb-4 text-left text-base leading-relaxed">
              Run an Apache HTTP server in detached mode on port{' '}
              <code className="inline-block whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-xs font-semibold">
                8080
              </code>
              :
            </p>
            <CodeBlock language="bash" showLineNumbers className="no-scrollbar w-full rounded-xl text-left shadow-md">
              $ podman run -dt -p 8080:80/tcp docker.io/library/httpd {'\n'}
            </CodeBlock>
            <StickyNote title="Note">
              <p className="mb-2">
                Because the container is being run in detached mode, represented by the{' '}
                <code className="inline-block whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-xs font-semibold">
                  -d
                </code>{' '}
                in the{' '}
                <code className="inline-block whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-xs font-semibold">
                  podman run
                </code>{' '}
                command, Podman will run the container in the background and print the container ID after it has
                executed the command. The{' '}
                <code className="inline-block whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-xs font-semibold">
                  -t
                </code>{' '}
                also adds a pseudo-tty to run arbitrary commands in an interactive shell.
              </p>
              <p>
                Also, we use port forwarding to be able to access the HTTP server. For successful running at least{' '}
                <strong>slirp4netns</strong> v0.3.0 is needed.
              </p>
            </StickyNote>
          </div>

          {/* Step 2: Listing running containers */}
          <div className="step-card rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="step-badge shadow-xs flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/25 text-sm font-bold">
                2
              </span>
              <h3 className="text-xl font-bold sm:text-2xl">Listing running containers</h3>
            </div>
            <p className="mb-4 text-left text-base leading-relaxed">
              The{' '}
              <code className="inline-block whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-xs font-semibold">
                podman ps
              </code>{' '}
              command is used to list created and running containers:
            </p>
            <CodeBlock language="bash" showLineNumbers className="no-scrollbar w-full rounded-xl text-left shadow-md">
              $ podman ps{'\n'}
              CONTAINER ID IMAGE COMMAND CREATED STATUS PORTS NAMES{'\n'}
              01c44968199f docker.io/library/httpd:latest httpd-foreground 1 minute ago Up 1 minute 0.0.0.0:8080-{'>'}
              80/tcp laughing_bob{'\n'}
            </CodeBlock>
            <StickyNote title="Note">
              <p>
                If you add{' '}
                <code className="inline-block whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-xs font-semibold">
                  -a
                </code>{' '}
                to the{' '}
                <code className="inline-block whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-xs font-semibold">
                  podman ps
                </code>{' '}
                command, Podman will show all containers (created, exited, running, etc.).
              </p>
            </StickyNote>
          </div>

          {/* Step 3: Testing the container */}
          <div className="step-card rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-md sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="step-badge shadow-xs flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/25 text-sm font-bold">
                3
              </span>
              <h3 className="text-xl font-bold sm:text-2xl">
                Testing the{' '}
                <code className="inline-block whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-xs font-semibold">
                  httpd
                </code>{' '}
                container
              </h3>
            </div>
            <p className="mb-3 text-left text-base leading-relaxed">
              The container is reachable via its mapped port on your local machine:
            </p>
            <CodeBlock language="bash" showLineNumbers className="no-scrollbar w-full rounded-xl text-left shadow-md">
              $ curl http://localhost:8080{'\n'}
            </CodeBlock>

            <p className="mb-3 mt-6 text-left text-base leading-relaxed">
              From another machine, reach it using the host's IP address:
            </p>
            <CodeBlock language="bash" showLineNumbers className="no-scrollbar w-full rounded-xl text-left shadow-md">
              $ curl http://{'<IP_Address>'}:8080{'\n'}
            </CodeBlock>

            <StickyNote title="Note">
              <p>
                Instead of using{' '}
                <code className="inline-block whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-xs font-semibold">
                  curl
                </code>
                , you can also point a browser to{' '}
                <code className="inline-block whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-xs font-semibold">
                  http://localhost:8080
                </code>
                .
              </p>
            </StickyNote>
          </div>
        </div>
      </div>
    </section>
  );
};

/* PAGE CONTENT */
function GetStarted() {
  return (
    <Layout>
      <PageHeader
        title={header.title}
        description={header.subtitle}
        basicResources={true}
        instructions={header.instructions}
      />
      <GetHelpSection />
      <SearchPullListSection />
      <RunListContainersSection />
    </Layout>
  );
}

export default GetStarted;
