import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { Eye, Stack, Sparkle, MapPin, Sun, Moon, X, Plus, Pause, Play, EnvelopeSimple, LinkedinLogo, GithubLogo, MagnifyingGlass, Compass, GridFour, Check, Copy, CaretRight, CaretUp } from '@phosphor-icons/react';
import projects from './data/projects.json';

const email = 'ellenwang918@gmail.com';
const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
type Theme = 'light' | 'dark';
type ProjectId = (typeof projects)[number]['id'];
type ProjectAction = (id: ProjectId) => void;
type InlineAccentProps = { tone: 'cyan' | 'lime' | 'yellow'; Icon: PhosphorIcon; className?: string };
type ProjectArtworkProps = { index: number; className?: string };
type ProjectCardProps = { index: number; onOpen: ProjectAction };
type CaseStudyProps = { id: ProjectId; onClose: () => void; onChange: ProjectAction };
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
  { value: '3', label: 'working customer segments', short: 'Making the customer picture clearer.', category: 'Customer research' },
];
const expertise = [
  { name: 'Research', Icon: MagnifyingGlass, title: 'Start with the people.', text: 'User research, customer analysis and research synthesis help me understand the people behind a product, uncover patterns, and connect visible problems with their underlying causes.', skills: ['User interviews', 'Research synthesis', 'Usability testing'], project: 2 },
  { name: 'Product', Icon: Compass, title: 'Make complexity usable.', text: 'I turn complex workflows into clear interactions and testable prototypes. Working closely with engineering, I balance user needs with technical feasibility to shape an achievable first release.', skills: ['Product strategy', 'Interaction design', 'Prototyping'], project: 3 },
  { name: 'Systems', Icon: GridFour, title: 'Build clarity that scales.', text: 'A design system connects components, people and delivery practices. I create reusable foundations, practical documentation and shared workflows to keep design and development aligned.', skills: ['Design systems', 'Documentation', 'Design governance'], project: 0 },
];
function InlineAccent({ tone, Icon, className = '' }: InlineAccentProps) {
  return <span className={`inline-accent accent-${tone} ${className}`} aria-hidden="true"><Icon weight="bold" /></span>;
}
function ProjectArtwork({ index, className = '' }: ProjectArtworkProps) {
  return <div className={`artwork artwork-${index} ${className}`}>
    <span className="artwork-label" aria-hidden="true">{outcomes[index].category}</span>
    {index === 0 ? <img className="system-shot" src={assetUrl('/assets/design-foundations.png')} alt="Illustrative design system foundations: colour, typography and components" loading="lazy" /> : <img className="editorial-art" src={assetUrl(projects[index].hero.src)} alt={projects[index].hero.alt} loading="lazy" />}
    <span className="artwork-index" aria-hidden="true">0{index + 1}</span>
  </div>;
}
function ProjectCard({ index, onOpen }: ProjectCardProps) {
  const project = projects[index];
  return <button className={`project-card ${index === 4 ? 'project-card-wide' : ''}`} onClick={() => onOpen(project.id)} aria-label={`Read ${project.title}`}>
    <div className="project-visual"><ProjectArtwork index={index} /><span className="project-open" aria-hidden="true"><Plus size={22} weight="bold" /></span></div>
    <div className="project-description"><div className="project-meta"><span>RIO TINTO</span><span>{project.metadata[2].value}</span></div><h3>{project.title}</h3><p>{outcomes[index].short}</p><div className="project-tags">{project.tags.slice(0, 2).map(tag => <span className="badge" key={tag}>{tag}</span>)}</div><span className="read-case">Read the case study <Plus size={16} /></span></div>
  </button>;
}
// Source content uses paragraphs, emphasis and lists. Render text without executable HTML.
function InlineText({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((piece, i) => piece.startsWith('**') ? <strong key={i}>{piece.slice(2, -2)}</strong> : piece);
}
function StoryContent({ content }: { content: string }) {
  return content.split(/\n\s*\n/).filter(Boolean).map((block, i) => {
    const lines = block.split('\n');
    if (lines.every(line => /^- /.test(line))) return <ul key={i}>{lines.map((line, j) => <li key={j}><InlineText text={line.slice(2)} /></li>)}</ul>;
    if (lines.every(line => /^\d+\. /.test(line))) return <ol key={i}>{lines.map((line, j) => <li key={j}><InlineText text={line.replace(/^\d+\. /, '')} /></li>)}</ol>;
    return <p key={i}><InlineText text={block} /></p>;
  });
}
function CaseStudy({ id, onClose, onChange }: CaseStudyProps) {
  const dialogRef = useRef<HTMLDialogElement>(null), scrollRef = useRef<HTMLElement>(null), headingRef = useRef<HTMLHeadingElement>(null), previousFocus = useRef<HTMLElement | null>(null);
  const index = projects.findIndex(p => p.id === id), project = projects[index];
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    const scrollY = window.scrollY, previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = previousOverflow; previousFocus.current?.focus({ preventScroll: true }); window.scrollTo({ top: scrollY, behavior: 'instant' }); };
  }, []);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); headingRef.current?.focus({ preventScroll: true }); }, [id]);
  return <dialog className="case-dialog" ref={dialogRef} aria-labelledby="case-title" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="case-shell"><div className="case-toolbar"><span className="mono">ELLEN WANG / SELECTED WORK / 0{index + 1}</span><button className="icon-button" onClick={onClose} aria-label="Close case study"><X size={22} /></button></div>
    <div className="case-body"><aside className="case-sidebar" aria-label="Case studies"><p className="mono">THE PROJECTS</p>{projects.map((p, i) => <button className={p.id === id ? 'selected' : ''} onClick={() => onChange(p.id)} aria-current={p.id === id ? 'true' : undefined} key={p.id}><span className="mono">0{i + 1}</span>{p.folderTitle}</button>)}<p className="case-sidebar-note">Complex products.<br />Clear experiences.</p></aside>
    <article className="case-content" ref={scrollRef}><img className="case-editorial" src={assetUrl(project.hero.src)} alt={project.hero.alt} /><div className="case-copy"><div className="project-tags">{project.tags.map(tag => <span className="badge" key={tag}>{tag}</span>)}</div><h2 id="case-title" ref={headingRef} tabIndex={-1}>{project.title}</h2><p className="case-summary">{project.summary}</p><dl className="case-metadata">{project.metadata.map(m => <div key={m.label}><dt className="mono">{m.label}</dt><dd>{m.value}</dd></div>)}</dl><div className="case-highlight"><strong>{outcomes[index].value}</strong><span>{outcomes[index].label}</span></div>
    {project.story.filter(section => section.content).map((section, i) => <section className="story-section" key={section.header}><div className="story-heading"><span className="mono">0{i + 1}</span><h3>{section.header}</h3></div><StoryContent content={section.content} />{index === 0 && section.header === 'The challenge' && <img className="story-image" src={assetUrl('/assets/3-search.svg')} alt="Three different search patterns found across the product" loading="lazy" />}{index === 0 && section.header === 'Outcome' && <div className="case-gallery"><figure><img src={assetUrl('/assets/design-foundations.png')} alt="Illustrative design system foundations" loading="lazy" /><figcaption>Design system foundations</figcaption></figure><figure><img src={assetUrl('/assets/design-documentation.png')} alt="Illustrative checkbox component documentation" loading="lazy" /><figcaption>Component documentation</figcaption></figure></div>}</section>)}
    <p className="confidential-note">Some details and original project visuals are confidential. The images shown are illustrative mock-ups created for public viewing and do not represent the actual work. You’re welcome to <a href={`mailto:${email}`}>email me</a> for a chat.</p><div className="case-footer"><button className="button button-outline" onClick={onClose}>Back to portfolio</button><button className="button" onClick={() => onChange(projects[(index + 1) % projects.length].id)}>Next case study <CaretRight size={16} /></button></div></div></article></div></div>
  </dialog>;
}
export function App() {
  const [activeSection, setActiveSection] = useState(''), [activeTab, setActiveTab] = useState(0), [paused, setPaused] = useState(false), [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => { try { return localStorage.getItem('ellen-theme') === 'dark' ? 'dark' : 'light'; } catch { return 'light'; } });
  const getProjectId = () => { const id = new URLSearchParams(window.location.search).get('project'); return projects.some(p => p.id === id) ? id : null; };
  const [projectId, setProjectId] = useState(getProjectId);
  const copyTimeout = useRef<number | undefined>(undefined);
  useEffect(() => { document.documentElement.dataset.theme = theme; try { localStorage.setItem('ellen-theme', theme); } catch { /* Preference storage is optional. */ } }, [theme]);
  useEffect(() => { const handlePop = () => setProjectId(getProjectId()); window.addEventListener('popstate', handlePop); return () => window.removeEventListener('popstate', handlePop); }, []);
  useEffect(() => { const project = projects.find(p => p.id === projectId); document.title = project ? `${project.folderTitle} — Ellen Wang` : 'Ellen Wang — Product Designer'; }, [projectId]);
  useEffect(() => { const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) setActiveSection(entry.target.id); }); }, { rootMargin: '-20% 0px -50% 0px' }); document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section)); return () => observer.disconnect(); }, []);
  useEffect(() => () => clearTimeout(copyTimeout.current), []);
  function openProject(id: ProjectId) { const url = new URL(window.location.href); url.searchParams.set('project', id); window.history[projectId ? 'replaceState' : 'pushState']({}, '', url); setProjectId(id); }
  function closeProject() { const url = new URL(window.location.href); url.searchParams.delete('project'); window.history.pushState({}, '', url); setProjectId(null); }
  async function copyEmail() { try { await navigator.clipboard.writeText(email); setCopied(true); clearTimeout(copyTimeout.current); copyTimeout.current = window.setTimeout(() => setCopied(false), 2500); } catch { window.location.href = `mailto:${email}`; } }
  const currentExpertise = expertise[activeTab], ExpertiseIcon = currentExpertise.Icon;
  const handleTabKey = (event: KeyboardEvent<HTMLDivElement>) => { let index = activeTab; if (event.key === 'ArrowRight') index = (index + 1) % expertise.length; else if (event.key === 'ArrowLeft') index = (index + expertise.length - 1) % expertise.length; else if (event.key === 'Home') index = 0; else if (event.key === 'End') index = expertise.length - 1; else return; event.preventDefault(); setActiveTab(index); document.getElementById(`expertise-tab-${index}`)?.focus(); };
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><a className="brand" href="#home" aria-label="Ellen Wang, home"><img src={assetUrl('/assets/logo_in_circle.svg')} alt="" width="32" height="32" /><span>Ellen Wang<span className="brand-period">.</span></span></a><div className="header-right"><span className="location"><MapPin size={16} weight="fill" /> Gold Coast, AU</span><button className="icon-button theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}</button></div></header>
    <nav className="capsule-nav" aria-label="Main navigation">{[['expertise', 'Expertise'], ['work', 'Work'], ['about', 'About'], ['contact', 'Contact']].map(([id, label]) => <a key={id} href={`#${id}`} className={`${id === 'contact' ? 'nav-contact' : ''} ${activeSection === id ? 'nav-active' : ''}`} aria-current={activeSection === id ? 'location' : undefined}>{label}</a>)}</nav>
    <main id="main">
      <section className="hero container" id="home" aria-labelledby="hero-title"><p className="eyebrow"><span className="intro-line" /> HI, I’M ELLEN WANG</p><h1 id="hero-title">I turn <InlineAccent tone="cyan" Icon={Eye} /> complexity<br className="desktop-break" /> into <InlineAccent tone="lime" Icon={Stack} /> clarity<span className="hero-dot">.</span> <InlineAccent tone="yellow" Icon={Sparkle} className="sparkle-accent" /></h1><div className="hero-bottom"><p>Product designer with a technical background.<br />Making complex digital products feel human.</p><div className="hero-actions"><a className="button" href="#contact">Get in touch</a><a className="button button-white" href="#work">Explore my work</a></div></div></section>
      <section className={`project-reel ${paused ? 'is-paused' : ''}`} aria-label="Project preview gallery"><div className="reel-track">{[0, 1].map(group => <div className="reel-group" key={group} aria-hidden={group === 1 ? 'true' : undefined}>{projects.map((p, index) => <button className="reel-card" key={p.id} tabIndex={group === 1 ? -1 : 0} onClick={() => openProject(p.id)} aria-label={`Preview ${p.title}`}><ProjectArtwork index={index} /><span className="reel-caption">{p.folderTitle}<Plus size={16} /></span></button>)}</div>)}</div><div className="reel-bottom container"><span className="mono">A FEW THINGS I’VE HELPED MAKE CLEARER</span><button className="reel-control" aria-label={`${paused ? 'Play' : 'Pause'} project gallery`} onClick={() => setPaused(!paused)}>{paused ? <Play size={14} weight="fill" /> : <Pause size={14} weight="fill" />}<span>{paused ? 'Play' : 'Pause'}</span></button></div></section>
      <section className="work-section container" id="work" aria-labelledby="work-title"><div className="section-heading"><div><p className="eyebrow">01 / SELECTED WORK</p><h2 id="work-title">Thoughtful design.<br /><span className="muted-heading">Real-world complexity.</span></h2></div><p className="section-intro">From research and service blueprints<br />to products and systems that scale.</p></div><div className="work-grid">{projects.map((p, index) => <ProjectCard key={p.id} index={index} onOpen={openProject} />)}</div><p className="work-note">Project visuals are illustrative. Some details are confidential.</p></section>
      <section className="expertise-section container" id="expertise" aria-labelledby="expertise-title"><div className="expertise-card"><div className="expertise-top"><div><p className="eyebrow">02 / HOW I WORK</p><h2 id="expertise-title">Bringing <InlineAccent tone="cyan" Icon={Eye} /> clarity<br />to the bigger picture.</h2></div><div className="tab-list" role="tablist" aria-label="Design expertise" onKeyDown={handleTabKey}>{expertise.map((item, index) => <button key={item.name} id={`expertise-tab-${index}`} role="tab" aria-selected={activeTab === index} aria-controls="expertise-panel" tabIndex={activeTab === index ? 0 : -1} onClick={() => setActiveTab(index)}>{item.name}</button>)}</div></div><div id="expertise-panel" className="expertise-panel" role="tabpanel" aria-labelledby={`expertise-tab-${activeTab}`} tabIndex={0}><div className="expertise-copy" key={activeTab}><ExpertiseIcon size={32} weight="regular" /><h3>{currentExpertise.title}</h3><p>{currentExpertise.text}</p><div className="project-tags">{currentExpertise.skills.map(skill => <span className="badge" key={skill}>{skill}</span>)}</div><button className="text-button" onClick={() => openProject(projects[currentExpertise.project].id)}>Explore a related project <Plus size={16} /></button></div><div className={`expertise-art expertise-art-${activeTab}`} aria-hidden="true"><div className="fan-card fan-back"><ProjectArtwork index={(currentExpertise.project + 1) % projects.length} /></div><div className="fan-card fan-front"><ProjectArtwork index={currentExpertise.project} /></div></div></div></div></section>
      <section className="about-section container" id="about" aria-labelledby="about-title"><p className="eyebrow">03 / THE PERSON BEHIND THE WORK</p><div className="about-layout"><div className="about-title"><h2 id="about-title">Curious by nature.<br />Practical by design.</h2><div className="about-signature"><img src={assetUrl('/assets/logo_in_circle.svg')} alt="" width="64" height="64" /><span>Ellen Wang<br /><span className="muted">Product designer</span></span></div></div><div className="about-copy"><p className="about-lead">I’m a product designer with a technical background, specialising in complex digital products.</p><p>I work across research, product strategy, interaction design and design systems to turn complex workflows into scalable experiences that users and engineering teams can understand.</p><p className="about-location"><MapPin size={20} /> Based on the Gold Coast, Australia.</p><div className="about-links">{socials.slice(0, 2).map(({ label, url, Icon }) => <a key={label} href={url} target="_blank" rel="noreferrer"><Icon size={20} />{label}</a>)}</div></div></div><div className="principle-row"><span>People first.</span><span>Clarity always.</span><span>Built together.</span></div></section>
      <section className="contact-section container" id="contact" aria-labelledby="contact-title"><div className="contact-card"><p className="eyebrow">04 / LET’S CONNECT</p><h2 id="contact-title">Have something<br /><span className="contact-line">complex <InlineAccent tone="yellow" Icon={Sparkle} /> in mind?</span></h2><div className="contact-bottom"><p>I’d love to hear about it.</p><a href={`mailto:${email}`} className="button button-white">Let’s talk <EnvelopeSimple size={18} /></a></div><div className="email-row"><a href={`mailto:${email}`}>{email}</a><button className="copy-button" aria-label={copied ? 'Email address copied' : 'Copy email address'} onClick={copyEmail}>{copied ? <Check size={18} /> : <Copy size={18} />}<span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span></button></div></div></section>
    </main>
    <footer className="site-footer container"><span>© {new Date().getFullYear()} Ellen Wang</span><p>Made with care & a little curiosity.</p><div>{socials.map(({ label, url }) => <a key={label} href={url} target={label === 'Email' ? undefined : '_blank'} rel="noreferrer">{label}</a>)}</div><a className="back-top" href="#home" aria-label="Back to top"><CaretUp size={18} /></a></footer>
    {projectId && <CaseStudy id={projectId} onClose={closeProject} onChange={openProject} />}
  </>;
}
