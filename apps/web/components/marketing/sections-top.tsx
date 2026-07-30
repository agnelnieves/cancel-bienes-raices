"use client"

import * as React from "react"
import { motion } from "motion/react"
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

import { links } from "@/lib/config"
import { Reveal } from "./reveal"
import { Button } from "@cancel/ui"

// ---------------------------------------------------------------- Stats bar

export function StatsBar() {
  const stats = [
    { value: "1,284", label: "Comparables en la plataforma" },
    { value: "23", label: "Cash deals reportados este mes" },
    { value: "18", label: "Realtors verificados en la red" },
    { value: "32", label: "Municipios de PR cubiertos" },
  ]
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.07} className="text-center">
            <p className="font-heading text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
              {s.value}
            </p>
            <p className="mt-1.5 text-[13px] text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------- Data moat (dark)

export function DataMoat() {
  const sources = [
    {
      icon: Users,
      title: "Red de realtors",
      tag: "Exclusiva",
      exclusive: true,
      description:
        "Realtors activos reportan sus cash deals a cambio de visibilidad e incentivos. Cada venta es verificada antes de publicarse.",
    },
    {
      icon: Building2,
      title: "MLS de Puerto Rico",
      tag: "Pública",
      exclusive: false,
      description:
        "Listados y ventas reportadas en el sistema MLS — la capa base que todos tienen, organizada de verdad.",
    },
    {
      icon: ScrollText,
      title: "Registro de la Propiedad",
      tag: "Pública",
      exclusive: false,
      description:
        "Escrituras y transferencias registradas oficialmente — el respaldo legal de cada comparable.",
    },
    {
      icon: Landmark,
      title: "CRIM",
      tag: "Pública",
      exclusive: false,
      description:
        "Avalúos y data catastral de los 78 municipios — el punto de referencia fiscal de cada propiedad.",
    },
  ]

  return (
    <section id="data" className="scroll-mt-24 bg-[#0c1a14] py-24 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              El foso competitivo
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-[42px] sm:leading-[1.08]">
              La mitad de las ventas de PR{" "}
              <span className="text-primary">no existe</span> en internet
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              En Puerto Rico, una parte enorme del mercado se mueve en efectivo —
              y esas ventas nunca tocan el MLS ni los portales. Sin esos
              comparables, estás valuando propiedades con media foto. Nosotros
              reportamos esa otra mitad.
            </p>

            <div className="mt-8 space-y-4">
              <ComparisonRow
                visible={false}
                platform="Zillow, PropStream, los coaches"
                text="Te enseñan el precio que piden, no el que pagan"
              />
              <ComparisonRow
                visible
                platform="Cancel"
                text="Te enseñamos lo que realmente se pagó — en cash y a tiempo"
              />
            </div>

            <Button size="lg" className="mt-8" asChild>
              <a href={links.signup}>
                Ver la data exclusiva
                <ArrowRight className="size-4" />
              </a>
            </Button>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-3">
              {sources.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  className={
                    s.exclusive
                      ? "relative overflow-hidden rounded-2xl border border-primary/40 bg-primary/10 p-5"
                      : "rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                  }
                >
                  {s.exclusive && (
                    <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                  )}
                  <div className="flex items-start gap-4">
                    <div
                      className={
                        s.exclusive
                          ? "flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-[#0c1a14]"
                          : "flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white/70"
                      }
                    >
                      <s.icon className="size-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-heading text-[15px] font-bold">
                          {s.title}
                        </h3>
                        <span
                          className={
                            s.exclusive
                              ? "rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-[#0c1a14]"
                              : "rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold text-white/60"
                          }
                        >
                          {s.tag.toUpperCase()}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-white/60">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <p className="pt-1 text-center text-[11px] text-white/40">
                <Lock className="mr-1 inline size-3" />
                {marketStats.cashDealsThisMonth} ventas en efectivo verificadas este mes — y subiendo
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
          <EyeOff className="size-3.5 text-white/50" />
        </span>
      )}
      <p className="text-[14px] leading-relaxed text-white/70">
        <strong className="text-white">{platform}:</strong> {text}
      </p>
    </div>
  )
}

