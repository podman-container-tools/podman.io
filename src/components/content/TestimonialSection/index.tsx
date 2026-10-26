import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Testimonial from '@site/src/components/ui/Testimonial';
import SectionHeader from '@site/src/components/layout/SectionHeader';
import { testimonials } from '@site/static/data/testimonials';

function TestimonialSection() {
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

  const maxIndex = Math.max(0, testimonials.length - itemsPerPage);

  useEffect(() => {
    setCurrentIndex(i => Math.min(i, maxIndex));
  }, [maxIndex]);

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
    <section className="overflow-hidden bg-gradient-to-b from-white via-purple-100 to-white py-16 dark:from-[#1B1B1D] dark:via-purple-900/25 dark:to-[#1B1B1D] xl:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <SectionHeader
            title="What people are saying about Podman"
            textGradient={true}
            textGradientStops="from-blue-700 to-blue-500"
          />
        </div>

        {/* Carousel Wrapper */}
        <div className="relative mx-auto w-full max-w-7xl px-11 sm:px-14 md:px-16">
          {/* Left Side Arrow Button */}
          {showLeftArrow && (
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous testimonials"
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
              aria-label="Next testimonials"
              title="Next"
              style={{ backgroundColor: '#892CA0', color: '#ffffff' }}
              className="absolute right-0 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#892CA0] text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-[#77218d] active:scale-95 sm:right-1 sm:h-11 sm:w-11 md:right-2">
              <Icon icon="material-symbols:arrow-forward-rounded" className="text-xl text-white sm:text-2xl" />
            </button>
          )}

          {/* Carousel Track Container */}
          <div className="relative overflow-hidden py-6 sm:py-8">
            <div
              className="flex items-stretch transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="flex w-full shrink-0 px-2 sm:px-3 md:w-1/2 lg:w-1/3">
                  <Testimonial {...testimonial} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
