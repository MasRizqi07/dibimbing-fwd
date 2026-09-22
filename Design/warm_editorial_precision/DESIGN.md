---
name: Warm Editorial Precision
colors:
  surface: '#f9faf6'
  surface-dim: '#d9dad7'
  surface-bright: '#f9faf6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f0'
  surface-container: '#edeeea'
  surface-container-high: '#e7e9e5'
  surface-container-highest: '#e2e3df'
  on-surface: '#1a1c1a'
  on-surface-variant: '#42484a'
  inverse-surface: '#2e312f'
  inverse-on-surface: '#f0f1ed'
  outline: '#72787a'
  outline-variant: '#c2c7ca'
  surface-tint: '#49626a'
  primary: '#00151a'
  on-primary: '#ffffff'
  primary-container: '#102a31'
  on-primary-container: '#78929a'
  inverse-primary: '#b0cbd4'
  secondary: '#4b6700'
  on-secondary: '#ffffff'
  secondary-container: '#c3f35b'
  on-secondary-container: '#506e00'
  tertiary: '#051419'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a292e'
  on-tertiary-container: '#809197'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce7f0'
  primary-fixed-dim: '#b0cbd4'
  on-primary-fixed: '#031f26'
  on-primary-fixed-variant: '#324a52'
  secondary-fixed: '#c3f35b'
  secondary-fixed-dim: '#a8d641'
  on-secondary-fixed: '#141f00'
  on-secondary-fixed-variant: '#384e00'
  tertiary-fixed: '#d4e5ec'
  tertiary-fixed-dim: '#b8c9d0'
  on-tertiary-fixed: '#0e1e23'
  on-tertiary-fixed-variant: '#3a494f'
  background: '#f9faf6'
  on-background: '#1a1c1a'
  surface-variant: '#e2e3df'
typography:
  display:
    fontFamily: Geist
    fontSize: 56px
    fontWeight: '600'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Geist
    fontSize: 38px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Geist
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 25px
    letterSpacing: 0em
  body-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 21px
    letterSpacing: 0.005em
  eyebrow:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: -0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1.25rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses a high-end editorial sensibility translated into functional digital tooling for Indonesian SMEs and modern founders. It marries the structured rigor of mid-century Swiss graphic design with the tactile warmth of archival print matter. The aesthetic avoids clinical SaaS tropes (harsh cold grays, neon gradients, hyper-gloss) in favor of considered whitespace, precise typographic balance, and intentional contrast.

The emotional core is **understated confidence, architectural clarity, and respectful utility**. The UI positions Indonesian enterprise tools not as utilitarian back-offices, but as premium business instruments that instill pride, focus, and momentum.

Visual tenets:
- **Warm Canvas:** Soft, light-absorbing paper-like backgrounds replace stark sterile whites.
- **Architectural Ink:** Contrast is anchored in deep vegetal slate-ink, delivering authority without the jarring edge of pitch black.
- **Calculated Vitality:** High-voltage lime is deployed exclusively as a dynamic inflection point—signaling direct action, success states, and primary interaction triggers.
- **Atmospheric Restraint:** Depth relies on low-contrast structural rules and tonal stepping rather than aggressive skeuomorphic drops.

## Colors

The palette establishes an organic editorial foundation balanced by a high-conversion focal point:

- **Canvas & Surface Base (`#F7F8F4`):** Cream. An unbleached, archival base that softens ocular fatigue while lending a tactile print feeling.
- **Primary Text & Headings (`#102027`):** Ink. High-density, balanced neutral with a blue-charcoal undertone for razor-sharp legibility.
- **Body & Secondary Copy (`#64747A`):** Muted Slate. Optimized for long-form reading, documentation, and metadata without competing against headings.
- **Dark Structural Surfaces & Actions (`#102A31`):** Deep Navy. Used for core interactive buttons, solid container headers, sidebars, and navigation rails.
- **Conversion Accent (`#C3F35B`):** Lime. Reserved strictly for primary callouts, completion highlights, badges, and focal interactive states. Pair only with Ink or Navy text for strict WCAG AA/AAA compliance.
- **Structural Dividing Line (`#DFE6E4`):** Line. Hairline dividers, card outlines, and structural bounds. Never use saturated borders.

## Typography

Typography functions as the primary visual architecture. Using `Geist` uniformly enforces technical exactness and typographic cohesion. 

Key principles:
- **Tightened Headings:** Display and headline levels feature negative tracking (`-0.015em` to `-0.03em`) to mimic tight editorial typesetting and maintain high optical weight.
- **Extended Body Breathing Room:** Body copy enforces a line-height ratio of 1.6x–1.66x. This generous vertical rhythm is crucial for data-dense business information and Indonesian localized text, which often contains multisyllabic terms.
- **Eyebrow Taxonomy:** Category badges, metric tags, and section headers deploy the `eyebrow` token in all-caps with widened tracking (`0.08em`) to demarcate sections with mathematical precision.

## Layout & Spacing

Layouts conform to a disciplined, column-anchored grid capped at a strict max width:

- **Canvas Constraints:** Maximum outer layout container width is fixed at `1160px`. On screens larger than 1160px, auto-margins center the canvas to preserve balanced whitespace and prevent information drift.
- **Desktop (1024px+):** 12-column layout with `1.5rem` (24px) gutters and `2rem` (32px) margins.
- **Tablet (768px – 1023px):** 8-column layout with `1.5rem` gutters and `1.5rem` margins.
- **Mobile (< 768px):** 4-column fluid layout with `1rem` (16px) gutters and `1.25rem` (20px) margins.

