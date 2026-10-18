# Prototype Instructions

Use pure white (`#ffffff`) as the light-theme page background, per the user's preference. Preserve the optional dark theme.

Use the selected soft-glow mockup for the background treatment: diffuse cyan and lime glows behind the right side of the Home hero, fading into the white page, and a pale-grey (#f5f6f7) Expertise card. Do not use the dot grid. Preserve the optional dark theme with a dark Expertise surface and restrained glows.
Make the hero background span the full page width at every screen size. Keep the hero content inside the existing centred container with its original gutters.

Use IBM Plex Sans at 14px and medium weight (500) for the Home introduction label, "HI, I’M ELLEN WANG", preserving its letter spacing. Keep a compact 6px gap between the emoji and text, and align them along the bottom.

Do not show the gallery's bottom caption ("A FEW THINGS I’VE HELPED MAKE CLEARER") or its Pause/Play control row. Keep the preview cards and their individual captions, with automatic motion pausing on hover or keyboard focus.
Use light, diffuse shadows around the carousel preview artwork, with restrained shadows in the dark theme. Keep the shadows visible beyond the gallery's vertical edges.
Give the Customer Analysis carousel artwork (`artwork-4`) an especially soft, blended shadow with a wide blur and no tight contact-shadow layer.
Show only the project name in each carousel caption, without a plus icon.
On carousel-card hover or keyboard focus, gently enlarge the active card and subtly blur and fade the other cards' artwork while keeping captions sharp. Restore the cards on exit, and omit enlargement for reduced motion and touch-only hover.

Precede the Home introduction with a 👋 emoji instead of a line. On hover, enlarge the emoji slightly and wave once per pointer entry; respect reduced-motion preferences.

Keep routine completion updates concise and omit preview images unless the user asks for one or a visual explanation is needed.

Keep the pill navigation fixed at the bottom centre of the viewport on desktop and mobile, with safe-area spacing and enough footer clearance to keep links accessible.

Show "Available for work" in the top-right header instead of location details, preceded by a green dot with a soft, diffused glow. Keep the status readable on desktop and mobile.

Preserve the logo and availability row's original top padding: 28px on desktop and tablet, and 20px on mobile. Requests for Home header section spacing refer to the introduction, not the logo row.
Keep the increased Home introduction spacing: use 316px of hero top padding on desktop, 396px on wide desktop, 256px on tablet, and 258px on mobile.
Use "I turn ambiguity into clarity." as the Home hero headline.
Apply a very light static blur (`.01em`) to the word "ambiguity" in the Home headline, scaled with its font size so it remains legible on desktop and mobile.
Reveal the Home headline on page load with a gentle fade and upward motion, playing once. Show it immediately when reduced motion is preferred, and preserve the light blur on "ambiguity".
Omit the Work section's introductory sentence, "From research and service blueprints to products and systems that scale."
Use a loose hand-drawn tangle with a trailing loop, inspired by the supplied scribble reference, in place of the eye in the Home hero. Preserve the cyan pill background and render the scribble in black in both themes. Keep the Expertise eye accent.

Use a right arrow (→) after "Explore a related project" in the Expertise section and "Read the case study" on project cards.

Keep text-button labels stationary. On hover and keyboard focus, reveal a 1px dot centred beneath the label, then extend it symmetrically into a thin 1px underline; glide the arrow 8px right over 240ms. Reverse on exit and respect reduced-motion preferences.

Do not show a circular plus overlay on case-study cards, including on hover, keyboard focus, and mobile.
Use a soft cyan/lime glow in the full-width Work section background, matching the Home hero's colours and opacity, with the content kept inside its existing centred container. Preserve the original individual artwork colours on both the Work cards and carousel. The glow belongs to the section background, not the cards.

Place the tags/chips immediately before each case-study card heading, after the company and date metadata.
Open each case study as a standalone page at /work/<project-id>, not a popup. Use normal links for cards, carousel previews, related projects, the project sidebar, and next-project navigation. Preserve all case-study content, provide Back to Home links, and support direct visits, refresh, and browser Back/Forward.
Use the first full-page case-study layout, as confirmed by the user: "ELLEN WANG / SELECTED WORK / 01" breadcrumb on the left and "← Back to Home" on the right of the top toolbar. Leave no gap between the toolbar divider and the content section on desktop or mobile. Extend THE PROJECTS sidebar's right border to the bottom of the full case-study content, while keeping its inner project navigation sticky. Show the hero image before the tags and title on the right. Keep the Back link's centred-dot underline and 8px leftward arrow motion. Preserve independent copy removals, including the omitted sidebar tagline.
Omit the case-study sidebar tagline, "Complex products. Clear experiences."
Leave no horizontal grid gap between the case-study project sidebar and the article; the article starts immediately beside the sidebar divider on desktop and tablet.
Keep the case-study toolbar's bottom padding compact: 12px on desktop and tablet, and 10px on mobile.
Show a fixed circular Back to top button in the bottom-right corner of every case-study page, 32px from the edges on desktop and 16px on mobile, with safe-area spacing. Use the existing action colours and an upward caret. Scroll smoothly to the page top and respect reduced-motion preferences. Keep 112px of page-bottom padding on desktop and 96px on mobile so the fixed button leaves footer navigation clear.
Show a thin reading-progress bar fixed at the top of every case-study page, aligned with the centred case-study container's inner edges and side gutters. Fill it as the article scrolls, reaching 100% when the article's end is visible. Support desktop, mobile, both themes, and reduced motion.

Use IBM Plex Sans for tag/chip labels, with compact padding of 2px vertically and 10px horizontally.

Order the pill menu and page sections as Home, Expertise, Work, About, Contact. Keep the project preview gallery with the Home introduction.
Start the Expertise, Work, About, and Contact sections with their main headings; omit numbered section labels such as "01 / HOW I WORK" and their extra spacing.

Keep spacing between section content blocks 40% tighter than the original, except for the enlarged gap above the carousel. Desktop gaps: Hero to gallery 75.2px (84.8px on wide desktop and 65.6px on tablet), gallery to Expertise card 88.8px, Expertise to Work 76.8px, Work to About 88.8px, About to Contact 76.8px, Contact to footer 28.8px. Mobile gaps: 52.8px, 57.6px, 43.2px, 43.2px, 43.2px, and 28.8px respectively. Preserve internal component spacing and bottom navigation clearance.

Style all pill menu items equally, including Contact. Use one white background pill that follows hovered items with fluid stretching motion and returns to the active section when the pointer leaves. Keep the active item highlighted, support keyboard focus, and respect reduced-motion preferences.
Order the Expertise tabs as Design system, Research, Product, with Design system selected initially. Style them as a grey pill menu with the same fluid stretching highlight motion as the bottom navigation. Use a light grey track (#e0e1e3) and white highlight in the light theme, with matching dark-theme surfaces. Preserve tab selection, keyboard navigation, and reduced-motion support.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

Use TypeScript for app code (`.ts`/`.tsx`) and the Vite configuration. Keep strict type checking enabled, and run it as part of the production build.

At case-study viewport widths of 1055px and below, use a single-column layout with a compact expandable Projects navigation above the article. Adapt heading and metadata layouts before mobile widths, keep 20px mobile case-study gutters, and allow content to wrap without horizontal clipping.

Customer Analysis is archived, not a published case study. Keep its complete content and outcome in archive/case-studies/customer-data-analysis-commercial.json and preserve its artwork assets. Exclude it from public case-study routes, Work cards, carousel previews, project navigation, and next-project links.

Use "Get in touch!" as the Contact heading and "Want to work together or have a question? Reach out, I'm always open for a chat." as its supporting copy.

Keep the yellow sparkle pill accent beside the Contact heading, including with the updated Get in touch! copy.

The former Expertise section is now About, with tabs ordered About me, Design system, Product. Select About me initially and include all content from the former separate About section in that tab. Remove the Research tab and separate About section. The bottom navigation and page order are Home, About, Work, Contact.

Use About Ellen as the former Expertise section heading, and About as its bottom navigation label. Preserve all section content, tabs, and the #about anchor.

Use 48px desktop padding for the About Ellen card, and no additional bottom padding on .about-me-content beneath the principles row. Preserve the existing tablet and mobile card padding.

Use 48px margin-top for .principle-row in the About me tab on desktop and tablet. On mobile use 26.2px, applying the same 48/88 reduction ratio to the original 48px mobile margin.

On mobile, give the About Ellen card 28px vertical and 24px horizontal padding, including 28px beneath the principles row. Keep .about-me-content free of additional bottom padding.

Use 48px Contact card padding on desktop and tablet; preserve the existing mobile padding.

Keep the Contact card's Let's talk button label on one line at every screen size; prevent the button from shrinking and wrapping its text.

Use Selected work as the Work section heading.

Omit the Work section note: Project visuals are illustrative. Some details are confidential.

Keep About-to-Work and Work-to-Contact gaps equal via --section-gap: 76.8px on desktop/tablet and 43.2px on mobile.

Use IBM Plex Sans everywhere previously styled with IBM Plex Mono, through --font-mono referencing --font-body. Preserve all existing font sizes, weights, letter spacing, line heights, and other styles.

Omit the case-highlight outcome block from every case-study page. Preserve the outcome content in project records and story sections.

Use PALMS Design System for the first case-study project navigation label (01 PALMS Design System), in both desktop sidebar and compact navigation.

Use CASE STUDIES as the case-study sidebar heading instead of THE PROJECTS.

Use Design Governance instead of Governance in the PALMS case-study tags.

Use Web instead of Design Review in the PALMS case-study tags.

For PALMS, show the three search patterns image in Background immediately after the paragraph beginning The initial interface prioritised speed to market, before the stakeholder research paragraph.

Show only the supplied design system foundations image in PALMS Outcome, spanning the full article width. Omit the component documentation image.

Style the highlighted PALMS Background problem statement in Space Grotesk at 1.25 times the body font size and medium weight, distinct from the surrounding IBM Plex Sans copy.

Also italicise the highlighted PALMS Background problem statement.

For PALMS, place the updated team quotes image beside the Background stakeholder research paragraph and problem statement on wide screens, stacking beneath that text at 1055px and below. Do not show it in My approach.

Render the PALMS Background problem statement as a semantic blockquote, with an italic Space Grotesk statement, no background and a black left accent line.

In the PALMS Background side-by-side layout, align the bottom of the problem statement quote with the bottom of the team quotes image; retain natural stacked spacing on smaller screens.

Preserve the team quotes image's intrinsic aspect ratio with height auto and object-fit contain in the PALMS Background grid; never stretch it to match the text column height.

Display each of the seven PALMS My approach steps in its own numbered card with theme-aware surfaces and responsive padding, preserving the text and order.

Lay out PALMS approach cards in three columns on wide screens, two columns at 1055px and below, and one column at 671px and below. Keep the number above the title and the description below it.

Use #f0f3f5 as the PALMS approach cards' light-theme background; retain the existing dark-theme surface.


Use a visible but soft diffuse cyan/lime glow behind the Home headline (弥散风), fading to white at the section edges, with responsive mobile gradients and restrained dark-theme opacity. Preserve hero spacing and full-width coverage.

Apply a matching diffuse cyan/lime glow behind the header area of case-study pages, fading out before the main story content, with mobile adjustments and restrained dark-mode opacity.

Scatter subtle static cyan and lime diffuse glows at irregular positions down case-study bodies, preserving text readability, with responsive mobile sizing and reduced dark-mode opacity.


PALMS approach cards flip on click, tap, Enter or Space between the existing approach and the approved corresponding result. Preserve the responsive grid, #f0f3f5 light surface, 24px Space Grotesk numbers, dark theme and reduced-motion support. Do not add hover tilt.

Use the user-supplied public/assets/Group 14.svg as the current design system foundations image wherever that artwork is displayed.

Use 24px numbers on PALMS approach cards, preserving the existing title and body sizes.

Use Space Grotesk for the PALMS approach card numbers, keeping 24px size and regular weight.

Use #f0f3f5 for PALMS approach card fronts and #e3f4f7 for result backs in the light theme; preserve existing dark-theme surfaces.


Use plain PALMS flip cards without notebook ruling, punched holes, folded corners or paper shadows. Preserve grey fronts, pale cyan backs and 24px Space Grotesk numbers.
