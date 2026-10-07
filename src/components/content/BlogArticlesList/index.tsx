import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
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
  altLayout = false,
  title = 'Latest Articles',
  titleColor = 'text-blue-700',
  showFooter = false,
  footerText = '',
  sectionClassName = '',
}) => {
  const { data, loading } = useBlogPosts(limit);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading || !data || data.length === 0) {
    return null;
  }

  const maxIndex = Math.max(0, data.length - itemsPerPage);
  const showLeftArrow = currentIndex > 0;
  const showRightArrow = currentIndex < maxIndex;

  const prevSlide = () => {
    if (showLeftArrow) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const nextSlide = () => {
    if (showRightArrow) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <section className={sectionClassName || 'my-12 overflow-hidden xl:my-20'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="mb-6">
          <SectionHeader title={title} textColor={titleColor} />
        </div>

        {/* Carousel Wrapper - Arrows safely inset inside screen padding */}
        <div className="relative mx-auto w-full max-w-7xl px-11 sm:px-14 md:px-16">
          {/* Left Side Arrow Button */}
          {showLeftArrow && (
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous articles"
              title="Previous"
              style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
              className="absolute left-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#892CA0] text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-[#77218d] active:scale-95 sm:left-1 sm:h-11 sm:w-11 md:left-2">
              <Icon icon="material-symbols:arrow-back-rounded" className="text-xl text-white sm:text-2xl" />
            </button>
          )}

          {/* Right Side Arrow Button */}
          {showRightArrow && (
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next articles"
              title="Next"
              style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
              className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#892CA0] text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-[#77218d] active:scale-95 sm:right-1 sm:h-11 sm:w-11 md:right-2">
              <Icon icon="material-symbols:arrow-forward-rounded" className="text-xl text-white sm:text-2xl" />
            </button>
          )}

          {/* Smooth Sliding Track Container with Outer Edge Blend Masks */}
          <div className="relative -mx-3 overflow-hidden px-3 py-6 sm:py-8">
            {/* Left Side Dissolve Gradient Mask */}
            {showLeftArrow && (
              <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-3 bg-gradient-to-r from-white to-transparent dark:from-[#1b1b1d] dark:to-transparent sm:w-4" />
            )}

            {/* Right Side Dissolve Gradient Mask */}
            {showRightArrow && (
              <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-3 bg-gradient-to-l from-white to-transparent dark:from-[#1b1b1d] dark:to-transparent sm:w-4" />
            )}
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              }}>
              {data.map((card, index) => (
                <div key={card.id} className="w-full shrink-0 px-2 sm:px-3 md:w-1/2 lg:w-1/3">
                  <ArticleCard
                    title={card.title.rendered}
                    author_link={card.author_info.author_link}
                    display_name={card.author_info.display_name}
                    subtitle={card.excerpt.rendered}
                    date={card.date || card.wbDate}
                    imgSrc={card.jetpack_featured_media_url}
                    path={card.link}
                    altLayout={altLayout}
                    index={index}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showFooter && footerText && (
        <p className="mt-8 text-center">
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
