import { useLiquidPill } from './useLiquidPill';

const items = [
  ['home', 'Home'],
  ['expertise', 'Expertise'],
  ['work', 'Work'],
  ['about', 'About'],
  ['contact', 'Contact'],
] as const;

export function CapsuleNav({ activeSection }: { activeSection: string }) {
  const pill = useLiquidPill<HTMLElement>(activeSection);
  return <nav ref={pill.containerRef} className="capsule-nav" aria-label="Main navigation" onPointerLeave={pill.onPointerLeave}>
    <span ref={pill.pillRef} className="nav-pill" aria-hidden="true" />
    {items.map(([id, label]) => <a key={id} href={`#${id}`}
      aria-current={activeSection === id ? 'location' : undefined}
      {...pill.getItemProps(id)}>{label}</a>)}
  </nav>;
}