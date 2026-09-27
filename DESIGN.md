---
name: Netoun
description: Personal site of a full-stack engineer whose signature is creative front-end craft, built as a night workbench of machine panels and warm paper.
colors:
  warm-paper-beige: "oklch(0.93 0.03 80)"
  workbench-ink: "oklch(0.07 0 0)"
  lit-paper-stock: "oklch(0.975 0.012 88)"
  paper-edge: "oklch(0.88 0.02 80)"
  pale-gray-rule: "oklch(0.9 0 0)"
  pale-gray-wash: "oklch(0.96 0 0)"
  graphite-gray: "oklch(0.45 0 0)"
  lamplight-gold: "oklch(0.8858 0.182 95.69)"
  deep-ink: "oklch(0.09 0 0)"
  phosphor-mint: "oklch(0.7906 0.1573 166.87)"
  ultraviolet-orchid: "oklch(0.5548 0.2575 312.98)"
  kirby-pink: "oklch(0.8455 0.0872 355.09)"
  fault-red: "oklch(0.55 0.22 29)"
typography:
  display:
    fontFamily: "PPNeueMontreal, system-ui, sans-serif"
    fontSize: "6rem"
    fontWeight: 700
    lineHeight: 0.8
    letterSpacing: "-0.045em"
    fontFeature: '"liga" 1, "clig" 1'
  headline:
    fontFamily: "PPNeueMontreal, system-ui, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "PPNeueMontreal, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.25
  lead:
    fontFamily: "PPNeueMontreal, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.25
  body:
    fontFamily: "PPNeueMontreal, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Doto, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.12em"
  label-cta:
    fontFamily: "Doto, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 900
    lineHeight: 1.25
  label-nav:
    fontFamily: "Doto, system-ui, sans-serif"
    fontSize: "0.6rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.06em"
  spec-note:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.02em"
rounded:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  full: "9999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  2xl: "3rem"
  3xl: "4rem"
components:
  button-cta:
    backgroundColor: "{colors.warm-paper-beige}"
    textColor: "{colors.workbench-ink}"
    typography: "{typography.label-cta}"
    rounded: "{rounded.lg}"
    padding: "1rem 1.5rem"
  button-cta-hover:
    backgroundColor: "{colors.pale-gray-wash}"
    textColor: "{colors.workbench-ink}"
  button-primary:
    backgroundColor: "{colors.lamplight-gold}"
    textColor: "{colors.deep-ink}"
    rounded: "{rounded.lg}"
    padding: "0.5rem 1rem"
  card-paper:
    backgroundColor: "{colors.lit-paper-stock}"
    textColor: "{colors.workbench-ink}"
    rounded: "{rounded.md}"
    padding: "1.5rem"
  card-terminal-bar:
    textColor: "{colors.graphite-gray}"
    typography: "{typography.label}"
    padding: "0.5rem 1rem"
  tag-frontend:
    backgroundColor: "color-mix(in srgb, oklch(0.7906 0.1573 166.87) 18%, transparent)"
    textColor: "{colors.workbench-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
  tag-backend:
    backgroundColor: "color-mix(in srgb, oklch(0.5548 0.2575 312.98) 18%, transparent)"
    textColor: "{colors.workbench-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
  tag-creative:
    backgroundColor: "color-mix(in srgb, oklch(0.8858 0.182 95.69) 18%, transparent)"
    textColor: "{colors.workbench-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
  tag-default:
    backgroundColor: "color-mix(in srgb, oklch(0.07 0 0) 8%, transparent)"
    textColor: "{colors.workbench-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
  panel-machine:
    backgroundColor: "{colors.workbench-ink}"
    textColor: "{colors.warm-paper-beige}"
    rounded: "{rounded.xl}"
    padding: "4rem"
  nav-section-link:
    textColor: "{colors.graphite-gray}"
    typography: "{typography.label-nav}"
    rounded: "{rounded.sm}"
  nav-section-link-active:
    textColor: "{colors.workbench-ink}"
---

# Design System: Netoun

## Overview

**Creative North Star: "The Night Workbench"**

