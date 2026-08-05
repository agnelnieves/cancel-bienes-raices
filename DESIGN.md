# DESIGN.md — Cancel Bienes Raíces

Living design system for the product (`apps/app`) and shared tokens (`packages/ui`).  
Use this when building or reviewing UI so future work stays coherent with the shell we shipped.

**Register:** product (app UI serves the investor; design is calm and useful, not theatrical).  
**North star:** Airbnb simplicity — breathable space, one clear focus, place texture over spreadsheet chrome.  
**Audience:** Puerto Rico real-estate investors (often non-technical). Warm, trustworthy, Spanish (PR) with industry English where the community already speaks it.

Related: `AGENTS.md` (stack/architecture), `docs/ui-patterns-mobbin.md` (research), `packages/ui/src/styles.css` (source of truth for tokens).

---

## 1. Product surfaces

| Surface | App | Role |
|--------|-----|------|
| Marketing | `@cancel/web` | Landing; can be more editorial/motion-forward |
| Product | `@cancel/app` | Tools shell; restrained accent, high clarity |
| Design system | `@cancel/ui` | Tokens + shadcn primitives — **never duplicate in apps** |
| Data/formatters | `@cancel/data` | Types, mocks, `en-US` money / `es-PR` dates |

Demo state lives in Zustand (`cbr-*` keys). UI should not assume production auth.

---

## 2. Brand & color

### Strategy: **Restrained**

- Tinted neutrals (warm, never pure gray stack)
- **One loud accent ≤ ~10% of chrome:** primary teal
- Semantic colors for meaning only (cash / success / warning / info)

### Light (default product scene)

Investor at a desk daytime, laptop, wanting calm confidence — light UI wins.

| Token | Value | Use |
|-------|--------|-----|
| `--primary` | `#1D9E75` | CTAs, active icons, links, focus ring |
| `--foreground` | `#222222` | Body / titles |
| `--muted-foreground` | `#6A6A6A` | Helpers, meta |
| `--muted` / `--secondary` / `--sidebar` | `#F4F2ED` | Soft fills, rail canvas |
| `--border` / `--input` | `#E4E2DC` | Hairlines |
| `--cash` | `#B85C42` | **Cash deals only** (exclusive network) |
| `--success` | same family as primary | Positive deltas |
| `--warning` | warm ochre | Caution stages / risk |
| `--info` | desaturated blue | Neutral info chips |

Dark theme exists (`styles.css` `.dark`) with green-tinted surfaces — keep chroma low near black.

### Rules

- Never pure `#000` / pure `#fff` for large surfaces if you can use tokenized neutrals.
- Do **not** invent a second brand accent. Cash terracotta is not “secondary brand”; it is a deal-source badge.
- Soft semantic fills: `bg-success-soft`, `bg-cash-soft`, etc. — chips, not full page washes.

### Elevation (Airbnb-like)

Prefer **hairline + whisper shadow**, not stacked card chrome.

| Utility | Intent |
|---------|--------|
| `shadow-card` | Quiet card edge |
| `shadow-soft` | Menus, small popovers |
| `shadow-inset-panel` | Main content panel floating on sidebar canvas |
| `shadow-lift` | Hover lift / floating filter bars |

Defined in `packages/ui/src/styles.css` `@layer utilities`.

---

## 3. Typography

**Font:** Plus Jakarta Sans via `next/font` → `--font-jakarta` → `font-sans` / `font-heading`.

| Role | Classes (product) | Notes |
|------|-------------------|--------|
| Page title / home greeting | `font-heading text-[26px] sm:text-[28px] font-bold tracking-tight` | Weight **700** |
| Section title | `font-heading text-base font-semibold tracking-tight` | In-page blocks |
| Body | `text-sm` (14px) | Default readable size |
| Meta / helpers | `text-xs` or `text-[11px] text-muted-foreground` | Dates, captions |
| Micro labels | Prefer sentence case; avoid dense `uppercase tracking-wide` micro-labels on dashboards | Finance-UI smell |
| Tabular numbers | `tabular-nums` | Prices, ROI, stats |

### Page headers

Use `apps/app/components/page-header.tsx` (`PageHeader`) for every tool page **except**:

- **Home** — owns greeting + live status line
- **Comparables** — full-bleed map; no in-content page title

```tsx
<PageHeader
  title="Deal Tracker"
  description="Tu pipeline de prospecto a cierre"
  actions={/* primary CTA */}
/>
```

Home greeting pattern:

```tsx
<p className="text-xs text-muted-foreground first-letter:uppercase">{date}</p>
<h2 className="mt-1.5 font-heading text-[26px] font-bold tracking-tight sm:text-[28px]">
  {greeting}, {firstName}
</h2>
<p className="mt-1.5 text-sm text-muted-foreground">{liveStatus}</p>
```

Live status is product signal (`N deals en movimiento · Condado +8.2%`), **not** a marketing slogan.

---

## 4. Layout & density

### Shell (inset product chrome)

