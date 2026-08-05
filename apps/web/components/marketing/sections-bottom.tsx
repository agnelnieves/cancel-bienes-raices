"use client"

import { ArrowRight, Check, Crown, Users } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  cn,
} from "@cancel/ui"

import { links } from "@/lib/config"
import { Reveal, SectionLabel } from "./reveal"

// ------------------------------------------------------------------ Pricing

export function Pricing() {
  const tiers = [
    {
      name: "Gratis",
      price: "$0",
      period: "para siempre",
      description: "Para tantear el terreno.",
      features: [
        "5 comparables al mes",
        "Calculadora ROI básica",
        "Pulso de mercado semanal",
        "Comunidad (solo lectura)",
      ],
      cta: "Empezar gratis",
      featured: false,
    },
    {
      name: "Pro",
      price: "$30",
      period: "/mes",
      description: "Para el inversionista activo que busca deals cada semana.",
      features: [
        "Comparables ilimitados en toda PR",
        "Data exclusiva de cash deals",
        "Copiloto AI sin límites",
        "Calculadora completa (alquiler, flip, Airbnb)",
        "Estimador de remodelación",
        "Deal Tracker + Comparador",
        "Planner de crédito",
        "Exportar análisis (PDF)",
      ],
      cta: "Comenzar prueba gratis",
      featured: true,
    },
    {
      name: "Comunidad",
      price: "Incluido",
      period: "con tu membresía",
      description:
        "Si ya eres miembro de la comunidad de Christopher, entra directo.",
      features: [
        "Todo lo de Pro incluido",
        "Acceso vía tu cuenta de la comunidad",
        "Canales privados de miembros",
        "Sesiones de análisis en vivo",
      ],
      cta: "Entrar con mi membresía",
      featured: false,
    },
  ]

  return (
    <section id="precios" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionLabel>Precios</SectionLabel>
          <h2 className="mt-3 font-heading text-[28px] font-bold tracking-tight text-balance sm:text-[40px] sm:leading-[1.12]">
            Un solo deal bueno paga esto por años
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            PropStream cuesta $99/mes y no tiene ni un comparable de Puerto
            Rico. Nosotros nacimos aquí.
          </p>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-5 sm:mt-16 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.07} className="h-full">
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-3xl p-7 sm:p-8",
                  tier.featured
                    ? "border border-primary/30 bg-card shadow-[0_2px_4px_rgb(34_34_34/0.04),0_24px_56px_-16px_rgb(29_158_117/0.22),0_0_0_1px_rgb(29_158_117/0.10)]"
                    : "border border-border/80 bg-card shadow-card"
                )}
              >
                {tier.featured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 text-[11px] font-semibold tracking-tight text-primary-foreground shadow-soft">
                    Más popular
                  </span>
                )}
                <div className="flex items-center gap-2">
                  {tier.name === "Comunidad" && (
                    <Crown className="size-4 text-primary" strokeWidth={1.75} />
                  )}
                  <h3 className="font-heading text-[17px] font-bold tracking-tight">
                    {tier.name}
                  </h3>
                </div>
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-heading text-[44px] leading-none font-bold tracking-tight tabular-nums">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tier.period}
                  </span>
                </div>
                <p className="mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
                  {tier.description}
                </p>
                <ul className="mt-7 flex-1 space-y-3">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-[13.5px] leading-snug"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  variant={tier.featured ? "default" : "outline"}
                  className="mt-8 h-11 w-full rounded-full"
                  asChild
                >
                  <a href={links.signup}>{tier.cta}</a>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal
          className="mt-8 text-center text-[12.5px] text-muted-foreground"
          delay={0.15}
        >
          Precio de fundador. Sube cuando salgamos de beta. Sin contratos,
          cancela cuando quieras.
        </Reveal>
      </div>
    </section>
  )
}

// -------------------------------------------------------------- Testimonios

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "Cerré mi primer deal del año con la jugada de crédito y los comparables de la plataforma. El cash deal que usé para negociar no salía en ningún lado: $27K menos de lo que pedían.",
      name: "Jorge Medina",
      initials: "JM",
      role: "Inversionista · Bayamón",
    },
    {
      quote:
        "Antes pasaba horas en Excel y llamando realtors para armar un comparable. Ahora corro el análisis completo en minutos y entro a las ofertas con confianza.",
      name: "Wanda Reyes",
      initials: "WR",
      role: "Inversionista · San Juan",
    },
    {
      quote:
        "La calculadora con modo Airbnb me evitó un mal deal en Rincón. El STR se veía lindo hasta que vi los gastos reales. Eso solo ya vale la membresía.",
      name: "Carmen Delgado",
      initials: "CD",
      role: "Inversionista · Rincón",
    },
  ]

  return (
    <section className="border-y border-border/60 bg-sidebar py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-2">
            <Users className="size-4 text-primary" strokeWidth={1.75} />
            <SectionLabel>La comunidad</SectionLabel>
          </div>
          <h2 className="mt-3 font-heading text-[28px] font-bold tracking-tight text-balance sm:text-[40px] sm:leading-[1.12]">
            Hecha con los inversionistas que la usan todos los días
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:mt-14 md:grid-cols-3 md:gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.07} className="h-full">
              <figure className="flex h-full flex-col rounded-3xl border border-border/70 bg-card p-7 shadow-card">
                <div className="flex gap-0.5" aria-label="5 de 5 estrellas">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg
                      key={j}
                      className="size-3.5 fill-amber-400"
                      viewBox="0 0 20 20"
                      aria-hidden
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[14.5px] leading-relaxed text-foreground/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-border/70 pt-5">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-[12px] font-bold text-primary">
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold tracking-tight">
                      {t.name}
                    </p>
                    <p className="text-[12px] text-muted-foreground">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------- FAQ

