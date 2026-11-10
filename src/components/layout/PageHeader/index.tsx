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
    <div className={`${grid} ${display} ${layout}`}>
      <h1 className="mb-6 max-w-sm text-purple-700 dark:text-purple-700 lg:max-w-lg">{title}</h1>
      <Markdown text={description} styles="leading-relaxed" />
    </div>
  );
};

const Image = ({
  grid = '',
  display = '',
  layout = '',
  image = { path: 'images/optimized/podman-2-196w-172h.webp', alt: 'Podman Logo' },
}: ImageSectionProps) => {
  return (
    <div className="flex w-full items-center justify-center">
      <img src={image.path} alt={image.alt} className={`mx-auto block ${grid} ${display} ${layout}`} />
    </div>
  );
};

function PageHeaderSupplementalInfo({ image, basicResources }: PageHeaderSupplementalInfoProps) {
  if (basicResources) {
    return <BasicResourcesBox />;
  }
  return <Image image={image} layout="mb-8 lg:mb-0" />;
}

function Instructions({ instructions }: InstructionsProps) {
  if (instructions) {
    return (
      <div>
        <h3 className="mb-4 text-gray-700">{instructions.title}</h3>
        <p>{instructions.subtitle}</p>
        <ul className="mb-10 mt-4 flex flex-col gap-6 sm:flex-row lg:mb-16 lg:gap-4 xl:flex-col">
          <li>
            <a
              href={instructions.button.path}
              className="flex h-32 max-w-lg flex-col items-center justify-center gap-4 rounded-md bg-gray-100 p-4 text-center text-purple-700 no-underline underline-offset-4 transition duration-150 ease-linear hover:bg-purple-700 hover:text-purple-50 hover:no-underline hover:shadow-md dark:bg-gray-700 dark:hover:bg-purple-900 dark:hover:text-white lg:h-auto lg:flex-row xl:justify-start">
              <span>{instructions.button.text}</span>
              <Icon icon={instructions.button.icon} className="order-first hidden lg:block" />
            </a>
          </li>
        </ul>
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
    <header className={`bg-${lightColor} dark:bg-${darkColor}`}>
      <div className="bg-gradient-to-r from-blue-500 to-purple-700 dark:from-blue-700 dark:to-purple-900 lg:pt-8">
        <WaveBorder />
      </div>
      <div className="container flex flex-col justify-around md:flex-row">
        <div>
          <TextBox title={title} description={description} layout="mt-12 lg:mt-0 mb-8" />
          <Instructions instructions={instructions} />
        </div>
        <div className="flex w-full items-center justify-center md:ml-12 md:w-[50%] md:justify-center lg:ml-24">
          <PageHeaderSupplementalInfo basicResources={basicResources} image={image} />
        </div>
      </div>
    </header>
  );
}

export default PageHeader;
