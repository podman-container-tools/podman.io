import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig, useColorMode} from '@docusaurus/theme-common';

export interface LogoProps {
  imageClassName?: string;
  titleClassName?: string;
  [key: string]: unknown;
}

export default function Logo(props: LogoProps): JSX.Element {
  const {
    siteConfig: {title},
  } = useDocusaurusContext();
  const {
    navbar: {title: navbarTitle, logo},
  } = useThemeConfig();
  const {colorMode} = useColorMode();

  const {imageClassName, titleClassName, ...propsRest} = props;
  const logoLink = useBaseUrl(logo?.href || '/');
  const fallbackAlt = navbarTitle ? '' : title;
  const alt = logo?.alt ?? fallbackAlt;

  const logoSrc = logo?.srcDark && colorMode === 'dark' ? logo.srcDark : logo?.src;
  const logoUrl = useBaseUrl(logoSrc);

  const logoImg = logoSrc ? (
    <img
      src={logoUrl}
      alt={alt}
      height={logo?.height}
      width={logo?.width}
      style={logo?.style}
      className={logo?.className}
    />
  ) : null;

  return (
    <Link
      to={logoLink}
      {...propsRest}
      {...(logo?.target && {target: logo.target})}>
      {logoImg &&
        (imageClassName ? (
          <div className={imageClassName}>{logoImg}</div>
        ) : (
          logoImg
        ))}
      {navbarTitle != null && <b className={titleClassName}>{navbarTitle}</b>}
    </Link>
  );
}