export function Faq() {
  const faqs = [
    {
      q: "¿De dónde sale la data de comparables?",
      a: "Combinamos cuatro fuentes: MLS de Puerto Rico, el Registro de la Propiedad, data del CRIM, y nuestra fuente estrella: una red de realtors activos que reportan sus ventas en efectivo (cash deals) directamente a la plataforma. Cada comparable muestra su fuente, y los exclusivos van verificados.",
    },
    {
      q: "¿Qué es un cash deal y por qué importa tanto?",
      a: "Una venta en efectivo que muchas veces nunca se lista en MLS ni aparece en portales como Zillow. En PR representan una porción enorme del mercado real. Sin esos precios, tu análisis usa solo la mitad de la foto, y suele ser la mitad más cara. Con ellos, sabes lo que la gente realmente pagó.",
    },
    {
      q: "¿Sirve si estoy empezando y nunca he hecho un deal?",
      a: "Sí. De hecho está hecha para ti. El onboarding te configura el panel en un minuto según tu experiencia, y el copiloto te explica los números en español claro mientras trabaja: qué es un cap rate, cuándo un deal es bueno, cuándo pasar.",
    },
    {
      q: "¿Cubren toda Puerto Rico?",
      a: "La cobertura más profunda hoy es zona metro (San Juan, Bayamón, Guaynabo, Carolina), Caguas, Ponce, Rincón y Dorado, que es donde se mueve la comunidad. La red de realtors crece cada mes y con ella los municipios cubiertos (ya vamos por 32).",
    },
    {
      q: "¿Y la metodología de invertir con tarjetas de crédito?",
      a: "El Planner de Crédito está diseñado exactamente para eso: mapea tus líneas, te dice cuánto puedes movilizar sin pasar del 30% de utilización, prioriza las promos al 0% y te calcula el costo real del capital. Es la misma jugada que enseña Christopher, pero con números en vez de memoria.",
    },
    {
      q: "¿Cuándo llega a Estados Unidos?",
      a: "La expansión a mercados latinos clave (Florida, Texas, Nueva York) está en el roadmap después del lanzamiento en PR. Los miembros fundadores de PR mantienen su precio cuando abramos.",
    },
  ]

  return (
    <section id="faq" className="scroll-mt-24 py-20 sm:py-28">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <Reveal className="text-center">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="mt-3 font-heading text-[28px] font-bold tracking-tight text-balance sm:text-[40px]">
            Preguntas frecuentes
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-border/70">
                <AccordionTrigger className="text-left text-[15px] font-semibold tracking-tight hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[14.5px] leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  )
}

// ------------------------------------------------------------------ Final CTA

export function FinalCta() {
  return (
    <section className="pb-24 sm:pb-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-[#0e1411] px-6 py-20 text-center sm:rounded-[40px] sm:px-16 sm:py-24">
            {/* Warm horizon glow, teal family */}
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden
              style={{
                backgroundImage:
                  "radial-gradient(ellipse 55% 45% at 50% -5%, color-mix(in srgb, #1d9e75 38%, transparent), transparent 70%), radial-gradient(ellipse 45% 45% at 85% 105%, color-mix(in srgb, #1d9e75 14%, transparent), transparent), radial-gradient(ellipse 35% 35% at 10% 100%, color-mix(in srgb, #b85c42 8%, transparent), transparent)",
              }}
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-heading text-[32px] font-bold tracking-tight text-balance text-white sm:text-5xl sm:leading-[1.08]">
                La próxima vez que veas un deal, vas a saber si vale la pena
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-white/60 sm:text-lg">
                Únete a los inversionistas que ya toman decisiones con data real
                de Puerto Rico. Gratis para empezar.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="h-12 gap-2 rounded-full px-8 text-[15px] shadow-lift"
                  asChild
                >
                  <a href={links.signup}>
                    Comenzar gratis
                    <ArrowRight className="size-4 transition-transform duration-150 group-hover/button:translate-x-0.5" />
                  </a>
                </Button>
              </div>
              <p className="mt-6 text-[12.5px] text-white/40">
                5 búsquedas gratis al mes · Sin tarjeta · Cancela cuando quieras
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