Spacing Rhythm:
- Spacing follows a predictable 4px/8px mathematical ladder.
- Micro-spacing (`space-xs`, `space-sm`) governs internal component alignment (icon-to-label, input padding).
- Macro-spacing (`space-lg`, `space-xl`) isolates functional card blocks and sections, giving dashboard modules an uncluttered, publication-grade cadence.

## Elevation & Depth

This system avoids heavy drop shadows, diffused colored glows, and blurred neon highlights. Depth is achieved through **low-contrast linear delineation and tonal planar shifting**.

- **Structural Outlines:** Surfaces separate from the `#F7F8F4` cream ground via crisp 1px borders colored `#DFE6E4`. Borders define the perimeter without heavy contrast.
- **Tonal Stepping:** To establish hierarchy, layered components step down in value. A base background (`#F7F8F4`) supports elevated cards (`#FFFFFF`), while nested segments or toolbars use faint tonal tinting (`#F0F2ED`).
- **Tactile Shadows (Strictly Restrained):** Where physical lifting is necessary (e.g., dropdown menus, popovers, active modal dialogs), apply an ultra-subtle, non-directional shadow:
  `box-shadow: 0 4px 20px -2px rgba(16, 32, 39, 0.04), 0 2px 6px -1px rgba(16, 32, 39, 0.02);`
  The shadow tint must borrow from the `#102027` Ink pigment rather than raw neutral black.
- **Dark Surface Dominance:** Floating drawers or prominent notification bars switch to solid `#102A31`, introducing natural depth through absolute value contrast rather than artificial blur layers.

## Shapes

The geometry pairs structured engineering with tactile softness, prioritizing rounded corners that follow precise hierarchy:

- **Major Surfaces & Modals:** Large dashboard containers, hero sections, and flyout dialogs utilize a fixed `20px` radius (`rounded-xl` equivalent).
- **Cards & Data Modules:** Standard content tiles, data widgets, and form groups utilize an exact `15px` radius (`rounded-lg` equivalent).
- **Form Controls & Triggers:** Buttons, inputs, dropdown selectors, and segmented tabs use `8px` (`rounded-md` equivalent).
- **Badges & Pills:** Status indicators, conversion tags, and filter pills employ full pill-rounding (`9999px`) to contrast against rectilinear card bounds.

## Components

### Touch Targets & Sizing
All interactive components adhere to a mandatory **minimum hit area of 44px × 44px**, ensuring mobile touch accuracy for SME operators in dynamic environments.

### Buttons
- **Primary:** Background `#102A31`, text `#F7F8F4`, 8px border-radius, minimum height 44px, horizontal padding 20px. Font weight 500. On hover, background shifts subtly to `#1A3D46`.
- **Conversion / Accent:** Background `#C3F35B`, text `#102027`, 8px border-radius. Reserved for primary purchase, confirmation, or checkout moments. On hover, background lightens with 10% opacity wash.
- **Secondary / Outline:** 1px solid border `#DFE6E4`, background transparent, text `#102027`. Hover state transitions background to `#FFFFFF` with border darkened to `#CCD6D3`.
- **Ghost:** Background transparent, text `#64747A`. Hover state transitions text to `#102027` with subtle `#F0F2ED` background.

### Cards & Panels
- **Standard Card:** Background `#FFFFFF`, 1px solid `#DFE6E4`, 15px border radius. Internal padding: 24px (`space-lg`) desktop, 16px (`space-md`) mobile.
- **Inverted Dark Card:** Background `#102A31`, text `#F7F8F4`, 15px border radius. Used for executive summaries, revenue metrics, and conversion banners. Secondary text inside shifts to `rgba(247, 248, 244, 0.7)`.

### Input Fields & Controls
- **Text Inputs:** Height 44px, background `#FFFFFF`, border 1px solid `#DFE6E4`, radius 8px, font size 15px. Placeholder text `#64747A`. 
- **Focus State:** 1px solid `#102A31` outline with zero offset glow. Clear, high-contrast, editorial focus indicator.
- **Error State:** 1px solid `#D9383A`, supporting helper copy styled in 13px red-slate text.

### Checkboxes & Radios
- Size 20px × 20px, set inside a 44px touch area.
- Unchecked: Border 1.5px solid `#DFE6E4`, background `#FFFFFF`.
- Checked: Border `#102A31`, background `#102A31`, with a high-contrast `#F7F8F4` icon or inner radio dot.

### Chips & Badges
- **Status Chip:** Pill shape (`9999px`), padding 4px 10px, font token `eyebrow`. 
  - *Active / Paid:* `#C3F35B` background with `#102027` text.
  - *Neutral / Pending:* `#F0F2ED` background with `#64747A` text.
- **Filter Chip:** Height 36px, radius 8px, border 1px solid `#DFE6E4`, background `#FFFFFF`. Active filter turns background to `#102A31` with `#F7F8F4` text.

### Lists & Tables
- Border-bottom 1px solid `#DFE6E4` across all row separators. Row padding 16px vertical.
- Header rows set in `eyebrow` uppercase tracking with `#64747A` text color. Alternating row fills are avoided; contrast relies on hover background tint `#F0F2ED`.