Dark machine panels bookend a lit workbench of warm paper cards, and the hardware objects carry the identity. At the top, an immersive near-black hero panel holds a WebGL/WebGPU mesh of gold, mint and violet light under animated film grain, a CSS-3D laptop that boots on arrival, and a magnetic `_Get in touch_` CTA; on scroll the hero morphs from full-bleed into an inset rounded panel. At the bottom, a matching dark footer panel holds a CSS-3D server rack and the `_❯ ESTABLISH LINK` contact block. Between them, the page is warm beige paper under a fixed WebGL grain overlay, and the content sits on opaque paper cards that stay quiet until pointed at.

The voice of the machine is Doto, a dot-matrix face used only for terminal vocabulary: `_❯` prompts, the `▐` cursor, the `⤘` arrow, underscored labels (`_GET IN TOUCH_`, `_VIEW PROJECT_`), and `_0N /` section numbering. The human voice is PP Neue Montreal, used for every heading and paragraph. Density is moderate: cards are compact and bar-topped like terminal windows, the sections breathe inside a capped column, and the dark panels run near-full-bleed.

Components are precise, tactile, quiet: neutral at rest, colour spent only on hover and focus, machine labels in Doto. Glows exist but stay subtle and belong to the dark world only (the hero and its CTA). Confirmed rejections: aggressive neon, and "The Signal" directions (carrier wave, dithering), which are never to be resurrected.

**Key Characteristics:**

- Two dark machine panels (hero laptop, footer rack) bookending a warm paper workbench.
- A WebGL/WebGPU mesh of gold, mint and violet light plus WebGL film grain on the dark panels; a static WebGL grain over the whole page.
- Opaque paper cards with a terminal title bar, neutral at rest, gold-tinted lift on hover.
- Doto for machine labels only; PP Neue Montreal for everything a person reads at length.
- One house easing curve, `cubic-bezier(0.22, 1, 0.36, 1)`, shared by CSS and JS.
- Every animation stops under `prefers-reduced-motion`; prerendered HTML is fully visible without JS.

## Colors

Warm paper and near-black ink carry the structure; three luminous accents (gold, mint, violet) plus a soft pink are rationed as small lit marks and hover responses.

### Primary

- **Lamplight Gold** (oklch(0.8858 0.182 95.69)): the house accent. On dark panels it is the CTA glow, the hero links, the blinking cursor, footer hover colour and the focus ring. On paper it appears only as small lit marks (the status dot, the timeline station dot, the card footer tick) and as the tint inside the hover shadow; the section-title `_❯` prompt mixes it 50% with ink so it stays legible.
- **Deep Ink** (oklch(0.09 0 0)): text on solid gold fills (the primary button and the active labs control).

### Secondary

- **Phosphor Mint** (oklch(0.7906 0.1573 166.87)): the frontend tag domain, the second blob of the hero mesh, the far halo in every glow token, the contact popover edge and link hover, and the middle stop of the sections-nav progress track.

### Tertiary

- **Ultraviolet Orchid** (oklch(0.5548 0.2575 312.98)): the backend tag domain, the third blob of the hero mesh, and the bottom stop of the sections-nav track. Never text on paper at small sizes.
- **Kirby Pink** (oklch(0.8455 0.0872 355.09)): the footer's contact voice (the Doto subtext and the default contact-link accent), the Kirby skill, and one band of the card holographic sheen and hero meta gradient.

### Neutral

- **Warm Paper Beige** (oklch(0.93 0.03 80)): the page background, and the light text colour on dark panels.
- **Workbench Ink** (oklch(0.07 0 0)): all text on paper; mixed 98% with a pale wash it becomes the dark machine panel; the focus ring on light surfaces.
- **Lit Paper Stock** (oklch(0.975 0.012 88)): opaque card and open-nav surface, a step lighter and warmer than the page.
- **Paper Edge** (oklch(0.88 0.02 80)): card hairlines (at 50% via the subtle border), the experience timeline rail, the unlit sections-nav track.
- **Pale Gray Rule** (oklch(0.9 0 0)): the strong border (card footer rules, labs frames and controls).
- **Pale Gray Wash** (oklch(0.96 0 0)): hover fill of the hero CTA and ghost buttons, slider track, dim labs text.
- **Graphite Gray** (oklch(0.45 0 0)): secondary text on paper: terminal bar labels, section descriptions and indexes, status annotations, inactive nav links.
- **Fault Red** (oklch(0.55 0.22 29)): the rack's `ERR` status, the warm end of the rack accent spectrum, and (mixed with gold) the first terminal window dot. Not an interface error colour: the site has no forms.

