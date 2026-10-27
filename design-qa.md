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

---

# Leisure photo collage QA

final result: passed

## Target and evidence

- Source visual truth: C:/Users/woshi/AppData/Local/Temp/codex-clipboard-cf319fdf-e4c2-41bf-8d10-3b5bfb54e9c7.png (1917 × 1011).
- Desktop browser screenshot: .tools/leisure-desktop.png (1320 × 1277 raster; browser viewport 1335 × 1291 CSS px).
- Mobile browser screenshot: .tools/leisure-mobile.png (374 × 4580 full-page raster; browser viewport 390 × 844 CSS px).
- Same-input comparison board: .tools/leisure-comparison.jpg. Reference scaled proportionally to 720px wide; implementation collage cropped from the desktop screenshot without stretching.
- State: Home, About, Leisure selected, light theme. The reference describes the collage only, not the surrounding page or its typography.

## Findings

No actionable P0, P1 or P2 findings in the scoped change.

The three-column stagger, varied image widths, square corners and open gaps follow the reference. Slot ratios intentionally adapt to the actual six supplied photos so every composition remains complete. The blue selection border and grey placeholder fills in the reference are editor/placeholder details and are omitted.

## Required fidelity surfaces

- Typography: existing about-lead heading, body fonts, sizes, weights and copy preserved; no captions or labels added to the visible layout.
- Spacing/layout: collage sits in the existing right column with a 40px text gap on desktop. At 1055px and below it stacks after the text. Mobile measured collage top 805.7px and text bottom 773.7px: 32px gap. No horizontal page overflow at 390px.
- Colours/tokens: existing theme-aware About card preserved; original photo colours retained without filters, frames, shadows or additional backgrounds.
- Image quality: all six optimised WebP assets load. EXIF orientation applied during export; source files remain untouched. Image dimensions and browser measurements confirm natural proportions with no crop or distortion. The same-input focused collage comparison shows complete faces, dog, cat, birds and architecture.
- Copy/content: approved three paragraphs and heading unchanged. All six images have descriptive alt text.

## Verification

- Production build and strict TypeScript check passed.
- Six of six images loaded successfully on desktop and mobile; no distortion measured.
- Professional/Leisure tabs tested with click and Home/End keyboard navigation; correct panels and accents remain intact.
- Browser error log: empty.
- Temporary mobile viewport restored; local preview remains open on Leisure.

## Comparison history

First visual comparison passed without a required visual fix. Full desktop screenshot verifies the collage beside the text; focused comparison board verifies its arrangement against the supplied source. Full mobile capture verifies stacked content and all six photos.

## Follow-up polish

None required. A future request may change photo ordering or relative size without altering the underlying images.

## Follow-up: seventh Leisure photo

Added the supplied pink-and-grey bird selfie from C:/Users/woshi/AppData/Local/Temp/codex-clipboard-5a0cb103-83c0-4f16-91e7-02d7b5d1c007.jpg as photo-07.webp. Orientation and full composition are preserved, with a 787 x 1400 optimised web copy. Existing six photo sizes and positions remain unchanged. The smaller seventh photo extends the middle column, retaining the staggered arrangement.

Browser evidence: .tools/leisure-seven-desktop.png. Desktop screenshot reviewed against the supplied new photo and existing collage reference; no missing subjects, crop, distortion or overlap. All seven photos load at 390px mobile width and the page has no horizontal overflow. Strict TypeScript check passed. Desktop viewport restored and Leisure preview kept open.

final result: passed

---

# Leisure hanging-photo experiment

final result: passed

## Source and rendered evidence

- User reference: https://github.com/alejandrobujan/tendedero; live demonstration inspected at https://tendedero.app/.
- Reference screenshot: .tools/hanging-reference.png (1280 x 720 raster). The captured state shows four framed screenshots attached by clips to a thin line.
- Desktop screenshot: .tools/hanging-desktop.png (1320 x 1277 raster, 1335 x 1291 CSS viewport).
- Mobile full-page screenshot: .tools/hanging-mobile.png (390 x 844 CSS viewport; content-only full-page raster).
- Dark screenshot: .tools/hanging-dark.png.
- Same-input focused comparison: .tools/hanging-comparison.jpg. Reference rail cropped without stretching; implementation gallery cropped without stretching. Compared the hanging treatment, not the reference app's unrelated desktop interface.

