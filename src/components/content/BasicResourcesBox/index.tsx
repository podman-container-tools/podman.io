import React from 'react';
import { Icon } from '@iconify/react';
import { resources } from './data';

const BasicResourcesBox = () => {
  return (
    <div className="my-4 w-full max-w-md lg:my-0">
      <header className="mb-4">
        <h3 className="text-xl font-bold tracking-tight text-blue-700 dark:!text-blue-500">{resources.title}</h3>
      </header>
      <div>
        <ul className="flex list-none flex-col gap-3.5 p-0">
          {resources.buttons.map((button, index) => {
            const isExternal = button.path.startsWith('http');
            return (
              <li key={index} className="list-none">
                <a
                  href={button.path}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  style={{ textDecoration: 'none' }}
                  className="glass-container group flex w-full items-center justify-between gap-4 rounded-xl p-3.5 !no-underline dark:border-white/20 dark:bg-white/10 dark:hover:border-white/30 dark:hover:bg-white/15">
                  <div className="flex min-w-0 items-center gap-3.5 !no-underline">
                    <Icon
                      icon={button.icon || 'fa6-solid:book'}
                      className="shrink-0 text-xl text-blue-700 transition-colors dark:text-blue-500"
                    />
                    <span className="truncate text-sm font-semibold text-gray-900 !no-underline transition-colors group-hover:!text-blue-700 dark:text-white dark:group-hover:!text-blue-500 sm:text-base">
                      {button.text}
                    </span>
                  </div>
                  <Icon
                    icon={isExternal ? 'material-symbols:open-in-new' : 'material-symbols:arrow-forward-rounded'}
                    className="shrink-0 text-base text-blue-700/70 transition-all duration-200 group-hover:translate-x-0.5 group-hover:!text-blue-700 dark:text-blue-500/70 dark:group-hover:!text-blue-500"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default BasicResourcesBox;
