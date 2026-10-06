import React from 'react';
import SectionHeader from '@site/src/components/layout/SectionHeader';
import ArticleCard from '@site/src/components/ui/ArticleCard';
import { useBlogPosts } from '@site/src/hooks/useBlogPosts';

interface BlogArticlesListProps {
  limit?: number;
  displayCount?: number;
  altLayout?: boolean;
  title?: string;
  titleColor?: string;
  showFooter?: boolean;
  footerText?: string;
  containerLayout?: 'vertical' | 'grid';
  sectionClassName?: string;
}

const BlogArticlesList: React.FC<BlogArticlesListProps> = ({
  limit = 4,
  displayCount,
  altLayout = false,
  title = 'Latest Articles',
  titleColor = 'text-blue-700',
  showFooter = false,
  footerText = '',
  containerLayout = 'grid',
  sectionClassName = '',
}) => {
  const { data, loading, error } = useBlogPosts(limit);
  const actualDisplayCount = displayCount ?? limit;

  if (loading) {
    return null;
  }

  if (error) {
    return (
      <section className={sectionClassName}>
        <SectionHeader title={title} textColor={titleColor} />
        <div className="my-8 flex justify-center text-center">
          <p className="font-medium text-gray-600 dark:text-gray-400">
            Failed to load the latest blog posts. Please check back later.
          </p>
        </div>
      </section>
    );
  }

  const containerClasses =
    containerLayout === 'vertical' ? 'flex flex-col gap-4' : 'flex flex-wrap justify-center gap-4';

  return (
    <section className={sectionClassName}>
      <SectionHeader title={title} textColor={titleColor} />
      <div className={containerClasses}>
        {data.slice(0, actualDisplayCount).map((card, index) => (
          <ArticleCard
            key={card.id}
            title={card.title.rendered}
            author_link={card.author_info.author_link}
            display_name={card.author_info.display_name}
            subtitle={card.excerpt.rendered}
            date={card.wbDate}
            imgSrc={card.jetpack_featured_media_url}
            path={card.link}
            altLayout={altLayout}
            index={index}
          />
        ))}
      </div>
      {showFooter && footerText && (
        <p className="ml-2l text-center 2xl:text-start">
          {footerText}{' '}
          <a
            href="https://blog.podman.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 transition duration-150 ease-linear hover:text-purple-700 dark:hover:text-purple-500">
            on our Blog!
          </a>
        </p>
      )}
    </section>
  );
};

export default BlogArticlesList;
