import { cn } from "@cancel/ui"

/**
 * In-content page title — same register as the home dashboard greeting.
 * Replaces the old top toolbar title.
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="font-heading text-[26px] font-semibold tracking-tight sm:text-[28px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}

export const PAGE_META: Record<string, { title: string; description: string }> =
  {
    "/comparables": {
      title: "Comparables",
      description: "Ventas reales — incluyendo cash deals exclusivos",
    },
    "/calculadora": {
      title: "Calculadora ROI",
      description: "Cap rate, cash flow y break-even al instante",
    },
    "/estimador": {
      title: "Estimador de remodelación",
      description: "Presupuesto por partida con precios de PR",
    },
    "/comparador": {
      title: "Comparador",
      description: "Hasta 5 propiedades lado a lado con scoring",
    },
    "/deals": {
      title: "Deal Tracker",
      description: "Tu pipeline de prospecto a cierre",
    },
    "/credito": {
      title: "Planificador de crédito",
      description: "Utilización estratégica de tus líneas",
    },
    "/comunidad": {
      title: "Comunidad",
      description: "Los inversionistas de la red",
    },
    "/contratistas": {
      title: "Red de contratistas",
      description: "Profesionales vetados por la comunidad",
    },
    "/configuracion": {
      title: "Configuración",
      description: "Tu cuenta y preferencias",
    },
  }
