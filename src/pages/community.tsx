import React from 'react';
import Layout from '@theme/Layout';
import { Icon } from '@iconify/react';
/* COMPONENTS */
import Markdown from '@site/src//components/utilities/Markdown';
import PageHeader from '@site/src/components/layout/PageHeader';
import SectionHeader from '@site/src/components/layout/SectionHeader';
import ThankYouSection from '@site/src/components/content/ThankYouSection';
import CommunityMeetingsCardGrid from '@site/src/components/layout/CommunityMeetingsCardGrid';
import SmallCard from '@site/src/components/ui/SmallCard';
import DateTimeBox from '@site/src/components/content/DateTimeBox';
import InfoBox from '@site/src/components/ui/InfoBox';
import InfoBanner from '@site/src/components/ui/InfoBanner';
import IconLink from '@site/src/components/utilities/IconLink';
import Button from '@site/src/components/utilities/Button';
import DropdownButton from '@site/src/components/utilities/DropdownButton';
import WaveBorder from '@site/src/components/shapes/WaveBorder';
/* PAGE DATA */
import { header, communityChat, communityMeetings, mailingList, submittingIssues } from '@site/static/data/community';

/* PAGE COMPONENTS */
const CommunityLinks = () => {
  const links = communityChat.links.map(x => x);
  return (
    <ul className="mb-12 flex flex-wrap items-end justify-around gap-8 lg:gap-16">
      {links.map((link, index) => {
        return (
          <li key={index}>
            <IconLink {...link} />
          </li>
        );
      })}
    </ul>
  );
};

const CommunityChatSection = (): JSX.Element => {
  return (
    <section className="bg-gray-50 dark:bg-gradient-to-t dark:from-gray-700 dark:via-gray-900 dark:to-gray-900">
      <SectionHeader textGradient={true} title={communityChat.title} />
      <div className="mx-4 mt-8 flex flex-wrap justify-around gap-4 sm:mx-8 lg:mx-auto lg:mt-16 lg:max-w-6xl">
        <div className="">
          <p className="max-w-sm text-center text-gray-700 md:max-w-md md:text-start lg:max-w-xl">
            {communityChat.subtitle}
          </p>
        </div>
        <DateTimeBox />
      </div>
      <div className="container pt-12 lg:pt-20">
        <CommunityLinks />
      </div>
      <WaveBorder />
    </section>
  );
};

const CommunityMeetingSection = (): JSX.Element => {
  return (
    <section className="bg-white pb-8 dark:bg-gray-900">
      <div className="container flex flex-col">
        <SectionHeader
          title={communityMeetings.title}
          description={communityMeetings.subtitle}
          textGradientStops="from-purple-500 to-purple-700 dark:text-purple-500"
          textGradient={true}
        />
        <CommunityMeetingsCardGrid cards={communityMeetings.cards} />
      </div>
    </section>
  );
};

const MailingListSection = (): JSX.Element => {
  return (
    <section id="mailing-list">
      <div className="container grid gap-4 lg:grid-cols-2">
        <SectionHeader
          title={mailingList.title}
          description={mailingList.subtitle}
          layout="col-span-full"
          textColor="dark:text-blue-700"
        />
        <section className="container mb-8">
          <h3 className="mb-2 font-medium text-purple-700 dark:text-purple-500">{mailingList.browseInfo.title}</h3>
          <Markdown text={mailingList.browseInfo.subtitle} styles="max-w-prose" />
        </section>
        <section className="container mb-8">
          <h3 className="mb-2 font-medium text-purple-700 dark:text-purple-500">{mailingList.subscribeInfo.title}</h3>
          <Markdown text={mailingList.subscribeInfo.subtitle} styles="max-w-prose " />
          <div className="flex flex-wrap gap-6">
            {mailingList.subscribeInfo.options.map((card, index) => {
              return <SmallCard {...card} key={index} />;
            })}
          </div>
          <div className="my-4 max-w-prose">
            <Markdown text={mailingList.subscribeInfo.description} />
          </div>
        </section>
        <section className="mb-8 lg:col-start-2 lg:row-span-2 lg:row-start-2">
          <div>
            <img
              src={mailingList.extraInfo.image.path}
              alt={mailingList.extraInfo.image.alt}
              className="w-full object-cover"
            />
          </div>
          <div className="ml-8 xl:ml-10">
            <InfoBox title={mailingList.extraInfo.note.title} text={mailingList.extraInfo.note.text} />
          </div>
        </section>
      </div>
    </section>
  );
};

