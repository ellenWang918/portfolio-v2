import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { Eye, Heart, Paperclip, X, Stack, Sparkle, MapPin, Sun, Moon, EnvelopeSimple, LinkedinLogo, GithubLogo, Check, Copy, CaretLeft, CaretRight, CaretUp, ArrowRight, ArrowLeft, Pause, Play, ArrowCounterClockwise } from '@phosphor-icons/react';
import projects from './data/projects.json';
import { CapsuleNav } from './CapsuleNav';
import { ExpertiseTabs } from './ExpertiseTabs';
import { ReadingProgress } from './ReadingProgress';
import { usePersonaColumns } from './usePersonaColumns';
import { useHangingLine } from './useHangingLine';

const email = 'ellenwang918@gmail.com';
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
type Theme = 'light' | 'dark';
type ProjectId = (typeof projects)[number]['id'];
const projectUrl = (id: ProjectId) => `${import.meta.env.BASE_URL}work/${id}`;

type InlineAccentProps = { tone: 'cyan' | 'lime' | 'yellow'; Icon: PhosphorIcon; className?: string };
type ProjectArtworkProps = { index: number; className?: string };
type ProjectCardProps = { index: number };
type StorySection = { header: string; content: string; table?: { headers: string[]; rows: string[][] } };

const socials = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/zi-wang-456923171/', Icon: LinkedinLogo },
  { label: 'GitHub', url: 'https://github.com/ellenWang918', Icon: GithubLogo },
  { label: 'Email', url: `mailto:${email}`, Icon: EnvelopeSimple },
];
const outcomes = [
  { value: '100%', label: 'design team adoption', short: 'One shared source of truth.', category: 'Design systems' },
  { value: '4', label: 'usability sessions', short: 'A familiar pattern. A feasible MVP.', category: 'Product design' },
  { value: '12', label: 'user stories prototyped', short: 'From complex requirements to a testable experience.', category: 'Discovery & prototyping' },
  { value: '16', label: 'interviews across 8 groups', short: 'Connecting people, processes & systems.', category: 'Service design' },
];
function InlineAccent({ tone, Icon, className = '' }: InlineAccentProps) {
  return <span className={`inline-accent accent-${tone} ${className}`} aria-hidden="true"><Icon weight="bold" /></span>;
}
function LeisureCollage() {
  const galleryRef = useHangingLine();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isOpen = selectedIndex !== null;
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!isOpen) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);
  const lines = [
    [
      { src: 'photo-01.webp', alt: 'A selfie with a cat', width: 1050, height: 1400 },
      { src: 'photo-03.webp', alt: 'A group selfie with friends', width: 1400, height: 1050 },
      { src: 'photo-07.webp', alt: 'A smiling selfie with a pink and grey bird perched on my head', width: 787, height: 1400 },
      { src: 'photo-06.webp', alt: 'Looking up at a circular skylight beside a colourful orange wall', width: 787, height: 1400 },
    ],
    [
      { src: 'photo-04.webp', alt: 'A sunny walk with a dog beneath palm trees', width: 1050, height: 1400 },
      { src: 'photo-05.webp', alt: 'Birds resting on a wooden jetty beside the water', width: 788, height: 1400 },
      { src: 'photo-02.webp', alt: 'Sharing a sunny afternoon with friends', width: 1400, height: 1050 },
    ],
  ];
  const photos = lines.flat();
  const currentPhoto = selectedIndex === null ? null : photos[selectedIndex];
  const navigatePhoto = (direction: number) => setSelectedIndex(current => current === null ? null : (current + direction + photos.length) % photos.length);
  return <><div ref={galleryRef} className="leisure-collage hanging-gallery" role="group" aria-label="Hanging photos of friends, animals and places I love">
    <canvas className="hanging-connector" aria-hidden="true" />
    {lines.map((rowPhotos, index) => <div className="hanging-row" key={index}>
      {rowPhotos.map(photo => <button type="button" className="hanging-photo" key={photo.src} aria-haspopup="dialog" onClick={() => setSelectedIndex(photos.indexOf(photo))} aria-label={`View full photo: ${photo.alt}`}>
        <span className="hanging-swing">
          <Paperclip className="hanging-clip" weight="light" aria-hidden="true" />
          <span className="hanging-frame"><img src={assetUrl(`/assets/leisure/${photo.src}`)} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" /></span>
        </span>
      </button>)}
    </div>)}
  </div><dialog ref={dialogRef} className="leisure-lightbox" aria-label="Leisure photo viewer" onCancel={() => setSelectedIndex(null)} onClose={() => setSelectedIndex(null)} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) setSelectedIndex(null);
  }} onKeyDown={event => {
    if (event.key === 'Tab') {
      const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('button');
      const first = buttons[0], last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigatePhoto(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }}>
    {currentPhoto && <>
      <button type="button" className="photo-viewer-control photo-viewer-close" aria-label="Close photo viewer" onClick={() => setSelectedIndex(null)}><X size={22} aria-hidden="true" /></button>
      <button type="button" className="photo-viewer-control photo-viewer-previous" aria-label="Previous photo" onClick={() => navigatePhoto(-1)}><CaretLeft size={26} aria-hidden="true" /></button>
      <figure className="photo-viewer-figure"><img src={assetUrl(`/assets/leisure/${currentPhoto.src}`)} alt={currentPhoto.alt} width={currentPhoto.width} height={currentPhoto.height} /><figcaption aria-live="polite" aria-atomic="true">Photo {(selectedIndex ?? 0) + 1} of {photos.length}</figcaption></figure>
      <button type="button" className="photo-viewer-control photo-viewer-next" aria-label="Next photo" onClick={() => navigatePhoto(1)}><CaretRight size={26} aria-hidden="true" /></button>
    </>}
  </dialog></>;
}
function ComplexityScribble() {
  return <span className="inline-accent accent-cyan complexity-scribble" aria-hidden="true">
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 38C7 28 22 12 40 11C60 8 69 22 60 34C52 46 22 48 14 36C6 25 31 13 48 17C66 20 62 38 44 42C26 48 13 37 19 26C25 15 49 13 58 24C68 36 41 45 23 38C9 32 33 19 47 22C63 25 47 41 29 38C14 35 35 17 53 23C70 29 42 42 27 32C17 26 47 18 56 29C65 41 28 42 23 31C18 20 51 19 54 31C57 44 20 43 19 31C18 21 45 17 59 23" />
      <path d="M14 31C23 18 48 17 55 27C65 42 31 47 24 36C16 25 51 20 52 32C52 45 31 35 36 26C43 15 61 28 48 36C36 44 27 28 42 25C57 23 58 37 40 42C27 45 27 25 47 26C60 27 41 42 32 33C23 25 51 22 56 34" />
      <path d="M49 35C59 42 56 49 45 52C36 55 32 48 42 44C53 40 57 53 46 60C38 65 34 58 42 55C52 50 54 63 45 68C39 71 35 66 41 64C50 61 46 73 40 77" />
    </svg>
  </span>;
}
function PalmsMotionCover({ className = '', controls = false }: { className?: string; controls?: boolean }) {
  const [paused, setPaused] = useState(false);
  return <div className={`palms-motion-cover ${paused ? 'is-paused' : ''} ${className}`}>
    <img className="palms-motion-field" src={assetUrl('/assets/palms-blue-motion-field-v1.png')} alt="" aria-hidden="true" width={1672} height={941} />
    <img className="palms-motion-field palms-motion-field-secondary" src={assetUrl('/assets/palms-blue-motion-field-v1.png')} alt="" aria-hidden="true" width={1672} height={941} />
    <strong className="palms-motion-title">PALMS Design System</strong>
    {controls && <button className="palms-motion-toggle" type="button" aria-label={paused ? 'Play cover animation' : 'Pause cover animation'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={16} weight="fill" aria-hidden="true" /> : <Pause size={16} weight="fill" aria-hidden="true" />}</button>}
  </div>;
}
function SolverCover({ className = '', loading = 'lazy' }: { className?: string; loading?: 'eager' | 'lazy' }) {
  return <div className={`solver-preview ${className}`}>
    <div className="solver-preview-screen solver-preview-back">
      <img src={assetUrl('/assets/solver-kaizen-wireframe.png')} alt="Solver Kaizen improvement list with search, filters and status tracking" width={1586} height={992} loading={loading} />
    </div>
    <div className="solver-preview-screen solver-preview-front">
      <img src={assetUrl('/assets/solver-action-board-preview.png')} alt="Solver Kanban action board with Created, Endorsed, In progress and Completed columns" width={1600} height={1000} loading={loading} />
    </div>
    <div className="preview-copy"><strong className="preview-title">Solver</strong><p>A clearer way to track Kaizen actions.</p></div>
  </div>;
}
function ProjectArtwork({ index, className = '' }: ProjectArtworkProps) {
  if (projects[index].id === 'design-system-palms') return <PalmsMotionCover className={`artwork artwork-${index} ${className}`} />;
  if (projects[index].id === 'feature-improvement-sps') return <SolverCover className={`artwork artwork-${index} ${className}`} />;
  if (projects[index].id === 'rapid-discovery-ism') return <div className={`artwork artwork-${index} heritage-preview ${className}`}>
    <img className="editorial-art" src={assetUrl(projects[index].hero.src)} alt={projects[index].hero.alt} width={1672} height={941} loading="lazy" />
  </div>;
  return <div className={`artwork artwork-${index} ${className}`}>
    <span className="artwork-label" aria-hidden="true">{outcomes[index].category}</span>
    <img className="editorial-art" src={assetUrl(projects[index].hero.src)} alt={projects[index].hero.alt} loading="lazy" />
    <span className="artwork-index" aria-hidden="true">0{index + 1}</span>
  </div>;
}
function ProjectCard({ index }: ProjectCardProps) {
  const project = projects[index];
  return <a className={`project-card ${index === 4 ? 'project-card-wide' : ''}`} href={projectUrl(project.id)} aria-label={`Read ${project.title}`}>
    <div className="project-visual"><ProjectArtwork index={index} /></div>
    <div className="project-description">
      <div className="project-meta"><span>RIO TINTO</span><span>{project.metadata[2].value}</span></div>
      <div className="project-tags">{project.tags.slice(0, 2).map(tag => <span className="badge" key={tag}>{tag}</span>)}</div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <span className="read-case"><span className="text-button-label">Read the case study</span><ArrowRight size={16} aria-hidden="true" /></span>
    </div>
  </a>;
}
// Source content uses paragraphs, emphasis and lists. Render text without executable HTML.
function CharterDefinition() {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 16, top: 16 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const tooltipId = useId();
  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const show = () => { cancelClose(); setOpen(true); };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      if (document.activeElement !== triggerRef.current) setOpen(false);
    }, 120);
  };
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  useLayoutEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      const trigger = triggerRef.current?.getBoundingClientRect();
      const card = cardRef.current?.getBoundingClientRect();
      if (!trigger || !card) return;
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight;
      const below = trigger.bottom + 10;
      const top = below + card.height <= viewportHeight - 16 ? below : trigger.top - card.height - 10;
      setPosition({
        left: Math.max(16, Math.min(trigger.left, viewportWidth - card.width - 16)),
        top: Math.max(16, Math.min(top, viewportHeight - card.height - 16)),
      });
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !triggerRef.current?.contains(event.target) && !cardRef.current?.contains(event.target)) setOpen(false);
    };
    const dismissOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') { cancelClose(); setOpen(false); } };
    document.addEventListener('pointerdown', dismissOutside);
    document.addEventListener('keydown', dismissOnEscape);
    return () => {
      document.removeEventListener('pointerdown', dismissOutside);
      document.removeEventListener('keydown', dismissOnEscape);
    };
  }, [open]);
  return <><button ref={triggerRef} type="button" className="charter-definition-trigger" aria-describedby={open ? tooltipId : undefined} onMouseEnter={show} onMouseLeave={scheduleClose} onFocus={show} onBlur={() => setOpen(false)} onClick={show}>digital charter</button>
    {open && createPortal(<div ref={cardRef} id={tooltipId} role="tooltip" className="charter-definition-card" style={position} onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
      <p>A <strong>charter</strong> is the plan that defines a Kaizen before the improvement event begins. It helps the team and sponsor agree on:</p>
      <ul>
        <li><strong>Problem:</strong> What needs to improve, and why?</li>
        <li><strong>Objectives:</strong> What results are expected, and how will success be measured?</li>
        <li><strong>Scope:</strong> What is included and excluded?</li>
        <li><strong>People:</strong> Who sponsors, leads, facilitates, and participates?</li>
        <li><strong>Timeline and resources:</strong> When will it happen, and what support is needed?</li>
      </ul>
    </div>, document.body)}
  </>;
}
function InlineText({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((piece, i) => piece === '**digital charter**' ? <CharterDefinition key={i} /> : piece.startsWith('**') ? <strong key={i}>{piece.slice(2, -2)}</strong> : piece);
}
function ApproachCards({ content, results }: { content: string; results: string[] }) {
  const [flipped, setFlipped] = useState<number[]>([]);
  const descriptionId = useId();
  const blocks = content.split(/\n\s*\n/).filter(Boolean);
  const steps = blocks.flatMap(block => block.split('\n')).filter(line => /^\d+\. /.test(line));
  return <><StoryContent content={blocks.filter(block => !/^\d+\. /.test(block)).join('\n\n')} /><ol className="result-cards">{steps.map((step, i) => {
    const match = step.match(/^\d+\. \*\*(.*?)\*\*\s*(.*)$/);
    if (!match) return null;
    const open = flipped.includes(i);
    const approachId = `${descriptionId}-${i}-approach`;
    const resultId = `${descriptionId}-${i}-result`;
    return <li key={match[1]}>
      <button type="button" className={`result-card ${open ? 'is-flipped' : ''}`}
        aria-pressed={open}
        aria-label={`${i + 1}. ${match[1]}. ${open ? 'Show approach' : 'Show result'}`}
        aria-describedby={open ? resultId : approachId}
        onClick={() => setFlipped(previous => previous.includes(i) ? previous.filter(value => value !== i) : [...previous, i])}>
        <span className="result-card-inner">
          <span className="result-card-front" aria-hidden={open}>
            <span className="result-card-number">{String(i + 1).padStart(2, '0')}</span>
            <strong>{match[1]}</strong><span id={approachId}>{match[2]}</span>
            <span className="result-card-hint">View result ↗</span>
          </span>
          <span className="result-card-back" aria-hidden={!open}>
            <span className="result-card-number">{String(i + 1).padStart(2, '0')}</span>
            <strong>The result</strong><span id={resultId}>{results[i]}</span>
            <span className="result-card-hint">Back to approach ↩</span>
          </span>
        </span>
      </button>
    </li>;
  })}</ol></>;
}
function StoryVideo({ src, label }: { src: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const play = () => { void videoRef.current?.play().catch(() => setPlaying(false)); };
  const togglePlayback = () => {
    if (videoRef.current?.paused) play();
    else videoRef.current?.pause();
  };
  const replay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    play();
  };
  return <div className="story-video-player">
    <video ref={videoRef} className="story-video" autoPlay muted loop playsInline preload="metadata" aria-label={label} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}>
      <source src={assetUrl(src)} type="video/mp4" />
      Your browser does not support embedded video. <a href={assetUrl(src)}>Watch {label}</a>.
    </video>
    <div className="story-video-controls" role="group" aria-label="Video playback">
      <button type="button" aria-label={playing ? 'Pause video' : 'Play video'} title={playing ? 'Pause' : 'Play'} onClick={togglePlayback}>{playing ? <Pause size={16} weight="fill" aria-hidden="true" /> : <Play size={16} weight="fill" aria-hidden="true" />}</button>
      <button type="button" aria-label="Replay video" title="Replay" onClick={replay}><ArrowCounterClockwise size={18} aria-hidden="true" /></button>
    </div>
  </div>;
}
function SolverApproach({ content }: { content: string }) {
  const blocks = content.split(/\n\s*\n/).filter(Boolean);
  const steps = blocks.filter(block => block.startsWith('**'));
  const introduction = blocks.filter(block => !block.startsWith('**')).join('\n\n');
  return <div className="solver-approach"><ol className="approach-timeline" role="list">{steps.map((step, i) => {
    const [title, ...description] = step.split('\n');
    return <li key={i}><strong>{title.replace(/^\*\*|\*\*$/g, '')}</strong><p>{description.join(' ')}</p></li>;
  })}</ol><div className="approach-layout"><div className="approach-narrative"><StoryContent content={introduction} /></div><img className="story-image solver-research-plan" src={assetUrl('/assets/solver-kaizen-research-plan.png')} alt="Kaizen concept research plan showing objectives, methodology, participants and questions across preparation, event and follow up phases, with sensitive details blurred." width={1727} height={911} loading="lazy" /></div></div>;
}
function StoryTable({ headers, rows, label }: { headers: string[]; rows: string[][]; label: string }) {
  return <div className="story-table-scroll" role="region" aria-label={`${label} table, scroll horizontally to view all columns`} tabIndex={0}>
    <table className="story-table" aria-label={label}>
      <thead><tr>{headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead>
      <tbody>{rows.map(([goal, ...cells]) => <tr key={goal}>
        <th scope="row"><InlineText text={goal} /></th>
        {cells.map((cell, index) => <td key={index}><InlineText text={cell} /></td>)}
      </tr>)}</tbody>
    </table>
  </div>;
}
function StoryContent({ content, showPalmsComparison = false }: { content: string; showPalmsComparison?: boolean }) {
  return content.split(/\n\s*\n/).filter(Boolean).map((block, i) => {
    if (block.startsWith('### ')) return <h3 className="story-subheading" key={i}><InlineText text={block.slice(4)} /></h3>;
    if (block.startsWith('**How might we ') && block.endsWith('**')) return <blockquote className="palms-problem-quote" key={i}><p>{block.slice(2, -2)}</p></blockquote>;
    if (/^\*[^*]+\*$/.test(block)) return <p key={i}><em>{block.slice(1, -1)}</em></p>;
    const lines = block.split('\n');
    if (lines.every(line => /^- /.test(line))) return <ul key={i}>{lines.map((line, j) => <li key={j}><InlineText text={line.slice(2)} /></li>)}</ul>;
    if (lines.every(line => /^\d+\. /.test(line))) return <ol key={i}>{lines.map((line, j) => <li key={j}><InlineText text={line.replace(/^\d+\. /, '')} /></li>)}</ol>;
    return <Fragment key={i}><p><InlineText text={block} /></p>{showPalmsComparison && block.startsWith('The initial interface prioritised speed to market.') && <img className="story-image" src={assetUrl('/assets/3-search.svg')} alt="Three different search patterns found across the product" loading="lazy" />}</Fragment>;
  });
}
function CaseStudy({ id }: { id: ProjectId }) {
  const articleRef = useRef<HTMLElement>(null);
  const defineLayoutRef = usePersonaColumns(id === 'rapid-discovery-ism');
  const index = projects.findIndex(p => p.id === id), project = projects[index];
  const previousProject = projects[index - 1], nextProject = projects[index + 1];
  const sections: StorySection[] = project.story.filter(section => section.content || section.header === 'Solution' || (id === 'rapid-discovery-ism' && ['Research', 'Define', 'Design'].includes(section.header)));
  return <main id="main" className="case-page">
    <ReadingProgress key={id} articleRef={articleRef} />
    <div className="case-container container">
    <div className="case-toolbar"><span className="mono">ELLEN WANG / SELECTED WORK / 0{index + 1}</span><a className="text-button case-back" href={`${import.meta.env.BASE_URL}#home`}><ArrowLeft size={16} aria-hidden="true" /><span className="text-button-label">Back to Home</span></a></div>
    <div className="case-body">
      <details className="case-project-picker" key={id}>
        <summary>Projects <span>{project.id === 'feature-improvement-sps' ? 'Solver' : project.folderTitle}</span></summary>
        <nav aria-label="Case studies">
          {projects.map((p, i) => <a href={projectUrl(p.id)} aria-current={p.id === id ? 'page' : undefined} key={p.id}><span className="mono">0{i + 1}</span>{p.id === 'design-system-palms' ? 'PALMS Design System' : p.id === 'feature-improvement-sps' ? 'Solver' : p.folderTitle}</a>)}
        </nav>
      </details>
      <aside className="case-sidebar" aria-label="Case studies">
        <div className="case-sidebar-content">
          <div className="case-project-list">
            <p className="mono">CASE STUDIES</p>
            {projects.map((p, i) => <a className={p.id === id ? 'selected' : ''} href={projectUrl(p.id)} aria-current={p.id === id ? 'page' : undefined} key={p.id}><span className="mono">0{i + 1}</span>{p.id === 'design-system-palms' ? 'PALMS Design System' : p.id === 'feature-improvement-sps' ? 'Solver' : p.folderTitle}</a>)}
          </div>
        </div>
      </aside>
      <article id="case-article" className="case-content" ref={articleRef}>
        {id === 'design-system-palms' ? <PalmsMotionCover className="case-editorial" controls /> : id === 'feature-improvement-sps' ? <SolverCover className="case-editorial" loading="eager" /> : id === 'rapid-discovery-ism' ? <img className="case-editorial heritage-schedule-cover" src={assetUrl('/assets/heritage-schedule-cover-v1.png')} alt="Heritage Schedule, with a softly faded dotted double diamond on a pale warm-grey background" width={1672} height={941} fetchPriority="high" /> : <img className="case-editorial" src={assetUrl(project.hero.src)} alt={project.hero.alt} />}
        <div className="case-copy"><div className="project-tags">{project.tags.map(tag => <span className="badge" key={tag}>{tag}</span>)}</div><h1 id="case-title">{project.title}</h1><p className="case-summary">{project.summary}</p><dl className="case-metadata">{project.metadata.map(m => <div key={m.label}><dt className="mono">{m.label}</dt><dd>{m.value}</dd></div>)}</dl>
    {sections.map((section, i) => <section className={`story-section ${id === 'design-system-palms' && section.header === 'Background' ? 'palms-background' : id === 'design-system-palms' && section.header === 'My approach' ? 'palms-approach' : ''}`} id={`case-section-${i}`} key={section.header}>
      <div className="story-heading"><span className="mono">0{i + 1}</span><h2>{section.header}</h2></div>
      {id === 'design-system-palms' && section.header === 'Background' ? <><StoryContent content={section.content.split('\n\n').slice(0, 2).join('\n\n')} showPalmsComparison /><div className="palms-background-insight"><div><StoryContent content={section.content.split('\n\n').slice(2).join('\n\n')} /></div><img src={assetUrl('/assets/palms-team-feedback.png')} alt="Quotes from the team about finding designs, component flexibility and design consistency." loading="lazy" /></div></>
        : id === 'design-system-palms' && section.header === 'My approach' ? <ApproachCards content={section.content} results={project.approachResults ?? []} />
        : id === 'feature-improvement-sps' && section.header === 'Background' ? <div className="solver-background-grid"><div><StoryContent content={section.content} /></div><img src={assetUrl('/assets/solver-kaizen-wireframe.png')} alt="Simplified Solver Kaizen wireframe showing search, filters and a list of improvements with status, lead, sponsor, site and creation date. Content is anonymised." width={1586} height={992} loading="lazy" /></div>
        : id === 'feature-improvement-sps' && section.header === 'Approach' ? <SolverApproach content={section.content} />
        : id === 'feature-improvement-sps' && section.header === 'Solution' ? <><StoryContent content={section.content} /><img className="story-image solver-solution-workflow" src={assetUrl('/assets/solver-kaizen-solution-workflow.png')} alt="Five stages of the Kaizen workflow: prepare charter, sponsor approval, run event, follow up actions, and complete and share." width={2055} height={765} loading="lazy" /></>
        : id === 'feature-improvement-sps' && section.header === 'My contribution' ? <><StoryContent content={section.content} /><StoryVideo src="/assets/kaizen-task-click-demo-v1.mp4" label="Kaizen task interaction demo" /></>
        : id === 'rapid-discovery-ism' && section.header === 'Executive summary' ? <><StoryContent content={section.content} /><StoryVideo src="/assets/heritage-schedule-flow-v2.mp4" label="Heritage Schedule: log in, open Annual baseline and explore the Gantt chart and configuration" /></>
        : id === 'rapid-discovery-ism' && section.header === 'Research' ? <><StoryContent content={section.content} /><figure className="ism-research-figure"><img className="story-image ism-research-canvas" src={assetUrl('/assets/ism-alignment-canvas-v2.png')} alt="Eight-section alignment canvas covering the problem, customer, current state, vision, priorities, deliverables, risks and next steps. Sticky-note answers and embedded images are blurred." width={1953} height={805} loading="lazy" /><figcaption>Product Alignment Canvas</figcaption></figure></>
        : id === 'rapid-discovery-ism' && section.header === 'Define' ? <div className="ism-define-layout" ref={defineLayoutRef}><div className="ism-define-copy"><StoryContent content={section.content} /></div><figure className="ism-persona-figure"><a href={assetUrl('/assets/planner_persona.png')} target="_blank" rel="noreferrer" aria-label="View full-size Heritage Planner persona"><img className="story-image ism-persona-image" src={assetUrl('/assets/planner_persona.png')} alt="Illustrative Heritage Planner persona wearing a safety helmet. Goals focus on keeping activities on track, coordinating changes and identifying at-risk work. Needs include current work requests, reliable schedules and clear handovers; pains include slow macros, manual rescheduling and fragmented data." width={752} height={1084} loading="lazy" /></a><figcaption>Heritage Planner persona</figcaption></figure></div>
        : id === 'rapid-discovery-ism' && section.header === 'Design' ? <><StoryContent content={section.content} /><a className="ism-prototype-link" href={assetUrl('/assets/configuration-update-prototype-flow-v5-horizontal.png')} target="_blank" rel="noreferrer" aria-label="View full-size configuration update prototype flow"><img className="story-image ism-prototype-flow" src={assetUrl('/assets/configuration-update-prototype-flow-v5-horizontal.png')} alt="Configuration update prototype flow: find the configuration, edit configuration, review changes and configuration updated, with supporting paths for invalid or missing fields and cancelling unsaved changes. Illustrative interaction with fictional content." width={2172} height={724} loading="lazy" /></a></>
        : <StoryContent content={section.content} />}
      {section.table && <StoryTable headers={section.table.headers} rows={section.table.rows} label={section.header} />}
      {index === 0 && section.header === 'Outcome' && <div className="case-gallery"><figure><img src={assetUrl('/assets/Group%2014.svg')} alt="Illustrative design system foundations" loading="lazy" /><figcaption>Design system foundations</figcaption></figure></div>}
    </section>)}
    <p className="confidential-note">Some details and original project visuals are confidential. The images shown are illustrative mock-ups created for public viewing and do not represent the actual work. You’re welcome to <a href={`mailto:${email}`}>email me</a> for a chat.</p>
    <nav className="case-footer" aria-label="Case study navigation">
      <a className="button button-outline" href={previousProject ? projectUrl(previousProject.id) : `${import.meta.env.BASE_URL}#home`}>{previousProject && <CaretLeft size={16} aria-hidden="true" />}<span>{previousProject ? 'Previous case study' : 'Back to home'}</span></a>
      <a className="button" href={nextProject ? projectUrl(nextProject.id) : `${import.meta.env.BASE_URL}#home`}><span>{nextProject ? 'Next case study' : 'Back to home'}</span>{nextProject && <CaretRight size={16} aria-hidden="true" />}</a>
    </nav></div></article>    </div>
    </div>
    <button className="case-back-top" aria-label="Back to top" title="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>
      <CaretUp size={22} aria-hidden="true" />
    </button>
  </main>;
}
export function App() {
  const [activeSection, setActiveSection] = useState('home'), [activeTab, setActiveTab] = useState(0), [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => { try { return localStorage.getItem('ellen-theme') === 'dark' ? 'dark' : 'light'; } catch { return 'light'; } });
  const casePrefix = `${import.meta.env.BASE_URL}work/`;
  const requestedProject = window.location.pathname.startsWith(casePrefix)
    ? window.location.pathname.slice(casePrefix.length).replace(/\/$/, '')
    : new URLSearchParams(window.location.search).get('project');
  const projectId = projects.find(project => project.id === requestedProject)?.id ?? null;
  const copyTimeout = useRef<number | undefined>(undefined);
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('ellen-theme', theme); } catch { /* Preference storage is optional. */ } }, [theme]);
  useEffect(() => { const project = projects.find(p => p.id === projectId); document.title = project ? `${project.folderTitle} — Ellen Wang` : 'Ellen Wang — Product Designer'; }, [projectId]);
  useEffect(() => {
    if (projectId) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section[id]'));
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      const readingLine = window.innerHeight * 0.35;
      let current = 'home';
      for (const section of sections) {
        if (section.getBoundingClientRect().top > readingLine) break;
        current = section.id;
      }
      setActiveSection(current);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(updateActiveSection); };
    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  useEffect(() => () => clearTimeout(copyTimeout.current), []);
  async function copyEmail() { try { await navigator.clipboard.writeText(email); setCopied(true); clearTimeout(copyTimeout.current); copyTimeout.current = window.setTimeout(() => setCopied(false), 2500); } catch { window.location.href = `mailto:${email}`; } }
  const aboutTabs = [{ name: 'Professional' }, { name: 'Leisure' }];
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><a className="brand" href={`${import.meta.env.BASE_URL}#home`} aria-label="Ellen Wang, home"><img src={assetUrl('/assets/logo_in_circle.svg')} alt="" width="32" height="32" /><span>Ellen Wang<span className="brand-period">.</span></span></a><div className="header-right"><span className="availability"><span className="availability-dot" aria-hidden="true" />Available for work</span><button className="icon-button theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}</button></div></header>
    {projectId ? <CaseStudy id={projectId} /> : <>
    <CapsuleNav activeSection={activeSection} />
    <main id="main">
      <section className="hero" id="home" aria-labelledby="hero-title"><div className="container"><p className="eyebrow"><span className="intro-wave" aria-hidden="true">👋</span> HI, I’M ELLEN WANG</p><h1 id="hero-title" aria-label="I turn ambiguity into clarity."><span className="hero-line hero-line-ambiguity">I turn <ComplexityScribble /> <span className="hero-ambiguity">ambiguity</span></span>{' '}<span className="hero-line hero-line-clarity">into <InlineAccent tone="lime" Icon={Stack} className="hero-layers-accent" /> clarity<span className="hero-dot">.</span> <InlineAccent tone="yellow" Icon={Sparkle} className="sparkle-accent" /></span></h1><div className="hero-bottom"><p>Product designer with a technical background.<br />Making complex digital products feel human.</p><div className="hero-actions"><a className="button" href="#contact">Get in touch</a><a className="button button-white" href="#work">Explore my work</a></div></div></div></section>
      <section className="project-reel" aria-label="Project preview gallery"><div className="reel-track">{[0, 1].map(group => <div className="reel-group" key={group} aria-hidden={group === 1 ? 'true' : undefined}>{projects.map((p, index) => <a className="reel-card" key={p.id} tabIndex={group === 1 ? -1 : 0} href={projectUrl(p.id)} aria-label={`Preview ${p.title}`}><ProjectArtwork index={index} /><span className="reel-caption">{p.folderTitle}</span></a>)}</div>)}</div></section>
      <section className="expertise-section container" id="about" aria-labelledby="expertise-title"><div className="expertise-card"><div className="expertise-top"><div><h2 id="expertise-title">About Ellen {activeTab === 1 ? <span className="inline-accent leisure-accent" aria-hidden="true"><Heart weight="bold" /></span> : <InlineAccent tone="cyan" Icon={Eye} />}</h2></div><ExpertiseTabs items={aboutTabs} activeTab={activeTab} onChange={setActiveTab} /></div><div id="expertise-panel" className="expertise-panel about-me-panel" role="tabpanel" aria-labelledby={`expertise-tab-${activeTab}`} tabIndex={0}>{activeTab === 0 ? <div className="about-me-content"><div className="about-layout"><div className="about-title"><h2 id="about-title">Curious by nature.<br />Practical by design.</h2><div className="about-signature"><img src={assetUrl('/assets/logo_in_circle.svg')} alt="" width="64" height="64" /><span>Ellen Wang<br /><span className="muted">Product designer | Design engineer | Specialty in Design system | Engineer background</span></span></div></div><div className="about-copy"><p className="about-lead">I’m a product designer with a technical background, specialising in complex digital products.</p><p>I work across research, product strategy, interaction design and design systems to turn complex workflows into scalable experiences that users and engineering teams can understand.</p><p className="about-location"><MapPin size={20} /> Based on the Gold Coast, Australia.</p><div className="about-links">{socials.slice(0, 2).map(({ label, url, Icon }) => <a key={label} href={url} target="_blank" rel="noreferrer"><Icon size={20} />{label}</a>)}</div></div></div><div className="principle-row"><span>People first.</span><span>Clarity always.</span><span>Built together.</span></div></div> : <div className="about-me-content"><div className="about-layout leisure-layout"><div className="leisure-content"><div className="about-title"><h2 className="about-lead">Love nature.<br />Love connection.</h2></div><div className="about-copy leisure-copy"><p>Outside of designing, I love travelling, taking photos and playing mahjong. <span className="leisure-sticker leisure-sticker-mahjong" aria-hidden="true"><img src={assetUrl('/assets/leisure/mahjong-emoji.svg')} alt="" width="20" height="20" /></span></p><p>I love all kinds of animals, especially cats. <span className="leisure-sticker leisure-sticker-cat" aria-hidden="true">🐱</span> I currently volunteer at <a href="https://friendsofthepound.com/" target="_blank" rel="noreferrer">Friends of the Pound</a>, caring for the little ones and helping them find their forever homes.</p><p>I also love meeting people and building connections whenever I can. Some of my former colleagues have become friends, and we catch up regularly over coffee. <span className="leisure-sticker leisure-sticker-coffee" aria-hidden="true"><img src={assetUrl('/assets/leisure/coffee-emoji.svg')} alt="" width="20" height="20" /></span></p></div></div><LeisureCollage /></div></div>}</div></div></section>
      <section className="work-section" id="work" aria-labelledby="work-title"><div className="container"><div className="section-heading"><div><h2 id="work-title">Selected work</h2></div></div><div className="work-grid">{projects.map((p, index) => <ProjectCard key={p.id} index={index} />)}</div></div></section>
      <section className="contact-section container" id="contact" aria-labelledby="contact-title"><div className="contact-card"><h2 id="contact-title">Get in touch! <InlineAccent tone="yellow" Icon={Sparkle} /></h2><div className="contact-bottom"><p>Open to work now. Reach out if you wanna be friends or colleagues!</p><a href={`mailto:${email}`} className="button button-white">Let’s talk <EnvelopeSimple size={18} /></a></div><div className="email-row"><a href={`mailto:${email}`}>{email}</a><button className="copy-button" aria-label={copied ? 'Email address copied' : 'Copy email address'} onClick={copyEmail}>{copied ? <Check size={18} /> : <Copy size={18} />}<span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span></button></div></div></section>
    </main>
    <footer className="site-footer container"><span>© {new Date().getFullYear()} Ellen Wang</span><p>Made with care & a little curiosity.</p><div>{socials.map(({ label, url }) => <a key={label} href={url} target={label === 'Email' ? undefined : '_blank'} rel="noreferrer">{label}</a>)}</div></footer>
    </>}
  </>;
}