- Outer canvas: `bg-sidebar` (warm `#F4F2ED`)
- Main panel: floating `bg-background`, `lg:rounded-xl`, `shadow-inset-panel`
- **No top toolbar.** Titles live in content; utilities live in the sidebar.
- Content max width: `max-w-[1200px]`, padding `px-4 sm:px-6 lg:px-8`, top `pt-8 lg:pt-10`
- Full-bleed exception: `/comparables` (map owns the panel)

### Spacing rhythm

- Page sections: `space-y-6` to `space-y-10` (generous between major blocks)
- Prefer **breath inside** modules (row padding, type size) over only large outer gaps with cramped cards
- Avoid wrapping every list in `shadow-card` — use top borders / dividers on the page canvas when the content is a list (Airbnb energy)

### Cards

- Cards for **objects** (deal, property, credit line) or true panels (pipeline hero)
- Nested cards are almost always wrong
- Dashboard first fold: **one hero** (pipeline). Network stats are a quiet strip, not three competing KPI tiles

### Primary actions

- One solid primary button per view when possible (`Buscar comparables` vs outline `Nuevo deal`)
- Segmented controls (`TabsList`) should be **`w-fit`**, not full-width stretched pills

---

## 5. App shell & navigation

### Sidebar geometry (critical — jump-free collapse)

Source: `apps/app/components/shell/sidebar.tsx`  
Widths: `SIDEBAR_WIDTH = 232`, `SIDEBAR_WIDTH_COLLAPSED = 48` (+ 16px for container `p-2`).

| Rule | Detail |
|------|--------|
| Icon left inset | Fixed `pl-[14px]` so a 20px icon centers in the 48px rail: `(48 − 20) / 2 = 14` |
| Never | `justify-center` / `w-10` swaps that re-center icons mid-tween |
| Labels | Always mounted; animate **opacity + translateX only** (no max-width/margin reflow) |
| Icon size | Glyph fixed at 20px; **scale** 0.9 expanded → 1.0 collapsed (spring) |
| Active (expanded) | Full-row soft fill |
| Active (collapsed) | Absolute `size-10` chip behind icon (`left-1`), not a stretched oval |
| Section labels | **None** — flat continuous nav list |
| Dividers between sections | **None** |

### Nav icons (product)

Animated icons under `apps/app/components/icons/` (motion + `startAnimation` / `stopAnimation` on hover).

| Route | Icon |
|-------|------|
| Inicio | `HomeIcon` |
| Comparables | `MapIcon` (folded map — **not** search) |
| Calculadora | `ChartColumnIncreasingIcon` |
| Estimador | `HammerIcon` |
| Deals | `FolderKanbanIcon` |
| Comparador | `GitCompareArrowsIcon` |
| Crédito | `CreditCardIcon` |
| Contratistas | `ConstructionIcon` |
| Comunidad | `UsersIcon` |

### Bottom rail (order)

1. **Notificaciones** — `BellIcon`, dropdown of recent activity  
2. **Copiloto** — `SearchIcon`, opens assistant (`⌘K`)  
3. **Cuenta** — large avatar (`size-8`), name + “Cuenta demo”; menu **`side="top"`** `align="start"`

Account menu includes theme 3-way (Claro / Oscuro / Sistema), Configuración, Restablecer demo, Cerrar sesión.

### Brand row

- Green `C` mark + wordmark “Cancel.” when expanded  
- Collapse control on the right when expanded  
- Collapsed: mark only; **hover rail** swaps mark → expand toggle (ChatGPT pattern)  
- Keyboard: `⌘B` / `Ctrl+B` toggles sidebar

### Mobile

- Bottom `MobileNav` (5 items); no desktop header  
- Account / copiloto primarily desktop rail (assistant may still float)

---

## 6. Motion

Library: **`motion/react`** (already in app). Prefer CSS for trivial hovers; Motion for shell layout, springs, and coordinated enter/exit.

### Curves & duration (animations.dev alignment)

| Use | Spec |
|-----|------|
| Rail width / panel travel | `cubic-bezier(0.32, 0.72, 0, 1)` (Vaul-like), ~**300ms** |
| Labels (collapse) | Opacity + `x: -8`, ~**180ms** out, ~**240ms** in with short delay |
| Icon scale | Spring `duration: 0.34`, `bounce: 0.14` |
| UI under ~300ms | Default; bigger travel can run slightly longer if the curve front-loads motion |
| Exits | Faster / simpler than enters |

### Rules

1. **Only animate transform/opacity** for 60fps; width on the sidebar rail is the deliberate exception (must reflow main content).  
2. **No layout thrash on labels** — never animate `max-width` / flex gaps that move icon X.  
3. **Interruptible** transitions (CSS transitions / springs), not restarting keyframes for toggles.  
4. **`useReducedMotion()`** — drop travel; keep state change (opacity ok; no large x/width).  
5. Hover icon animations are **delight on rare hover**, not on every keyboard nav step.  
6. Page enter: `animate-fade-in` utility is fine for route content.

### Anti-patterns

