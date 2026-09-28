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
  circuit-azure: "oklch(0.7 0.15 240)"
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
    fontWeight: 800
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
  tag-systems:
    backgroundColor: "color-mix(in srgb, oklch(0.7 0.15 240) 18%, transparent)"
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

Dark machine panels bookend a lit workbench of warm paper cards, and the hardware objects carry the identity. At the top, an immersive near-black hero panel holds a WebGL/WebGPU mesh of gold, mint and violet light under animated film grain, a CSS-3D laptop that boots on arrival, and a magnetic `_Get in touch_` CTA; on scroll the hero morphs from full-bleed into an inset rounded panel. At the bottom, a matching dark footer panel holds a CSS-3D server rack with a patch unit and the `_❯ ESTABLISH LINK` faceplate: a patch cable runs from the rack to the contact being pointed at. Between them, the page is warm beige paper printed with a baked film grain, and the content sits on opaque paper cards that stay quiet until pointed at.

The voice of the machine is Doto, a dot-matrix face used only for terminal vocabulary: `_❯` prompts, the `▐` cursor, the `⤘` arrow, underscored labels (`_GET IN TOUCH_`, `_VIEW PROJECT_`), and `_0N /` section numbering. The human voice is PP Neue Montreal, used for every heading and paragraph. Density is moderate: cards are compact and bar-topped like terminal windows, the sections breathe inside a capped column, and the dark panels run near-full-bleed.

