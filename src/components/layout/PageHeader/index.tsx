import React from 'react';
import { Icon } from '@iconify/react';
import WaveBorder from '@site/src/components/shapes/WaveBorder';
import Markdown from '@site/src/components/utilities/Markdown';
import BasicResourcesBox from '@site/src/components/content/BasicResourcesBox';
type ImageSectionProps = LayoutProps & {
  image?: Image;
};

type InstructionDetails = {
  title?: string;
  subtitle?: string;
  button?: {
    path?: string;
    text?: string;
    icon?: string;
  };
};

type PageHeaderProps = LayoutProps &
  HeaderProps & {
    image?: Image;
    colors?: Colors;
    darkColor?: string;
    lightColor?: string;
    basicResources?: boolean;
    instructions?: InstructionDetails;
  };

type PageHeaderSupplementalInfoProps = PageHeaderProps & {
  image?: Image;
  basicResources?: boolean;
};

type InstructionsProps = PageHeaderProps & {
  instructions?: InstructionDetails;
};

const TextBox = ({ grid, display, layout, title, description }: PageHeaderProps): JSX.Element => {
  return (
    <div className={`${grid || ''} ${display || ''} ${layout || ''}`}>
      <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-purple-700 dark:!text-purple-500 sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      {description && (
        <Markdown text={description} styles="text-base sm:text-lg leading-relaxed text-gray-700 dark:text-gray-200" />
      )}
    </div>
  );
};

const Image = ({
  grid,
  display,
  layout,
  image = { path: 'images/optimized/podman-2-196w-172h.webp', alt: 'Podman Logo' },
}: ImageSectionProps) => {
  return (
    <div className="flex justify-center">
      <img src={image.path} alt={image.alt} className={`${grid || ''} ${display || ''} ${layout || ''}`} />
    </div>
  );
};

function PageHeaderSupplementalInfo({ image, basicResources }: PageHeaderSupplementalInfoProps) {
  if (basicResources) {
    return <BasicResourcesBox />;
  }
  return <Image image={image} layout="mb-8 lg:mb-0 max-w-xs md:max-w-sm" />;
}

function Instructions({ instructions }: InstructionsProps) {
  if (instructions) {
    const isExternal = instructions.button?.path?.startsWith('http');
    return (
      <div className="mt-8 border-t border-purple-100/60 pt-6 dark:border-white/10">
        {instructions.title && (
          <h2 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
            {instructions.title}
          </h2>
        )}
        {instructions.subtitle && (
          <p className="mb-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">{instructions.subtitle}</p>
        )}
        {instructions.button && (
          <div className="max-w-md">
            <a
              href={instructions.button.path}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              style={{ textDecoration: 'none' }}
              className="glass-container group flex w-full items-center justify-between gap-4 rounded-xl p-3.5 !no-underline dark:border-white/20 dark:bg-white/10 dark:hover:border-white/30 dark:hover:bg-white/15">
              <div className="flex min-w-0 items-center gap-3.5 !no-underline">
                <Icon
                  icon={instructions.button.icon || 'fa6-solid:book'}
                  className="shrink-0 text-xl text-blue-700 transition-colors dark:text-blue-500"
                />
                <span className="truncate text-sm font-semibold text-gray-900 !no-underline transition-colors group-hover:!text-blue-700 dark:text-white dark:group-hover:!text-blue-500 sm:text-base">
                  {instructions.button.text}
                </span>
              </div>
              <Icon
                icon={isExternal ? 'material-symbols:open-in-new' : 'material-symbols:arrow-forward-rounded'}
                className="shrink-0 text-base text-blue-700/70 transition-all duration-200 group-hover:translate-x-0.5 group-hover:!text-blue-700 dark:text-blue-500/70 dark:group-hover:!text-blue-500"
              />
            </a>
          </div>
        )}
      </div>
    );
  }
  return null;
}

function PageHeader({
  title,
  description,
  image,
  lightColor = 'white',
  darkColor = 'gray-900',
  basicResources,
  instructions,
}: PageHeaderProps) {
  return (
    <header className={`bg-${lightColor} dark:bg-${darkColor} transition-colors`}>
      <div className="bg-gradient-to-r from-blue-500 to-purple-700 dark:from-blue-700 dark:to-purple-900 lg:pt-8">
        <WaveBorder />
      </div>
      <div className="container py-8 lg:py-12">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <TextBox title={title} description={description} layout="mb-6" />
            <Instructions instructions={instructions} />
          </div>
          <div className="flex justify-center lg:col-span-5 lg:justify-end">
            <PageHeaderSupplementalInfo basicResources={basicResources} image={image} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
