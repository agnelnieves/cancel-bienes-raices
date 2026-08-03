"use client"

import * as React from "react"
import { motion } from "motion/react"
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  GitCompareArrows,
  HardHat,
  KanbanSquare,
  Landmark,
  Search,
  Sparkles,
} from "lucide-react"

import { formatCompact, formatCurrency, soldProperties, zones } from "@cancel/data"
import { cn } from "@cancel/ui"

import { Reveal } from "./reveal"

export function ToolsBento() {
  return (
    <section id="herramientas" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Las herramientas
          </p>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-balance sm:text-[42px] sm:leading-[1.1]">
            Todo lo que necesitas para decidir si un deal vale la pena
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Seis herramientas integradas entre sí — lo que encuentras en una,
            lo usas en todas.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-6">
          <Reveal className="md:col-span-4 md:row-span-2">
            <ComparablesCell />
          </Reveal>
          <Reveal className="md:col-span-2 md:row-span-2" delay={0.1}>
            <CopilotoCell />
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.05}>
            <CalculadoraCell />
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.1}>
            <DealsCell />
          </Reveal>
          <Reveal className="md:col-span-2" delay={0.15}>
            <CreditoCell />
          </Reveal>
          <Reveal className="md:col-span-3" delay={0.2}>
            <ContratistasCell />
          </Reveal>
          <Reveal className="md:col-span-3" delay={0.25}>
            <EstimadorCell />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------

function Cell({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: React.ElementType
  title: string
  description: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lift",
        className
      )}
    >
      <div className="p-6 pb-0">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
        <h3 className="mt-4 font-heading text-lg font-bold tracking-tight">
          {title}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="relative mt-5 flex-1">{children}</div>
    </div>
  )
}

// ---------------------------------------------------------------- Comparables

