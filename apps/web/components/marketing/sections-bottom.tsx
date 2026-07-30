"use client"

import { ArrowRight, BadgeCheck, Check, Crown, Users } from "lucide-react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  cn,
} from "@cancel/ui"

import { links } from "@/lib/config"
import { Reveal } from "./reveal"

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
      description: "Si ya eres miembro de la comunidad de Christopher, entra directo.",
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
    <section id="precios" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Precios
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-[42px]">
            Un solo deal bueno paga esto por años
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            PropStream cuesta $99/mes y no tiene ni un comparable de Puerto
            Rico. Nosotros nacimos aquí.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.08}>
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-2xl border p-7",
                  tier.featured
                    ? "border-primary/50 bg-card shadow-lift"
                    : "border-border bg-card"
                )}
              >
                {tier.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-wide text-primary-foreground uppercase">
                    Más popular
                  </span>
                )}
                <div className="flex items-center gap-2">
                  {tier.name === "Comunidad" && (
                    <Crown className="size-4 text-primary" />
                  )}
                  <h3 className="font-heading text-lg font-bold">{tier.name}</h3>
                </div>
                <div className="mt-4 flex items-baseline gap-1.5">
                  <span className="font-heading text-4xl font-extrabold tracking-tight">
                    {tier.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {tier.period}
                  </span>
                </div>
                <p className="mt-2 text-[13px] text-muted-foreground">
                  {tier.description}
                </p>
                <ul className="mt-6 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13.5px]">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  size="lg"
                  variant={tier.featured ? "default" : "outline"}
                  className="mt-7 w-full"
                  asChild
                >
                  <a href={links.signup}>{tier.cta}</a>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-6 text-center text-xs text-muted-foreground" delay={0.2}>
          Precio de fundador — sube cuando salgamos de beta. Sin contratos,
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
        "Cerré mi primer deal del año con la jugada de crédito y los comparables de la plataforma. El cash deal que usé para negociar no salía en ningún lado — $27K menos de lo que pedían.",
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
    <section className="border-y border-border/60 bg-muted/30 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-1.5">
            <Users className="size-4 text-primary" />
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              La comunidad
            </p>
          </div>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-[42px]">
            Hecha con los inversionistas que la usan todos los días
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className="size-4 fill-amber-400" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed text-foreground/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <span className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {t.initials}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold">{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
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
      a: "Combinamos cuatro fuentes: MLS de Puerto Rico, el Registro de la Propiedad, data del CRIM, y nuestra fuente estrella — una red de realtors activos que reportan sus ventas en efectivo (cash deals) directamente a la plataforma. Cada comparable muestra su fuente, y los exclusivos van verificados.",
    },
    {
      q: "¿Qué es un cash deal y por qué importa tanto?",
      a: "Una venta en efectivo que muchas veces nunca se lista en MLS ni aparece en portales como Zillow. En PR representan una porción enorme del mercado real. Sin esos precios, tu análisis usa solo la mitad de la foto — y suele ser la mitad más cara. Con ellos, sabes lo que la gente realmente pagó.",
    },
    {
      q: "Sirve si estoy empezando y nunca he hecho un deal?",
      a: "Sí — de hecho está hecha para ti. El onboarding te configura el panel en un minuto según tu experiencia, y el copiloto te explica los números en español claro mientras trabaja: qué es un cap rate, cuándo un deal es bueno, cuándo pasar.",
    },
    {
      q: "¿Cubren toda Puerto Rico?",
      a: "La cobertura más profunda hoy es zona metro (San Juan, Bayamón, Guaynabo, Carolina), Caguas, Ponce, Rincón y Dorado — que es donde se mueve la comunidad. La red de realtors crece cada mes y con ella los municipios cubiertos (ya vamos por 32).",
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
    <section id="faq" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal className="text-center">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-[42px]">
            Preguntas frecuentes
          </h2>
        </Reveal>
        <Reveal delay={0.1} className="mt-10">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-[15px] font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-[14px] leading-relaxed text-muted-foreground">
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
    <section className="pb-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center sm:px-16 sm:py-20">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 20%, white 0%, transparent 40%), radial-gradient(circle at 80% 90%, white 0%, transparent 35%)",
              }}
            />
            <div className="relative">
              <BadgeCheck className="mx-auto size-10 text-primary-foreground/80" />
              <h2 className="mx-auto mt-5 max-w-2xl font-heading text-3xl font-extrabold tracking-tight text-balance text-primary-foreground sm:text-5xl">
                La próxima vez que veas un deal, vas a saber si vale la pena
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-primary-foreground/80">
                Únete a los inversionistas que ya toman decisiones con data real
                de Puerto Rico. Gratis para empezar.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" variant="secondary" className="gap-2" asChild>
                  <a href={links.signup}>
                    Comenzar gratis
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
              <p className="mt-4 text-xs text-primary-foreground/60">
                5 búsquedas gratis al mes · Sin tarjeta · Cancela cuando quieras
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
