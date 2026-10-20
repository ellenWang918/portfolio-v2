import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { Eye, Stack, Sparkle, MapPin, Sun, Moon, EnvelopeSimple, LinkedinLogo, GithubLogo, Compass, GridFour, Check, Copy, CaretRight, CaretUp, ArrowRight, ArrowLeft, Pause, Play, ArrowCounterClockwise } from '@phosphor-icons/react';
import projects from './data/projects.json';
import { CapsuleNav } from './CapsuleNav';
import { ExpertiseTabs } from './ExpertiseTabs';
import { ReadingProgress } from './ReadingProgress';

const email = 'ellenwang918@gmail.com';
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
type Theme = 'light' | 'dark';
type ProjectId = (typeof projects)[number]['id'];
const projectUrl = (id: ProjectId) => `${import.meta.env.BASE_URL}work/${id}`;

type InlineAccentProps = { tone: 'cyan' | 'lime' | 'yellow'; Icon: PhosphorIcon; className?: string };
type ProjectArtworkProps = { index: number; className?: string };
type ProjectCardProps = { index: number };

const socials = [
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/zi-wang-456923171/', Icon: LinkedinLogo },
  { label: 'GitHub', url: 'https://github.com/ellenWang918', Icon: GithubLogo },
  { label: 'Email', url: `mailto:${email}`, Icon: EnvelopeSimple },
];
const outcomes = [
  { value: '100%', label: 'design team adoption', short: 'One shared source of truth.', category: 'Design systems' },
  { value: '4', label: 'usability sessions', short: 'A familiar pattern. A feasible MVP.', category: 'Product design' },
  { value: '16', label: 'interviews across 8 groups', short: 'Connecting people, processes & systems.', category: 'Service design' },
  { value: '12', label: 'user stories prototyped', short: 'From complex requirements to a testable experience.', category: 'Discovery & prototyping' },
];
const expertise = [
  { name: 'Design system', Icon: GridFour, title: 'Build clarity that scales.', text: 'A design system connects components, people and delivery practices. I create reusable foundations, practical documentation and shared workflows to keep design and development aligned.', skills: ['Design systems', 'Documentation', 'Design governance'], project: 0 },
  { name: 'Product', Icon: Compass, title: 'Make complexity usable.', text: 'I turn complex workflows into clear interactions and testable prototypes. Working closely with engineering, I balance user needs with technical feasibility to shape an achievable first release.', skills: ['Product strategy', 'Interaction design', 'Prototyping'], project: 3 },
];
function InlineAccent({ tone, Icon, className = '' }: InlineAccentProps) {
  return <span className={`inline-accent accent-${tone} ${className}`} aria-hidden="true"><Icon weight="bold" /></span>;
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
function ProjectArtwork({ index, className = '' }: ProjectArtworkProps) {
  return <div className={`artwork artwork-${index} ${className}`}>
    <span className="artwork-label" aria-hidden="true">{outcomes[index].category}</span>
    {index === 0 ? <img className="system-shot" src={assetUrl('/assets/Group%2014.svg')} alt="Illustrative design system foundations: colour, typography and components" loading="lazy" /> : <img className="editorial-art" src={assetUrl(projects[index].hero.src)} alt={projects[index].hero.alt} loading="lazy" />}
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
      <p>{outcomes[index].short}</p>
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
function KaizenVideo() {
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
    <video ref={videoRef} className="story-video" autoPlay muted loop playsInline preload="metadata" aria-label="Kaizen task interaction demo" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)}>
      <source src={assetUrl('/assets/kaizen-task-click-demo-v1.mp4')} type="video/mp4" />
      Your browser does not support embedded video. <a href={assetUrl('/assets/kaizen-task-click-demo-v1.mp4')}>Watch the Kaizen task interaction demo</a>.
    </video>
    <div className="story-video-controls" role="group" aria-label="Video playback">
      <button type="button" aria-label={playing ? 'Pause video' : 'Play video'} title={playing ? 'Pause' : 'Play'} onClick={togglePlayback}>{playing ? <Pause size={16} weight="fill" aria-hidden="true" /> : <Play size={16} weight="fill" aria-hidden="true" />}</button>
      <button type="button" aria-label="Replay video" title="Replay" onClick={replay}><ArrowCounterClockwise size={18} aria-hidden="true" /></button>
    </div>
  </div>;
}
function ApproachTimeline({ content }: { content: string }) {
  const blocks = content.split(/\n\s*\n/).filter(Boolean);
  const steps = blocks.filter(block => block.startsWith('**'));
  const introduction = blocks.filter(block => !block.startsWith('**')).join('\n\n');
  return <div className="approach-layout"><ol className="approach-timeline" role="list">{steps.map((step, i) => {
    const [title, ...description] = step.split('\n');
    return <li key={i}><strong>{title.replace(/^\*\*|\*\*$/g, '')}</strong><p>{description.join(' ')}</p></li>;
  })}</ol><div className="approach-narrative"><StoryContent content={introduction} /></div></div>;
}
function StoryContent({ content, showPalmsComparison = false }: { content: string; showPalmsComparison?: boolean }) {
  return content.split(/\n\s*\n/).filter(Boolean).map((block, i) => {
    if (block.startsWith('**How might we help teams keep design and implementation aligned as PALMS grows,')) return <blockquote className="palms-problem-quote" key={i}><p>{block.slice(2, -2)}</p></blockquote>;
    const lines = block.split('\n');
    if (lines.every(line => /^- /.test(line))) return <ul key={i}>{lines.map((line, j) => <li key={j}><InlineText text={line.slice(2)} /></li>)}</ul>;
    if (lines.every(line => /^\d+\. /.test(line))) return <ol key={i}>{lines.map((line, j) => <li key={j}><InlineText text={line.replace(/^\d+\. /, '')} /></li>)}</ol>;
    return <Fragment key={i}><p><InlineText text={block} /></p>{showPalmsComparison && block.startsWith('The initial interface prioritised speed to market.') && <img className="story-image" src={assetUrl('/assets/3-search.svg')} alt="Three different search patterns found across the product" loading="lazy" />}</Fragment>;
  });
}
function CaseStudy({ id }: { id: ProjectId }) {
  const articleRef = useRef<HTMLElement>(null);
  const index = projects.findIndex(p => p.id === id), project = projects[index];
  const sections = project.story.filter(section => section.content || section.header === 'Solution');
  return <main id="main" className="case-page">
    <ReadingProgress key={id} articleRef={articleRef} />
    <div className="case-container container">
    <div className="case-toolbar"><span className="mono">ELLEN WANG / SELECTED WORK / 0{index + 1}</span><a className="text-button case-back" href={`${import.meta.env.BASE_URL}#home`}><ArrowLeft size={16} aria-hidden="true" /><span className="text-button-label">Back to Home</span></a></div>
    <div className="case-body">
      <details className="case-project-picker" key={id}>
        <summary>Projects <span>{project.folderTitle}</span></summary>
        <nav aria-label="Case studies">
          {projects.map((p, i) => <a href={projectUrl(p.id)} aria-current={p.id === id ? 'page' : undefined} key={p.id}><span className="mono">0{i + 1}</span>{p.id === 'design-system-palms' ? 'PALMS Design System' : p.folderTitle}</a>)}
        </nav>
      </details>
      <aside className="case-sidebar" aria-label="Case studies">
        <div className="case-sidebar-content">
          <div className="case-project-list">
            <p className="mono">CASE STUDIES</p>
            {projects.map((p, i) => <a className={p.id === id ? 'selected' : ''} href={projectUrl(p.id)} aria-current={p.id === id ? 'page' : undefined} key={p.id}><span className="mono">0{i + 1}</span>{p.id === 'design-system-palms' ? 'PALMS Design System' : p.folderTitle}</a>)}
          </div>
        </div>
      </aside>
      <article id="case-article" className="case-content" ref={articleRef}>
        <img className="case-editorial" src={assetUrl(project.hero.src)} alt={project.hero.alt} />
        <div className="case-copy"><div className="project-tags">{project.tags.map(tag => <span className="badge" key={tag}>{tag}</span>)}</div><h1 id="case-title">{project.title}</h1><p className="case-summary">{project.summary}</p><dl className="case-metadata">{project.metadata.map(m => <div key={m.label}><dt className="mono">{m.label}</dt><dd>{m.value}</dd></div>)}</dl>
    {sections.map((section, i) => <section className={`story-section ${id === 'design-system-palms' && section.header === 'Background' ? 'palms-background' : id === 'design-system-palms' && section.header === 'My approach' ? 'palms-approach' : ''}`} id={`case-section-${i}`} key={section.header}>
      <div className="story-heading"><span className="mono">0{i + 1}</span><h2>{section.header}</h2></div>
      {id === 'design-system-palms' && section.header === 'Background' ? <><StoryContent content={section.content.split('\n\n').slice(0, 2).join('\n\n')} showPalmsComparison /><div className="palms-background-insight"><div><StoryContent content={section.content.split('\n\n').slice(2).join('\n\n')} /></div><img src={assetUrl('/assets/palms-team-feedback.png')} alt="Quotes from the team about finding designs, component flexibility and design consistency." loading="lazy" /></div></>
        : id === 'design-system-palms' && section.header === 'My approach' ? <ApproachCards content={section.content} results={project.approachResults ?? []} />
        : id === 'feature-improvement-sps' && section.header === 'Background' ? <div className="solver-background-grid"><div><StoryContent content={section.content} /></div><img src={assetUrl('/assets/solver-kaizen-wireframe.png')} alt="Simplified Solver Kaizen wireframe showing search, filters and a list of improvements with status, lead, sponsor, site and creation date. Content is anonymised." width={1586} height={992} loading="lazy" /></div>
        : id === 'feature-improvement-sps' && section.header === 'My approach' ? <><ApproachTimeline content={section.content} /><img className="story-image solver-research-plan" src={assetUrl('/assets/solver-kaizen-research-plan.png')} alt="Kaizen concept research plan showing objectives, methodology, participants and questions across preparation, event and follow up phases, with sensitive details blurred." width={1727} height={911} loading="lazy" /></>
        : id === 'feature-improvement-sps' && section.header === 'My contribution to the action workflow' ? <><StoryContent content={section.content} /><KaizenVideo /></>
        : <StoryContent content={section.content} />}
      {index === 0 && section.header === 'Outcome' && <div className="case-gallery"><figure><img src={assetUrl('/assets/Group%2014.svg')} alt="Illustrative design system foundations" loading="lazy" /><figcaption>Design system foundations</figcaption></figure></div>}
    </section>)}
    <p className="confidential-note">Some details and original project visuals are confidential. The images shown are illustrative mock-ups created for public viewing and do not represent the actual work. You’re welcome to <a href={`mailto:${email}`}>email me</a> for a chat.</p><div className="case-footer"><a className="button button-outline" href={`${import.meta.env.BASE_URL}#home`}>Back to Home</a><a className="button" href={projectUrl(projects[(index + 1) % projects.length].id)}>Next case study <CaretRight size={16} /></a></div></div></article>    </div>
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
  const aboutTabs = [{ name: 'About me' }, ...expertise];
  const currentExpertise = expertise[Math.max(0, activeTab - 1)], ExpertiseIcon = currentExpertise.Icon;
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><a className="brand" href={`${import.meta.env.BASE_URL}#home`} aria-label="Ellen Wang, home"><img src={assetUrl('/assets/logo_in_circle.svg')} alt="" width="32" height="32" /><span>Ellen Wang<span className="brand-period">.</span></span></a><div className="header-right"><span className="availability"><span className="availability-dot" aria-hidden="true" />Available for work</span><button className="icon-button theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}</button></div></header>
    {projectId ? <CaseStudy id={projectId} /> : <>
    <CapsuleNav activeSection={activeSection} />
    <main id="main">
      <section className="hero" id="home" aria-labelledby="hero-title"><div className="container"><p className="eyebrow"><span className="intro-wave" aria-hidden="true">👋</span> HI, I’M ELLEN WANG</p><h1 id="hero-title">I turn <ComplexityScribble /> <span className="hero-ambiguity">ambiguity</span><br className="desktop-break" /> into <InlineAccent tone="lime" Icon={Stack} /> clarity<span className="hero-dot">.</span> <InlineAccent tone="yellow" Icon={Sparkle} className="sparkle-accent" /></h1><div className="hero-bottom"><p>Product designer with a technical background.<br />Making complex digital products feel human.</p><div className="hero-actions"><a className="button" href="#contact">Get in touch</a><a className="button button-white" href="#work">Explore my work</a></div></div></div></section>
      <section className="project-reel" aria-label="Project preview gallery"><div className="reel-track">{[0, 1].map(group => <div className="reel-group" key={group} aria-hidden={group === 1 ? 'true' : undefined}>{projects.map((p, index) => <a className="reel-card" key={p.id} tabIndex={group === 1 ? -1 : 0} href={projectUrl(p.id)} aria-label={`Preview ${p.title}`}><ProjectArtwork index={index} /><span className="reel-caption">{p.folderTitle}</span></a>)}</div>)}</div></section>
      <section className="expertise-section container" id="about" aria-labelledby="expertise-title"><div className="expertise-card"><div className="expertise-top"><div><h2 id="expertise-title">About Ellen <InlineAccent tone="cyan" Icon={Eye} /></h2></div><ExpertiseTabs items={aboutTabs} activeTab={activeTab} onChange={setActiveTab} /></div><div id="expertise-panel" className={`expertise-panel ${activeTab === 0 ? 'about-me-panel' : ''}`} role="tabpanel" aria-labelledby={`expertise-tab-${activeTab}`} tabIndex={0}>{activeTab === 0 ? <div className="about-me-content"><div className="about-layout"><div className="about-title"><h2 id="about-title">Curious by nature.<br />Practical by design.</h2><div className="about-signature"><img src={assetUrl('/assets/logo_in_circle.svg')} alt="" width="64" height="64" /><span>Ellen Wang<br /><span className="muted">Product designer</span></span></div></div><div className="about-copy"><p className="about-lead">I’m a product designer with a technical background, specialising in complex digital products.</p><p>I work across research, product strategy, interaction design and design systems to turn complex workflows into scalable experiences that users and engineering teams can understand.</p><p className="about-location"><MapPin size={20} /> Based on the Gold Coast, Australia.</p><div className="about-links">{socials.slice(0, 2).map(({ label, url, Icon }) => <a key={label} href={url} target="_blank" rel="noreferrer"><Icon size={20} />{label}</a>)}</div></div></div><div className="principle-row"><span>People first.</span><span>Clarity always.</span><span>Built together.</span></div></div> : <><div className="expertise-copy" key={activeTab}><ExpertiseIcon size={32} weight="regular" /><h3>{currentExpertise.title}</h3><p>{currentExpertise.text}</p><div className="project-tags">{currentExpertise.skills.map(skill => <span className="badge" key={skill}>{skill}</span>)}</div><a className="text-button" href={projectUrl(projects[currentExpertise.project].id)}><span className="text-button-label">Explore a related project</span><ArrowRight size={16} aria-hidden="true" /></a></div><div className={`expertise-art expertise-art-${activeTab}`} aria-hidden="true"><div className="fan-card fan-back"><ProjectArtwork index={(currentExpertise.project + 1) % projects.length} /></div><div className="fan-card fan-front"><ProjectArtwork index={currentExpertise.project} /></div></div></>}</div></div></section>
      <section className="work-section" id="work" aria-labelledby="work-title"><div className="container"><div className="section-heading"><div><h2 id="work-title">Selected work</h2></div></div><div className="work-grid">{projects.map((p, index) => <ProjectCard key={p.id} index={index} />)}</div></div></section>
      <section className="contact-section container" id="contact" aria-labelledby="contact-title"><div className="contact-card"><h2 id="contact-title">Get in touch! <InlineAccent tone="yellow" Icon={Sparkle} /></h2><div className="contact-bottom"><p>Want to work together or have a question? Reach out, I'm always open for a chat.</p><a href={`mailto:${email}`} className="button button-white">Let’s talk <EnvelopeSimple size={18} /></a></div><div className="email-row"><a href={`mailto:${email}`}>{email}</a><button className="copy-button" aria-label={copied ? 'Email address copied' : 'Copy email address'} onClick={copyEmail}>{copied ? <Check size={18} /> : <Copy size={18} />}<span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span></button></div></div></section>
    </main>
    <footer className="site-footer container"><span>© {new Date().getFullYear()} Ellen Wang</span><p>Made with care & a little curiosity.</p><div>{socials.map(({ label, url }) => <a key={label} href={url} target={label === 'Email' ? undefined : '_blank'} rel="noreferrer">{label}</a>)}</div><a className="back-top" href="#home" aria-label="Back to top"><CaretUp size={18} /></a></footer>
    </>}
  </>;
}
