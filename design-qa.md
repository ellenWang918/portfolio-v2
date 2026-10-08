# Portfolio visual QA

**Final result: passed**

No actionable P0, P1, or P2 findings remain after the fixes below.

## Comparison target and evidence

- Source recording: `D:/woshi/Downloads/ScreenRecording_10-08-2026 11-02-32_1.mp4`.
- Source visual truth: `.tools/reference-hero.jpg`, extracted site-only crop at 1640 × 1002 pixels. Additional recording frames informed the project-grid and expertise layouts.
- Content source: https://ellenwang.space/.
- Typography and token source: https://modern8-bits-up.vercel.app/?path=/docs/foundation-design-token--docs.
- Implementation: http://localhost:4173/, homepage, light appearance, top of page.
- CSS comparison viewport: 1640 × 1002. Browser screenshot output omits the scrollbar and is 1625 × 993 pixels. For focused comparisons the implementation is normalized to 1640 × 1002 with uniform scaling. No pixel-exact conclusions are drawn from scrollbar or output-density differences.
- Implementation screenshot: `docs/screenshots/desktop.jpg`.
- Full-view side-by-side evidence: `.tools/qa/comparison-final.jpg` includes the recording crop and rendered implementation in the same comparison input.
- Focused comparisons: `.tools/qa/hero-comparison.jpg` and `.tools/qa/navigation-comparison.jpg` compare typography, colored inline motifs, and navigation spacing at readable scale.
- Responsive evidence: `docs/screenshots/mobile.jpg` and `docs/screenshots/mobile-contact.jpg`, captured at CSS 390 × 844; output 375 × 812. The 320 × 740 and 768 × 1024 views were inspected directly in the browser.

## Findings and comparison history

1. **[P2, resolved] Hero and gallery proportions.** First desktop capture (`.tools/qa/desktop-before.jpg`) placed the hero too high and used narrow gallery cards. Increased desktop top spacing and gallery card width, with a 620px card at the recording's viewport. The revised full-view comparison shows the broad two-line headline, generous upper whitespace, right-side actions, and approximately 2.6 visible gallery cards. The content region is centered within the design system's 1440px maximum.
2. **[P2, resolved] Mobile contact action and small metadata.** Initial phone inspection showed a wrapped contact-button label and overly small secondary text. The contact action now keeps its label on one line while adjacent prose wraps; navigation is 14px and metadata is at least 12px. The revised 390px contact capture shows a readable email row and usable action.
3. **[P2, resolved] Overflow at 320px.** A later narrow-phone inspection showed the contact heading and navigation exceeding the available width. Added a narrow breakpoint with reduced pill padding, a 32px hero, a 26px contact heading, and natural contact-line wrapping. Reinspection reports document width 305px inside the 320px viewport, with all persistent controls visible. At 390px the earlier two-line heading and contact layout remain intact.

## Required fidelity surfaces

- **Fonts and typography:** Space Grotesk display, IBM Plex Sans body, and IBM Plex Mono metadata match Modern8-bits families and are locally loaded. Display text intentionally uses the system's bold weight rather than the recording's lighter face. Two-line desktop hero hierarchy, readable body leading, and responsive headings were checked. Metadata remains legible at 12px; long case-study titles wrap naturally.
- **Spacing and layout rhythm:** Floating black capsule, wide gray hero canvas, inline accents, offset project grid, rounded white expertise panel, and generous section spacing follow the recording's structure. Design-system gutters and a 1440px maximum govern the implementation. Narrow phone controls fit after the documented fix.
- **Colors and tokens:** Neutral page, card, ink, border, and action roles map to the supplied design system. Cyan, lime, and yellow are editorial accents from the recording, not semantic status colors. Dark mode uses the design system's inverted action roles; text and secondary buttons were inspected after transitions completed.
- **Image quality and assets:** Uses Ellen's original vector editorial illustrations, logo, and public design-system mockups. Artwork is sharp, deliberately cropped within the gallery, and proportionally displayed in case studies. Phosphor provides interface icons. The reference's unrelated brand-project photos are intentionally replaced with Ellen's actual public project assets. No generated portrait, fake product screenshot, or handcrafted illustration is used.
- **Copy and content:** All five published case-study narratives, metadata, and tags are carried into the project data. About copy and public contact details come from Ellen's site. Homepage headlines and expertise summaries are adapted from that professional content. Confidentiality and illustrative-visual explanations remain visible. No availability or invented client claims are added.

## Interactions and accessibility checked

- All five case-study views open and switch to the correct project; next-project and close actions work.
- A direct project URL survives reload and displays the correct case study. Escape closes the native dialog. The native modal provides focus containment and an inert background; focus is restored on close.
- Expertise tabs work with clicks and arrow keys; ARIA selection follows the visible panel.
- Gallery pause/play works; hover/focus pause and reduced-motion rules are present.
- Light/dark switch works and persists through reload. Returned to light mode for handoff.
- Contact navigation, email destinations, and copy-email success state work. Social-link destinations are preserved.
- No document overflow at tested desktop, tablet, 390px, or corrected 320px widths. No failed project images observed.
- Browser console checked: no captured errors or warnings in the completed interaction run.
- Production build and hosting-worker tests completed successfully.

## Intentional adaptations and remaining limits

This is a reference-led redesign, rather than a pixel-identical clone of the unrelated portfolio in the recording. Typography and neutral tokens follow Modern8-bits, while project assets and content follow Ellen's site. A personal-photo collage is replaced by Ellen's existing logo and biography because no portrait was supplied. The recording contains no mobile design, so phone layouts are responsive adaptations.

Browser validation was performed in the available Chromium-based in-app browser. Other browser engines and live public hosting were not tested. Publishing remains a separate action.

## Implementation checklist

- [x] Preserve the recording's editorial structure and rhythm.
- [x] Carry across all five real projects and public contact details.
- [x] Map Modern8-bits typography and neutral theme roles.
- [x] Resolve desktop proportion and phone overflow findings.
- [x] Verify core interactions, direct links, and saved theme.
- [x] Save desktop/mobile evidence and remove temporary comparison utilities from public assets.

final result: passed

## User-requested background update

The user requested pure white after the initial reference-led build. The light-theme page token and browser theme color are now `#ffffff`. The rendered body was checked in the browser and reports `rgb(255, 255, 255)`. Updated evidence: `docs/screenshots/white-background.jpg`. This preference supersedes the original gray-canvas comparison; the layout and optional dark theme remain in place.