### Named Rules

**The Spent-on-Hover Rule.** Accents never tint a resting surface. A card at rest is paper, a hairline and a neutral shadow; gold enters the surface only through the hover shadow, where it means "this one".

**The Dark-Only Gold Rule.** Gold is a text, hover and ring colour on dark panels only. On paper it measures about 1.1:1, so there it appears as a lit dot or tick, or mixed 50% with ink; gold hover and gold text on paper are debt, not precedent.

**The Kirby Reserve Rule.** Pink belongs to the footer's contact voice and the Kirby skill. It never goes on structural lines such as rails, rules or borders.

## Typography

**Display Font:** PP Neue Montreal (variable, local woff2, with system-ui)
**Body Font:** PP Neue Montreal (with system-ui)
**Label/Mono Font:** Doto (Google Fonts, weights 100 to 900, with system-ui)
**Code Font:** the system monospace stack (`ui-monospace`, SF Mono, Menlo, Consolas), never downloaded; the hero's spec layer only

**Character:** A clean neo-grotesk for everything a person reads, set against a dot-matrix face that speaks only as the machine. The italic, tightly tracked hero headline is the one moment the grotesk performs; everywhere else it stays plain.

The theme stack lists `Inter` but it is never loaded and resolves to system-ui. MabeoVintage is declared and preloaded in the document head, but no surface uses it; it is not part of the system.

### Hierarchy

- **Display** (700 italic, 2.25rem stepping to 3.5rem at sm, 4.75rem at md, 6rem at lg, 7.5rem at 2k; line-height 0.9 to 0.8; tracking -0.035em to -0.045em; ligatures on): the hero headline only, warm paper on the dark panel with the soft glow text shadow.
- **Headline** (700, 2.25rem stepping to 3.5rem at md, line-height 1.25): section and page titles, always led by the `_❯` prompt. Smaller variants step 1.875/2.25rem and 1.5/1.875rem.
- **Title** (600, 1.25rem, line-height 1.25): experience roles; project card titles use the same weight at 1rem.
- **Lead** (400, 1.25rem stepping to 1.5rem at md and 1.875rem at 2k, line-height 1.25, max 40rem): the hero statement under the headline.
- **Body** (400, 0.875rem, line-height 1.45): card descriptions, clamped to three lines on project cards. Global line-height is 1.5; paragraphs use `text-wrap: pretty`, headings `balance`.
- **Label** (Doto 500, 0.75rem, tracking 0.12em to 0.18em, uppercase): terminal bars, tags, company names, status annotations, `_VIEW PROJECT_`. Section descriptions and `_0N /` indexes use 600 at 0.875rem with 0.14em tracking.
- **CTA label** (Doto 900, 1.25rem stepping to 1.5rem at md and 1.875rem at 2k, uppercase): the hero `_Get in touch_` button only.
- **Spec** (system mono 400, 0.6875rem file tabs, 0.625rem annotations, 0.5625rem swatches; tabular numerals, 0.02em tracking): the hero's spec layer only.

### Named Rules

**The Two Voices Rule.** PP Neue Montreal speaks; Doto labels the machine. Doto is for prompts, bars, tags, indexes, nav and the CTA, never for a sentence meant to be read as prose. The system monospace is not a third voice for the page: it only prints values read from the code, in the hero's spec layer.

**The Measured Value Rule.** A spec annotation prints what the live element reports (computed styles, layout, the renderer that won, the frame rate), never a number typed by hand. Change a token and the annotation follows; a value nothing can measure does not get an annotation.