function ComparablesCell() {
  const comps = React.useMemo(
    () => soldProperties.filter((p) => p.source === "cash").slice(0, 5),
    []
  )
  const [active, setActive] = React.useState(0)

  React.useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % comps.length), 2600)
    return () => clearInterval(t)
  }, [comps.length])

  return (
    <Cell
      icon={Search}
      title="Buscador de Comparables"
      description="Propiedades similares vendidas con precios reales — incluyendo los cash deals que reporta nuestra red de realtors y que no aparecen en ningún sistema público."
    >
      <div className="space-y-2 px-6 pb-6">
        {comps.map((p, i) => (
          <div
            key={p.id}
            className={cn(
              "flex items-center justify-between gap-3 rounded-xl border p-3 transition-all duration-500",
              i === active
                ? "border-primary/40 bg-primary/5 scale-[1.01]"
                : "border-border bg-background opacity-70"
            )}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <BadgeCheck className="size-3 shrink-0 text-cash" />
                <span className="text-[9px] font-bold tracking-wide text-cash">
                  CASH · EXCLUSIVO
                </span>
                <span className="text-[10px] text-muted-foreground">{p.city}</span>
              </div>
              <p className="mt-0.5 truncate text-xs font-medium">{p.address}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-heading text-sm font-bold">{formatCompact(p.price)}</p>
              <p className="text-[9px] text-muted-foreground">${p.pricePerSqFt}/pc</p>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
          <span>+1,284 comparables en toda la isla</span>
          <span className="inline-flex items-center gap-1 font-medium text-primary">
            Explorar <ArrowUpRight className="size-3" />
          </span>
        </div>
      </div>
    </Cell>
  )
}

// ------------------------------------------------------------------ Copiloto

const CHAT_SCRIPT = [
  { role: "user" as const, text: "Busca casas en Bayamón bajo $200K" },
  { role: "thinking" as const, text: "Cruzando MLS + red de cash deals…" },
  {
    role: "assistant" as const,
    text: "Encontré 4 comparables. 2 son cash deals exclusivos — mediana $127/pc:",
  },
]

function CopilotoCell() {
  const [step, setStep] = React.useState(0)

  React.useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % (CHAT_SCRIPT.length + 1)), 2200)
    return () => clearInterval(t)
  }, [])

  const sample = soldProperties.find((p) => p.id === "p-021")!

  return (
    <Cell
      icon={Sparkles}
      title="Copiloto AI"
      description="Pídele lo que sea en español — busca, calcula y mueve tu pipeline por ti."
    >
      <div className="space-y-2.5 px-6 pb-6">
        {CHAT_SCRIPT.slice(0, step + 1).map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className={cn(
              msg.role === "user" && "flex justify-end",
              msg.role === "thinking" && "flex items-center gap-2 text-[10px] text-muted-foreground"
            )}
          >
            {msg.role === "user" && (
              <div className="max-w-[90%] rounded-2xl rounded-br-md bg-primary px-3 py-2 text-[11px] text-primary-foreground">
                {msg.text}
              </div>
            )}
            {msg.role === "thinking" && (
              <>
                <span className="flex gap-0.5">
                  <span className="size-1 rounded-full bg-primary animate-typing" />
                  <span className="size-1 rounded-full bg-primary animate-typing [animation-delay:150ms]" />
                  <span className="size-1 rounded-full bg-primary animate-typing [animation-delay:300ms]" />
                </span>
                {msg.text}
              </>
            )}
            {msg.role === "assistant" && (
              <div className="rounded-2xl rounded-bl-md border border-border bg-muted/50 px-3 py-2 text-[11px] leading-relaxed">
                {msg.text}
                <div className="mt-2 flex items-center justify-between rounded-lg border border-border bg-card p-2">
                  <div>
                    <p className="text-[10px] font-medium">{sample.address}</p>
                    <p className="text-[9px] text-muted-foreground">{sample.city}</p>
                  </div>
                  <p className="font-heading text-[11px] font-bold">
                    {formatCompact(sample.price)}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-[10px] text-muted-foreground">
          <Sparkles className="size-3 text-primary" />
          Pregúntale lo que sea…
          <kbd className="ml-auto rounded border border-border px-1">⌘K</kbd>
        </div>
      </div>
    </Cell>
  )
}

// --------------------------------------------------------------- Calculadora

function CalculadoraCell() {
  const [price, setPrice] = React.useState(150000)
  const [rent, setRent] = React.useState(1400)

  const opex = rent * 0.28
  const noi = rent - opex
  const coc = ((noi * 12) / (price * 1.03 + 10000)) * 100

  return (
    <Cell
      icon={GitCompareArrows}
      title="Calculadora ROI"
      description="Cap rate, cash flow y break-even sin abrir Excel."
    >
      <div className="space-y-3 px-6 pb-6">
        <MiniSlider label="Precio" value={price} min={80000} max={400000} step={5000} onChange={setPrice} format={(v) => formatCompact(v)} />
        <MiniSlider label="Renta" value={rent} min={800} max={3000} step={50} onChange={setRent} format={(v) => `${formatCurrency(v)}/mes`} />
        <div className="flex items-end justify-between rounded-xl bg-primary/5 p-3">
          <div>
            <p className="text-[9px] font-semibold tracking-widest text-muted-foreground uppercase">
              Cash-on-cash
            </p>
            <p className="font-heading text-2xl font-extrabold text-primary">
              {coc.toFixed(1)}%
            </p>
          </div>
          <p className="text-right text-[10px] leading-snug text-muted-foreground">
            Cash flow ≈ {formatCurrency(Math.round(noi))}/mes
            <br />
            {coc >= 10 ? "🔥 deal brutal" : coc >= 6 ? "decente" : "flojo"}
          </p>
        </div>
      </div>
    </Cell>
  )
}

function MiniSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  format: (v: number) => string
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{format(value)}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--primary)]"
      />
    </div>
  )
}

// ---------------------------------------------------------------------- Deals

