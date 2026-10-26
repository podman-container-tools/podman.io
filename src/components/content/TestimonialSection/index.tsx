import React from 'react';
import Testimonial from '@site/src/components/ui/Testimonial';
import SectionHeader from '@site/src/components/layout/SectionHeader';
import { testimonials } from '@site/static/data/testimonials';

// Quadruple the cards (16 items total) to form two identical 8-card halves (-50% animation loop)
const marqueeCards = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

function TestimonialSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-purple-100 to-blue-50/30 py-16 dark:from-[#1B1B1D] dark:via-purple-900/25 dark:to-[#1B1B1D] xl:py-24">
      {/* Left Side Vertical Gradient Blur Overlay */}
      <div
        aria-hidden="true"
        className="dark:via-purple-950/70 pointer-events-none absolute inset-y-0 left-0 z-20 w-16 bg-gradient-to-b from-white via-purple-100/90 to-blue-50/60 backdrop-blur-md dark:from-[#1B1B1D] dark:to-[#1B1B1D] sm:w-28 md:w-44 lg:w-60"
        style={{
          maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Right Side Vertical Gradient Blur Overlay */}
      <div
        aria-hidden="true"
        className="dark:via-purple-950/70 pointer-events-none absolute inset-y-0 right-0 z-20 w-16 bg-gradient-to-b from-white via-purple-100/90 to-blue-50/60 backdrop-blur-md dark:from-[#1B1B1D] dark:to-[#1B1B1D] sm:w-28 md:w-44 lg:w-60"
        style={{
          maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <SectionHeader
            title="What people are saying about Podman"
            textGradient={true}
            textGradientStops="from-blue-700 to-blue-500"
          />
        </div>

        {/* Continuous Smooth Marquee Wrapper */}
        <div
          className="testimonial-marquee-wrapper relative w-full overflow-hidden py-4"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 4%, black 96%, transparent 100%)',
          }}>
          <div className="testimonial-marquee-track flex gap-6">
            {marqueeCards.map((testimonial, index) => (
              <div key={index} className="w-[320px] shrink-0 sm:w-[380px]">
                <Testimonial {...testimonial} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
