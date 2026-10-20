# Ellen Wang portfolio

A responsive React and TypeScript portfolio combining the supplied recording's editorial layout, Ellen Wang's published content, and Modern8-bits foundations.

[Live website](https://ellenwang918.github.io/portfolio-v2/) · [GitHub repository](https://github.com/ellenWang918/portfolio-v2)

![Portfolio preview](docs/screenshots/white-background.jpg)

## Preview and development

The local preview runs at http://localhost:4173/ when started on port 4173.

```sh
npm install
npm run dev -- --port 4173
npm run typecheck
npm run build
npm run preview
```

## Features

- Spacious hero with inline accent icons and a floating navigation pill.
- Moving project gallery with pause, hover/focus pause, and reduced-motion support.
- Four published case studies with standalone URLs, project navigation and browser history support; Customer Analysis is archived.
- About me, Design system and Product tabs with keyboard navigation.
- Responsive project grid, About section, email links, copy-email action, and social links.
- Persisted light/dark preference and self-hosted fonts.

## Editing

`src/data/projects.json` contains the original case-study copy and metadata. `src/App.tsx` contains the homepage narrative and typed page components, and `src/main.tsx` is the app entry point. `src/tokens.css` maps the design foundations; `src/portfolio.css` contains layout and responsive styling. Original artwork is in `public/assets`, and fonts are in `public/fonts`.

`npm run typecheck` checks the app and `vite.config.ts` with strict TypeScript settings. The production build runs this check before bundling. The Sites worker, build adapter, and hosting tests remain JavaScript for hosting compatibility.

Example case-study URL: `/work/design-system-palms`.

## Sources and adaptation

- Content and public project illustrations: [ellenwang.space](https://ellenwang.space/), retrieved 8 October 2026.
- Typography, neutral palette, spacing, component foundations, and theme roles: [Modern8-bits design system](https://modern8-bits-up.vercel.app/?path=/docs/foundation-design-token--docs).
- Composition, floating navigation, inline colorful motifs, horizontal gallery, staggered projects, and expertise tabs: supplied `ScreenRecording_10-08-2026 11-02-32_1.mp4`.
- Space Grotesk and IBM Plex font families: Google Fonts, self-hosted locally. Interface icons: Phosphor.

The recording is a layout reference. Homepage copy is adapted to Ellen's product-design practice. Public illustrative project artwork and confidentiality notes are retained. The source site's published dates are preserved.

## Validation

Run `npm run build`, `npm run test:sites`, and `npm run test:e2e` to check types, production packaging and visitor journeys. Install the test browser once with `npx playwright install chromium`. The browser suite checks desktop and mobile layouts against the production files on a static server with no single-page fallback: fresh case-study visits and refreshes, project navigation and history, keyboard tabs, accessible flip-card descriptions, and contact clipboard success/denial. Tests do not open an external email application.

For the GitHub Pages variant, set `GITHUB_PAGES=true` for both the build and browser tests. CI checks that variant before publishing. Screenshots in `docs/screenshots` are visual references, not automated test results.

## Hosting

This is a static frontend. Email actions open the visitor's email client. A custom backend is not required.

For Vercel, `vercel.json` explicitly selects Vite, runs `npm run build`, and publishes `dist/client`. This overrides an existing Next.js framework preset on the connected project. Requests to `/work/*` serve `index.html`, allowing case-study links, direct visits and refreshes to load the correct page.

The GitHub Pages workflow builds and publishes the site after each push to `main`. It sets `GITHUB_PAGES=true` to use the repository's `/portfolio-v2/` base path. The build copies the app entry into `work/<project-id>/index.html` for each published project so a static host can serve direct visits and refreshes. Local previews and other hosting targets use `/` by default.

The existing Sites-compatible worker and build adapter are preserved. `npm run build` creates `dist/client`, `dist/server`, and `dist/.openai/hosting.json`. Run `npm run test:sites` before a Sites handoff. For a conventional static host, publish `dist/client` with a single-page fallback to `index.html`.
