import React from 'react';
import Layout from '@theme/Layout';
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

/* PAGE CONTENT */
function IndexPage() {
  return (
    <Layout>
      <HeroHeader {...header} />
      <FeatureSection />
      <WhyPodmanSection />
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