## Findings and intended adaptation

No actionable P0/P1/P2 findings. The portfolio uses two rows for seven portrait/landscape photos rather than the reference's single desktop-wide rail. Straight, lightly angled lines and Phosphor paperclip icons adapt the line-and-clip treatment. No Tendedero name, app icon, artwork or source code is incorporated.

## Fidelity surfaces

- Typography: existing Leisure heading and three paragraphs remain unchanged.
- Layout/spacing: four photos on the upper line and three on the lower line, with slight rotations and room for visible shadows. Text remains on the left at desktop width; gallery stacks at 1055px and below. At 390px, text-to-gallery gap is 32px and no horizontal overflow occurs.
- Colours/tokens: original photo colours preserved. Translucent light frames and diffuse shadows follow the reference; dark frames, clips and lines adapt to the existing optional dark theme.
- Imagery: all seven browser images load and preserve intrinsic proportions. No crop, stretch or placeholder graphics. Images retain descriptive alternatives. Links point to each full optimised image.
- Content: approved copy and About tab labels preserved. No reference desktop controls, captions or screenshot-manager actions added.

## Interaction and accessibility

- Brief entrance settling and hover/focus swing animate around the clip position. Both finish within two seconds; no continuous animation requires a pause control.
- Reduced-motion CSS explicitly disables the new animations. Hover animation requires a fine pointer with hover support.
- Keyboard focus gives each photo frame a visible outline; verified with Tab.
- Mobile asset loading and overflow checked. Light and dark appearances reviewed; original light theme and viewport restored.
- Browser error log empty. Production build and strict TypeScript check passed.

## Comparison history

First visual comparison passed without required visual corrections. Intentional differences are the two-line arrangement for all seven supplied photos, native paperclip icons, and theme-aware portfolio surfaces.

final result: passed

---

## Leisure desktop single-line layout

Source: user-requested responsive adaptation of the existing Tendedero-inspired hanging gallery.

- At 1056px and above: seven photographs share one full-width line above the Leisure heading and paragraphs; text width is capped at 760px for readability.
- Smaller screens: existing four-plus-three photo arrangement remains beneath the text.
- Browser checks: desktop 1335px, 1056px, 1055px, 900px and mobile 390px. Seven images load, with no horizontal overflow. Desktop anchors share one y coordinate; gallery ends before the text starts. Smaller-screen galleries follow the text.
- An intermediate check found that fractional viewport widths between 1055px and 1056px could retain a side-by-side layout. Fixed by making the stacked layout the default and applying desktop overrides only at 1056px. Rechecked 1055px: one content column, gallery follows the text, no overflow.
- Evidence: .tools/hanging-one-line-desktop.png and .tools/hanging-one-line-mobile.png. Existing frames, clips, colours, photo proportions, copy, motion and reduced-motion rules retained.
- Production build and strict TypeScript checks passed. Desktop viewport restored.

final result: passed

## Follow-up: centred Leisure content at tablet widths

At the annotated 1047px viewport, the Leisure heading and paragraphs now share the hanging gallery's 620px maximum width and horizontal centre. Text remains left-aligned within that block. Browser measurements: text and gallery both span x=206 to x=826, centre difference 0px, no horizontal overflow. Evidence: .tools/leisure-centred-tablet.png. The large-screen 760px text block retains its left alignment; mobile still uses the available width. Production build and strict TypeScript check passed; temporary viewport override reset.

final result: passed

---

## Leisure photo popup

Clicking a hanging photo now opens a native modal dialog at the selected photograph, with previous/next buttons, close button and an announced photo count. Gallery order is preserved and wraps from first to last and last to first. Images use contain sizing and are not cropped.

