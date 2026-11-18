# Design Specification — Zusammen mit der Ukraine e.V.

**Design direction:** Balanced / Modern Editorial / Human-centered
**Animation level:** Rich

## 1. Visual direction

The website must feel like a high-end digital experience by a professional creative
agency. Calm, spacious, human. No generic nonprofit template, no loud corporate
landing page, no business card.

Approved direction: warm neutral canvas, editorial typography, asymmetric imagery,
quiet motion.

## 2. Color palette (design tokens)

- Background: `#EEECE3`
- Primary dark green: `#243D37`
- Muted blue: `#547A9C`
- Coral: `#E77C5C`
- Warm yellow: `#E4BC63`
- White: `#FFFFFF`
- Secondary text: `#68716C`

## 3. Typography

- Display: "Space Grotesk" — headlines and display typography
- Body: "Manrope" — body text, navigation, buttons
- Responsive via `clamp()`
- Fallback stacks required before self-hosting of the Google Fonts files

## 4. Layout

- Max content width: 1440px
- Responsive 12-column grid on desktop
- Generous vertical spacing, consistent spacing scale
- Asymmetric image/content compositions
- Different image aspect ratios

## 5. Motion

- Rich motion: mouse interactions, parallax, scroll-triggered animations
- Initial load: subtle hero entrance, staggered
- Mouse: rAF-driven, per-layer depth, disabled on touch / reduced motion
- Scroll: IntersectionObserver reveals, count-up stats, parallax
- Projects: hover background transition, image scale, metadata reveal
- Performance: transform/opacity only, passive listeners, cleanup

## 6. Accessibility

- `prefers-reduced-motion: reduce` support
- Semantic HTML, single H1, heading hierarchy
- Focus states, skip link, keyboard navigation, contrast, alt texts

## 7. Responsive

Desktop / Tablet / Mobile, tested at 1440 / 1280 / 1024 / 768 / 390 / 375 px.

## 8. Anti-patterns

- No excessive visual noise, no neon, no excessive gradients
- No overly dark backgrounds, no glassmorphism overload, no constant movement
- No repetitive identical cards, no generic Bootstrap-style layouts
- No AI-generated-template look
