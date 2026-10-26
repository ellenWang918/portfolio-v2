import { useLayoutEffect, useRef } from 'react';

export function usePersonaColumns(enabled: boolean) {
  const layoutRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const layout = layoutRef.current;
    if (!enabled || !layout) return;
    const copy = layout.querySelector<HTMLDivElement>('.ism-define-copy');
    const image = layout.querySelector<HTMLImageElement>('.ism-persona-image');
    const caption = layout.querySelector<HTMLElement>('figcaption');
    if (!copy || !image || !caption) return;

    const desktop = window.matchMedia('(min-width: 1056px)');
    let frame = 0;
    let disposed = false;

    const measure = () => {
      frame = 0;
      if (disposed) return;
      if (!desktop.matches) {
        layout.classList.remove('is-stacked');
        layout.style.removeProperty('--persona-width');
        return;
      }

      const gap = 28;
      const width = layout.getBoundingClientRect().width;
      const maximumImageWidth = width - gap - 320;
      const ratio = (image.naturalWidth || image.width) / (image.naturalHeight || image.height);
      const captionStyle = getComputedStyle(caption);
      const captionHeight = caption.getBoundingClientRect().height
        + parseFloat(captionStyle.marginTop) + parseFloat(captionStyle.marginBottom);
      const measurement = copy.cloneNode(true) as HTMLDivElement;
      measurement.setAttribute('aria-hidden', 'true');
      measurement.inert = true;
      Object.assign(measurement.style, {
        position: 'absolute', visibility: 'hidden', pointerEvents: 'none',
        left: '0', top: '0', height: 'auto',
      });
      layout.append(measurement);

      let imageWidth = 0;
      let matched = false;
      try {
        // Changing the text width changes its height. Find the smallest image
        // width that fits that height, leaving exactly the requested gap.
        for (let i = 0; i < 24; i++) {
          measurement.style.width = `${width - gap - imageWidth}px`;
          const nextWidth = Math.max(0, measurement.getBoundingClientRect().height - captionHeight) * ratio;
          if (nextWidth > maximumImageWidth || nextWidth <= 0) break;
          if (Math.abs(nextWidth - imageWidth) < 0.1) {
            imageWidth = nextWidth;
            matched = true;
            break;
          }
          imageWidth = nextWidth;
        }
      } finally {
        measurement.remove();
      }

      layout.classList.toggle('is-stacked', !matched);
      if (matched) {
        const value = `${imageWidth.toFixed(3)}px`;
        if (layout.style.getPropertyValue('--persona-width') !== value) {
          layout.style.setProperty('--persona-width', value);
        }
      } else {
        layout.style.removeProperty('--persona-width');
      }
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };

    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(layout);
    observer.observe(copy);
    desktop.addEventListener('change', schedule);
    image.addEventListener('load', schedule);
    void document.fonts.ready.then(() => { if (!disposed) schedule(); });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      desktop.removeEventListener('change', schedule);
      image.removeEventListener('load', schedule);
    };
  }, [enabled]);

  return layoutRef;
}