**The Legible Dot-Matrix Rule.** Anything set in Doto that is read or clicked should be at least 16px or weight 800 and up. Dot-matrix glyphs break apart at small sizes and light weights; several shipped labels (0.6rem nav links, 0.75rem bars at weight 400 to 500) are below this and are debt, not the standard.

**The Index, Not Kicker Rule.** The `_0N /` mark above a section title is literal terminal numbering and nothing else: no descriptive words, no taglines.

## Layout

A single column of sections inside a centred container that caps below common viewport widths so the page always keeps real side margins: full width with 1rem gutters on mobile, 1.5rem at 640px, 768px max with 2rem at 768px, 1024px max with 3rem at 1024px, 1280px max at 1280px, and 1440px max with 4rem at 1920px. Breakpoints are mobile-first (640, 768, 1024, 1280, 1920).

The hero and footer panels escape the container and sit near full-bleed, inset by 0.5rem. From 768px the hero panel's sides close in onto the content column over the first half screen of scroll (a CSS scroll-driven clip-path: nothing scales, the text and laptop already sit on that column); where the hero fits one screen (1024px wide, 640px tall) its stage first pins for 20vh. Below 768px, or under reduced motion, there is no morph. The footer panel uses a 1fr/2fr grid (rack left, contact block right-aligned), collapsing to one centred column below 768px.

Spacing follows the token scale (0.25, 0.5, 1, 1.5, 2, 3, 4rem). Card bodies use 1.5rem padding, terminal bars 0.5rem by 1rem, section headers end with 2rem (section) or 3rem (page) of space, and experience cards stack with 3rem between them. Scroll reveals translate items up 16px and fade in over 600ms, staggered 70ms per item.

A sections nav, fixed bottom-left from 768px, appears once the hero is scrolled past; below 768px it is hidden.

### Named Rules

**The Bookend Rule.** Dark panels run near-full-bleed at the top and bottom of the page only; everything between lives in the capped paper column. Never introduce a third dark panel mid-page.

## Elevation & Depth

A hybrid. Paper surfaces use a single tight, neutral two-layer shadow at rest and a larger lift on hover that adds a gold hairline ring, a gold bloom and a faint mint bloom. The dark panels get depth from heavy inset ink shadows and a corner gradient, not from drop shadows, and their light comes from the shader mesh. Glow tokens (layered paper-to-gold-to-mint halos) exist for the hero CTA and hero text only. Real 3D is used for objects: the laptop and the rack are CSS-3D boxes, and project cards tilt toward the pointer with a holographic sheen.

### Shadow Vocabulary

- **Rest card** (`box-shadow: 0 1px 2px color-mix(in srgb, oklch(0.07 0 0) 5%, transparent), 0 8px 24px -12px color-mix(in srgb, oklch(0.07 0 0) 18%, transparent)`): every paper card and the open sections nav, at rest.
- **Hover card** (`box-shadow: 0 24px 60px color-mix(in srgb, oklch(0.07 0 0) 14%, transparent), 0 0 0 1px color-mix(in srgb, oklch(0.8858 0.182 95.69) 30%, transparent), 0 8px 40px color-mix(in srgb, oklch(0.8858 0.182 95.69) 28%, transparent), 0 2px 12px color-mix(in srgb, oklch(0.7906 0.1573 166.87) 15%, transparent)`): project, experience and skill cards on hover.
- **Panel inset** (`box-shadow: inset 0 0 200px color-mix(in srgb, oklch(0.07 0 0) 80%, transparent), inset 0 0 40px color-mix(in srgb, oklch(0.07 0 0) 60%, transparent)`): the hero and footer machine panels.
- **CTA glow** (the `glowXl` token at rest, `glow2xl` on hover): the hero `_Get in touch_` button only, with the gold-to-mint text glow on its label.

### Named Rules

**The Paper Doesn't Glow Rule.** Glows are dark-world vocabulary, reserved for the CTA and the hero. On paper, accent lives in small marks and in the hover shadow, never as a haze behind text.

**The Rest/Hover Pair Rule.** Every paper card uses the rest shadow at rest and the hover shadow on hover, transitioning over 300ms on the house curve. No other elevation levels on paper.

