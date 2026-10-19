import React from 'react';
import { Icon } from '@iconify/react';
import { resources } from './data';

const BasicResourcesBox = () => {
  return (
    <div className="my-4 w-full max-w-md lg:my-0">
      <header className="mb-4">
        <h3 className="text-xl font-bold tracking-tight text-blue-900 dark:text-blue-300">{resources.title}</h3>
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
                  className="shadow-xs hover:border-blue-600 dark:hover:border-blue-400/50 group flex w-full items-center justify-between gap-4 rounded-xl border border-[#D5E3EE] bg-[#F0F6FA] p-3.5 !no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:!no-underline hover:shadow-md dark:border-white/10 dark:bg-[#1B222C] dark:shadow-none dark:hover:bg-[#202936]">
                  <div className="flex min-w-0 items-center gap-3.5 !no-underline">
                    <div className="shadow-xs dark:group-hover:bg-blue-600 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-100 bg-white text-blue-700 transition-colors duration-200 group-hover:border-blue-700 group-hover:bg-blue-700 group-hover:text-white dark:border-blue-500/30 dark:bg-blue-900/40 dark:text-blue-300 dark:group-hover:text-white">
                      <Icon icon={button.icon || 'fa6-solid:book'} className="text-lg" />
                    </div>
                    <span className="truncate text-sm font-semibold text-gray-900 !no-underline transition-colors group-hover:text-blue-900 dark:text-white dark:group-hover:text-blue-300 sm:text-base">
                      {button.text}
                    </span>
                  </div>
                  <Icon
                    icon={isExternal ? 'material-symbols:open-in-new' : 'material-symbols:arrow-forward-rounded'}
                    className="text-blue-400 dark:text-blue-400 shrink-0 text-base transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-blue-700 dark:group-hover:text-blue-300"
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
