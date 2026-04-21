import Link from "next/link"
import {
  ArrowRight,
  Search,
  Calculator,
  ArrowLeftRight,
  Kanban,
  CreditCard,
  BadgeCheck,
  TrendingUp,
  Users,
  ShieldCheck,
  DollarSign,
  BarChart3,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const tools = [
  {
    icon: Search,
    title: "Buscador de Comparables",
    description:
      "Busca propiedades similares vendidas recientemente con precios reales — incluyendo ventas en efectivo que no aparecen en ningún otro sistema.",
    badge: "Herramienta Principal",
  },
  {
    icon: Calculator,
    title: "Calculadora de ROI",
    description:
      "Cap rate, cash flow mensual, retorno de inversión y break-even. Todo calculado al instante sin necesidad de Excel.",
  },
  {
    icon: ArrowLeftRight,
    title: "Comparador de Propiedades",
    description:
      "Compara hasta 5 propiedades lado a lado con métricas normalizadas y un scoring automático que te dice cuál es el mejor deal.",
  },
  {
    icon: Kanban,
    title: "Deal Flow Tracker",
    description:
      "Tu pipeline personal de deals. Desde prospecto hasta cierre, todo organizado e integrado con la calculadora.",
  },
  {
    icon: CreditCard,
    title: "Credit Utilization Planner",
    description:
      "Planifica el uso estratégico de tus líneas de crédito para adquisiciones. Mapea tu crédito disponible y optimiza su uso.",
  },
]

const stats = [
  { value: "1,200+", label: "Comparables en PR" },
  { value: "200+", label: "Inversionistas activos" },
  { value: "23", label: "Cash deals este mes" },
  { value: "5", label: "Herramientas profesionales" },
]

const differentiators = [
  {
    icon: DollarSign,
    title: "Data de ventas en efectivo",
    description:
      "Acceso a transacciones cash que no se reportan en los sistemas públicos. La data que nadie más tiene.",
  },
  {
    icon: ShieldCheck,
    title: "Verificado por realtors",
    description:
      "Cada comparable es verificado directamente por nuestra red de realtors activos en el mercado.",
  },
  {
    icon: Zap,
    title: "Hecho para el inversionista latino",
    description:
      "En español, con las métricas que importan, diseñado para cómo tú inviertes.",
  },
  {
    icon: BarChart3,
    title: "Data local actualizada",
    description:
      "Mientras otros usan data desactualizada, nosotros actualizamos con transacciones reales de la semana.",
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:pt-32">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 px-3 py-1 text-xs"
            >
              <BadgeCheck className="size-3.5 text-primary" />
              Plataforma #1 de comparables en Puerto Rico
            </Badge>

            <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              La data de inversión que{" "}
              <span className="text-primary">nadie te enseña</span> a buscar
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Comparables reales, incluyendo ventas en efectivo. Calculadora de
              ROI, comparador de propiedades, y más. Todo en español, diseñado
              para el inversionista latino en Puerto Rico y Estados Unidos.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="w-full gap-2 sm:w-auto" asChild>
                <Link href="/dashboard">
                  Comenzar Gratis
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                asChild
              >
                <Link href="/precios">Ver Precios</Link>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              5 búsquedas gratis al mes. No requiere tarjeta de crédito.
            </p>
          </div>

          {/* Dashboard Preview */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl shadow-primary/5">
              <div className="flex items-center gap-1.5 border-b border-border/40 bg-muted/30 px-4 py-3">
                <div className="size-2.5 rounded-full bg-red-400/60" />
                <div className="size-2.5 rounded-full bg-amber-400/60" />
                <div className="size-2.5 rounded-full bg-emerald-400/60" />
                <span className="ml-3 text-xs text-muted-foreground">
                  app.bienesraicescr.com/dashboard
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4 p-6">
                {[
                  {
                    label: "Comparables disponibles",
                    value: "1,284",
                    change: "+47 esta semana",
                  },
                  {
                    label: "ROI promedio del mercado",
                    value: "13.1%",
                    change: "+2.3% vs mes anterior",
                  },
                  {
                    label: "Ventas cash este mes",
                    value: "23",
                    change: "Data exclusiva",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-border/40 bg-background p-4"
                  >
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-1 font-heading text-2xl font-bold">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-xs text-primary">{stat.change}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/40 bg-muted/20 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 flex-1 rounded-md border border-border/40 bg-background px-3 py-1.5 text-xs text-muted-foreground">
                    Buscar por dirección, zona o municipio...
                  </div>
                  <div className="h-8 rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">
                    Buscar
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-border/40 bg-muted/20">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-3xl font-bold text-primary">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section id="herramientas" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Todo lo que necesitas para invertir con confianza
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Cinco herramientas profesionales diseñadas específicamente para el
              inversionista de bienes raíces.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <Card
                key={tool.title}
                className="group relative transition-colors hover:border-primary/30"
              >
                <CardHeader>
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <tool.icon className="size-5 text-primary" />
                    </div>
                    {tool.badge && (
                      <Badge variant="secondary" className="text-[10px]">
                        {tool.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="font-heading text-lg">
                    {tool.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {tool.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}

            {/* Coming soon card */}
            <Card className="border-dashed">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted">
                  <TrendingUp className="size-5 text-muted-foreground" />
                </div>
                <CardTitle className="font-heading text-lg text-muted-foreground">
                  Más herramientas pronto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  Subastas, análisis de mercado, alertas de propiedades, y más.
                  Construido con feedback directo de la comunidad.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="border-y border-border/40 bg-muted/20">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              ¿Por qué Bienes Raíces CR?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              No somos otra plataforma genérica. Tenemos algo que nadie más
              tiene.
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-2">
            {differentiators.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="size-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="size-5 fill-amber-400 text-amber-400"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="font-heading text-xl font-medium leading-relaxed sm:text-2xl">
              &ldquo;Llevo años invirtiendo en Puerto Rico y nunca había tenido
              acceso a comparables reales de ventas en efectivo. Esta
              herramienta cambia completamente cómo evalúo propiedades.&rdquo;
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-heading text-sm font-bold text-primary">
                RV
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Roberto Vega</p>
                <p className="text-xs text-muted-foreground">
                  Inversionista · Miembro de la comunidad
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" />
              <span>200+ miembros activos</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BadgeCheck className="size-4 text-primary" />
              <span>Data verificada por realtors</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-14 text-center sm:px-16">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent" />
            <div className="relative">
              <h2 className="font-heading text-3xl font-bold text-primary-foreground sm:text-4xl">
                Empieza a invertir con data real
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
                Únete a cientos de inversionistas que ya están tomando mejores
                decisiones con nuestras herramientas.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full gap-2 sm:w-auto"
                  asChild
                >
                  <Link href="/dashboard">
                    Comenzar Gratis
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
              <p className="mt-3 text-xs text-primary-foreground/60">
                5 búsquedas gratis al mes · Sin tarjeta de crédito
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
