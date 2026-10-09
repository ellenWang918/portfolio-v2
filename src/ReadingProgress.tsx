import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

export function ReadingProgress({ articleRef }: { articleRef: RefObject<HTMLElement | null> }) {
  const barRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const article = articleRef.current;
    if (!article) return;
    let frame = 0;

    const updateProgress = () => {
      frame = 0;
      const { top, bottom, height } = article.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const progress = bottom <= viewportHeight ? 1
        : Math.max(0, Math.min(1, -top / Math.max(1, height - viewportHeight)));

      if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`;
      barRef.current?.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
    };
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(updateProgress);
    };

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(article);
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('pageshow', scheduleUpdate);
    updateProgress();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('pageshow', scheduleUpdate);
    };
  }, [articleRef]);

  return <div className="reading-progress container">
    <div ref={barRef} className="reading-progress-track" role="progressbar"
      aria-label="Case study reading progress" aria-controls="case-article"
      aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
      <span ref={fillRef} className="reading-progress-fill" />
    </div>
  </div>;
}
