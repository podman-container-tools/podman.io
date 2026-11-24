import React from 'react';
import Layout from '@theme/Layout';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
/* COMPONENTS */
import HeroHeader from '@site/src/components/layout/HeroHeader';
import LiteratureCarousel from '@site/src/components/content/LiteratureCarousel';
import TestimonialSection from '@site/src/components/content/TestimonialSection';
import BlogArticlesList from '@site/src/components/content/BlogArticlesList';
import WhyPodmanSection from '@site/src/components/content/WhyPodmanSection';
/* PAGE DATA */
import { header } from '@site/static/data/home';
import sponsorData from '@site/src/components/content/ThankYouSection/data';

const SPONSOR_LOGOS_ROW_1 = [
  { ...sponsorData[3], sizeClass: 'h-11 sm:h-12' }, // Motorola Solutions
  { ...sponsorData[2], sizeClass: 'h-7 sm:h-8' }, // SUSE
  { ...sponsorData[0], sizeClass: 'h-10 sm:h-12' }, // Red Hat
  { ...sponsorData[5], sizeClass: 'h-8 sm:h-9' }, // IBM
  { ...sponsorData[4], sizeClass: 'h-8 sm:h-9' }, // NTT
  { ...sponsorData[1], sizeClass: 'h-5 sm:h-6' }, // Amadeus
  { ...sponsorData[6], sizeClass: 'h-11 sm:h-12' }, // Debian
];

const SPONSOR_LOGOS_ROW_2 = [
  SPONSOR_LOGOS_ROW_1[3], // IBM
  SPONSOR_LOGOS_ROW_1[6], // Debian
  SPONSOR_LOGOS_ROW_1[5], // Amadeus
  SPONSOR_LOGOS_ROW_1[0], // Motorola Solutions
  SPONSOR_LOGOS_ROW_1[4], // NTT
  SPONSOR_LOGOS_ROW_1[2], // Red Hat
  SPONSOR_LOGOS_ROW_1[1], // SUSE
];

const SupportingOrganizationsSection = () => {
  const { withBaseUrl } = useBaseUrlUtils();

  const rows = [
    { id: 'row-1', logos: SPONSOR_LOGOS_ROW_1, animClass: 'animate-logo-marquee-left' },
    { id: 'row-2', logos: SPONSOR_LOGOS_ROW_2, animClass: 'animate-logo-marquee-right' },
  ];

  return (
    <section aria-label="Supporting Organizations" className="mx-auto my-14 max-w-6xl px-4 lg:my-20">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
        {/* Left Column: Heading & Subheading */}
        <header className="text-left lg:col-span-4">
          <h2 className="m-0 font-bold text-gray-900 dark:text-gray-50">Supporting Organizations</h2>
          <p className="mb-0 mt-3 leading-relaxed text-gray-700 dark:text-gray-100">
            Podman thrives thanks to the continuous contributions from leading open source organizations.
          </p>
        </header>

        {/* Right Column: 2-Row Moving Logo Marquee */}
        <div className="relative min-w-0 space-y-8 overflow-hidden py-2 sm:space-y-10 lg:col-span-8">
          {/* Soft Edge Fade Masks */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white to-transparent dark:from-[#1B1B1D] sm:w-16"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white to-transparent dark:from-[#1B1B1D] sm:w-16"
            aria-hidden="true"
          />

          {rows.map(row => (
            <div key={row.id} className={`${row.animClass} flex w-max items-center`}>
              {[0, 1].map(loopIdx => (
                <div
                  key={loopIdx}
                  aria-hidden={loopIdx === 1}
                  className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
                  {row.logos.map(sponsor => (
                    <a
                      key={`${row.id}-${loopIdx}-${sponsor.label}`}
                      href={sponsor.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={sponsor.label}
                      tabIndex={loopIdx === 1 ? -1 : undefined}
                      className="inline-flex shrink-0 items-center justify-center transition-transform duration-200 hover:scale-105">
                      <img
                        src={withBaseUrl(sponsor.src)}
                        alt={loopIdx === 0 ? sponsor.alt : ''}
                        loading="lazy"
                        decoding="async"
                        className={`${sponsor.sizeClass} w-auto object-contain brightness-0 dark:invert`}
                      />
                    </a>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* PAGE CONTENT */
function IndexPage() {
  return (
    <Layout>
      <HeroHeader {...header} />
      <WhyPodmanSection />
      <SupportingOrganizationsSection />
      <TestimonialSection />
      <BlogArticlesList
        limit={4}
        title="Latest Podman News"
        titleColor="text-purple-700 dark:text-white"
        containerLayout="grid"
      />
      <LiteratureCarousel />
    </Layout>
  );
}

export default IndexPage;
