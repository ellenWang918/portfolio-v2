import { useLayoutEffect, useRef, useState } from 'react';
import type { FocusEvent, PointerEvent } from 'react';
type PillPosition = { left: number; right: number; leftVelocity: number; rightVelocity: number };

export function useLiquidPill<T extends HTMLElement>(activeItem: string) {
  const containerRef = useRef<T>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const positionRef = useRef<PillPosition | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);
  const highlighted = focused ?? hovered ?? activeItem;

  useLayoutEffect(() => {
    const nav = containerRef.current, pill = pillRef.current;
    if (!nav || !pill) return;
    let frame = 0, previousTime = 0;
    let target = { left: 0, right: 0 };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const paint = () => {
      const position = positionRef.current;
      if (!position) return;
      pill.style.transform = `translateX(${position.left}px)`;
      pill.style.width = `${Math.max(1, position.right - position.left)}px`;
      pill.style.opacity = '1';
    };

    const animate = (time: number) => {
      const position = positionRef.current;
      if (!position) return;
      const dt = previousTime ? Math.min((time - previousTime) / 1000, 0.032) : 1 / 60;
      previousTime = time;
      if (reducedMotion.matches) {
        position.left = target.left;
        position.right = target.right;
        position.leftVelocity = position.rightVelocity = 0;
      } else {
        // The leading edge moves faster, stretching the pill before its tail catches up.
        const movingRight = (target.left + target.right) > (position.left + position.right);
        const leftSpring = movingRight ? 240 : 420;
        const rightSpring = movingRight ? 420 : 240;
        position.leftVelocity += ((target.left - position.left) * leftSpring - position.leftVelocity * 30) * dt;
        position.rightVelocity += ((target.right - position.right) * rightSpring - position.rightVelocity * 30) * dt;
        position.left += position.leftVelocity * dt;
        position.right += position.rightVelocity * dt;
      }
      const settled = Math.abs(target.left - position.left) + Math.abs(target.right - position.right) < 0.1
        && Math.abs(position.leftVelocity) + Math.abs(position.rightVelocity) < 0.5;
      if (settled) {
        position.left = target.left;
        position.right = target.right;
        position.leftVelocity = position.rightVelocity = 0;
      }
      paint();
      frame = settled ? 0 : requestAnimationFrame(animate);
    };

    const measure = () => {
      const link = nav.querySelector<HTMLElement>(`[data-pill-item="${highlighted}"]`);
      if (!link) return;
      target = { left: link.offsetLeft, right: link.offsetLeft + link.offsetWidth };
      if (!positionRef.current) {
        positionRef.current = { ...target, leftVelocity: 0, rightVelocity: 0 };
        paint();
      } else if (!frame) {
        previousTime = 0;
        frame = requestAnimationFrame(animate);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    nav.querySelectorAll('[data-pill-item]').forEach(link => observer.observe(link));
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [highlighted]);

  return {
    containerRef,
    pillRef,
    onPointerLeave: () => setHovered(null),
    getItemProps: (id: string) => ({
      'data-pill-item': id,
      onPointerEnter: (event: PointerEvent<HTMLElement>) => {
        if (event.pointerType === 'mouse') { setHovered(id); setFocused(null); }
      },
      onFocus: (event: FocusEvent<HTMLElement>) => setFocused(event.currentTarget.matches(':focus-visible') ? id : null),
      onBlur: () => setFocused(null),
    }),
  };
}