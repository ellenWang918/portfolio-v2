import type { KeyboardEvent } from 'react';
import { useLiquidPill } from './useLiquidPill';

type ExpertiseTabsProps = {
  items: readonly { name: string }[];
  activeTab: number;
  onChange: (index: number) => void;
};

export function ExpertiseTabs({ items, activeTab, onChange }: ExpertiseTabsProps) {
  const pill = useLiquidPill<HTMLDivElement>(String(activeTab));
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let index = activeTab;
    if (event.key === 'ArrowRight') index = (index + 1) % items.length;
    else if (event.key === 'ArrowLeft') index = (index + items.length - 1) % items.length;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = items.length - 1;
    else return;
    event.preventDefault();
    onChange(index);
    pill.containerRef.current?.querySelector<HTMLButtonElement>(`#expertise-tab-${index}`)?.focus();
  };

  return <div ref={pill.containerRef} className="tab-list" role="tablist" aria-label="Design expertise"
    onKeyDown={handleKeyDown} onPointerLeave={pill.onPointerLeave}>
    <span ref={pill.pillRef} className="tab-pill" aria-hidden="true" />
    {items.map((item, index) => <button key={item.name} id={`expertise-tab-${index}`}
      role="tab" aria-selected={activeTab === index} aria-controls="expertise-panel"
      tabIndex={activeTab === index ? 0 : -1} onClick={() => onChange(index)}
      {...pill.getItemProps(String(index))}>{item.name}</button>)}
  </div>;
}
