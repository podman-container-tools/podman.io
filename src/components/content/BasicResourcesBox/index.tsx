import React from 'react';
import { Icon } from '@iconify/react';
import { resources } from './data';

interface BasicResourcesBoxProps {
  compact?: boolean;
}

const RESOURCE_ITEMS = [
  {
    title: 'Installation Instructions',
    subtitle: 'Setup Podman on Linux, macOS, or Windows',
    path: 'https://podman.io/docs/installation',
    icon: 'material-symbols:download-for-offline-rounded',
    isExternal: false,
  },
  {
    title: 'Documentation',
    subtitle: 'Official CLI commands, configs, and architecture',
    path: 'https://docs.podman.io',
    icon: 'material-symbols:menu-book-rounded',
    isExternal: true,
  },
  {
    title: 'Troubleshooting Guide',
    subtitle: 'Fix common issues, rootless setup, and networking',
    path: 'https://github.com/containers/podman/blob/main/troubleshooting.md',
    icon: 'material-symbols:troubleshoot-rounded',
    isExternal: true,
  },
  {
    title: 'Community & Discussions',
    subtitle: 'Connect with maintainers on GitHub, Discord, & Matrix',
    path: '/community',
    icon: 'fluent:people-community-24-filled',
    isExternal: false,
  },
];

const BasicResourcesBox: React.FC<BasicResourcesBoxProps> = ({ compact = false }) => {
  return (
    <div className="flex w-full flex-1 flex-col justify-between">
      <header className="mb-6 text-center lg:text-start">
        <h3 className="font-display text-2xl font-bold text-blue-700 dark:text-blue-500 lg:text-3xl">
          {resources.title}
        </h3>
      </header>

      <div className={`flex flex-1 flex-col justify-between ${compact ? 'gap-3' : 'gap-3.5 sm:gap-4'}`}>
        {RESOURCE_ITEMS.map((item, index) => {
          return (
            <a
              key={index}
              href={item.path}
              target={item.isExternal ? '_blank' : undefined}
              rel={item.isExternal ? 'noopener noreferrer' : undefined}
              style={{ textDecoration: 'none' }}
              className="group flex flex-1 items-center justify-between gap-3 rounded-xl border border-purple-100/60 bg-white p-3.5 !no-underline shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-[#232326] dark:shadow-none dark:hover:border-white/20 sm:gap-4 sm:p-4">
              <div className="flex min-w-0 items-center gap-3 !no-underline sm:gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-[#892CA0] transition-colors duration-200 group-hover:bg-[#892CA0] group-hover:text-white dark:bg-purple-900/40 dark:text-purple-300 dark:group-hover:bg-[#892CA0] dark:group-hover:text-white sm:h-11 sm:w-11">
                  <Icon icon={item.icon} className="text-xl sm:text-2xl" />
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-bold text-gray-900 !no-underline transition-colors group-hover:!text-[#892CA0] dark:text-white dark:group-hover:!text-purple-300 sm:text-base">
                    {item.title}
                  </span>
                  <span className="dark:text-gray-400 truncate text-xs text-gray-500">{item.subtitle}</span>
                </div>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-[#892CA0] transition-all duration-200 group-hover:translate-x-0.5 group-hover:bg-[#892CA0] group-hover:text-white dark:bg-purple-900/40 dark:text-purple-300 dark:group-hover:bg-[#892CA0] dark:group-hover:text-white sm:h-8 sm:w-8">
                <Icon
                  icon={item.isExternal ? 'material-symbols:open-in-new' : 'material-symbols:arrow-forward-rounded'}
                  className="text-sm sm:text-base"
                />
              </div>
            </a>
          );
        })}
      </div>

      {!compact && (
        <p className="text-gray-600 dark:text-gray-400 mt-6 text-center text-sm lg:text-start">
          Explore more guides &amp; tutorials in our{' '}
          <a
            href="https://docs.podman.io"
            target="_blank"
            rel="noopener noreferrer"
            className="dark:text-purple-400 font-medium text-purple-700 underline underline-offset-4 transition-colors hover:text-purple-900 dark:hover:text-purple-300">
            Documentation!
          </a>
        </p>
      )}
    </div>
  );
};

export default BasicResourcesBox;
