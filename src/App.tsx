import { useEffect, useRef, useState } from 'react';

import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { Eye, Stack, Sparkle, MapPin, Sun, Moon, EnvelopeSimple, LinkedinLogo, GithubLogo, MagnifyingGlass, Compass, GridFour, Check, Copy, CaretRight, CaretUp, ArrowRight, ArrowLeft } from '@phosphor-icons/react';
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
  { value: '3', label: 'working customer segments', short: 'Making the customer picture clearer.', category: 'Customer research' },
];
const expertise = [
  { name: 'Design system', Icon: GridFour, title: 'Build clarity that scales.', text: 'A design system connects components, people and delivery practices. I create reusable foundations, practical documentation and shared workflows to keep design and development aligned.', skills: ['Design systems', 'Documentation', 'Design governance'], project: 0 },
  { name: 'Research', Icon: MagnifyingGlass, title: 'Start with the people.', text: 'User research, customer analysis and research synthesis help me understand the people behind a product, uncover patterns, and connect visible problems with their underlying causes.', skills: ['User interviews', 'Research synthesis', 'Usability testing'], project: 2 },
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
    {index === 0 ? <img className="system-shot" src={assetUrl('/assets/design-foundations.png')} alt="Illustrative design system foundations: colour, typography and components" loading="lazy" /> : <img className="editorial-art" src={assetUrl(projects[index].hero.src)} alt={projects[index].hero.alt} loading="lazy" />}
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
function CaseStudy({ id }: { id: ProjectId }) {
  const articleRef = useRef<HTMLElement>(null);
  const index = projects.findIndex(p => p.id === id), project = projects[index];
  const sections = project.story.filter(section => section.content);
  return <main id="main" className="case-page container">
    <ReadingProgress key={id} articleRef={articleRef} />
    <div className="case-toolbar"><span className="mono">ELLEN WANG / SELECTED WORK / 0{index + 1}</span><a className="text-button case-back" href={`${import.meta.env.BASE_URL}#home`}><ArrowLeft size={16} aria-hidden="true" /><span className="text-button-label">Back to Home</span></a></div>
    <div className="case-body">
      <aside className="case-sidebar" aria-label="Case studies">
        <div className="case-sidebar-content">
          <div className="case-project-list">
            <p className="mono">THE PROJECTS</p>
            {projects.map((p, i) => <a className={p.id === id ? 'selected' : ''} href={projectUrl(p.id)} aria-current={p.id === id ? 'page' : undefined} key={p.id}><span className="mono">0{i + 1}</span>{p.folderTitle}</a>)}
          </div>
        </div>
      </aside>
      <article id="case-article" className="case-content" ref={articleRef}>
        <img className="case-editorial" src={assetUrl(project.hero.src)} alt={project.hero.alt} />
        <div className="case-copy"><div className="project-tags">{project.tags.map(tag => <span className="badge" key={tag}>{tag}</span>)}</div><h1 id="case-title">{project.title}</h1><p className="case-summary">{project.summary}</p><dl className="case-metadata">{project.metadata.map(m => <div key={m.label}><dt className="mono">{m.label}</dt><dd>{m.value}</dd></div>)}</dl><div className="case-highlight"><strong>{outcomes[index].value}</strong><span>{outcomes[index].label}</span></div>
    {sections.map((section, i) => <section className="story-section" id={`case-section-${i}`} key={section.header}><div className="story-heading"><span className="mono">0{i + 1}</span><h2>{section.header}</h2></div><StoryContent content={section.content} />{index === 0 && section.header === 'The challenge' && <img className="story-image" src={assetUrl('/assets/3-search.svg')} alt="Three different search patterns found across the product" loading="lazy" />}{index === 0 && section.header === 'Outcome' && <div className="case-gallery"><figure><img src={assetUrl('/assets/design-foundations.png')} alt="Illustrative design system foundations" loading="lazy" /><figcaption>Design system foundations</figcaption></figure><figure><img src={assetUrl('/assets/design-documentation.png')} alt="Illustrative checkbox component documentation" loading="lazy" /><figcaption>Component documentation</figcaption></figure></div>}</section>)}
    <p className="confidential-note">Some details and original project visuals are confidential. The images shown are illustrative mock-ups created for public viewing and do not represent the actual work. You’re welcome to <a href={`mailto:${email}`}>email me</a> for a chat.</p><div className="case-footer"><a className="button button-outline" href={`${import.meta.env.BASE_URL}#home`}>Back to Home</a><a className="button" href={projectUrl(projects[(index + 1) % projects.length].id)}>Next case study <CaretRight size={16} /></a></div></div></article>    </div>
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
  const currentExpertise = expertise[activeTab], ExpertiseIcon = currentExpertise.Icon;
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><a className="brand" href={`${import.meta.env.BASE_URL}#home`} aria-label="Ellen Wang, home"><img src={assetUrl('/assets/logo_in_circle.svg')} alt="" width="32" height="32" /><span>Ellen Wang<span className="brand-period">.</span></span></a><div className="header-right"><span className="availability"><span className="availability-dot" aria-hidden="true" />Available for work</span><button className="icon-button theme-toggle" aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>{theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}</button></div></header>
    {projectId ? <CaseStudy id={projectId} /> : <>
    <CapsuleNav activeSection={activeSection} />
    <main id="main">
      <section className="hero" id="home" aria-labelledby="hero-title"><div className="container"><p className="eyebrow"><span className="intro-wave" aria-hidden="true">👋</span> HI, I’M ELLEN WANG</p><h1 id="hero-title">I turn <ComplexityScribble /> <span className="hero-ambiguity">ambiguity</span><br className="desktop-break" /> into <InlineAccent tone="lime" Icon={Stack} /> clarity<span className="hero-dot">.</span> <InlineAccent tone="yellow" Icon={Sparkle} className="sparkle-accent" /></h1><div className="hero-bottom"><p>Product designer with a technical background.<br />Making complex digital products feel human.</p><div className="hero-actions"><a className="button" href="#contact">Get in touch</a><a className="button button-white" href="#work">Explore my work</a></div></div></div></section>
      <section className="project-reel" aria-label="Project preview gallery"><div className="reel-track">{[0, 1].map(group => <div className="reel-group" key={group} aria-hidden={group === 1 ? 'true' : undefined}>{projects.map((p, index) => <a className="reel-card" key={p.id} tabIndex={group === 1 ? -1 : 0} href={projectUrl(p.id)} aria-label={`Preview ${p.title}`}><ProjectArtwork index={index} /><span className="reel-caption">{p.folderTitle}</span></a>)}</div>)}</div></section>
      <section className="expertise-section container" id="expertise" aria-labelledby="expertise-title"><div className="expertise-card"><div className="expertise-top"><div><h2 id="expertise-title">Bringing <InlineAccent tone="cyan" Icon={Eye} /> clarity<br />to the bigger picture.</h2></div><ExpertiseTabs items={expertise} activeTab={activeTab} onChange={setActiveTab} /></div><div id="expertise-panel" className="expertise-panel" role="tabpanel" aria-labelledby={`expertise-tab-${activeTab}`} tabIndex={0}><div className="expertise-copy" key={activeTab}><ExpertiseIcon size={32} weight="regular" /><h3>{currentExpertise.title}</h3><p>{currentExpertise.text}</p><div className="project-tags">{currentExpertise.skills.map(skill => <span className="badge" key={skill}>{skill}</span>)}</div><a className="text-button" href={projectUrl(projects[currentExpertise.project].id)}><span className="text-button-label">Explore a related project</span><ArrowRight size={16} aria-hidden="true" /></a></div><div className={`expertise-art expertise-art-${activeTab}`} aria-hidden="true"><div className="fan-card fan-back"><ProjectArtwork index={(currentExpertise.project + 1) % projects.length} /></div><div className="fan-card fan-front"><ProjectArtwork index={currentExpertise.project} /></div></div></div></div></section>
      <section className="work-section" id="work" aria-labelledby="work-title"><div className="container"><div className="section-heading"><div><h2 id="work-title">Thoughtful design.<br /><span className="muted-heading">Real-world complexity.</span></h2></div></div><div className="work-grid">{projects.map((p, index) => <ProjectCard key={p.id} index={index} />)}</div><p className="work-note">Project visuals are illustrative. Some details are confidential.</p></div></section>
      <section className="about-section container" id="about" aria-labelledby="about-title"><div className="about-layout"><div className="about-title"><h2 id="about-title">Curious by nature.<br />Practical by design.</h2><div className="about-signature"><img src={assetUrl('/assets/logo_in_circle.svg')} alt="" width="64" height="64" /><span>Ellen Wang<br /><span className="muted">Product designer</span></span></div></div><div className="about-copy"><p className="about-lead">I’m a product designer with a technical background, specialising in complex digital products.</p><p>I work across research, product strategy, interaction design and design systems to turn complex workflows into scalable experiences that users and engineering teams can understand.</p><p className="about-location"><MapPin size={20} /> Based on the Gold Coast, Australia.</p><div className="about-links">{socials.slice(0, 2).map(({ label, url, Icon }) => <a key={label} href={url} target="_blank" rel="noreferrer"><Icon size={20} />{label}</a>)}</div></div></div><div className="principle-row"><span>People first.</span><span>Clarity always.</span><span>Built together.</span></div></section>
      <section className="contact-section container" id="contact" aria-labelledby="contact-title"><div className="contact-card"><h2 id="contact-title">Have something<br /><span className="contact-line">complex <InlineAccent tone="yellow" Icon={Sparkle} /> in mind?</span></h2><div className="contact-bottom"><p>I’d love to hear about it.</p><a href={`mailto:${email}`} className="button button-white">Let’s talk <EnvelopeSimple size={18} /></a></div><div className="email-row"><a href={`mailto:${email}`}>{email}</a><button className="copy-button" aria-label={copied ? 'Email address copied' : 'Copy email address'} onClick={copyEmail}>{copied ? <Check size={18} /> : <Copy size={18} />}<span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span></button></div></div></section>
    </main>
    <footer className="site-footer container"><span>© {new Date().getFullYear()} Ellen Wang</span><p>Made with care & a little curiosity.</p><div>{socials.map(({ label, url }) => <a key={label} href={url} target={label === 'Email' ? undefined : '_blank'} rel="noreferrer">{label}</a>)}</div><a className="back-top" href="#home" aria-label="Back to top"><CaretUp size={18} /></a></footer>
    </>}
  </>;
}
