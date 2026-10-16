import React, { useEffect, useState } from 'react';
import { translate } from '@docusaurus/Translate';
import { PageMetadata } from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import Link from '../components/utilities/Link';
import './styles.css';

export default function NotFound(): JSX.Element {
  const [currUrl, setCurrUrl] = useState('');
  const [relativeUrl, setRelativeUrl] = useState('');
  const [searchLink, setSearchLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    if (currUrl !== '') {
      const splitPath = currUrl.split('/');
      const relativePath = splitPath[splitPath.length - 1];
      if (relativePath !== '') {
        setRelativeUrl(relativePath);
      }
    }
  }, [currUrl]);

  useEffect(() => {
    if (relativeUrl !== '') {
      setSearchLink(`https://duckduckgo.com/?t=h_&kl=us-en&kp=-1&q=podman%2F${relativeUrl}&ia=web`);
    }
  }, [relativeUrl]);

  const Messages = [
    "Oh no! We can't seal the deal!",
    "We can't seal with it!",
    'This is seal-iously embarrassing...',
    "Seal-ly us! We can't find that page.",
    "Don't flip, but we can't find that.",
    "We don't sea that page.",
  ];
  const rand_seed = Math.floor(Math.random() * Messages.length);

  return (
    <>
      <PageMetadata
        title={translate({
          id: 'theme.NotFound.title',
          message: 'Page Not Found',
        })}
      />
      <Layout>
        <main className="margin-vert--xl container">
          <div className="img-container flex justify-center">
            <img src="/images/optimized/characters/confused-seal-231w-248h.webp" alt="Not Found" />
          </div>
          <div className="row">
            <div className="col title-row-col-1">
              <h1 className="hero__title">
                <div id="theme-NotFound-title">{Messages[rand_seed]}</div>
              </h1>
              <p>
                <div id="theme-NotFound-p1">
                  We could not find what you were looking for: &nbsp;
                  <Link
                    text={currUrl}
                    fontSize="font-bold"
                    textColor="dark:text-white text-black"
                    hoverColor=""
                    underline="no-underline hover:no-underline"
                    path="#"
                  />{' '}
                  isn't a working link. <br />
                  <span>
                    The content may have moved; &nbsp;
                    <Link
                      text="try a search for it"
                      fontSize="font-bold"
                      underline="no-underline hover:no-underline"
                      target="_blank"
                      path={searchLink}
                    />
                  </span>
                </div>
              </p>
            </div>
          </div>
        </main>
      </Layout>
    </>
  );
}