// ------------------------------------------------------------ Copiloto feature

const CAPABILITIES = [
  "Busca comparables con lenguaje natural — “casas en Caguas bajo $150K”",
  "Corre los números y te lleva a la calculadora pre-llenada",
  "Añade propiedades a tu pipeline sin que toques nada",
  "Te lee el pulso de cualquier zona al momento",
]

export function CopilotFeature() {
  return (
    <section id="copiloto" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Chat demo */}
          <Reveal className="order-2 lg:order-1">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-6 rounded-[32px] bg-primary/8 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-lift">
                <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Sparkles className="size-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Copiloto Cancel</p>
                    <p className="text-[10px] text-muted-foreground">
                      siempre disponible · ⌘K
                    </p>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <ChatBubble role="user" delay={0.1}>
                    ¿Cómo está el mercado en Rincón?
                  </ChatBubble>
                  <ChatBubble role="assistant" delay={0.35}>
                    Rincón está <strong>caliente</strong>: +12.3% año contra año,
                    mediana $236/pc. El 55% de las ventas son cash — y tenemos 3
                    cash deals exclusivos de la zona esta semana.
                  </ChatBubble>
                  <ChatBubble role="user" delay={0.6}>
                    Muéstrame el más barato y corre los números
                  </ChatBubble>
                  <ChatBubble role="assistant" delay={0.85}>
                    <div className="rounded-xl border border-border bg-background p-3">
                      <div className="flex items-center gap-1.5">
                        <BadgeCheck className="size-3 text-primary" />
                        <span className="text-[9px] font-bold text-primary">
                          CASH · EXCLUSIVO
                        </span>
                      </div>
                      <p className="mt-1 text-xs font-medium">
                        Carr. 115 Km 12.4, Bo. Puntas
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <p className="font-heading text-sm font-bold">$385,000</p>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                          16.4% ROI est.
                        </span>
                      </div>
                    </div>
                    <p className="mt-2">
                      Listo — te pre-llené la calculadora en modo Airbnb (ADR de
                      la zona: $230, ocupación 74%).
                    </p>
                  </ChatBubble>
                  <ChatBubble role="action" delay={1.1}>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[11px] font-medium text-primary">
                      Abrir calculadora
                      <ArrowRight className="size-3" />
                    </span>
                  </ChatBubble>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Copy */}
          <Reveal className="order-1 lg:order-2" delay={0.1}>
            <p className="text-xs font-semibold tracking-widest text-primary uppercase">
              Copiloto AI
            </p>
            <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-[42px] sm:leading-[1.08]">
              Un asistente que hace el trabajo,{" "}
              <span className="text-primary">no solo contesta</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Escríbele en español como le escribirías a un pana. El copiloto
              busca, calcula, compara y mueve cosas en tu cuenta de verdad.
            </p>
            <ul className="mt-7 space-y-3.5">
              {CAPABILITIES.map((c, i) => (
                <motion.li
                  key={c}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="flex items-start gap-3 text-[15px] leading-relaxed"
                >
                  <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="size-3 text-primary" />
                  </span>
                  {c}
                </motion.li>
              ))}
            </ul>
            <Button size="lg" className="mt-8" asChild>
              <a href={links.signup}>
                Pruébalo gratis
                <ArrowRight className="size-4" />
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={role === "user" ? "flex justify-end" : ""}
    >
      <div
        className={
          role === "user"
            ? "max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2.5 text-[12.5px] text-primary-foreground"
            : role === "action"
              ? ""
              : "max-w-[92%] rounded-2xl rounded-bl-md border border-border bg-muted/50 px-3.5 py-2.5 text-[12.5px] leading-relaxed text-foreground/90"
        }
      >
        {children}
      </div>
    </motion.div>
  )
}
