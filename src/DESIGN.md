---
name: Atmospheric Cartography
colors:
  surface: '#111317'
  surface-dim: '#111317'
  surface-bright: '#37393d'
  surface-container-lowest: '#0c0e11'
  surface-container-low: '#1a1c1f'
  surface-container: '#1e2023'
  surface-container-high: '#282a2d'
  surface-container-highest: '#333538'
  on-surface: '#e2e2e6'
  on-surface-variant: '#d4c4b0'
  inverse-surface: '#e2e2e6'
  inverse-on-surface: '#2f3034'
  outline: '#9d8f7c'
  outline-variant: '#504535'
  surface-tint: '#fabc4d'
  primary: '#ffc665'
  on-primary: '#432c00'
  primary-container: '#e5a93c'
  on-primary-container: '#5e4000'
  inverse-primary: '#7e5700'
  secondary: '#ffb77d'
  on-secondary: '#4d2600'
  secondary-container: '#d97707'
  on-secondary-container: '#432100'
  tertiary: '#c2d0e8'
  on-tertiary: '#233144'
  tertiary-container: '#a6b5cc'
  on-tertiary-container: '#39475a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdead'
  primary-fixed-dim: '#fabc4d'
  on-primary-fixed: '#281900'
  on-primary-fixed-variant: '#604100'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#d5e3fc'
  tertiary-fixed-dim: '#b9c7df'
  on-tertiary-fixed: '#0d1c2e'
  on-tertiary-fixed-variant: '#3a485b'
  background: '#111317'
  on-background: '#e2e2e6'
  surface-variant: '#333538'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 44px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.08em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-desktop: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system establishes a high-precision, atmospheric geospatial visualization environment tailored for deep temporal replay, critical weather analytics, and situational monitoring. Rooted in tactical clarity and calm authority, the experience replaces visual noise and harsh neon accents with deep, warm charcoals and glowing earthy amber indicators.

Visual direction balances technical precision with tactile glassmorphism. Surfaces feel like physical observation consoles suspended over dynamic terrain: edge-lit hairline boundaries, deep slate layers, and targeted ochre energy fields indicating high-activity sectors. The interface respects the primacy of the underlying canvas, eliminating bulky persistent rails or sidebars in favor of a full-bleed geographic viewport overlaid with floating HUD modules, telemetry dock panels, and contextual temporal scrubs.

## Colors
The palette is grounded in extreme darkness, allowing cartographic data layers and active state indicators to communicate without eye strain during long-duration monitoring.

- **Primary Amber (`#E5A93C`)**: Active nodes, playback markers, scrubbing playheads, radar sweeps, and critical vector alerts. Emits an ambient ochre glow (`rgba(229, 169, 60, 0.15)`).
- **Secondary Ochre (`#D97706`)**: Hover states, intermediate telemetry thresholds, compressed heat zones, and secondary controls.
- **Deep Charcoal Canvas (`#0D0F12`)**: The foundational base for map underlays, coordinate margins, and full-screen canvasing.
- **Warm Dark Slate (`#14171C` to `#1C2027`)**: Floating surface panels, telemetry cards, and modal backdrops.
- **Hairline Border (`rgba(255, 255, 255, 0.08)`)**: Defines floating panels and division rules without solid blocky contrast.
- **Crisp Off-White (`#F1F5F9` and `#E2E8F0`)**: Primary and secondary typographic layers ensuring peak legibility against dark vector tiles.
- **Warning & Hazard Guidance**: Never use harsh diagonal yellow hazard stripes. Use soft radiant amber glows, solid ochre boundary tracks, or subtle pulsing perimeter rings to signal threshold breaches.

## Typography
Typography reflects high-end operational control systems:
- **Display and Headlines (`Space Grotesk`)**: Provides an engineered, modern structural presence for geographic regions, timestamps, storm/event names, and HUD titles.
- **Body (`Geist`)**: Delivers clean, neutral, human-factored readability for meteorological notes, telemetry breakdowns, and system configurations.
- **Data & Metric Labels (`JetBrains Mono`)**: Handles all coordinates, UTC offsets, wind/pressure telemetry, playback speed multiplier ratios, and numeric scrub values with fixed-width tabular accuracy.

## Layout & Spacing
The layout treats the entire screen as a full-bleed geographic viewport. Left-side standard navigation bars are omitted entirely to maximize spatial exploration. Interface panels exist as floating spatial HUD modules positioned on fixed boundary anchor points.

