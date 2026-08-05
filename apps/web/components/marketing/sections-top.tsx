"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Eye,
  EyeOff,
  Landmark,
  Lock,
  ScrollText,
  Sparkles,
  Users,
} from "lucide-react"

import { marketStats } from "@cancel/data"
import { Button, cn } from "@cancel/ui"

import { links } from "@/lib/config"
import { duration, easeOut } from "./motion"
import { Reveal, SectionLabel } from "./reveal"

// ---------------------------------------------------------------- Stats bar
// Quiet network strip (Airbnb energy) — not four competing KPI tiles

export function StatsBar() {
  const stats = [
    {
      value: marketStats.totalComparables.toLocaleString("en-US"),
      label: "Comparables",
    },
    {
      value: String(marketStats.cashDealsThisMonth),
      label: "Cash deals este mes",
    },
    {
      value: String(marketStats.verifiedRealtors),
      label: "Realtors verificados",
    },
    {
      value: String(marketStats.municipalities),
      label: "Municipios cubiertos",
    },
  ]

  return (
    <section className="border-y border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14">
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.05}
              className={cn(
                "text-center md:text-left",
                i > 0 && "md:border-l md:border-border/70 md:pl-10"
              )}
            >
              <p className="font-heading text-[32px] font-bold tracking-tight tabular-nums text-foreground sm:text-4xl">
                {s.value}
              </p>
              <p className="mt-1.5 text-[13px] text-muted-foreground">{s.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Data moat

export function DataMoat() {
  const sources = [
    {
      icon: Users,
      title: "Red de realtors",
      tag: "Exclusiva",
      exclusive: true,
      description:
        "Realtors activos reportan sus cash deals a cambio de visibilidad e incentivos. Cada venta se verifica antes de publicarse.",
    },
    {
      icon: Building2,
      title: "MLS de Puerto Rico",
      tag: "Pública",
      exclusive: false,
      description:
        "Listados y ventas del sistema MLS: la capa base que todos tienen, organizada de verdad.",
    },
    {
      icon: ScrollText,
      title: "Registro de la Propiedad",
      tag: "Pública",
      exclusive: false,
      description:
        "Escrituras y transferencias registradas oficialmente. El respaldo legal de cada comparable.",
    },
    {
      icon: Landmark,
      title: "CRIM",
      tag: "Pública",
      exclusive: false,
      description:
        "Avalúos y data catastral de los 78 municipios. El punto de referencia fiscal de cada propiedad.",
    },
  ]

  return (
    <section
      id="data"
      className="scroll-mt-24 bg-[#0e1411] py-20 text-white sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <SectionLabel className="text-[13px] font-semibold tracking-tight text-primary">
              El foso competitivo
            </SectionLabel>
            <h2
              aria-label="La mitad de las ventas de PR no existe en internet"
              className="mt-3 font-heading text-[28px] font-bold tracking-tight text-balance sm:text-[40px] sm:leading-[1.1]"
            >
              La mitad de las ventas de PR{" "}
              <span className="text-primary">no existe</span> en internet
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/65 sm:text-lg">
              En Puerto Rico, una parte enorme del mercado se mueve en efectivo
              y esas ventas nunca tocan el MLS ni los portales. Sin esos
              comparables, valuás con media foto. Nosotros reportamos la otra
              mitad.
            </p>

            <div className="mt-8 space-y-3.5">
              <ComparisonRow
                visible={false}
                platform="Zillow, PropStream, los coaches"
                text="Te enseñan el precio que piden, no el que pagan"
              />
              <ComparisonRow
                visible
                platform="Cancel"
                text="Te enseñamos lo que realmente se pagó, en cash y a tiempo"
              />
            </div>

            <Button
              size="lg"
              className="mt-9 h-11 rounded-full px-6"
              asChild
            >
              <a href={links.signup}>
                Ver la data exclusiva
                <ArrowRight className="size-4 transition-transform duration-150 group-hover/button:translate-x-0.5" />
              </a>
            </Button>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-3">
              {sources.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.07,
                    ease: easeOut,
                  }}
                  className={
                    s.exclusive
                      ? "relative overflow-hidden rounded-2xl border border-cash/40 bg-cash/10 p-5"
                      : "rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5"
                  }
                >
                  {s.exclusive && (
                    <div
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cash to-transparent"
                      aria-hidden
                    />
                  )}
                  <div className="flex items-start gap-4">
                    <div
                      className={
                        s.exclusive
                          ? "flex size-11 shrink-0 items-center justify-center rounded-xl bg-cash text-white"
                          : "flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/8 text-white/65"
                      }
                    >
                      <s.icon className="size-5" strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-heading text-[15px] font-bold tracking-tight">
                          {s.title}
                        </h3>
                        <span
                          className={
                            s.exclusive
                              ? "rounded-full bg-cash px-2 py-0.5 text-[10px] font-bold text-white"
                              : "rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/55"
                          }
                        >
                          {s.tag}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-white/55">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <p className="flex items-center justify-center gap-1.5 pt-2 text-[11.5px] text-white/40">
                <Lock className="size-3" />
                {marketStats.cashDealsThisMonth} ventas en efectivo verificadas
                este mes
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ComparisonRow({
  visible,
  platform,
  text,
}: {
  visible: boolean
  platform: string
  text: string
}) {
  return (
    <div className="flex items-start gap-3">
      {visible ? (
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
          <Eye className="size-3.5 text-primary" />
        </span>
      ) : (
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white/8">
          <EyeOff className="size-3.5 text-white/45" />
        </span>
      )}
      <p className="text-[14.5px] leading-relaxed text-white/65">
        <strong className="font-semibold text-white">{platform}:</strong> {text}
      </p>
    </div>
  )
}

// ------------------------------------------------------------ Copiloto feature

const CAPABILITIES = [
  "Busca comparables con lenguaje natural: “casas en Caguas bajo $150K”",
  "Corre los números y te lleva a la calculadora pre-llenada",
  "Añade propiedades a tu pipeline sin que toques nada",
  "Te lee el pulso de cualquier zona al momento",
]

export function CopilotFeature() {
  return (
    <section id="copiloto" className="scroll-mt-24 bg-sidebar py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <div className="relative mx-auto max-w-md">
              <div
                className="absolute -inset-8 rounded-[40px] bg-primary/10 blur-3xl"
                aria-hidden
              />
              <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card shadow-lift">
                <div className="flex items-center gap-2.5 border-b border-border/70 px-4 py-3.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Sparkles className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold tracking-tight">
                      Copiloto Cancel
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      siempre disponible · ⌘K
                    </p>
                  </div>
                  <span className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse-dot" />
                    En línea
                  </span>
                </div>
                <div className="space-y-3 p-4">
                  <ChatBubble role="user" delay={0.08}>
                    ¿Cómo está el mercado en Rincón?
                  </ChatBubble>
                  <ChatBubble role="assistant" delay={0.28}>
                    Rincón está <strong>caliente</strong>: +12.3% año contra año,
                    mediana $236/pc. El 55% de las ventas son cash, y tenemos 3
                    cash deals exclusivos de la zona esta semana.
                  </ChatBubble>
                  <ChatBubble role="user" delay={0.48}>
                    Muéstrame el más barato y corre los números
                  </ChatBubble>
                  <ChatBubble role="assistant" delay={0.68}>
                    <div className="rounded-xl border border-cash/25 bg-cash-soft p-3">
                      <div className="flex items-center gap-1.5">
                        <BadgeCheck className="size-3 text-cash" />
                        <span className="text-[11px] font-semibold text-cash">
                          Cash · Exclusivo
                        </span>
                      </div>
                      <p className="mt-1.5 text-[12.5px] font-medium tracking-tight">
                        Carr. 115 Km 12.4, Bo. Puntas
                      </p>
                      <div className="mt-2.5 flex items-center justify-between">
                        <p className="font-heading text-[15px] font-bold tabular-nums">
                          $385,000
                        </p>
                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold tabular-nums text-primary">
                          16.4% ROI est.
                        </span>
                      </div>
                    </div>
                    <p className="mt-2.5">
                      Listo: te pre-llené la calculadora en modo Airbnb (ADR de
                      la zona $230, ocupación 74%).
                    </p>
                  </ChatBubble>
                  <ChatBubble role="action" delay={0.88}>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3.5 py-1.5 text-[12px] font-medium text-primary transition-colors hover:bg-primary/10">
                      Abrir calculadora
                      <ArrowRight className="size-3.5" />
                    </span>
                  </ChatBubble>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="order-1 lg:order-2" delay={0.08}>
            <SectionLabel>Copiloto AI</SectionLabel>
            <h2
              aria-label="Un asistente que hace el trabajo, no solo contesta"
              className="mt-3 font-heading text-[28px] font-bold tracking-tight text-balance sm:text-[40px] sm:leading-[1.1]"
            >
              Un asistente que hace el trabajo,{" "}
              <span className="text-primary">no solo contesta</span>
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Escríbele en español como le escribirías a un pana. El copiloto
              busca, calcula, compara y mueve cosas en tu cuenta de verdad.
            </p>
            <ul className="mt-8 space-y-3.5">
              {CAPABILITIES.map((c, i) => (
                <motion.li
                  key={c}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06, ease: easeOut }}
                  className="flex items-start gap-3 text-[15px] leading-relaxed"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="size-3 text-primary" />
                  </span>
                  {c}
                </motion.li>
              ))}
            </ul>
            <Button
              size="lg"
              className="mt-9 h-11 rounded-full px-6"
              asChild
            >
              <a href={links.signup}>
                Pruébalo gratis
                <ArrowRight className="size-4 transition-transform duration-150 group-hover/button:translate-x-0.5" />
              </a>
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function ChatBubble({
  role,
  children,
  delay,
}: {
  role: "user" | "assistant" | "action"
  children: React.ReactNode
  delay: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: reduce ? duration.fast : 0.4,
        delay: reduce ? 0 : delay,
        ease: easeOut,
      }}
      className={role === "user" ? "flex justify-end" : ""}
    >
      <div
        className={
          role === "user"
            ? "max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-[13px] text-primary-foreground"
            : role === "action"
              ? ""
              : "max-w-[92%] rounded-2xl rounded-bl-md border border-border/70 bg-muted/50 px-3.5 py-2.5 text-[13px] leading-relaxed text-foreground/90"
        }
      >
        {children}
      </div>
    </motion.div>
  )
}