Verified in the in-app browser:
- Open first photo; Next shows 2 of 7; Previous returns to 1 of 7.
- Left keyboard arrow wraps from 1 to 7; Right wraps from 7 to 1.
- Tab and Shift+Tab stay within the three viewer controls. Native background inertness and explicit boundary handling preserve modal focus.
- Escape closes and returns focus to the originating photo button; body scrolling is restored.
- Opening the seventh photo shows 7 of 7. Mobile Next wraps to 1 of 7; clicking the backdrop dismisses the popup.
- Close button works. Dark-theme popup uses rgb(41,41,41) with white text; original light theme restored.
- Desktop and 390px mobile layouts inspected. Mobile dialog fits the image height rather than leaving a tall blank area for landscape photos.
- Browser error log empty. Production build and strict TypeScript checks passed after the final adjustments.

Evidence: .tools/leisure-popup-desktop.png, .tools/leisure-popup-mobile.png and .tools/leisure-popup-dark.png. Native dialog, existing design tokens and Phosphor controls are used. Temporary viewport override reset; original gallery preview remains open.

final result: passed

---

## Leisure copy, stickers and curved hanging line

Updated the animal-volunteering and friendship copy using the proofread wording. Friends of the Pound links to https://friendsofthepound.com/. Added a small cat sticker after cats and a coffee sticker after the friendship paragraph; both are decorative emoji with accessible surrounding text.

Replaced the straight rails with a geometry-driven canvas connector. Smooth interpolation passes through each actual clip centre, including the lower cat, group and dog-photo clips highlighted in the user's annotations. It follows brief clip swings, resizes for the desktop single line and smaller-screen two-line layouts, and repaints with theme changes. Decorative rendering is hidden from assistive technology and does not intercept photo clicks.

Browser review confirmed all seven connections visually on desktop and both mobile rows, all images loaded, two stickers and the correct shelter URL, with no horizontal overflow. The popup still opens the selected image, advances to the next and closes with Escape. Dark line colour repaints to #8a8c91; original light theme and viewport restored. Browser error log empty. Strict type checking and production build passed.

Evidence: .tools/leisure-curved-line-desktop.png, .tools/leisure-curved-line-mobile.png and .tools/leisure-curved-line-dark.png. The five user annotations supplied the specific line/clip targets. Font, spacing, photo colours and proportions, popup and gallery order preserved.

final result: passed

## Follow-up: natural shallow hanging line

Raised the shorter photographs by aligning gallery items at the top rather than stretching their buttons and centring their contents. Desktop clip offsets now form one shallow bow, with only 16px between the highest and lowest clip centres. Reduced the line's endpoint lift from 12px to 3px, removing the pronounced waves while retaining every clip connection. Smaller-screen photo arrangements, images, copy, popup and motion remain intact.

Desktop screenshot visually reviewed: .tools/leisure-natural-line-desktop.png. No horizontal overflow; production build and strict TypeScript check passed.

final result: passed

---

## Home ambiguity-to-clarity entrance

Implemented the approved approximately 1.2-second sequence. The first headline line fades and rises for 650ms after a 100ms delay; the second follows 150ms later. The cyan scribble twists and settles, lime layers settle into place, and the yellow sparkle pops once. Final accent motion ends at 1160ms. Fine-pointer hover affects only accent icons; words stay stationary. Reduced-motion CSS removes the entrance and accent animations and immediately displays the complete headline while retaining the static .01em ambiguity blur.

Browser verification observed the first line arriving before the second after a fresh Home reload. Settled computed styles confirm opacity 1 and identity transforms on both lines, one animation iteration, and correct individual accent delays/durations. Existing desktop headline geometry and hero spacing remain intact. No horizontal overflow at desktop, 390px or 320px widths. Blur scales from .72px at desktop to .39px at 390px. Desktop and mobile final appearances reviewed; temporary viewport reset and Home preview kept open.

Evidence: .tools/hero-motion-desktop.png and .tools/hero-motion-mobile.png. Production build and strict TypeScript checks passed. Reduced-motion behavior is implemented via the explicit CSS media override; OS preference was not changed during verification.

final result: passed