- **Floating Viewport Shell**: The primary map is 100vw × 100vh. All controls overlay this canvas inside a non-blocking safe area bounded by `margin` tokens.
- **Top Control Strip**: Floats 24px below the viewport ceiling, centering replay scenario selectors, search coordinates, and quick telemetry toggles.
- **Bottom Timeline Dock**: Floats 24px above the viewport floor, extending across 70–80% of screen width (max 1120px) to provide a granular time-scrubbing track, transport controls, and playback speed presets.
- **Responsive Adaptations**:
  - **Desktop (1024px+)**: Dual floating panels (telemetry stack right, layer toggles upper left). Timeline dock centered at bottom.
  - **Tablet (768px – 1023px)**: Side modules consolidate into collapsible bottom-sheet drawers or top drop-down pills.
  - **Mobile (< 768px)**: Floating timeline locks to bottom edge with simplified scrub-bar; coordinate HUD tucks into a compact top-right glass badge.

## Elevation & Depth
Elevation is achieved using ambient glassmorphic stratification rather than drop shadows. Every floating surface interacts directly with the dynamic map layer beneath it:

- **Surface Floor (`Level 0`)**: The active map rendering engine (`#0D0F12`).
- **HUD Glass Overlays (`Level 1`)**: Panels use a background of `rgba(20, 23, 28, 0.72)` supported by `backdrop-filter: blur(16px)` and bounded by a crisp `1px` outline of `rgba(255, 255, 255, 0.08)`.
- **Active Controls & Menus (`Level 2`)**: Dropdowns, layer pickers, and tooltips elevate to `rgba(24, 28, 35, 0.88)` with `backdrop-filter: blur(24px)` and a subtle ambient outer shadow of `0 12px 32px rgba(0, 0, 0, 0.45)`.
- **Amber Glow Accents**: Key interactive points (the playhead needle, active radar ping, threshold status) project a soft luminous bloom (`box-shadow: 0 0 20px rgba(229, 169, 60, 0.2)`), imparting heat without cluttering the screen with opaque artifacts.

## Shapes
Shapes emphasize structured architectural precision:
- Primary panels, cards, and floating containers utilize a subtle, tight corner radius (4px to 6px) to maintain a technical, instruments-grade console silhouette.
- Interactive pills, coordinate badges, playback controls, and small status indicators use full rounded capsules (pill forms) only when distinguishing individual interactive tokens from structural data panels.
- Interior dividers and border lines are strictly hairline (1px), never exceeding 1px width.

## Components

### Buttons & Transport Controls
- **Primary Action (Play/Pause/Active Export)**: Solid ochre/amber fill (`#E5A93C`) with deep charcoal text (`#0D0F12`), high font weight (`600`), and a delicate ambient aura (`0 0 16px rgba(229, 169, 60, 0.2)`).
- **Secondary HUD Controls**: Glassmorphic slate fill (`rgba(255, 255, 255, 0.04)`), `1px` hairline border (`rgba(255, 255, 255, 0.08)`), text `#E2E8F0`. On hover, the border shifts to `rgba(229, 169, 60, 0.4)` and surface lightens to `rgba(255, 255, 255, 0.08)`.

### Cards & HUD Modules
- Built with warm dark slate glass (`rgba(20, 23, 28, 0.75)`), backdrop blur of 16px, and a unified 1px border (`rgba(255, 255, 255, 0.08)`).
- Header sections integrate a terminal-style micro label (`JetBrains Mono`, 10px uppercase) with an amber indicator dot (`6px × 6px`, `#E5A93C`) signifying live telemetry stream status.

### Timeline Scrubber Dock
- **Track**: Horizontal rail tinted in `rgba(255, 255, 255, 0.06)` with segmented tick marks for hours/minutes in `JetBrains Mono`.
- **Buffered Window**: Low-opacity amber field (`rgba(229, 169, 60, 0.12)`) marking available cache.
- **Playhead**: Vertical hairline needle in `#E5A93C` topped by an amber diamond head featuring an active outer glow.

### Chips & Badges
- **Status Pills**: Compact containers with `2px` vertical padding, `8px` horizontal padding, containing monospaced text (`label-md`). 
- **Active State**: Inset glow with border `rgba(229, 169, 60, 0.3)` and background `rgba(229, 169, 60, 0.1)`.

### Input Fields & Layer Selectors
- Background `rgba(13, 15, 18, 0.8)`, hairline border, inset padding of `0.5rem 0.75rem`. Focus transition produces a sharp amber stroke border (`#E5A93C`) with zero heavy outer drop-shadow.
- Checkboxes and toggles employ custom ochre-filled check markers and micro toggles that slide with an amber rail trail.