Components are precise, tactile, quiet: neutral at rest, colour spent only on hover and focus, machine labels in Doto. Glows exist but stay subtle and belong to the dark world only (the hero, its CTA and the Skills terminal's glass). Confirmed rejections: aggressive neon, and "The Signal" directions (carrier wave, dithering), which are never to be resurrected.

**Key Characteristics:**

- Two dark machine panels (hero laptop, footer rack) bookending a warm paper workbench.
- A WebGL/WebGPU mesh of gold, mint and violet light plus WebGL film grain on the dark panels; a baked film-grain tile on the paper.
- Opaque paper cards with a terminal title bar, neutral at rest, gold-tinted lift on hover.
- Doto for machine labels only; PP Neue Montreal for everything a person reads at length.
- One house easing curve, `cubic-bezier(0.22, 1, 0.36, 1)`, shared by CSS and JS.
- Every animation stops under `prefers-reduced-motion`; prerendered HTML is fully visible without JS.

## Colors

Warm paper and near-black ink carry the structure; three luminous accents (gold, mint, violet) plus a soft pink are rationed as small lit marks and hover responses.

### Primary

- **Lamplight Gold** (oklch(0.8858 0.182 95.69)): the house accent. On dark panels it is the CTA glow, the hero links, the blinking cursor, footer hover colour and the focus ring. On paper it appears only as small lit marks (the status dot, the work log's HEAD ring and ping, the card footer tick), as the tint of git tags and as the tint inside the hover shadow; the section-title `_❯` prompt mixes it 50% with ink so it stays legible.
- **Deep Ink** (oklch(0.09 0 0)): text on solid gold fills (the primary button and the active labs control).

### Secondary

- **Phosphor Mint** (oklch(0.7906 0.1573 166.87)): the frontend tag domain (and the frontend lane of the work log, deepened 70% with ink in oklab), the second blob of the hero mesh, the far halo in every glow token, the contact popover edge and link hover, and the middle stop of the sections nav's neon track.

### Tertiary

- **Ultraviolet Orchid** (oklch(0.5548 0.2575 312.98)): the backend tag domain (and the backend lane of the work log, undiluted), the third blob of the hero mesh, and the end stop of the sections nav's neon track. Never text on paper at small sizes.
- **Circuit Azure** (oklch(0.7 0.15 240)): the systems & AI domain (Rust, Python, AI, TensorFlow, DialogFlow): its tag tint, stack tick and LEDs, the monitor's fourth meter, and the work log lane (deepened 70 % with ink on paper, as mint is). Lighter than violet (0.70 against 0.55), so the two never rely on hue alone. Chosen on the canvas (Skills, round 3, D1) over an ember orange.
- **Kirby Pink** (oklch(0.8455 0.0872 355.09)): the footer's contact voice (the email port's accent: its LED, plug latch, cable and label when plugged, which is its resting state), and one band of the card holographic sheen and hero meta gradient.

### Neutral

- **Warm Paper Beige** (oklch(0.93 0.03 80)): the page background, and the light text colour on dark panels.
- **Workbench Ink** (oklch(0.07 0 0)): all text on paper; mixed 98% with a pale wash it becomes the dark machine panel; the focus ring on light surfaces.
- **Lit Paper Stock** (oklch(0.975 0.012 88)): opaque card and open-nav surface, a step lighter and warmer than the page.
- **Paper Edge** (oklch(0.88 0.02 80)): card hairlines (at 50% via the subtle border).
- **Pale Gray Rule** (oklch(0.9 0 0)): the strong border (card footer rules, labs frames and controls).
- **Pale Gray Wash** (oklch(0.96 0 0)): hover fill of the hero CTA and ghost buttons, slider track, dim labs text.
- **Graphite Gray** (oklch(0.45 0 0)): secondary text on paper: terminal bar labels, section descriptions and indexes, status annotations, inactive nav links.
- **Muted on Dark** (`mutedForegroundOnDark`, warm paper mixed 64% into ink): graphite's role on the dark panels, opaque so it reads the same over any panel shade: the footer status strip and copyright. The rack caption sits over the mesh's gold bloom, where muted-on-dark fell to 3.8:1, so it is paper at 82 % (about 5:1 at the bloom's brightest).
- **Fault Red** (oklch(0.55 0.22 29)): the rack's `ERR` status, the warm end of the rack accent spectrum, and (mixed with gold) the first terminal window dot. Not an interface error colour: the site has no forms.

### Named Rules

**The Spent-on-Hover Rule.** Accents never tint a resting surface. A card at rest is paper, a hairline and a neutral shadow; gold enters the surface only through the hover shadow, where it means "this one". One exception, data not decoration: the work log's branch lanes and tracks carry their stack domain at rest (see Work Log).

**The Dark-Only Gold Rule.** Gold is a text, hover and ring colour on dark panels only. On paper it measures about 1.1:1, so there it appears as a lit dot or tick, or mixed 50% with ink; gold hover and gold text on paper are debt, not precedent.

**The Kirby Reserve Rule.** Pink belongs to the footer's contact voice. It never goes on structural lines such as rails, rules or borders.

## Typography

**Display Font:** PP Neue Montreal (variable, local woff2, weights 200 to 800, with system-ui). WebKit does not map `font-weight` onto this file's weight axis (no STAT table, a non-standard `ital` axis running 100 to 900), so every weight goes through `weight()` (`app/styles/weight.ts`), which also pins `font-variation-settings` in WebKit only. The file's true italic sits at `ital` 900: CSS `italic` does not reach it, so the hero headline is a synthesized oblique of the upright.
**Body Font:** PP Neue Montreal (with system-ui)
**Label/Mono Font:** Doto (self-hosted variable woff2, weights 100 to 900: the Google Fonts latin subset, preloaded, and latin-ext on demand; SIL OFL; with system-ui)
**Code Font:** the system monospace stack (`ui-monospace`, SF Mono, Menlo, Consolas), never downloaded; the hero's spec layer only

**Character:** A clean neo-grotesk for everything a person reads, set against a dot-matrix face that speaks only as the machine. The italic, tightly tracked hero headline is the one moment the grotesk performs; everywhere else it stays plain.

The theme stack lists `Inter` but it is never loaded and resolves to system-ui. PP Neue Montreal and the Doto latin file are the only fonts preloaded; nothing else is downloaded.

### Hierarchy

- **Display** (700 italic, 2.25rem stepping to 3.5rem at sm, 4.75rem at md, 6rem at lg, 7.5rem at 2k; line-height 0.9 to 0.8; tracking -0.035em to -0.045em; ligatures on): the hero headline only, warm paper on the dark panel with the soft glow text shadow.
- **Headline** (700, 2.25rem stepping to 3.5rem at md, line-height 1.25): section and page titles, always led by the `_❯` prompt. Smaller variants step 1.875/2.25rem and 1.5/1.875rem.
- **Title** (600, 1.25rem, line-height 1.25): project names in the monitor (1rem in its table rows from 768px), client projects in the work log (1rem, 1.125rem from lg), and the practice and stack checks in the fetch readout (1.25rem at every width).
- **Log employer** (700, 1.5rem stepping to 1.875rem at lg, line-height 1.05, tracking -0.02em): the employer names in the work log, well under the section headline; the role under it is 1rem.
- **Lead** (400, 1.25rem stepping to 1.5rem at md and 1.875rem at 2k, line-height 1.25, max 40rem): the hero statement under the headline.
- **Body** (400, 0.875rem, line-height 1.45): card descriptions (1rem in the monitor's detail pane and mobile rows). Running text on the paper is 1rem at every width: the work log's descriptions, the practice sentences, the stack's tools and the readout's values; no paper text steps up to 1.125rem. Global line-height is 1.5; paragraphs use `text-wrap: pretty`, headings `balance`.
- **Label** (Doto 800 to 900, 0.75rem, tracking 0.12em to 0.18em, uppercase): terminal bars, tags, company names, status annotations, `_VIEW PROJECT_`. Section descriptions and `_0N /` indexes use 800 at 0.875rem with 0.14em tracking.
- **CTA label** (Doto 900, 1.25rem stepping to 1.5rem at md and 1.875rem at 2k, uppercase): the hero `_Get in touch_` button only.
- **Spec** (system mono 400, 0.6875rem file tabs, 0.625rem annotations, 0.5625rem swatches; tabular numerals, 0.02em tracking): the hero's spec layer only.

### Named Rules

**The Two Voices Rule.** PP Neue Montreal speaks; Doto labels the machine. Doto is for prompts, bars, tags, indexes, nav and the CTA, never for a sentence meant to be read as prose. The system monospace is not a third voice for the page: it only prints values read from the code, in the hero's spec layer.

**The Measured Value Rule.** A spec annotation prints what the live element reports (computed styles, layout, the renderer that won, the frame rate), never a number typed by hand. Change a token and the annotation follows; a value nothing can measure does not get an annotation.

**The Legible Dot-Matrix Rule.** Anything set in Doto that is read or clicked should be at least 16px or weight 800 and up. Dot-matrix glyphs break apart at small sizes and light weights; the smallest read Doto is the sections nav's 12px at 800–900 (14px on touch). The `2xs` size (0.6rem) is for aria-hidden decoration only. Terminal glyphs (`_❯`, `▐`, `⤘`, `❯`) go through the `Glyph` primitive, which hides them from assistive tech: a heading reads "Projects", never "underscore ❯ Projects".

**The Index, Not Kicker Rule.** The `_0N /` mark above a section title is literal terminal numbering and nothing else: no descriptive words, no taglines.

## Layout

A single column of sections inside a centred container that caps below common viewport widths so the page always keeps real side margins: full width with 1rem gutters on mobile, 1.5rem at 640px, 768px max with 2rem at 768px, 1024px max with 3rem at 1024px, 1280px max at 1280px, and 1440px max with 4rem at 1920px. Breakpoints are mobile-first (640, 768, 1024, 1280, 1920), written in em (40, 48, 64, 80, 120em) so a visitor who raises the default text size gets the narrower layout instead of an overflowing one.

The hero and footer panels escape the container and sit near full-bleed, inset by 0.5rem. From 768px the hero panel's sides close in onto the content column over the first half screen of scroll (a CSS scroll-driven clip-path: nothing scales, the text and laptop already sit on that column); where the hero fits one screen (1024px wide, 640px tall) its stage first pins for 20vh. Below 768px, or under reduced motion, there is no morph. The footer panel is full-bleed like the hero (inset 0.5rem, 0.5rem above the page's end) while its content stays on the page column; it stacks rack, contact block and status strip below 1280px, and from 1280px the rack takes a 24.5rem left column and the faceplate the rest, with the status strip across the foot.

Spacing follows the token scale (0.25, 0.5, 1, 1.5, 2, 3, 4rem). Card bodies use 1.5rem padding, terminal bars 0.5rem by 1rem, and section headers end with 2rem (section) or 3rem (page) of space. Scroll reveals translate items up 16px and fade in over 600ms, staggered 70ms per item.

A sections nav docks at the foot of the screen once the hero is scrolled past: bottom-left from 768px, across the foot (1rem sides) below. It is an opaque object on purpose: below 1440px the column leaves no free gutter, so it covers content the way a dock does, never text on text. It steps away once the footer holds the screen; on phones, anything else pinned to the bottom (the Skills receipt) pads itself by `dockClearance` (`app/styles/dock.css.ts`).

### Named Rules

**The Bookend Rule.** Dark panels run near-full-bleed at the top and bottom of the page only; everything between lives in the capped paper column. Never introduce a third dark panel mid-page. Ink objects inside the column are not panels: the sections nav capsule, the work log's command line and the Skills terminal (window chrome, no bleed, no mesh canvas).

## Elevation & Depth

A hybrid. Paper surfaces use a single tight, neutral two-layer shadow at rest and a larger lift on hover that adds a gold hairline ring, a gold bloom and a faint mint bloom. The dark panels get depth from heavy inset ink shadows and a corner gradient, not from drop shadows, and their light comes from the shader mesh. Glow tokens (layered paper-to-gold-to-mint halos) exist for the hero CTA and hero text only. Real 3D is used for objects: the laptop and the rack are CSS-3D boxes; the holographic tilting project card lives on in its Lab.

### Shadow Vocabulary

- **Rest card** (`box-shadow: 0 1px 2px color-mix(in srgb, oklch(0.07 0 0) 5%, transparent), 0 8px 24px -12px color-mix(in srgb, oklch(0.07 0 0) 18%, transparent)`): every paper card, at rest.
- **Hover card** (`box-shadow: 0 24px 60px color-mix(in srgb, oklch(0.07 0 0) 14%, transparent), 0 0 0 1px color-mix(in srgb, oklch(0.8858 0.182 95.69) 30%, transparent), 0 8px 40px color-mix(in srgb, oklch(0.8858 0.182 95.69) 28%, transparent), 0 2px 12px color-mix(in srgb, oklch(0.7906 0.1573 166.87) 15%, transparent)`): the Lab project card on hover. No homepage surface uses it any more: the monitor window, the work log and the fetch readout's card are not targets.
- **Panel inset** (`box-shadow: inset 0 0 200px color-mix(in srgb, oklch(0.07 0 0) 80%, transparent), inset 0 0 40px color-mix(in srgb, oklch(0.07 0 0) 60%, transparent)`): the hero and footer machine panels.
- **CTA glow** (the `glowXl` token at rest, `glow2xl` on hover): the hero `_Get in touch_` button only, with the gold-to-mint text glow on its label.

### Named Rules

**The Paper Doesn't Glow Rule.** Glows are dark-world vocabulary, reserved for the CTA, the hero and the glass of the Skills terminal (phosphor bloom on ink). On paper, accent lives in small marks and in the hover shadow, never as a haze behind text.

**The Rest/Hover Pair Rule.** Every paper card uses the rest shadow at rest and the hover shadow on hover, transitioning over 300ms on the house curve. No other elevation levels on paper.

## Shapes

Soft, consistent rounding by scale. Machine panels use 2rem corners from 768px (1rem below); paper cards and the open sections nav use 1rem (the capsule at rest is a pill); buttons and the contact popover use 1.5rem; small links and contact rows use 0.5rem; the focus ring and slider track use 0.25rem; tags, status dots and window dots are fully round. The deliberate squares are the footer's hardware: keystone jacks (4px corners), their 5 × 3px LEDs, the faceplate (12px corners, 10px on phones) and the status strip (0.5rem). Borders are 1px hairlines: the subtle border (paper edge at 50%) around and inside cards, the strong border (pale gray rule) for card footers. Cards clip their content (`overflow: hidden`), so their focus ring is drawn inset.

## Components

Precise, tactile, quiet: neutral at rest, colour spent only on hover and focus, machine labels in Doto.

### Buttons

- **Shape:** gently rounded (1.5rem).
- **Hero CTA (`_Get in touch_`):** warm paper fill, ink text, pale gray rule border, Doto 900 uppercase at 1.25rem to 1.875rem, 1rem by 1.5rem padding, max 300px wide (360px at 2k), the CTA glow shadow and gold text glow. It is magnetic: within 80px of a fine pointer it pulls up to 4px toward the cursor (inert on touch and under reduced motion), and it opens the contact popover.
- **Hover / Focus:** lifts 2px and deepens to the `glow2xl` halo; the fill shifts to pale gray wash; the `⤘` arrow wobbles and flashes gold. Press returns to rest at 98% scale over 150ms. Focus is a 2px gold outline with 2px offset, because the CTA sits on the dark hero.
- **Primary:** solid gold with deep ink text, 0.5rem by 1rem, soft glow; used for the labs reset control. Its focus ring is ink with a 2px offset.

### Chips

- **Style:** Doto 800 tags, 0.08em tracking, fully round, ink text on an 18% tint of the domain accent: mint for frontend, violet for backend, gold for creative (graphics, games, shaders), azure for systems & AI, and an 8% ink wash for tooling. Small is 0.75rem with 0.125rem by 0.375rem padding.
- **State:** static labels, no interaction.

### Cards / Containers

- **Corner Style:** 1rem.
- **Background:** opaque lit paper stock.
- **Shadow Strategy:** the Rest/Hover Pair (see Elevation & Depth).
- **Border:** subtle hairline; strong rule above the project card footer.
- **Internal Padding:** 1.5rem body; 0.5rem by 1rem terminal bar.
- **Terminal bar:** every card opens with a Doto bar (three window dots, uppercase label, date) over a hairline, like a terminal window.
- **Project card (Lab only, `/labs/project-card-3d`):** no longer on the homepage, where the Process Monitor lists the projects. It tilts toward the pointer (3D rotate, lifts 4px, scales 1.02), the image zooms from 1.05 to 1.15, a holographic gold/mint/violet/pink sheen rises from 18% to 50%, and the `⤘ _VIEW PROJECT_` label darkens with its arrow sliding in. Keyboard focus reveals the same arrow and label, with an inset 2px ink ring.
- **Skills:** no longer cards; the Fetch Readout prints them (see below).

### Navigation

- **Sections nav (ink capsule):** a small ink object, never a third dark panel (same family as the work log's command terminal and the monitor's ink strip). At rest it is one status line: the current section (`_02` in muted-on-dark, the name in paper, Doto 900 at 12px, 14px on touch, typed in when it changes), a hairline divider, and `LABS →` (a route, no index, outside the scroll-spy). Along its foot runs the neon track: the same gentle S as ever, laid down, gold to mint to violet, lit up to the scroll progress with a soft 6px tip, over an unlit paper-at-14% line, with one station per section that turns paper once passed. Hover (mouse), focus or a tap on the label (a React Aria disclosure button) grows it upward into the list: `_0N / NAME` rows, the current one in paper on an 8% wash, gold on hover and focus (legal on ink). Rows are 28px on desktop and 44px on touch, where a light scrim sits behind the open list and a chevron marks the button. Focus is the gold ring (the capsule remaps `ring`); Escape folds the list and returns focus to the label. It is the page's first tab stop even while hidden: focus brings it in, above the hero stage.
- **Section header:** optional `_0N /` index, then the headline led by the `_❯` prompt in the section accent mixed 50% with ink, then an uppercase Doto description in graphite gray.

### Machine Panel (signature)

The dark bookends. Near-black (ink mixed 98% with a pale wash), heavy inset shadows, 2rem corners from 768px, padding 4rem at desktop. Both panels carry the shared shader mesh; the paper around them carries the film grain of `grain.shader.ts`, baked by `bun run generate-grain-tile` into a 128px tile (@1x/@2x, one cell per device pixel) and set as the body background once the page has loaded, so it never delays the first paint. The hero panel holds the spec layer, the booting CSS-3D laptop, the headline, the lead (`_❯ ...▐`), the magnetic CTA with `Explore the Labs →` under it, and it performs the scroll morph. The footer panel holds the CSS-3D server rack, the patch faceplate and the status strip (see Patch Panel).

### Spec Layer (signature)

The hero reads as a workbench under a plotter: the code it is built from is printed around it.

- **Header strip:** a 2.5rem editor tab strip along the panel's top edge, over a 8% paper hairline, on the text column. From 1280px (and 640px tall) it holds three toggle tabs, the real files that set the hero's values (`welcome-hero-section-content.css.ts`, `welcome-hero.css.ts`, `welcome-hero-computer.css.ts`); picking one lights the annotations that file sets, a mint underline grows under it, and picking it again clears it. Narrower, the strip shows `welcome-hero.section.tsx` only. On the right: the renderer that paints the mesh (`webgpu`, `webgl` or `css`, in mint with a breathing dot) and the measured frame rate.
- **Dot grid:** 1px dots on a 16px pitch at 10% paper, under the text, at every width and without JS. It dims to 50% while a group is lit.
- **Rules (every width):** mint rules on every headline baseline and an I-beam bracket with a dimension line on the lead's measure; they need no room, so phones get them too.
- **Swatches (every width):** the four palette tokens (chip, DESIGN.md name at paper 65%, raw OKLCH value at paper 50%, about 5:1) in a 2 × 2 block, at full strength (no tab, never dimmed): under the Labs link on phones and tablets, in the bottom padding beside the laptop.
- **Annotations (from 1280px):** the headline's spec note; the gutter dimension from the frame edge to the text; a gold-titled note beside the CTA; a dashed selection box on the laptop's screen plane (it tilts with the laptop) with a note printing the live `rotateY · rotateX`; At rest the other annotations sit at 14 to 55% opacity; hovering the headline, the lead or the laptop (or picking a file) lights its group to about 90% and dims the others to 45%.
- **Motion:** once hydrated with fonts loaded, a single plotter pass of about two seconds: tabs drop in, a mint scanline crosses the panel, rules draw left to right, notes type in, the gutter counts up to its value, swatches rise. A lit group replays a light pulse along its rules; the laptop's box marches its ants while lit. Under reduced motion everything is shown at once and nothing moves.
- **Without JS:** the grid and the entry file name only; annotations need measured values.

### Process Monitor (signature)

The Projects section reads the projects as processes: a light-mode `htop` on paper. It is the section's own procedure, distinct from the hero's spec layer: nothing is annotated, everything is listed, and every value is derived from `projects-data.ts` (never typed, never a made-up metric).

- **Window:** one opaque paper card (1rem corners, strong border, rest shadow; no hover lift, the window is not a target). Discreet gradients only, never an accent at rest: a lamp from the top-left, the paper warming slightly towards the foot, a light bevel on the command bar, a hair-lighter top edge on the ink strip.
- **Command bar:** `_❯ netoun ps --projects▐` in Doto, and on the right `UP hh:mm:ss`, the time this visit has been running (prerendered as `UP --:--:--`, ticking once a second only while the section is on screen).
- **Meters:** FRONTEND / BACKEND / CREATIVE / SYSTEMS & AI as segmented bars (an empty domain keeps its row at `00 tags`, unlit), one segment per tag, counted with the tag primitive's own domain map; lit segments are small LEDs (brighter at the top, the domain colour below), unlit ones a faint ink gradient. Each meter opens with a 12px CSS-3D cube in its domain colour. Beside them TASKS (total, live, source), SINCE and LATEST.
- **Column strip:** the one ink band of the monitor (paper text, Doto 900 uppercase). NAME, STATUS and DATE are sort buttons (arrow shows the direction, gold on hover and focus since the strip is dark); ID, HOST and STACK are labels. Default sort: DATE, newest first.
- **Rows:** a React Aria grid list. ID is a PID that grows with time (01 = oldest project); NAME is the link; STATUS is `LIVE` or `SRC`, read from the URL, each with its CSS-3D object: `LIVE` a graphite rack unit with a mint LED (the footer rack in miniature), `SRC` a violet cube; the object turns to show its side while its row is selected; HOST is the URL without its scheme; DATE is `YYYY-MM`. Columns widen per breakpoint: ID · NAME · STATUS · DATE from 768px, + HOST from 1024px, + STACK from 1280px.
- **Selection:** a click, a tap or the arrow keys select a row, as in a real `htop`; pointing selects nothing (the pointer crosses rows on its way to the detail pane), a pointed row only takes an 8% mint wash. The selected row takes a mint wash fading from 32% to 10% across the row and a `❯` caret; Enter (or a double click) opens it, a tap never does (the name link and `⏎ OPEN` open). The mint wash is an interaction state, so it honours the Spent-on-Hover Rule.
- **Detail pane (from 768px):** the selected project's 16:10 capture in a chrome bezel, `_❯ inspect <slug>`, title, description, stack and `_SOURCE_ ↗` / `_LIVE_ ↗`. It is an on-screen echo, hidden from assistive tech; the row carries the same text.
- **Key bar (from 768px):** `↑ PREV`, `↓ NEXT`, `⏎ OPEN` on real CSS-3D keycaps in the laptop keyboard's ink, and `LABS →` on the right. A keycap sinks when its control is pressed, and when its key is pressed inside the grid (listened on the grid, never on the document).
- **Chrome captures:** every capture sits in a 5px polished-chrome bezel (cool silvers, conic) behind a glass sheen. While a fine pointer moves over the monitor, the bezel's highlights turn with it and a silver glint (a hair of mint) crosses the capture; a new capture arrives with one glint sweep. Touch screens keep the bezel and a faint resting glint. Chrome is metal, not glow: it keeps the Paper Doesn't Glow Rule.
- **Below 768px:** no selection; every row is a complete block (ID, status, date, name, host, capture, description, stack), the host wrapping rather than truncated. Sorting stays available in the strip.
- **Motion:** one arrival when the section reveals: the command types in steps, the meter segments light one by one, the rows print one after another from 600ms (`arrival` in `app/styles/motion.css.ts`, shared by the three procedures). Arriving by a sections-nav link skips it. Once a visitor sorts, rows never replay it. Under reduced motion, nothing moves (no cube spin, no object turn, no glint), and the cursor does not blink; without JS, everything is shown and the newest project is selected.

### Work Log (signature)

The Experience section reads the work history as `git log --graph`, printed straight on the paper: no window, no card. It is the section's own procedure, distinct from the monitor above it (which is a window you operate) and from the hero's spec layer. Every value is derived from `experiences-data.ts` and the current month.

- **Command line:** a small terminal on the paper: an ink capsule (0.5rem corners, machined top edge, rest shadow) printing `$ netoun log --graph --all▐` in Doto 900, the `$` and the cursor in gold (it sits on ink). No `_❯` here: the section title carries the only prompt. On the right, on the paper, `SINCE SEP 2017 · 9Y`. Pointing at a branch swaps `--all` for its name, on a tint of its domain.
- **`branch -v`:** headed `netoun branch -v` (no prompt either), beside the section title from 1280px (under it below): one row per employer (`*` on the current one), a segmented bar on one shared scale (one segment per two months, lit as LEDs in the lane colour (brighter at the top), unlit ones a faint ink gradient), the months, and `open · HEAD` / `merged YYYY-MM` from 640px.
- **Graph:** printed, not drawn: `git log --graph` in git's own ASCII, Doto 900 at 22px on a 20px line (28px on 24px from 1024px), three glyph cells wide (main, the diagonals, the branch). `*` is a commit, `|` a lane, `/` the branch folding back into main, `\` main opening the next one, `¦` main while it waits above its latest merge (it has not moved since the open branch forked), `:` the unlisted client work (with the line `⋮ more client work, not listed`, never a count). Every row is snapped to a whole number of lines (`useLineSnap`, a ResizeObserver on each row's content), so a glyph column clipped by its row ends on a line boundary and the next row carries on unbroken; without JS the rows keep their natural height. The page's grayscale smoothing is lifted on the glyphs (it thinned Doto on macOS and opened seams between its dots). Between two employers the machinery is three lines (`/`, the merge's `*`, `\`). Chosen on the canvas (round 4, A1) after vector lanes, routed fillets and LED segments.
- **Lane colour:** each branch takes the main domain of every tag shipped on it, counted with the tag primitive's map; ties go frontend → backend → creative → systems. Along its branch the lane runs lit at the tip (the latest) to deep where it forked, one solid colour per row (a gradient clipped to the text broke Doto's dots apart): time reads as light. Lit and mid are the accent mixed with ink (violet: lit with white), deep is the accent mixed with the rail's graphite (never black), all in oklab, never oklch, which would rotate mint to olive and gold to orange. A legend closes the log: `LANE = MAIN STACK DOMAIN`, naming only the lane colours drawn.
- **Nodes:** `*` in the row's colour: a tip in its lane at its most lit, a client project in its own domain, a merge and the root in main's graphite. HEAD's `*` sits on a gold pulse, the only live mark of the section (paused off screen).
- **Employer:** a dimension line runs out of the tip's `*` under the employer, like the hero's gutter: a 1px hairline from the lane colour to 45 % of it, closed by a 7px tick. The commit's short hash, the ref pill (`HEAD -> lonestone` on an ink pill: `HEAD` in gold, the name in its lane colour lightened for the ink; merged branches on a tint with a 1px lane-colour border; 1.375rem tall, Doto 12px) and, from 1024px, the period (Doto 12px) sit on it, on paper, as git prints `* 7448d23 (HEAD -> lonestone)`. Then the employer name (h3), role, place, and the stack mix as LED segments with `5 FRONTEND · 7 BACKEND · 1 CREATIVE`. Text on the right: period and computed tenure, description, stack chips (the tag primitive).
- **Client projects:** h4 title (first line centred on the node line), `MOSTLY <DOMAIN>` with a small LED, then git's `--stat` line: the hash and `stack | 5 +++++`, one `+` per tool of its stack, in its domain colour. Description, stack chips (the tag primitive, medium). Git's own lines (`cd178c8 Merge branch 'easilys'`, `main`, `tag: 2021-07`, `Initial commit`) are printed in Doto graphite and hidden from assistive tech: the employer rows already carry the dates.
- **Diff:** the text reads as an added hunk, as `git show` prints it: a gutter of `+` beside every description, one per line (the same size and line height, clipped to the paragraph), in the employer's lane or the project's domain at 70 %; every stack chip takes a `+` mark in its domain, deepened with ink (the tag primitive's `mark`, hidden from assistive tech). Chosen on the canvas (round 2, K3) over plotter marks and a pager frame.
- **Hashes:** every printed commit (tip, client project, merge, root) carries a 7-character hash, FNV-1a of a seed from the data (the slug, the project title), so it is stable across builds and identifies nothing outside the log. Printed a step lighter than the muted labels, and hidden from assistive tech. Decoration that stays quieter than the content: no detail may cost the titles and sentences their legibility.
- **Interaction:** a mouse pointer on a branch's row in `branch -v` or on its ref pill filters the log to it (the groups themselves never listen, and nothing lights while the page scrolls, so a resting mouse never filters): the other branches fade to 28 %, the matching `branch -v` row takes a tint of its domain. Touch and keyboard see everything, unfiltered: nothing in the log is a control.
- **Below 1024px:** one column in reading order (pill, name, role, period, place, text, stack, mix).
- **Motion:** one arrival when the section reveals: the command types in steps, the `branch -v` bars fill, the rows print one after another (55ms apart) and each lane draws down as its rows print, and each employer's track draws out of it. Under reduced motion nothing moves (no ping, no cursor blink); without JS everything is shown. Durations hydrate from the build's month, then follow the visitor's month.

### Fetch Readout (signature)

The Skills section reads the stack and the practice as a fetch readout: `neofetch`, the dev's system screenshot, run in a small terminal. It is the section's own procedure, distinct from the monitor (a window you operate) and the work log (a graph printed on the paper). It alternates three surfaces inside itself: the head runs in the terminal (ink), the practice is lifted into the section's one white card, the stack is printed on the paper. Every value is derived: the job and counts from the data, the evidence from the projects, jobs, Labs and the site's own `package.json`.

- **Terminal:** an ink window in the column, the practice card's width, 1rem corners, a hairline of paper at 12%, the rest shadow. An object like the work log's command line, not a panel: no bleed, no mesh, so the Bookend Rule holds. Its bar is machined (a hair lighter at the top) and holds the three window dots only; the screen's inner edge is the card's, so the head, the checks and the stack share one edge. The screen is a lightly shaded CRT: at rest (and without JS or WebGL) its glass carries the hero mesh's three lights, held still (mint behind the logo, violet low under the readout, a hint of gold in the far corner), and over the text lie 1px scanlines on a 3px pitch at 30% ink, the tube's vignette and a glass sheen from the top-left lamp. Glyphs bloom in their own colour (0.5em at 38%) and the Doto ones add a hair of convergence error (fault red left, mint right, 0.035em). Once the terminal comes within half a viewport, a WebGL light pass (`app/components/misc/shaders/crt/`, screen blend, one cell per CSS pixel) adds what CSS can't: the three lights drifting on slow orbits, a refresh band rolling down the glass every 7.5s, and phosphor noise re-rolled 24 times a second. It stops off screen; under reduced motion it draws one still frame, without the band.
- **Command line:** `_❯ fastfetch --logo netoun▐` in Doto 900 on the glass, the prompt and the cursor in gold (legal on ink).
- **Logo:** `public/logo.svg` printed as characters, the way neofetch prints a distro logo: 42 × 25 cells filled with `netoun`, the favicon's squiggle hollow. The art is generated by `bun run generate-logo-ascii` into `app/features/skills/data/logo-ascii.ts`, never typed. Doto and the system monospace both advance 0.6em, so at a 1em line the cells are 0.6 × 1 and the disc prints round before and after Doto loads. It carries the favicon's holo gradient, lit on the ink (mint → violet lifted 28% with white → gold), drifting over 14s as the favicon's does (paused off screen), with a soft paper bloom (drop-shadow, 0.35em at 22%). Pointing at a readout line fills the letters with that line's colour: paper for the practice, the domain's light for a stack domain. The logo is the brand mark, an object rather than a surface, so the Spent-on-Hover Rule holds.
- **Readout:** `netoun@lonestone` (user in mint, host in lifted violet: the current employer's slug), then as many dashes as it has characters (paper at 32%), then `key: value` lines: Role and Host (the current job), Uptime (months since the first job), Shipped (projects, employers, Labs), Stack (tools, domains). Keys in Doto 900 gold, as neofetch colours its keys; values in PP Neue Montreal paper with their own hierarchy: the role in bold italic (the hero headline's voice), each line's datum in semibold (Lonestone, 9Y, the counts), its context in muted-on-dark (· Nantes, FR, · since SEP 2017). The colour row closes it: one LED block per domain (practice paper, frontend, backend, creative, systems & AI, tooling muted-on-dark), each glowing faintly in its own light, with its label and count.
- **Practice card:** the section's white card (rest shadow, strong border, the monitor's lamp gradient; not a target, no hover lift). Its bar: `PRACTICE` on an ink pill in gold, `agents & LLM`, the count. Inside, one check per practice in a 2 × 2 grid from 1024px: a gold `✓` on an ink square (the practice's mark, never a fourth domain colour), the title (h4), one sentence of fact, then `• works with` / `• built with` and `• receipt` in Doto. Client work reads `client work, not listed`, as in the work log; the one public receipt links to this site's `AGENTS.md`.
- **Stack:** printed on the paper, on the card's inner edge, so the two 2 × 2 grids share their columns. A `STACK` label (outlined, not inked) and `FOUND IN THE PROJECTS, JOBS, LABS OR THIS SITE`. One check per domain of the tag primitive's map: frontend, backend, creative and systems & AI fill the 2 × 2, and the tooling it leaves neutral runs as one line across under a hairline (title, LEDs and tools side by side from 1024px). Each check: the `✓` on an LED square of the domain, the title (h4), one LED segment per tool, the count, then the tools as prose separated by drawn dots. A tool is listed only if it ships somewhere (a page test enforces it).
- **Receipts:** the tools are a React Aria tag group per domain. Pointing at a tool, focusing it (arrow keys move the selection) or tapping it selects it: its name takes a 2px underline in the lane ink and the receipt line under the stack prints where it ships (`2 projects: … · 1 job: … · this site's package.json (react)`). Each tool's accessible name carries its receipt; the line only echoes it on screen. On phones the receipt line sticks to the foot of the screen while the stack scrolls by.
- **Below 1024px:** the grids go to one column; each tick moves beside its title and the text runs the full width under it; the stack leaves the card's inner edge for the page edge, like the head. Below 768px the logo sits above the readout at about 200px (a mark, not a poster), the colour row becomes an even 2-column grid (six blocks), and the STACK label stacks over its note.
- **Motion:** one arrival when the section reveals: the command types, the logo prints row by row, the readout lines print, the checks print, the LED segments light one by one. Under reduced motion nothing moves (no drift, no cursor blink, no colour transition); without JS everything is shown and the receipt line reads its hint.

### Patch Panel (signature)

The footer reads the contact links as a patch panel: `ESTABLISH LINK` made literal. It is the footer's own procedure, on the dark bookend (the only colour-lit surface besides the hero). Every value is real: the links from `contact-links.data.ts`, the Labs count from the registry, the build facts from `vite.config.ts` defines.

- **Rack:** the CSS-3D server rack is a cabinet: side panels with vent slots and top and bottom caps, 3px outside the units and 3px proud of their bezels, so the stack reads as one rack. Each unit shows its hardware behind the bezel, in CSS only: CORE eight hot-swap caddies with a mint power LED and a gold activity LED each (flickering, paused off screen, still under reduced motion), EDGE a perforated grille and a mint status LCD, ARCHIVE three cartridge slots with gold labels and drive LEDs. Steel slotted screws, chrome pull handles. It gains a `NETOUN LINK · PATCH 3P` unit on top: one keystone jack per link (GitHub, LinkedIn, Email), numbered `01`–`03`, each with a 5 × 3px LED in the link's accent (the email in pink, the others gold, mint, then violet, in order). The plugged jack shows a plug with its latch in the accent and a lit LED. The rack sizes itself from CSS variables per breakpoint (`size="inherit"`): 13rem wide on phones, 15rem from 768px, 15.625rem from 1280px. Under it, the caption `⤘ /labs/server-unit-3d` (Doto 900, paper at 82 %, gold on hover and focus).
- **Heading:** an h2, `_❯ ESTABLISH LINK▐` in Doto 900 uppercase (1.5rem, 1.75rem from 768px, 2rem from 1280px), the prompt and blinking cursor in gold.
- **Faceplate:** a pane of terminal glass (the page's one liquid-glass surface, asked for by Nicolas): frosted over the panel's mesh (`backdrop-filter: blur(18px) saturate(1.6) brightness(0.8)` on a 46% ink tint), a 1px rim drawn with a gradient (bright at the top left, a faint gold, violet and mint fringe where glass would split the light), barely-there scanlines, and a liquid highlight that follows a fine pointer and otherwise rests at the left edge, level with the plugged port (`--glass-x` / `--glass-y`, set by `usePlateLight`; it jumps instead of gliding under reduced motion). Standoff screws in the corners, etched lines between the ports. Without backdrop-filter support it stays a dark translucent pane.
- **Plugging:** the plugged port (pointed at, focused, or at rest the email one) takes an 11% wash of its accent, its name in the accent (violet lifted towards white for contrast), a plug in its jack, and its LED lights 480ms later, when the cable arrives. From 1280px a patch cable hangs from the rack's jack to the port: measured on screen (the rack is 3D), a sheath in the accent deepened with ink, an ink outline, a thin highlight, a soft shadow on the panel, and strain-relief boots at both ends. It draws in 560ms on the house curve, the first time the footer comes into view and each time the plug moves. Stacked (below 1280px) there is no cable; the rack's plug and the port's LED still move.
- **Status strip:** a machined strip under everything (bevel, a screw at each end from 768px): four lens LEDs (PWR and LAN lit mint, HDD dim gold, ERR dim red; LAN blinks while a port is being picked; labels are shown except between 1280px and 1920px, where the strip holds one line), `NETOUN.COM · 12 ROUTES PRERENDERED · BUILD YYYY-MM-DD · COMMIT` (Doto 900, 12px, muted-on-dark, all derived at build), `SOURCE ↗` (the site's repository) and `© YYYY Netoun. All rights reserved.` (PP Neue Montreal 13px; the year is the build's, so it never hydrates differently). No sign-off sentence: the strip closes the page.
- **Focus:** a 2px gold ring on every port, the caption, the uplink and the source. Targets are at least 44px tall on phones (72px ports).
- **Without JS:** everything is printed, the email port is plugged (rack plug, LED, wash); no cable. **Reduced motion:** no draw, no LED delay, no cursor or LAN blink; the cable appears at once.

The 404 page (the root error boundary, served by Pages as `404.html`) is paper only: the failing `cd <path>` on a small ink terminal (gold prompt, as in the work log), the shell's `no such file or directory` answer in muted Doto, `404` in Doto, the h1 "Page not found" in PP Neue Montreal 600 (3.5rem, 6rem from 768px), one sentence naming the path, then `_BACK HOME_` as an ink pill (gold text on hover, legal on ink) and `LABS →` as a Doto key.

In the hero, the contact popover is a translucent dark card (1.5rem corners, 3px backdrop blur, mint edge) on a 14px blueprint grid, with Doto 900 links that turn mint on hover.

## Do's and Don'ts

### Do:

- **Do** preserve the hero world intact: the gold, mint and violet shader mesh, the film grain, the booting laptop, the magnetic CTA and the scroll morph.
- **Do** keep the footer as a dark machine panel with the server rack and the `_❯ ESTABLISH LINK` patch faceplate.
- **Do** speak machine in Doto with the established vocabulary: `_❯` prompts, `▐` cursor, `⤘` arrow, underscored labels (`_GET IN TOUCH_`), `_0N /` numbering.
- **Do** keep cards neutral at rest (rest shadow, subtle hairline, opaque paper) and spend colour only on hover and focus.
- **Do** show a 2px outline with offset on every interactive element: ink on light surfaces, gold on dark panels. The global ring reads the `ring` token (ink) with zero specificity; a dark surface remaps it once (`vars: { [vars.colors.ring]: vars.colors.primary }`: the hero, the footer panel, the contact popover, the sections nav, the Labs sidebar and code viewer) instead of restating it on each control.
- **Do** set Doto that is read or clicked at 16px or more, or at weight 800 and up.
- **Do** use the house curve `cubic-bezier(0.22, 1, 0.36, 1)` with the 150/300/600ms durations, and stop every animation under `prefers-reduced-motion`.

### Don't:

- **Don't** use aggressive neon; glows stay subtle and are reserved for CTAs and the hero.
- **Don't** resurrect "The Signal" directions: no carrier wave, no dithering.
- **Don't** use gold as hover or text colour on paper (about 1.1:1); gold hover belongs to dark surfaces.
- **Don't** use graphite gray for text on the dark panels (about 2.72:1); use `mutedForegroundOnDark` (paper mixed 64% into ink, opaque, 6.9:1 on the footer panel) or warm paper at 50% and up.
