import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import SectionHeader from '@site/src/components/layout/SectionHeader';
import { literature } from '@site/static/data/literature';

function LiteratureCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Randomize initial book on page load
  useEffect(() => {
    setActiveIndex(Math.floor(Math.random() * literature.length));
  }, []);

  // Auto-advance every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev < literature.length - 1 ? prev + 1 : 0));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="container my-12 xl:my-20">
      <SectionHeader
        title="Learn Podman with books & guides"
        description="Explore free e-books, hands-on DevOps guides and resources by Podman maintainers and experts."
        fontWeight="font-bold"
        textColor="text-blue-700 dark:text-blue-500"
      />

      {/* Smooth Horizontal Sliding Track */}
      <div className="mx-auto mt-10 max-w-6xl overflow-hidden py-6">
        <div
          className="flex items-center transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
          {literature.map(book => (
            <div key={book.id} className="w-full shrink-0 px-4">
              <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-6 lg:flex-row lg:items-start lg:gap-8">
                <div
                  className={`flex min-w-0 max-w-full flex-col items-center justify-center gap-6 lg:flex-row lg:items-start lg:gap-0 ${book.extraImages ? 'flex-1' : ''}`}>
                  {/* Book Cover Image (visible on mobile, tablet & desktop) */}
                  {book.coverImage && (
                    <div className="order-first shrink-0 lg:mr-12 xl:mr-16">
                      <img
                        src={book.coverImage.src}
                        alt={book.coverImage.alt}
                        loading="lazy"
                        decoding="async"
                        className={
                          book.id === 'container-commandos'
                            ? 'block max-h-48 w-auto max-w-[170px] origin-bottom-left rotate-[4deg] object-contain sm:max-h-56 sm:max-w-[190px] lg:max-h-64 lg:max-w-[200px]'
                            : 'block h-56 w-auto origin-bottom-left rotate-[4deg] object-contain sm:h-64 lg:-mt-5 lg:h-[350px]'
                        }
                      />
                    </div>
                  )}

                  {/* Text Content */}
                  <div className="mx-2 min-w-0 max-w-lg flex-1 flex-col items-center text-center sm:mx-4 lg:mx-0 lg:items-start lg:text-start">
                    <h3 className="mb-3 mt-0 p-0 text-xl font-bold tracking-tight text-purple-700 dark:!text-white sm:text-2xl">
                      {book.title}
                    </h3>
                    <p className="mb-5 max-w-prose text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-[15px] lg:mb-7">
                      {book.description}
                    </p>
                    <a
                      href={book.button.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 rounded-md bg-purple-700 px-5 py-2.5 text-sm font-semibold !text-white !no-underline shadow-sm transition-colors duration-200 hover:bg-purple-900 hover:!text-white hover:!no-underline dark:bg-purple-700 dark:hover:bg-purple-500">
                      <span>{book.button.text}</span>
                      <Icon
                        icon={
                          book.button.text.toLowerCase().includes('download')
                            ? 'material-symbols:download-rounded'
                            : 'material-symbols:arrow-forward-rounded'
                        }
                        className="text-base"
                      />
                    </a>
                  </div>
                </div>

                {/* Extra Images (like coloring pages collage) */}
                {book.extraImages && (
                  <div className="order-first mx-auto hidden lg:order-last lg:block xl:mx-0">
                    <img
                      src={book.extraImages.src}
                      alt={book.extraImages.alt}
                      loading="lazy"
                      decoding="async"
                      className="max-w-[290px]"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="mt-2 flex justify-center gap-2">
        {literature.map((_, index) => (
          <button
            type="button"
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'w-8 bg-purple-700 dark:bg-purple-500'
                : 'bg-gray-300 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-500'
            }`}
            aria-label={`Go to book ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default LiteratureCarousel;
