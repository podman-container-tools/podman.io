import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { Icon } from '@iconify/react';
import Button from '@site/src/components/utilities/Button';
import DropdownButton from '@site/src/components/utilities/DropdownButton';
import Link from '@site/src/components/utilities/Link';
import WaveBorder from '@site/src/components/shapes/WaveBorder';
import operatingSystemData from './installOptions';

const detectOperatingSystem = () => {
  const userAgent = window.navigator.userAgent.toLowerCase().split(' ');
  if (userAgent.find(item => item.includes('windows'))) {
    return 'windows';
  } else if (userAgent.find(item => item.includes('macintosh'))) {
    return 'mac';
  }
  return 'linux';
};

function returnOperatingSystemData() {
  const os = operatingSystemData.find(os => os.id === detectOperatingSystem() && os);
  return os;
}

const InstallOption = (props): JSX.Element => {
  if (!props) {
    props = operatingSystemData[0];
  }
  return (
    <section>
      <div>
        <a
          href={props.preferred.path}
          className="group block rounded-t-md px-4 py-3.5 text-purple-900 no-underline transition duration-150 ease-linear hover:bg-purple-700 hover:text-white hover:no-underline dark:text-white dark:hover:bg-purple-700">
          <div className="flex items-center gap-4">
            <Icon
              icon={props.preferred.icon}
              className="order-first shrink-0 text-3xl text-purple-900 group-hover:text-white dark:!text-white dark:group-hover:!text-white sm:text-4xl"
            />
            <div className="min-w-0 flex-1">
              <h3 className="m-0 text-sm font-semibold text-purple-900 group-hover:text-white dark:!text-white dark:group-hover:!text-white sm:text-base">
                {props.preferred.title}
              </h3>
              <p className="m-0 mt-0.5 text-xs font-normal text-gray-500 group-hover:text-purple-100 dark:!text-white dark:group-hover:!text-white sm:text-sm">
                {props.preferred.subtitle}
              </p>
            </div>
          </div>
        </a>
      </div>
      <div>
        <a
          href={props.alt.path}
          className="group block px-4 py-3.5 text-purple-900 no-underline transition duration-150 ease-linear hover:bg-purple-700 hover:text-white hover:no-underline dark:text-white dark:hover:bg-purple-700">
          <div className="flex items-center gap-4">
            <Icon
              icon={props.alt.icon}
              className="order-first shrink-0 text-3xl text-purple-900 group-hover:text-white dark:!text-white dark:group-hover:!text-white sm:text-4xl"
            />
            <div className="min-w-0 flex-1">
              <h4 className="m-0 text-sm font-semibold text-purple-900 group-hover:text-white dark:!text-white dark:group-hover:!text-white sm:text-base">
                {props.alt.title}
              </h4>
              <p className="m-0 mt-0.5 text-xs font-normal text-gray-500 group-hover:text-purple-100 dark:!text-white dark:group-hover:!text-white sm:text-sm">
                {props.alt.subtitle}
              </p>
            </div>
          </div>
        </a>
      </div>
      {props.third && (
        <div>
          <a
            href={props.third.path}
            className="group block px-4 py-3.5 text-purple-900 no-underline transition duration-150 ease-linear hover:bg-purple-700 hover:text-white hover:no-underline dark:text-white dark:hover:bg-purple-700">
            <div className="flex items-center gap-4">
              <Icon
                icon={props.third.icon}
                className="order-first shrink-0 text-3xl text-purple-900 group-hover:text-white dark:!text-white dark:group-hover:!text-white sm:text-4xl"
              />
              <div className="min-w-0 flex-1">
                <h4 className="m-0 text-sm font-semibold text-purple-900 group-hover:text-white dark:!text-white dark:group-hover:!text-white sm:text-base">
                  {props.third.title}
                </h4>
                <p className="m-0 mt-0.5 text-xs font-normal text-gray-500 group-hover:text-purple-100 dark:!text-white dark:group-hover:!text-white sm:text-sm">
                  {props.third.subtitle}
                </p>
              </div>
            </div>
          </a>
        </div>
      )}
      <div>
        <a
          href={props.other.path}
          className="group block rounded-b-md bg-gray-50 px-4 py-3 text-purple-900 no-underline transition duration-150 ease-linear hover:bg-purple-700 hover:text-white hover:no-underline dark:bg-white/[0.07] dark:text-white dark:hover:bg-purple-700">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h5 className="m-0 text-sm font-semibold text-purple-900 group-hover:text-white dark:!text-white dark:group-hover:!text-white">
                {props.other.text}
              </h5>
              {props.other.subtext && (
                <p className="m-0 mt-0.5 text-xs font-normal text-gray-500 group-hover:text-purple-100 dark:!text-white dark:group-hover:!text-white">
                  {props.other.subtext}
                </p>
              )}
            </div>
            <Icon
              icon="material-symbols:arrow-circle-right-rounded"
              className="shrink-0 text-xl text-purple-900 group-hover:text-white dark:!text-white dark:group-hover:!text-white"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

function HeroHeader({ title, subtitle, podmanrelease, desktoprelease, image, platforms }) {
  const releaseLinkProps = {
    fontSize: 'text-xs sm:text-sm 2xl:text-base font-normal',
    textColor: 'text-white dark:text-gray-100',
    hoverColor: 'hover:text-purple-300 dark:hover:text-purple-300',
    underline: 'underline underline-offset-4 decoration-white/70 hover:decoration-purple-300',
  };

  return (
    <header className="relative z-30 bg-gradient-to-r from-blue-500 to-purple-700 dark:from-blue-700 dark:to-purple-900">
      <div className="mx-auto grid px-6 sm:px-8 md:grid-cols-5 md:items-end md:gap-8 lg:gap-12 lg:px-16 xl:px-28 2xl:px-52">
        <div className="relative z-20 min-w-0 pb-20 pt-8 md:col-span-3 md:pb-28 md:pt-12 lg:pb-32 2xl:pb-36">
          <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white dark:text-gray-50 sm:text-4xl lg:mb-6 lg:text-5xl 2xl:text-6xl">
            {title}
          </h1>
          <p className="max-w-sm text-base leading-relaxed text-white/95 dark:text-gray-100 sm:max-w-md sm:text-lg lg:max-w-xl 2xl:max-w-2xl 2xl:text-xl">
            {subtitle}
          </p>
          <div className="relative z-40 my-4 flex max-w-sm gap-6 text-base sm:gap-8 sm:text-lg 2xl:text-xl">
            <Button as="link" text="Get Started" path="/get-started" />
            <BrowserOnly>
              {() => (
                <DropdownButton
                  text="Download"
                  icon="material-symbols:download-rounded"
                  option={InstallOption(returnOperatingSystemData())}
                />
              )}
            </BrowserOnly>
          </div>
          <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 pt-2 text-xs font-normal text-white dark:text-gray-100 sm:flex-nowrap sm:gap-x-3 sm:text-sm 2xl:gap-x-4 2xl:text-base">
            <span className="max-w-full break-words sm:whitespace-nowrap">
              Latest stable Podman <Link {...podmanrelease} {...releaseLinkProps} />
            </span>
            <span className="hidden opacity-60 sm:inline" aria-hidden="true">
              -
            </span>
            <span className="max-w-full break-words sm:whitespace-nowrap">
              Latest stable Podman Desktop <Link {...desktoprelease} {...releaseLinkProps} />
            </span>
            <span className="hidden opacity-60 sm:inline" aria-hidden="true">
              -
            </span>
            <span className="max-w-full break-words sm:whitespace-nowrap">
              <Link
                text="Apache License 2.0"
                path="https://www.apache.org/licenses/LICENSE-2.0"
                {...releaseLinkProps}
              />
            </span>
          </p>
        </div>

        <div className="flex flex-col items-end justify-end self-end pb-4 md:col-span-2 md:pb-8 lg:pb-10 2xl:pb-14">
          <div className="mb-4 flex flex-col items-start pr-4 sm:pr-5 md:mb-6 md:items-end lg:pr-6 2xl:pr-8">
            <h3 className="text-base font-medium text-white dark:text-gray-100 2xl:text-lg">{platforms[0]}</h3>
            <ul className="flex gap-4 2xl:gap-5">
              {platforms.slice(1).map((icon, index) => {
                return (
                  <li key={index}>
                    <Icon icon={icon} className="text-3xl text-white dark:text-gray-100 2xl:text-4xl" />
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="hidden w-full justify-end md:flex">
            <img
              src={image.path}
              alt={image.alt}
              className="w-full max-w-none object-cover md:w-[108%] lg:w-[112%] 2xl:w-[115%]"
            />
          </div>
        </div>
      </div>
      <WaveBorder grid="md:-mt-16 lg:-mt-20 xl:-mt-24 2xl:-mt-28" />
    </header>
  );
}

export default HeroHeader;
