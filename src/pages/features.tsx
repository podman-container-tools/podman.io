import React from 'react';
import Layout from '@theme/Layout';
/* COMPONENTS */
import Markdown from '@site/src/components/utilities/Markdown';
import PageHeader from '@site/src/components/layout/PageHeader';
import SectionHeader from '@site/src/components/layout/SectionHeader';
import LiteratureCarousel from '@site/src/components/content/LiteratureCarousel';
import FeaturesCarousel from '@site/src/components/content/FeaturesCarousel';
import BlogArticlesList from '@site/src/components/content/BlogArticlesList';
/* PAGE DATA */
import { header, knowPodman, learnMore } from '@site/static/data/features';
import PlayOnScroll from '@site/src/components/utilities/PlayOnScroll';
import BasicResourcesBox from '@site/src/components/content/BasicResourcesBox';

/* PAGE COMPONENTS */
function GetToKnowPodmanSection() {
  return (
    <section className="mb-12 mt-4 lg:mb-16 lg:mt-8">
      <SectionHeader
        title={knowPodman.title}
        textColor="text-blue-700 dark:text-blue-500"
        fontWeight="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
        layout="mb-4 sm:mb-6 lg:mb-8"
      />
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 md:grid-cols-3 lg:mt-12 lg:gap-8">
          {knowPodman.cards.map((card, index) => {
            return (
              <article
                key={index}
                className="group flex h-full flex-col overflow-hidden rounded-xl border border-purple-100/60 bg-white p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:border-white/10 dark:bg-[#232326] dark:shadow-none dark:hover:border-white/20 sm:p-7">
                {/* Graphic Container */}
                <div className="relative mb-4 flex h-44 w-full items-center justify-center sm:h-48">
                  <img
                    src={card.image.path}
                    alt={card.image.alt}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-start">
                  <h3 className="mb-3 whitespace-nowrap text-center text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-[#892CA0] dark:text-white dark:group-hover:text-purple-300 sm:text-lg lg:text-xl">
                    {card.title}
                  </h3>
                  <Markdown
                    text={card.description}
                    styles="w-full text-justify [text-justify:inter-word] text-base leading-relaxed text-gray-600 dark:text-gray-300 [&_p]:!text-[15px] sm:[&_p]:!text-base lg:[&_p]:!text-base [&_p]:!leading-relaxed [&_p]:!text-justify [&_p]:[text-justify:inter-word] [&_p]:!m-0 [&_a]:!text-[15px] sm:[&_a]:!text-base lg:[&_a]:!text-base [&_a]:!leading-relaxed [&_a]:!font-medium [&_a]:!text-[#892CA0] [&_a]:!underline [&_a]:!underline-offset-4 hover:[&_a]:!text-[#77218d] dark:[&_a]:!text-purple-400 dark:hover:[&_a]:!text-purple-300"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const PodmanDesktopSection = () => {
  return (
    <section className="py-12 sm:py-16">
      <SectionHeader
        title="Podman Desktop"
        textColor="text-blue-700 dark:text-blue-500"
        fontWeight="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
        layout="mb-4 sm:mb-6 lg:mb-8"
      />
      <div className="mx-auto mt-6 max-w-5xl px-4 sm:mt-8 sm:px-6 lg:mt-12 lg:px-8">
        <div className="rounded-2xl border border-purple-100/80 bg-purple-100/40 p-6 shadow-sm transition-all duration-300 dark:border-white/10 dark:bg-[#232326] sm:p-8 md:p-10">
          <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-10">
            <a
              href="https://podman-desktop.io"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 transition-transform duration-200 hover:scale-105">
              <img
                src="logos/optimized/podman-desktop-logo-200w-198h.webp"
                alt="Podman Desktop Logo"
                className="h-28 w-28 object-contain sm:h-36 sm:w-36"
              />
            </a>
            <p className="text-gray-800 text-center text-lg leading-relaxed dark:text-gray-100 sm:text-xl md:text-left">
              <a
                href="https://podman-desktop.io"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#892CA0] underline underline-offset-4 transition-colors hover:text-[#77218d] dark:text-purple-300 dark:hover:text-purple-100">
                Podman Desktop
              </a>{' '}
              is Podman's graphical application that makes it easy to install and work with Podman (and other container
              engines) on Windows, macOS, and Linux.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const ManageContainersUISection = () => {
  return (
    <section className="bg-gradient-to-b from-purple-100 to-purple-300 dark:from-black dark:to-gray-900 xl:flex xl:flex-row-reverse xl:py-16">
      <div className="w-full flex-1 md:mx-auto md:my-16 md:w-4/5 lg:w-full xl:my-16">
        <PlayOnScroll
          vidFormat="video/mp4"
          url="video/ui/containers.mp4"
          posterImg="images/optimized/ui-screens/ui-manage-containers.webp"
          styles="rounded-lg w-full lg:w-3/4 lg:mx-auto xl:mr-0 xl:w-full max-w-[1200px] items-center md:rounded-3xl bg-cover md:bg-contain xl:rounded-r-none"
        />
      </div>
      <div className="my-12 flex flex-1 items-center md:my-0">
        <div className="flex flex-col justify-center px-8 md:mx-auto md:w-4/5 lg:px-12 xl:p-16">
          <h3 className="mb-6 text-3xl font-extrabold tracking-tight text-purple-900 dark:text-purple-300 sm:text-4xl lg:text-5xl">
            Manage containers (not just Podman.)
          </h3>
          <p className="text-gray-800 mb-4 text-justify text-lg leading-relaxed [text-justify:inter-word] dark:text-gray-100 sm:text-xl">
            Podman Desktop allows you to list, view, and manage containers from multiple supported container engines* in
            a single unified view.
          </p>
          <p className="text-gray-800 mb-4 text-justify text-lg leading-relaxed [text-justify:inter-word] dark:text-gray-100 sm:text-xl">
            Gain easy access to a shell inside the container, logs, and basic controls.
          </p>
          <em className="mt-8 block text-justify text-sm not-italic leading-normal text-gray-700 [text-justify:inter-word] dark:text-gray-300 sm:text-base">
            * Supported engines and orchestrators include Podman, Docker, Lima, kind, Red Hat OpenShift, Red Hat
            OpenShift Developer Sandbox.
          </em>
        </div>
      </div>
    </section>
  );
};

const BuildImagesUISection = () => {
  return (
    <section className="bg-gradient-to-b from-purple-100 to-purple-300 dark:from-black dark:to-gray-900 xl:flex xl:flex-row xl:py-16 xl:dark:from-gray-900 xl:dark:to-black">
      <div className="w-full flex-1 md:mx-auto md:my-16 md:w-4/5 lg:w-full xl:my-16">
        <PlayOnScroll
          vidFormat="video/mp4"
          url="video/ui/images.mp4"
          posterImg="images/optimized/ui-screens/ui-buildimage.webp"
          styles="rounded-lg w-full lg:w-3/4 lg:mx-auto xl:ml-0 xl:w-full max-w-[1200px] items-center md:rounded-3xl bg-cover md:bg-contain xl:rounded-l-none"
        />
      </div>
      <div className="my-12 flex flex-1 items-center md:my-0">
        <div className="flex flex-col justify-center px-8 md:mx-auto md:w-4/5 lg:px-12 xl:p-16">
          <h3 className="mb-6 text-3xl font-extrabold tracking-tight text-purple-900 dark:text-purple-300 sm:text-4xl lg:text-5xl">
            Build, pull, and push images.
          </h3>
          <p className="text-gray-800 mb-4 text-justify text-lg leading-relaxed [text-justify:inter-word] dark:text-gray-100 sm:text-xl">
            Build containers from a Dockerfile / Containerfile, or pull images from remote repositories to run.
          </p>
          <p className="text-gray-800 mb-4 text-justify text-lg leading-relaxed [text-justify:inter-word] dark:text-gray-100 sm:text-xl">
            Manage accounts for and push your images to multiple container registries.
          </p>
        </div>
      </div>
    </section>
  );
};

const CreatePodsUISection = () => {
  return (
    <section className="bg-gradient-to-b from-purple-100 to-purple-300 dark:from-black dark:to-gray-900 xl:flex xl:flex-row-reverse xl:py-16">
      <div className="w-full flex-1 md:mx-auto md:my-16 md:w-4/5 lg:w-full xl:my-16">
        <PlayOnScroll
          vidFormat="video/mp4"
          url="video/ui/podify.mp4"
          posterImg="images/optimized/ui-screens/ui-podify.webp"
          styles="rounded-lg w-full lg:w-3/4 lg:mx-auto xl:mr-0 xl:w-full max-w-[1200px] items-center md:rounded-3xl bg-cover md:bg-contain xl:rounded-r-none"
        />
      </div>
      <div className="my-12 flex flex-1 items-center md:my-0">
        <div className="flex flex-col justify-center px-8 md:mx-auto md:w-4/5 lg:px-12 xl:p-16">
          <h3 className="mb-6 text-3xl font-extrabold tracking-tight text-purple-900 dark:text-purple-300 sm:text-4xl lg:text-5xl">
            Podify containers into pods.
          </h3>
          <p className="text-gray-800 mb-4 text-justify text-lg leading-relaxed [text-justify:inter-word] dark:text-gray-100 sm:text-xl">
            Create pods by selecting containers to run together. View unified logs for your pods and inspect the
            containers inside each.
          </p>
          <p className="text-gray-800 mb-4 text-justify text-lg leading-relaxed [text-justify:inter-word] dark:text-gray-100 sm:text-xl">
            Play Kubernetes YAML locally, without Kubernetes, and generate Kubernetes YAML from Pods.
          </p>
        </div>
      </div>
    </section>
  );
};

const DeployToKubernetesUISection = () => {
  return (
    <section className="bg-gradient-to-b from-purple-100 to-purple-300 dark:from-black dark:to-gray-900 md:pb-32 xl:flex xl:flex-row xl:py-16 xl:dark:from-gray-900 xl:dark:to-black">
      <div className="w-full flex-1 md:mx-auto md:my-16 md:w-4/5 lg:w-full xl:my-16">
        <PlayOnScroll
          vidFormat="video/mp4"
          url="video/ui/kubernetes.mp4"
          posterImg="images/optimized/ui-screens/ui-k8sdeploy.webp"
          styles="rounded-lg w-full lg:w-3/4 lg:mx-auto xl:ml-0 xl:w-full max-w-[1200px] items-center md:rounded-3xl bg-cover md:bg-contain xl:rounded-l-none"
        />
      </div>
      <div className="my-12 flex flex-1 items-center md:my-0">
        <div className="flex flex-col justify-center px-8 md:mx-auto md:w-4/5 lg:px-12 xl:p-16">
          <h3 className="mb-6 text-3xl font-extrabold tracking-tight text-purple-900 dark:text-purple-300 sm:text-4xl lg:text-5xl">
            Deploy to Kubernetes.
          </h3>
          <p className="text-gray-800 mb-4 text-justify text-lg leading-relaxed [text-justify:inter-word] dark:text-gray-100 sm:text-xl">
            Deploy pods from Podman Desktop to local or remote Kubernetes contexts using automatically-generated YAML
            config.
          </p>
        </div>
      </div>
    </section>
  );
};

const PodmanCLISection = () => {
  return (
    <section className="py-12 sm:py-16">
      <SectionHeader
        title="Podman Command-Line"
        textColor="text-blue-700 dark:text-blue-500"
        fontWeight="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
        layout="mb-4 sm:mb-6 lg:mb-8"
        description="Find, run, build, and share containers with a familiar, daemonless CLI — no background daemon required."
      />
      <div className="mt-6 sm:mt-8 lg:mt-12">
        <FeaturesCarousel />
      </div>
    </section>
  );
};

const LearnMoreSection = () => {
  return (
    <section className="my-12 xl:my-20">
      <SectionHeader
        title={learnMore.title}
        textColor="text-purple-700 dark:text-purple-400"
        fontWeight="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight"
        layout="mb-4 sm:mb-6 lg:mb-8"
      />
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mt-6 grid grid-cols-1 items-stretch gap-10 sm:mt-8 lg:mt-12 lg:grid-cols-2 lg:gap-8 xl:gap-12">
          <div className="mx-auto flex w-full max-w-xl flex-col">
            <BlogArticlesList
              limit={2}
              displayCount={2}
              altLayout
              title={learnMore.blogPosts.title}
              titleColor="text-blue-700 dark:text-blue-500"
              showFooter
              footerText="Check out more posts about Podman"
              containerLayout="vertical"
              sectionClassName="flex w-full flex-1 flex-col justify-between"
            />
          </div>
          <div className="mx-auto flex w-full max-w-xl flex-col">
            <BasicResourcesBox />
          </div>
        </div>
      </div>
    </section>
  );
};

function Features() {
  return (
    <Layout>
      <PageHeader title={header.title} description={header.subtitle} />
      <GetToKnowPodmanSection />
      <PodmanDesktopSection />
      <ManageContainersUISection />
      <BuildImagesUISection />
      <CreatePodsUISection />
      <DeployToKubernetesUISection />
      <PodmanCLISection />
      <LearnMoreSection />
      <LiteratureCarousel />
    </Layout>
  );
}

export default Features;