## Shapes

Soft, consistent rounding by scale. Machine panels use 2rem corners from 768px (1rem below); paper cards and the sections nav use 1rem; buttons and the contact popover use 1.5rem; small links and contact rows use 0.5rem; the focus ring and slider track use 0.25rem; tags, status dots and window dots are fully round. The one deliberate square is the footer contact LED (8px, 2px radius), echoing the rack hardware. Borders are 1px hairlines: the subtle border (paper edge at 50%) around and inside cards, the strong border (pale gray rule) for card footers. Cards clip their content (`overflow: hidden`), so their focus ring is drawn inset.

## Components

Precise, tactile, quiet: neutral at rest, colour spent only on hover and focus, machine labels in Doto.

### Buttons

- **Shape:** gently rounded (1.5rem).
- **Hero CTA (`_Get in touch_`):** warm paper fill, ink text, pale gray rule border, Doto 900 uppercase at 1.25rem to 1.875rem, 1rem by 1.5rem padding, max 300px wide (360px at 2k), the CTA glow shadow and gold text glow. It is magnetic: within 80px of a fine pointer it pulls up to 4px toward the cursor (inert on touch and under reduced motion), and it opens the contact popover.
- **Hover / Focus:** lifts 2px and deepens to the `glow2xl` halo; the fill shifts to pale gray wash; the `⤘` arrow wobbles and flashes gold. Press returns to rest at 98% scale over 150ms. Focus is a 2px gold outline with 2px offset, because the CTA sits on the dark hero.
- **Primary:** solid gold with deep ink text, 0.5rem by 1rem, soft glow; used for the labs reset control. Its focus ring is ink with a 2px offset.

### Chips

- **Style:** Doto 500 tags, 0.08em tracking, fully round, ink text on an 18% tint of the domain accent: mint for frontend, violet for backend, gold for creative, and an 8% ink wash for tooling. Small is 0.75rem with 0.125rem by 0.375rem padding.
- **State:** static labels, no interaction.

### Cards / Containers

- **Corner Style:** 1rem.
- **Background:** opaque lit paper stock.
- **Shadow Strategy:** the Rest/Hover Pair (see Elevation & Depth).
- **Border:** subtle hairline; strong rule above the project card footer.
- **Internal Padding:** 1.5rem body; 0.5rem by 1rem terminal bar.
- **Terminal bar:** every card opens with a Doto bar (three window dots, uppercase label, date) over a hairline, like a terminal window.
- **Project card:** tilts toward the pointer (3D rotate, lifts 4px, scales 1.02), the image zooms from 1.05 to 1.15, a holographic gold/mint/violet/pink sheen rises from 18% to 50%, and the `⤘ _VIEW PROJECT_` label darkens with its arrow sliding in. Keyboard focus reveals the same arrow and label, with an inset 2px ink ring.
- **Experience card:** hangs on a hairline timeline rail with a gold station dot that pings; bar shows company and period in Doto, body leads with a `⤘` prompt and the role in PP Neue Montreal.
- **Skill block:** on hover the border takes the block's accent at 40% along with the hover shadow; the title glyph stays neutral.

### Navigation

- **Sections nav:** fixed bottom-left from 768px, hidden until the hero is scrolled past. At rest it is marginalia: a wavy progress track (gold to mint to violet, lit to the scroll position, over a dim paper-edge base) and Doto `_0N` indexes in graphite gray. On hover or focus-within the section names slide open and the panel materialises as opaque paper with the rest shadow. The active link turns ink with a faint gold text glow; focus is a 2px ink ring.
- **Section header:** optional `_0N /` index, then the headline led by the `_❯` prompt in the section accent mixed 50% with ink, then an uppercase Doto description in graphite gray.

### Machine Panel (signature)

The dark bookends. Near-black (ink mixed 98% with a pale wash), heavy inset shadows, 2rem corners from 768px, padding 4rem at desktop. Both panels carry the shared shader mesh; the page itself carries a static full-viewport WebGL grain. The hero panel holds the spec layer, the booting CSS-3D laptop, the headline, the lead (`_❯ ...▐`), the magnetic CTA with `Explore the Labs →` under it, and it performs the scroll morph. The footer panel holds the CSS-3D server rack and the contact block.

