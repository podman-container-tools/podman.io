import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import tabData from './data';

const Tab = (props): JSX.Element => {
  const { label, commands, method, isActive } = props;
  return (
    <button
      onClick={method}
      className={`rounded-lg p-4 shadow-sm transition duration-150 hover:bg-purple-700 hover:text-white dark:hover:bg-purple-900 dark:hover:text-gray-50 md:h-36 md:w-56 ${
        isActive
          ? 'bg-gradient-radial from-purple-500 to-purple-700 text-white dark:from-purple-700 dark:to-purple-900 dark:shadow-purple-900'
          : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300 dark:shadow-gray-700'
      }`}>
      <h4 className="text-blue-500 dark:text-blue-500">{label}</h4>
      <ul>
        {commands.map((command, index) => {
          return (
            <li key={index} className="hidden font-mono text-sm md:block">
              {command}
            </li>
          );
        })}
      </ul>
    </button>
  );
};
const TabContent = (props): JSX.Element => {
  const { title, commands, image, description, isActive } = props;
  return (
    <>
      <div className="xl:my-23 container my-12 flex flex-wrap justify-center gap-4 md:gap-12">
        <div className="max-w-sm">
          <h3
            className={`text-3xl ${
              isActive % 2 === 0
                ? 'text-white dark:text-white'
                : isActive === 1
                  ? 'text-blue-700 dark:text-purple-500'
                  : 'text-purple-700 dark:text-purple-500'
            }`}>
            {title}
          </h3>
          <ul className="my-4 lg:my-12">
            {commands.map((command, index) => (
              <li key={index} className={`font-mono ${isActive == 2 ? 'text-white' : 'text-blue-500'}`}>
                {command}
              </li>
            ))}
          </ul>
          <p className={isActive % 2 === 0 ? 'text-white dark:text-white' : 'text-gray-900 dark:text-white'}>
            {description}
          </p>
        </div>
        <div className={`${isActive % 2 === 1 && 'md:order-first'}`}>
          <img {...image} className="object-fit lg:w-[600px]" />
        </div>
      </div>
    </>
  );
};

function FeaturesCarousel() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  // render content
  return (
    <section className="bg-gray-100 dark:bg-gray-900">
      <div className="container -mb-6 flex justify-center gap-5 md:-mb-10 md:gap-8">
        {/* Loop through Tab data and generate tab buttons for each */}
        {tabData.map((tab, index) => {
          return (
            <Tab {...tab} method={() => setActiveTabIndex(index)} isActive={activeTabIndex === index} key={index} />
          );
        })}
      </div>
      <section
        className={`py-10 md:py-16 ${
          activeTabIndex % 2 === 1
            ? 'bg-white dark:bg-gray-900 dark:bg-gradient-to-b dark:from-purple-900 dark:to-purple-900/50'
            : activeTabIndex === 2
              ? 'bg-gradient-to-br from-blue-300 via-blue-500 to-blue-900 dark:from-blue-900 dark:to-gray-700/50'
              : 'bg-gradient-to-br from-purple-300 via-purple-700 to-purple-900'
        }`}>
        <div className="space-between container flex">
          <button
            type="button"
            onClick={() => setActiveTabIndex(activeTabIndex > 0 ? activeTabIndex - 1 : tabData.length - 1)}
            aria-label="Previous feature">
            <Icon
              icon="fa-solid:arrow-circle-left"
              className={`text-3xl transition duration-150 ease-linear hover:opacity-50 dark:hover:opacity-50 ${
                activeTabIndex % 2 === 0 ? 'text-white' : 'text-purple-700 dark:text-gray-50'
              }`}
            />
          </button>
          <TabContent {...tabData[activeTabIndex]} isActive={activeTabIndex} />
          <button
            type="button"
            onClick={() => setActiveTabIndex(activeTabIndex < 3 ? activeTabIndex + 1 : 0)}
            aria-label="Next feature">
            <Icon
              icon="fa-solid:arrow-circle-right"
              className={`text-3xl transition duration-150 ease-linear hover:text-purple-900 dark:hover:text-purple-700 ${
                activeTabIndex % 2 === 0 ? 'text-white' : 'text-gray-700 dark:text-gray-50'
              }`}
            />
          </button>
        </div>
      </section>
    </section>
  );
}

export default FeaturesCarousel;