function DealsCell() {
  const cols = [
    { label: "Prospecto", deals: [{ a: "Caguas", p: "$142K" }, { a: "Ponce", p: "$87K" }] },
    { label: "Oferta", deals: [{ a: "Bayamón", p: "$118K" }] },
    { label: "Cierre", deals: [{ a: "Santurce", p: "$315K" }] },
  ]
  return (
    <Cell
      icon={KanbanSquare}
      title="Deal Tracker"
      description="Tu pipeline de prospecto a cierre, siempre a la vista."
    >
      <div className="flex gap-2 px-6 pb-6">
        {cols.map((col) => (
          <div key={col.label} className="flex-1 rounded-xl bg-muted/60 p-2">
            <p className="px-1 text-[9px] font-semibold tracking-wide text-muted-foreground uppercase">
              {col.label}
            </p>
            <div className="mt-1.5 space-y-1.5">
              {col.deals.map((d) => (
                <div key={d.a} className="rounded-lg border border-border bg-card p-2">
                  <p className="truncate text-[10px] font-medium">{d.a}</p>
                  <p className="font-heading text-[11px] font-bold">{d.p}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Cell>
  )
}

// -------------------------------------------------------------------- Crédito

function CreditoCell() {
  const cards = [
    { name: "Sapphire · 0% APR", pct: 28, promo: true },
    { name: "Venture X", pct: 77, promo: false },
    { name: "Discover · 0% APR", pct: 12, promo: true },
  ]
  return (
    <Cell
      icon={Landmark}
      title="Planner de Crédito"
      description="La jugada de líneas al 0%, mapeada sin dañar tu score."
    >
      <div className="space-y-2.5 px-6 pb-6">
        {cards.map((c) => (
          <div key={c.name}>
            <div className="flex items-center justify-between text-[10px]">
              <span className={cn("font-medium", c.promo && "text-primary")}>
                {c.name}
              </span>
              <span className={cn("font-semibold", c.pct <= 30 ? "text-primary" : "text-amber-500")}>
                {c.pct}%
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${c.pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className={cn("h-full rounded-full", c.pct <= 30 ? "bg-primary" : "bg-amber-500")}
              />
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/5 px-3 py-2 text-[10px]">
          <Sparkles className="size-3 shrink-0 text-primary" />
          <span className="text-muted-foreground">
            Plan de jugada: <strong className="text-foreground">$40K</strong> distribuidos sin pasar del 30%
          </span>
        </div>
      </div>
    </Cell>
  )
}

// -------------------------------------------------------------- Contratistas

function ContratistasCell() {
  const pros = [
    { name: "Ramos Construction", trade: "Remodelación", rating: "4.9", jobs: 41 },
    { name: "TechosPR Solutions", trade: "Techos", rating: "4.9", jobs: 48 },
    { name: "Aires del Caribe", trade: "Mini-splits", rating: "4.8", jobs: 29 },
  ]
  return (
    <Cell
      icon={HardHat}
      title="Red de Contratistas"
      description="Profesionales vetados por la comunidad — licencia y seguro verificados, con precios de referencia claros."
    >
      <div className="space-y-2 px-6 pb-6">
        {pros.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
          >
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-[11px] font-bold text-primary">
                {p.name.slice(0, 1)}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate text-[11px] font-semibold">
                  {p.name}
                  <BadgeCheck className="size-3 shrink-0 text-primary" />
                </p>
                <p className="text-[10px] text-muted-foreground">{p.trade}</p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[11px] font-bold">★ {p.rating}</p>
              <p className="text-[9px] text-muted-foreground">{p.jobs} trabajos</p>
            </div>
          </div>
        ))}
        <p className="pt-0.5 text-center text-[10px] text-muted-foreground">
          El orden de los resultados no se vende — se gana con trabajos reales.
        </p>
      </div>
    </Cell>
  )
}

// ----------------------------------------------------------------- Estimador

function EstimadorCell() {
  const rows = [
    { label: "Cocina completa", price: "$12.5K" },
    { label: "2 baños", price: "$11.0K" },
    { label: "Pisos · 1,200 pc", price: "$8.4K" },
    { label: "Techo (sellado)", price: "$4.2K" },
  ]
  return (
    <Cell
      icon={GitCompareArrows}
      title="Estimador de Remodelación"
      description="Presupuesto por partida con precios reales de mano de obra de Puerto Rico."
    >
      <div className="space-y-2 px-6 pb-6">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-[11px]"
          >
            <span className="text-muted-foreground">{r.label}</span>
            <span className="font-semibold">{r.price}</span>
          </div>
        ))}
        <div className="flex items-center justify-between rounded-xl bg-primary/5 px-3 py-2.5">
          <span className="text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
            Total estimado
          </span>
          <span className="font-heading text-sm font-extrabold text-primary">$39.7K</span>
        </div>
      </div>
    </Cell>
  )
}