const DropdownContent = (props): JSX.Element => {
  return (
    <div className="rounded-md p-4 shadow-md">
      <ul>
        {props.map((link, index) => {
          return (
            <li
              key={index}
              className="my-2 rounded-md px-2 transition duration-150 ease-linear hover:bg-purple-700 hover:text-white">
              <a href={link.path} className="w-full hover:text-white hover:no-underline">
                {link.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const IssuesSection = () => {
  return (
    <section className="max-w-lg rounded-md bg-white px-10 pt-10 shadow-lg dark:bg-gray-900">
      <header className="mb-10">
        <h3 className="mb-4 text-center text-blue-700 dark:text-blue-500">{submittingIssues[1].title}</h3>
        <div className="bg-blue-100/25 px-3 py-2">
          <p className="flex items-center gap-2 rounded-md">
            <Icon icon="fa-solid:exclamation-circle" className="text-purple-700" />
            <span>{submittingIssues[1].subtitle}</span>
          </p>
        </div>
      </header>
      <div>
        {submittingIssues[1].sections.map((section, index) => {
          return (
            <div key={index} className="mb-12">
              <Markdown text={section.text} />
              <ul className="mb-8 ml-5 mt-4 list-disc">
                {section.checkList.map((item, index) => {
                  return <li key={index}>{item}</li>;
                })}
              </ul>
              <DropdownButton text={section.button.text} option={DropdownContent(section.button.links)} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

const PullRequestSection = () => {
  return (
    <section className="max-w-lg rounded-md bg-white p-10 shadow-lg dark:bg-gray-900">
      <header className="mx-auto mb-10">
        <h3 className="mb-3 text-center text-blue-700 dark:text-blue-500">{submittingIssues[2].title}</h3>
        <Markdown text={submittingIssues[2].subtitle} />
      </header>
      <div>
        {submittingIssues[2].description.map((paragraph, index) => {
          return (
            <p key={index} className="my-3">
              {paragraph}
            </p>
          );
        })}
        <ul className="my-4 ml-5 list-disc">
          {submittingIssues[2].checkList.map((item, index) => {
            return <li key={index}>{item}</li>;
          })}
        </ul>
        <Button as="link" outline={true} text={submittingIssues[2].button.text} path={submittingIssues[2].button.path} />
      </div>
    </section>
  );
};

const SubmitIssuesSection = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <SectionHeader
        title={submittingIssues[0].title}
        description={submittingIssues[0].subtitle}
        textGradientStops="from-purple-500 to-purple-700 dark:text-blue-700"
        textGradient={true}
      />
      <div className="mx-auto mb-20 mt-16 flex flex-wrap justify-center gap-20 px-8 lg:container">
        <IssuesSection />
        <PullRequestSection />
      </div>
    </section>
  );
};

/* PAGE CONTENT */
function Community() {
  return (
    <Layout>
      <PageHeader title={header.title} description={header.subtitle} />
      <InfoBanner
        description={header.banner.text}
        icon={header.banner.icon}
        styles="bg-purple-500 dark:bg-purple-700 text-white"
      />
      <CommunityChatSection />
      <CommunityMeetingSection />
      <InfoBanner
        description="**Searching for Podman Desktop Community Meetings?** [Click Here](https://podman-desktop.io/community#community-events) or visit the [official website](https://podman-desktop.io) to learn more."
        image={{
          src: 'logos/optimized/podman-desktop-logo-200w-198h.webp',
          alt: 'Podman Desktop Logo',
        }}
        styles="bg-purple-700 dark:bg-purple-900 text-white [&_img]:w-16 [&_img]:h-16  [&_a]:underline [&_a:hover]:text-purple-300"
        marginHeight="mt-8 lg:mt-16"
      />
      <MailingListSection />
      <SubmitIssuesSection />
      <ThankYouSection />
    </Layout>
  );
}

export default Community;
