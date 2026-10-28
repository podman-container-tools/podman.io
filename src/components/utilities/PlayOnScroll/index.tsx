import React, { useRef, useEffect } from 'react';

interface VideoProps {
  url: string;
  vidFormat?: string;
  styles?: string;
  posterImg?: string;
}

const PlayOnScroll: React.FC<VideoProps> = props => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Browser autoplay policy requires video to be muted
    video.muted = true;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                // Safely catch browser autoplay restrictions without throwing uncaught runtime errors
              });
            }
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div>
      <video className={props.styles} ref={videoRef} poster={props.posterImg} muted playsInline loop>
        <source src={props.url} type={props.vidFormat} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default PlayOnScroll;
