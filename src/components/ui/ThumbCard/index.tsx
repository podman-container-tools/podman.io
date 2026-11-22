import React from 'react';
import { Icon } from '@iconify/react';

type ThumbCardProps = Card & {
  image?: Image;
  icon?: string;
  iconClassName?: string;
};

function ThumbCard({ title, subtitle, image, icon, iconClassName = 'h-20 w-20' }: ThumbCardProps): JSX.Element {
  return (
    <article className="group flex flex-col items-center justify-start p-8 text-center transition-colors duration-200 hover:bg-purple-700 dark:hover:bg-purple-700">
      <h3 className="hidden">{title}</h3>
      <p className="max-w-[14rem] text-center text-gray-700 transition-colors duration-200 group-hover:text-white dark:text-gray-100">
        {subtitle}
      </p>
      <div className="order-first mb-6 flex h-24 w-full items-center justify-center">
        {icon ? (
          <Icon
            icon={icon}
            className={`${iconClassName} transition-all duration-200 group-hover:brightness-0 group-hover:invert`}
            aria-label={title ? `${title} Logo` : undefined}
          />
        ) : image ? (
          <img
            src={image.path}
            alt={image.alt}
            className="h-20 w-auto max-w-full object-contain transition-transform duration-200"
          />
        ) : null}
      </div>
    </article>
  );
}

export default ThumbCard;