- Snapping icon size via different `size={}` props without scale  
- Switching `justify-center` when collapsing  
- Full-width stretched tab bars  
- Competing first-fold KPI card stacks (hero-metric template ×3)

---

## 7. Components & composition

### Prefer `@cancel/ui`

Button, Card, Dialog, DropdownMenu, Input, Tabs, Sheet, Tooltip, Avatar, etc.

### Product-only patterns

| Pattern | Location | When |
|---------|----------|------|
| `PageHeader` | `components/page-header.tsx` | Tool pages |
| `SectionHeader` | `components/section-header.tsx` | In-page sections with optional action link |
| `SourceChip` | cash / MLS / etc. | Property provenance |
| Pipeline stage chips | dashboard / deals | Stage color by progress |
| Property map | MapLibre + CARTO | Comparables full-bleed |

### Tabs / segments

```tsx
<TabsList> {/* default w-fit — do not force w-full */}
  <TabsTrigger className="flex-none px-3.5">…</TabsTrigger>
</TabsList>
```

### Forms

- Labels quiet: `text-xs` / muted  
- Rounded inputs consistent with radius tokens  
- Primary submit solid teal; secondary outline

---

## 8. Content & voice

- **Language:** Spanish (PR). English OK for cash deal, cap rate, cash flow, deal, ROI, DOM.  
- **Money:** USD, `en-US` compact where space is tight (`formatCompact`, `formatCurrency` from `@cancel/data`).  
- **Dates:** `es-PR`.  
- **Tone:** Host-like confidence, not broker hype. Prefer concrete next steps (“Compara con otros deals de la zona”) over empty reassurance.  
- **No product slogans on logged-in home** — use live pipeline/market status.  
- Avoid em dashes in UI copy when writing new strings (prefer commas or periods).

---

## 9. Dashboard (Inicio) principles

What we optimized toward:

1. **Single first-fold story** — pipeline value + deal rows  
2. **Quiet network strip** — one line of red stats, not three metric tiles  
3. **Copiloto once** — sidebar only (not a second hero card)  
4. **Pulso del mercado** — dense useful table OK (tool energy below the fold)  
5. **Open lists** for radar/activity — dividers on canvas over endless card frames  
6. Soft calculadora promo (muted pill), not another competing card wall

---

## 10. Accessibility

- Focus rings: `focus-visible:ring-2 focus-visible:ring-ring/40` (or sidebar-ring in rail)  
- Collapsed nav: tooltips after width settles; `aria-label` on icon-only controls  
- Account / notifications menus keyboard reachable  
- `prefers-reduced-motion` honored in shell motion helpers  
- Touch targets on rail: ~40px active chips / 32px+ avatar

---

## 11. File map (design-critical)

```
packages/ui/src/styles.css          # tokens, shadows, keyframes
packages/ui/src/components/*        # primitives
apps/app/components/shell/sidebar.tsx
apps/app/components/shell/app-shell.tsx
apps/app/components/shell/logo.tsx
apps/app/components/page-header.tsx
apps/app/components/section-header.tsx
apps/app/components/icons/*         # animated nav icons
apps/app/app/(platform)/page.tsx    # home dashboard
apps/app/lib/stores/shell.ts        # sidebar widths + collapse persist
```

---

## 12. Do / Don’t checklist

### Do

- Use `PageHeader` + content CTAs  
- Keep one primary accent (teal)  
- Fixed icon X in the sidebar forever  
- Labels: opacity + x only on collapse  
- Segment controls hug content  
- Prefer open lists and hairline dividers for long scan lists  
- Spanish PR copy with real investor language  

### Don’t

- Bring back a top app toolbar for title/theme/avatar  
- Full-width stretched tabs  
- Triple KPI metric tiles as first fold  
- Nested cards / card-on-card dashboards  
- Uppercase micro-label soup (`VALOR DEL PIPELINE` everywhere)  
- Second brand color for decoration  
- Animate layout properties that move icon columns  
- Section headers in the sidebar nav  

---

## 13. Future production notes (design-relevant)

| Demo | Production implication |
|------|------------------------|
| Initials avatar | Real photo upload; keep `size-8` account treatment |
| “Cuenta demo” subtitle | Real email under name (Grok/ChatGPT pattern) |
| Deterministic copiloto | Same entry points (rail + `⌘K`); panel UI stays |
| CARTO maps | Same calm map chrome; denser data layers carefully |

---

## 14. Changelog of design decisions (session-hardened)

1. Airbnb-like home: fewer cards, one pipeline hero, live greeting status.  
2. Shell without top bar; utilities in bottom of sidebar.  
3. Comparables = map icon; copiloto = search icon.  
4. Jump-free sidebar collapse (fixed `pl-[14px]`, scale icons, opacity labels).  
5. Account avatar large; menu opens **up** (`side="top"`).  
6. Page titles and home greeting at **font-weight 700**.  
7. Calculator mode tabs content-sized, not stretched.

When this file conflicts with code, **update this file** after intentional design changes so the next agent inherits truth, not archaeology.
