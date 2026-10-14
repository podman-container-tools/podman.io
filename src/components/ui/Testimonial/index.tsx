import React from 'react';
import { Icon } from '@iconify/react';

type TestimonialProps = {
  name: string;
  handle: string;
  description: string;
  social: string;
  path: string;
  date: string;
  avatar: string;
  featuredlink?: string;
};

function Avatar({ src, name }: { src: string; name: string }) {
  const [broken, setBroken] = React.useState(false);
  const initials = name
    .replace(/[^\p{L} ]/gu, '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0])
    .join('');

  if (broken) {
    return (
      <div
        aria-label={`${name} avatar`}
        role="img"
        className="to-purple-600 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#892CA0] text-sm font-bold text-white shadow-sm ring-2 ring-purple-100 dark:ring-purple-900/40">
        {initials || name[0]}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${name} avatar`}
      onError={() => setBroken(true)}
      ref={img => {
        if (img && img.complete && img.naturalWidth === 0) setBroken(true);
      }}
      className="h-12 w-12 shrink-0 rounded-full object-cover shadow-sm ring-2 ring-purple-100 dark:ring-purple-900/40"
    />
  );
}

// Clean up escaped characters like \@ or \# commonly found in raw data
const formatDescription = (text: string) => {
  return text.replace(/\\([@#])/g, '$1');
};

function Testimonial(props: TestimonialProps) {
  const socialIcon = props.social === 'twitter' ? 'fa6-brands:x-twitter' : `logos:${props.social}`;

  return (
    <article className="group flex h-[290px] w-full flex-col justify-between whitespace-normal rounded-xl border border-purple-100/60 bg-white p-5 shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-[#232326] dark:shadow-none dark:hover:border-white/20 sm:h-[300px]">
      <div>
        {/* Header: Avatar, Name, Handle, Social Icon */}
        <div className="mb-3.5 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar src={props.avatar} name={props.name} />
            <div className="min-w-0 flex-1">
              <h3
                className="truncate text-base font-bold tracking-tight text-gray-900 dark:text-white"
                title={props.name}>
                {props.name}
              </h3>
              <a
                href={props.path}
                target="_blank"
                rel="noopener noreferrer"
                className="dark:text-gray-400 block truncate text-xs font-medium text-gray-500 transition-colors hover:text-[#892CA0] dark:hover:text-purple-300">
                {props.handle}
              </a>
            </div>
          </div>
          {/* Social Platform Link */}
          <a
            href={props.path}
            target="_blank"
            rel="noopener noreferrer"
            title="View original post"
            className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex shrink-0 items-center justify-center transition-colors dark:text-gray-500">
            <Icon icon={socialIcon} className="text-base" />
          </a>
        </div>

        {/* Testimonial Quote */}
        <div className="h-20 overflow-hidden sm:h-24">
          <p className="line-clamp-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {formatDescription(props.description)}
          </p>
        </div>

        {/* Featured Link (without border or gray background) */}
        <div className="mt-2.5 flex h-7 items-center">
          {props.featuredlink && (
            <a
              href={props.featuredlink}
              target="_blank"
              rel="noopener noreferrer"
              title={props.featuredlink}
              className="group/link dark:text-gray-400 inline-flex max-w-full items-center gap-1.5 !text-xs text-gray-500 !no-underline transition-colors hover:text-[#892CA0] dark:hover:text-purple-300">
              <Icon
                icon="material-symbols:link-rounded"
                className="text-gray-400 shrink-0 text-sm transition-colors group-hover/link:text-[#892CA0] dark:text-gray-500 dark:group-hover/link:text-purple-300"
              />
              <span className="truncate hover:underline">{props.featuredlink.replace(/^https?:\/\/(www\.)?/, '')}</span>
              <Icon
                icon="material-symbols:arrow-outward-rounded"
                className="text-gray-400 shrink-0 text-[10px] transition-colors group-hover/link:text-[#892CA0] dark:text-gray-500 dark:group-hover/link:text-purple-300"
              />
            </a>
          )}
        </div>
      </div>

      {/* Footer: Date and Source Link */}
      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-xs dark:border-white/5">
        <time className="text-gray-400 !text-xs font-normal dark:text-gray-500">{props.date}</time>
        <a
          href={props.path}
          target="_blank"
          rel="noopener noreferrer"
          className="group/post text-gray-400 inline-flex items-center gap-1 !text-xs font-normal !no-underline transition-colors hover:text-[#892CA0] dark:text-gray-500 dark:hover:text-purple-300">
          <span className="!text-xs">View post</span>
          <Icon
            icon="material-symbols:arrow-outward-rounded"
            className="text-[11px] transition-transform duration-200 group-hover/post:-translate-y-0.5 group-hover/post:translate-x-0.5"
          />
        </a>
      </div>
    </article>
  );
}

export default Testimonial;
