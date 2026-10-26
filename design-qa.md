# PALMS blue motion cover — design QA

final result: passed

## Latest palette refinement

The user found the first blue treatment too deep and the subsequent 60% wash too flat. The current light theme uses brightness(1.25), saturation(0.6), contrast(1.05) and a restrained 30% pale-blue wash to retain distinct light and darker fields, with a darker navy (#071d3b) title. Motion, layout and pause controls are unchanged. Dark mode retains a white title with a restrained 12% wash. Current browser evidence: `output/design-qa/palms-motion/balanced-blue-home.jpg`. The earlier comparison files below document the original blue adaptation. The production build and a fresh browser visual check passed after this contrast adjustment.

## Source and scope

- Source visual truth: https://www.rachelchen.tech/projects/openai, header video inspected playing in the browser; captured cover in `output/design-qa/palms-motion/reference-cover.jpg`.
- Implementation: PALMS homepage previews and `/work/design-system-palms`, using original generated blue artwork in `public/assets/palms-blue-motion-field-v1.png`.
- Implementation evidence: `output/design-qa/palms-motion/palms-cover.jpg` and `mobile.jpg`.
- Full comparison: `output/design-qa/palms-motion/comparison.html` places both actual cover captures together at equal 16:9 display sizes; `comparison.jpg` records the post-fix visual review. The final individual implementation capture excludes a fixed page navigation button that overlapped an earlier screenshot crop.
- Scope is an intentional blue adaptation of the reference cover only. Existing site typography, navigation and story content are retained. Solver is outside the change.

## Capture normalization

Desktop reference: CSS cover approximately 806 × 453 at a 1280px viewport. Final implementation cover: approximately 973 × 547 at a 1280px viewport. Both captures are 16:9 and displayed at equal width in the comparison. Captures use the browser's default pixel density; no artificial upscale is used. Mobile: 390 × 844 viewport override, with a 375px document content area after the scrollbar. Both cover captures show the light theme and normal playback; additional browser checks cover dark mode and paused state. Animation phases naturally differ.

Saved image sizes: reference 805 × 453, final PALMS cover 972 × 547, mobile viewport capture 375 × 812, and comparison board 1280 × 720. Screenshots are JPEG files, matching the browser's actual output format.

## Findings and iteration history

1. Initial comparison found P2 motion-layer edges becoming visible during rotation and imperfect title positioning after responsive resizing.
2. Increased primary artwork coverage to 140% and secondary coverage to 180%, and centred the stationary title with an inset overlay. Rebuilt and recaptured the actual header.
3. Post-fix comparison: no visible raster edges in the inspected animation phases; title stays centred and stationary. Mobile title fits on one line without clipping. No actionable P0/P1/P2 findings remain.

## Required visual surfaces

- Typography: centred PALMS Design System title, navy in light mode and white in dark mode; existing Space Grotesk, medium weight and responsive sizing. This intentionally uses the portfolio's display font rather than copying the reference font.
- Layout: 16:9 case-study cover; existing homepage card/carousel sizes preserved. Title is centred both horizontally and vertically. Existing case-study toolbar and sidebar remain intact.
- Colour: navy, azure and icy blue replace the reference's orange/lilac palette as requested, softened by the latest pale-blue wash. Dark mode applies brightness(0.8). Title colours follow the latest palette refinement above.
- Asset quality: original 1672 × 941 generated blue colour-field PNG, no copied reference video or branding. Layer coverage and clipping checked in desktop and mobile captures. No placeholder artwork.
- Copy: PALMS Design System only inside the new cover. Story text, metadata, project links and original Outcome foundations artwork remain present.
- Focused-region review: the complete cover is a single colour field and large title with no small embedded interface details. Full-cover comparison is sufficient; pause/play was checked separately in the live browser.

## Interaction and verification

- Browser playback observed; both raster layers report running and changing transforms.
- Case-study Pause stops both layers; Play resumes both. Labels update correctly.
- Keyboard focus on the homepage PALMS link pauses both decorative motion layers.
- Mobile reflow checked: document content width equals viewport content width, with no horizontal overflow.
- Dark mode checked: both layers use brightness(0.8), with unchanged white title.
- Reduced-motion CSS disables both animations and hides the unnecessary pause control. OS-level preference switching was not emulated in this browser session.
- Solver still uses its rose background, actual Kaizen list and foreground board, and its existing layer layout.
- Browser error log check returned no errors.
- `npm run build` passed, including strict TypeScript checks.

## Remaining limits

The exact video morphing from the source is adapted using drifting and blending original raster layers, rather than reproducing the source's rendered video frames. Long-duration performance and every animation phase were not exhaustively profiled. No remaining P3 item blocks review.

## PALMS animated title contrast

Added a diffuse radial backdrop behind the title, with a constant-opacity centre covering the rendered text: pale blue at 35% in light mode and dark navy at 50% in dark mode. The outer blue fields, original motion, layout and Solver are unchanged. The title remains navy in light mode and white in dark mode.

`python output/design-qa/palms-motion/check_contrast.py` checks conservative per-channel extrema across the original artwork, the filters, wash, radial backdrop and maximum secondary-layer opacity. The resulting lower bounds are 5.469:1 (light title), 5.093:1 (dark title), and 7.517:1 (playback icon), above the 4.5:1 normal-text threshold. These bounds cover all artwork positions and interpolated colours, including combinations more extreme than the animation actually produces.

Browser geometry checks confirm that the complete text rectangle remains within the backdrop's constant-opacity radius of .65: desktop carousel .314, desktop Work .307, desktop case cover .245, 390px carousel .433, 390px Work .365, 390px case cover .381, and 320px two-line case cover .393. Light and dark covers were visually checked, and the production build including strict TypeScript passed after this change. Evidence: `output/design-qa/palms-motion/contrast-light-work.jpg`, `contrast-dark-work.jpg`, and `contrast-dark-mobile.jpg`. This verifies the PALMS cover title and control, not a site-wide accessibility audit.

## Solver case-study header

Replaced the former header image with the same shared Solver artwork used by the homepage: dusty rose and diffuse glows, the Kaizen list behind the Kanban board on the left, and title/copy on the right. The case-study version uses 16:9 proportions, responsive type and eager image loading. The homepage retains its original dimensions and hover transforms.

Desktop and mobile light/dark checks passed. Both product images loaded; mobile copy stays within the cover and document width matches viewport width. Dark mode resolves to #493236 with white copy and .24 glow opacity. Browser error logs were empty, and `npm run build` passed including strict TypeScript. Evidence in `output/design-qa/palms-motion/`: `solver-header-desktop.jpg`, `solver-header-mobile.jpg`, `solver-header-dark-mobile.jpg`.
