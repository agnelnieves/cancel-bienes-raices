# Cancel Bienes Raíces

Plataforma de herramientas de inversión para Puerto Rico — comparables con data
exclusiva de cash deals, calculadora de ROI, deal tracker, planner de crédito y
un copiloto AI que hace el trabajo por ti.

Monorepo (Turborepo + pnpm):

- **`apps/web`** — landing page → http://localhost:3002
- **`apps/app`** — la plataforma → http://localhost:3003
- **`packages/ui`** — design system
- **`packages/data`** — mock data + tipos

```bash
pnpm install
pnpm dev
```

## Deployments (Vercel)

Each app is its own Vercel project (root directory + filtered pnpm build):

| App | Vercel project | Production |
| --- | --- | --- |
| Landing (`apps/web`) | `cancel-bienes-raices` | https://cancel-bienes-raices.vercel.app |
| Platform (`apps/app`) | `cancel-app` | https://cancel-app-zeta.vercel.app |

Config lives in `apps/web/vercel.json` and `apps/app/vercel.json`. Git pushes to `main` deploy both.

Ver [AGENTS.md](./AGENTS.md) para arquitectura y convenciones.

La planificación de lanzamiento, costos, investigación de viabilidad y demás
documentación del producto vive en [docs/](./docs/README.md).
