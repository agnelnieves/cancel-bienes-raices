# Landing redesign — direction (v2)

Date: 2026-08-04 · Scope: `apps/web` only (presentation; no data/store/routing changes).  
Supersedes the previous agent's uncommitted pass (kept: bento concept, dark data-moat section, motion tokens file; redone: hero, scroll system, polish).

## Goal

Award-level marketing site that feels like a design agency built it: Airbnb warmth + darkroom.engineering motion craft. One memorable moment (scroll-driven hero stage), everything else quiet, warm, confident.

## Research synthesis

### Mobbin references (analyzed via vision, both passes: layout + look-and-feel)

- [Monarch — hero](https://mobbin.com/sites/sections/5e856b27-50dc-48c3-8378-05260573e2b8): floating device with **soft diffuse shadow that lifts it off a clean background**; generous whitespace; product screenshot IS the proof.
- [Riverside — hero](https://mobbin.com/sites/sections/601ce269-1efe-407c-9fb5-7272f7504f43): realistic device bezels, staggered depth, center-forward composition. Devices feel physical, not flat screenshots.
- [Attio — bento](https://mobbin.com/sites/sections/9038df26-d13c-4c95-98d5-62ba4fd5fad3): uniform grid, card = visual top 60% + text bottom 40%, **separation via color contrast + soft shadow, no hard borders**.
- [Windsurf — bento](https://mobbin.com/sites/sections/578c6a44-919f-4628-8573-42ba22a389d7): text top 30%, **cropped product UI bottom 70%** — show the exact UI bit per feature, not whole-app screenshots.
- [Webflow — pricing](https://mobbin.com/sites/sections/86a4762c-79ce-4fe5-8aa7-8bdbba561302): featured plan = badge breaking the top edge + solid CTA; ghost CTAs elsewhere. Featured wins on weight, not size.
- [Hex — testimonials](https://mobbin.com/sites/sections/0c701f65-ae73-4165-9dbf-610613a2d986): quiet grid, logo/name first, short quote, no giant quote marks.

### Airbnb (user's north star)

Warm paper surfaces, hairline + whisper shadow, big human headlines, rounded-full CTAs, product imagery that feels photographed not screenshotted. Register: calm confidence, zero SaaS chrome.

### Lenis (scroll)

`lenis` package, `autoRaf: true`, `anchors: true` (native anchor links route through Lenis), reduced-motion fallback. Drives the hero scroll-scene via its own scroll event (no separate listeners).

## The concept: "del desk del inversionista"

The page is a calm desk. Sections are objects on it. Motion is scroll-choreographed but never theatrical inside content.

### Hero — scroll-driven stage (the memorable moment)

Full-width warm stage. Center: the app (comparables view) rendered as a **DOM replica** (not an image — crisp, animatable, real data from `@cancel/data`), framed as a floating laptop-grade panel with realistic chrome.

Scroll choreography (driven by Lenis scroll → `useScroll` with the hero as target):

1. **Enter (0–15% of stage):** panel rises from a slight tilt (`rotateX ~10deg` on a `perspective` wrapper), scale .92 → 1, shadow deepens.
2. **Settle (15–60%):** panel is flat and centered. Inside it, the mock app is *alive*: the comparables list cycles active rows, the market-pulse bars animate.
3. **Handoff (60–100%):** panel scales gently to .96 and fades upward as the stats strip slides in — the hero hands you to the page.

Floating data chips (cash-on-cash, copiloto) orbit the panel with independent parallax (slower scroll rate → depth). Reduced motion: static flat panel, no parallax.

Why DOM over canvas: text stays selectable/crisp at any DPR, respects tokens, and each row can animate individually. Canvas adds nothing here except blur.

### Sections (polish, same structure)

- **Stats strip** — open, Airbnb-quiet: hairline top/bottom, no boxes, tabular numerals.
- **Bento** — keep the live mini-UI cells (that's our Windsor move), refine: icons quieter, cell visuals cropped tighter, hover = border-lift only (no scale).
- **Data moat** — keep dark `#0e1411` section (matches our dark token family); refine cash accent glow.
- **Copiloto** — keep chat demo; tighten bubbles, calmer glow.
- **Pricing / Testimonials / FAQ / Final CTA** — typography + spacing polish; featured tier gets the badge-above-edge treatment (Webflow pattern).

### Motion system

- Lenis: `duration 1.1`, expo easing, `anchors: true`, disabled on `prefers-reduced-motion` + touch (`syncTouch: false`).
- All scroll effects transform/opacity only. Enter reveals stay ≤ 18px travel, expo-out.
- Existing `motion.ts` tokens kept (expo-out curves already match animations.dev guidance).

## Guardrails (from DESIGN.md)

- One loud accent (teal `#1D9E75`); terracotta `#B85C42` only for cash-deal exclusivity.
- Hairline + whisper shadow over stacked chrome; no nested cards; no uppercase micro-label soup.
- Spanish (PR) copy; USD `en-US`; avoid em dashes in new UI copy.
- No second brand color; dark section uses the token family's `#0e1411`.

## Implementation notes

- New: `components/marketing/smooth-scroll.tsx` (Lenis provider), hero stage rewritten in `hero.tsx`.
- `lenis` added to `apps/web` deps. `scroll-smooth` removed from `<html>` (Lenis owns scroll; CSS smooth-scroll conflicts).
- Verify: `pnpm --filter @cancel/web typecheck` + `pnpm --filter @cancel/web build`, then visual QA on :3002.
