import React from 'react';
import Layout from '@theme/Layout';
import { useBaseUrlUtils } from '@docusaurus/useBaseUrl';
/* COMPONENTS */
import Markdown from '@site/src/components/utilities/Markdown';
import HeroHeader from '@site/src/components/layout/HeroHeader';
import SectionHeader from '@site/src/components/layout/SectionHeader';
import ThumbCard from '@site/src/components/ui/ThumbCard';
import LiteratureCarousel from '@site/src/components/content/LiteratureCarousel';
import TestimonialSection from '@site/src/components/content/TestimonialSection';
import BlogArticlesList from '@site/src/components/content/BlogArticlesList';
import WhyPodmanSection from '@site/src/components/content/WhyPodmanSection';
import { Icon } from '@iconify/react';
/* PAGE DATA */
import { header, featureList, compatibleTools } from '@site/static/data/home';
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

/* PAGE COMPONENTS */
const FeatureItem = ({ title, icon, description }: { title: string; icon?: string; description: string }) => {
  return (
    <div className="group relative flex h-full flex-col justify-start rounded-md border border-black/[0.08] bg-white p-7 text-left shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] dark:border-white/[0.08] dark:bg-[#242328] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] sm:p-8">
      {/* Header: Layered Glassmorphism Icon + Title */}
      <div className="mb-4 flex items-center gap-4">
        <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
          <span
            className="absolute -bottom-1.5 -right-1 h-11 w-11 rounded bg-blue-700 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5 dark:bg-blue-700"
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded bg-white/35 text-white shadow-[0_6px_18px_rgba(0,0,0,0.08)] backdrop-blur-md transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 dark:bg-white/[0.1] dark:text-white">
            <Icon icon={icon || 'lucide:check'} className="h-6 w-6" />
          </div>
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h3>
      </div>

      {/* Body description */}
      <Markdown
        text={description}
        styles="w-full text-justify text-sm sm:text-base leading-relaxed text-gray-600 dark:text-gray-300 [&_a]:font-semibold [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-blue-900 dark:[&_a]:text-blue-500 dark:hover:[&_a]:text-blue-300"
      />
    </div>
  );
};

const FeatureSection = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <SectionHeader
          title="Built for safer, lighter containers"
          description="Everything you need to build, run, and manage OCI containers without a privileged background daemon."
          fontWeight="font-bold"
          textColor="text-gray-900 dark:text-gray-50"
        />
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {featureList.map(feature => {
            return (
              <FeatureItem
                key={feature.id}
                title={feature.title}
                icon={feature.icon}
                description={feature.description}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

const CompatibleToolSection = () => {
  return (
    <section className="mx-auto my-8 max-w-6xl px-4">
      <SectionHeader
        title={compatibleTools.title}
        description="Plug Podman straight into the editors, CI pipelines, and local Kubernetes workflows your team already uses."
        fontWeight="font-bold"
        textColor="text-gray-900 dark:text-gray-50"
      />
      <div className="mt-6 grid grid-cols-1 divide-y divide-black/[0.08] overflow-hidden rounded-md border border-black/[0.08] bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.05)] dark:divide-white/[0.08] dark:border-white/[0.08] dark:bg-[#242328] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
        {compatibleTools.tools.map(tool => {
          return (
            <ThumbCard
              key={tool.title}
              title={tool.title}
              subtitle={tool.description}
              image={tool.image}
              icon={tool.icon}
              iconClassName={tool.iconClassName}
            />
          );
        })}
      </div>
    </section>
  );
};

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
      <FeatureSection />
      <WhyPodmanSection />
      <SupportingOrganizationsSection />
      <CompatibleToolSection />
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
