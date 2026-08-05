# Cancel Bienes Raíces — Plataforma

Monorepo de la plataforma de herramientas de inversión para Puerto Rico.
Joint venture: **[dev] diseña y construye el producto · Christopher Cancel aporta comunidad, data y distribución.**

## Estructura

```
apps/
  web/        @cancel/web  → Landing page (marketing)         → :3002 dev
  app/        @cancel/app  → La plataforma (producto)         → :3003 dev
packages/
  ui/         @cancel/ui   → Design system (tokens + componentes shadcn)
  data/       @cancel/data → Tipos + mock data + formatters (única fuente de verdad del demo)
```

## Comandos

```bash
pnpm install
pnpm dev          # ambos apps en paralelo (turbo)
pnpm build        # build de producción de todo
pnpm typecheck    # typecheck de todos los paquetes
```

Correr uno solo: `pnpm --filter @cancel/app dev` (o `@cancel/web`).

## Stack

- **Next.js 16** (App Router, Turbopack) + React 19 + TypeScript estricto
- **Tailwind CSS v4** — el tema de marca vive en `packages/ui/src/styles.css`
  (teal `#1D9E75`, Plus Jakarta Sans vía `next/font`, light/dark)
- **MapLibre GL** para mapas (estilo mapcn.dev) — tiles gratis de CARTO
  (`positron`/`dark-matter`). Para producción usar MapTiler con API key.
- **Zustand + persist** (localStorage keys `cbr-*`) — todo el estado del demo.
  Cada store está diseñado para reemplazarse por Supabase/Clerk después.
- **Recharts** (gráficas), **@dnd-kit** (kanban), **sonner** (toasts),
  **motion** (landing), **radix-ui** (primitivos)

## Decisiones de arquitectura

- **Mock data centralizada** en `@cancel/data`: 45 propiedades, 12 zonas de PR
  (con stats, coordenadas y ADR/ocupación STR), deals, tarjetas, posts de
  comunidad. Los dos apps consumen lo mismo — la landing muestra data "viva".
- **El Copiloto AI es determinista** (`apps/app/lib/assistant/engine.ts`):
  parsea intención + entidades (zonas, precios, tipos) en español y devuelve
  una forma tipada (`EngineResult`) que la UI ejecuta (mutaciones de stores,
  navegación, prefill de la calculadora). Esa interfaz es exactamente la que
  un LLM real devolvería vía tool-calling — reemplazar el motor no toca la UI.
- **Onboarding conversacional determinista** — se siente como IA, es un
  wizard. Escribe en `useUserStore` y personaliza el dashboard (zonas).
- **Cross-tool wiring**: comparables → calculadora (prefill vía
  `useAnalysisStore`), comparables → comparador (tray), todo → pipeline.
- **Onboarding guard**: si `profile.onboarded === false`, el shell redirige a
  `/onboarding`. Reset desde Configuración → "Restablecer demo".

## Estado del demo vs. producción

| Demo (mock)                | Producción planeada                        |
| -------------------------- | ------------------------------------------ |
| Zustand + localStorage     | Supabase (Postgres) + RLS                  |
| Sin auth (perfil local)    | Clerk                                      |
| Copiloto determinista      | LLM con tool-calling sobre la misma interfaz |
| Tiles CARTO gratis         | MapTiler con key                           |
| Sin pagos                  | Stripe (tiers Gratis/Pro/Comunidad)        |
| Data mock en `@cancel/data`| CRIM + PRMLS + Registro + red de realtors  |

## Convenciones

- UI en **español (PR)** — términos de industria en inglés están bien
  ("cash deal", "deal flow", "cap rate") porque así habla la comunidad.
- Moneda USD formato `en-US`; fechas `es-PR`.
- Componentes de UI base siempre en `@cancel/ui` — nunca duplicar en apps.
- Data/tipos/formatters siempre en `@cancel/data`.
- **Diseño visual, shell, motion y anti-patrones:** ver [`DESIGN.md`](./DESIGN.md)
  (fuente de verdad para UI). Tokens en `packages/ui/src/styles.css`.