### Spec Layer (signature)

The hero reads as a workbench under a plotter: the code it is built from is printed around it.

- **Header strip:** a 2.5rem editor tab strip along the panel's top edge, over a 8% paper hairline, on the text column. From 1280px (and 640px tall) it holds three toggle tabs, the real files that set the hero's values (`welcome-hero-section-content.css.ts`, `welcome-hero.css.ts`, `welcome-hero-computer.css.ts`); picking one lights the annotations that file sets, a mint underline grows under it, and picking it again clears it. Narrower, the strip shows `welcome-hero.section.tsx` only. On the right: the renderer that paints the mesh (`webgpu`, `webgl` or `css`, in mint with a breathing dot) and the measured frame rate.
- **Dot grid:** 1px dots on a 16px pitch at 10% paper, under the text, at every width and without JS. It dims to 50% while a group is lit.
- **Annotations (from 1280px):** mint rules on every headline baseline and its spec note; an I-beam bracket and a dimension line on the lead's measure; the gutter dimension from the frame edge to the text; a gold-titled note beside the CTA; a dashed selection box on the laptop's screen plane (it tilts with the laptop) with a note printing the live `rotateY · rotateX`; the four palette swatches with their OKLCH values in the bottom padding, always at full strength (no tab, never dimmed). At rest the other annotations sit at 14 to 55% opacity; hovering the headline, the lead or the laptop (or picking a file) lights its group to about 90% and dims the others to 45%.
- **Motion:** once hydrated with fonts loaded, a single plotter pass of about two seconds: tabs drop in, a mint scanline crosses the panel, rules draw left to right, notes type in, the gutter counts up to its value, swatches rise. A lit group replays a light pulse along its rules; the laptop's box marches its ants while lit. Under reduced motion everything is shown at once and nothing moves.
- **Without JS:** the grid and the entry file name only; annotations need measured values.

### Contact Block (signature)

In the footer, a Doto header `_❯ ESTABLISH LINK` with a blinking gold `▐` cursor, then right-aligned uppercase Doto rows at 75% paper. Each row has a square LED dimmed to 35% of its accent; on hover or focus the row takes its accent colour, the LED lights with a soft 10px glow, and a `⤘` arrow slides in over 150ms. Focus is a 2px gold outline with 4px offset. In the hero, the contact popover is a translucent dark card (1.5rem corners, 3px backdrop blur, mint edge) on a 14px blueprint grid, with Doto 900 links that turn mint on hover.

## Do's and Don'ts

### Do:

- **Do** preserve the hero world intact: the gold, mint and violet shader mesh, the film grain, the booting laptop, the magnetic CTA and the scroll morph.
- **Do** keep the footer as a dark machine panel with the server rack and the `_❯ ESTABLISH LINK` contact block.
- **Do** speak machine in Doto with the established vocabulary: `_❯` prompts, `▐` cursor, `⤘` arrow, underscored labels (`_GET IN TOUCH_`), `_0N /` numbering.
- **Do** keep cards neutral at rest (rest shadow, subtle hairline, opaque paper) and spend colour only on hover and focus.
- **Do** show a 2px outline with offset on every interactive element: ink on light surfaces, gold on dark panels.
- **Do** set Doto that is read or clicked at 16px or more, or at weight 800 and up.
- **Do** use the house curve `cubic-bezier(0.22, 1, 0.36, 1)` with the 150/300/600ms durations, and stop every animation under `prefers-reduced-motion`.

### Don't:

- **Don't** use aggressive neon; glows stay subtle and are reserved for CTAs and the hero.
- **Don't** resurrect "The Signal" directions: no carrier wave, no dithering.
- **Don't** use gold as hover or text colour on paper (about 1.1:1); gold hover belongs to dark surfaces.
- **Don't** use graphite gray for text on the dark panels (about 2.72:1); use warm paper at reduced opacity instead.
