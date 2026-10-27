import { useLayoutEffect, useRef } from 'react';

type Point = { x: number; y: number };

export function useHangingLine() {
  const galleryRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const gallery = galleryRef.current;
    const canvas = gallery?.querySelector<HTMLCanvasElement>('.hanging-connector');
    const context = canvas?.getContext('2d');
    if (!gallery || !canvas || !context) return;

    let frame = 0;
    let animateUntil = 0;

    const draw = () => {
      const bounds = gallery.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const scale = window.devicePixelRatio || 1;
      const width = Math.round(bounds.width * scale), height = Math.round(bounds.height * scale);
      if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
      context.setTransform(scale, 0, 0, scale, 0, 0);
      context.clearRect(0, 0, bounds.width, bounds.height);
      context.strokeStyle = getComputedStyle(gallery).getPropertyValue('--hanging-line-colour').trim();
      context.lineWidth = 1;
      context.lineCap = 'round';

      const rows = [...gallery.querySelectorAll<HTMLDivElement>('.hanging-row')];
      const singleLine = rows[0] && getComputedStyle(rows[0]).display === 'contents';
      const groups = singleLine ? [gallery] : rows;

      for (const group of groups) {
        const clips = [...group.querySelectorAll<SVGSVGElement>('.hanging-clip')];
        const anchors = clips.map(clip => {
          const rect = clip.getBoundingClientRect();
          return { x: rect.left + rect.width / 2 - bounds.left, y: rect.top + rect.height / 2 - bounds.top };
        });
        if (!anchors.length) continue;
        const rowBounds = group.getBoundingClientRect();
        const first = anchors[0], last = anchors[anchors.length - 1];
        const points: Point[] = [
          { x: Math.max(0, rowBounds.left - bounds.left), y: Math.max(1, first.y - 3) },
          ...anchors,
          { x: Math.min(bounds.width, rowBounds.right - bounds.left), y: Math.max(1, last.y - 3) },
        ];
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        // Interpolate through the actual clip centres, including during their brief swing.
        for (let index = 0; index < points.length - 1; index++) {
          const previous = points[Math.max(0, index - 1)], start = points[index];
          const end = points[index + 1], next = points[Math.min(points.length - 1, index + 2)];
          context.bezierCurveTo(
            start.x + (end.x - previous.x) / 6, start.y + (end.y - previous.y) / 6,
            end.x - (next.x - start.x) / 6, end.y - (next.y - start.y) / 6,
            end.x, end.y,
          );
        }
        context.stroke();
      }
    };

    const render = () => {
      frame = 0;
      draw();
      if (performance.now() < animateUntil) frame = requestAnimationFrame(render);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(render); };
    const followSwing = () => { animateUntil = performance.now() + 2000; schedule(); };
    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(gallery);
    const themeObserver = new MutationObserver(schedule);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    gallery.addEventListener('animationstart', followSwing);
    gallery.addEventListener('animationend', schedule);
    gallery.addEventListener('animationcancel', schedule);
    window.addEventListener('resize', schedule);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) schedule();
    else followSwing();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      themeObserver.disconnect();
      gallery.removeEventListener('animationstart', followSwing);
      gallery.removeEventListener('animationend', schedule);
      gallery.removeEventListener('animationcancel', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return galleryRef;
}
