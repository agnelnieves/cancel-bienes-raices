"use client"

import * as React from "react"
import { motion } from "motion/react"
import {
  ArrowRight,
  BadgeCheck,
  BadgeDollarSign,
  Lock,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import { formatCompact, soldProperties, zones, marketStats } from "@cancel/data"
import { Button, cn } from "@cancel/ui"

import { links } from "@/lib/config"

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const cashDeals = React.useMemo(
    () => soldProperties.filter((p) => p.source === "cash").slice(0, 4),
    []
  )

  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
      {/* Glow de fondo */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary">
              <BadgeDollarSign className="size-3.5" />
              {marketStats.cashDealsThisMonth} cash deals exclusivos este mes
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="mt-6 font-heading text-[42px] leading-[1.04] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-[68px]"
          >
            Los comparables que los realtors{" "}
            <span className="relative inline-block text-primary">
              no te enseñan
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            Ventas reales de Puerto Rico — incluyendo los cash deals que no
            salen en ningún sistema público — más todas las herramientas para
            decidir si un deal vale la pena. En español, para el inversionista
            latino.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button size="lg" className="w-full gap-2 sm:w-auto" asChild>
              <a href={links.signup}>
                Comenzar gratis
                <ArrowRight className="size-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
              <a href="#herramientas">Ver las herramientas</a>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-4 text-xs text-muted-foreground"
          >
            5 búsquedas gratis al mes · Sin tarjeta de crédito
          </motion.p>
        </div>

        {/* -------- Mockup del producto -------- */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          {/* Tarjetas flotantes */}
          <FloatingCard className="top-16 -left-6 max-lg:hidden xl:-left-16" delay={0.9}>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Cash-on-cash</p>
                <p className="font-heading text-sm font-extrabold text-primary">
                  14.2%
                </p>
              </div>
            </div>
          </FloatingCard>
          <FloatingCard className="top-40 -right-4 max-lg:hidden xl:-right-14" delay={1.05}>
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <div className="text-[11px] leading-snug">
                <p className="font-semibold">Copiloto</p>
                <p className="text-muted-foreground">
                  “Añadí 3 deals a tu pipeline”
                </p>
              </div>
            </div>
          </FloatingCard>

          <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-lift">
            {/* Chrome del browser */}
            <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className="ml-2 flex h-6 flex-1 items-center rounded-md bg-background/80 px-3 text-[11px] text-muted-foreground">
                app.cancelpr.com/comparables
              </div>
            </div>

            {/* Contenido */}
            <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-3">
              {/* Columna izquierda: búsqueda + lista */}
              <div className="space-y-3 lg:col-span-2">
                <div className="flex h-10 items-center rounded-full border border-border bg-background px-4 text-xs text-muted-foreground">
                  Busca “Santurce” bajo $250K · solo data exclusiva…
                </div>
                <div className="space-y-2">
                  {cashDeals.map((p, i) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.65 + i * 0.12, ease }}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-md bg-cash-soft px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-cash ring-1 ring-cash/30">
                            <BadgeCheck className="size-2.5" />
                            CASH · EXCLUSIVO
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {p.city}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-xs font-medium">
                          {p.address}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-heading text-sm font-bold">
                          {formatCompact(p.price)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          ${p.pricePerSqFt}/pc
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-dashed border-cash/40 bg-cash-soft px-3.5 py-2.5">
                  <Lock className="size-3.5 shrink-0 text-cash" />
                  <p className="text-[11px] text-cash">
                    <strong>+{marketStats.totalComparables - 4} comparables más</strong>{" "}
                    — la mayoría no existe en Zillow ni MLS
                  </p>
                </div>
              </div>

              {/* Columna derecha: pulso de zonas */}
              <div className="space-y-2.5 max-lg:hidden">
                <p className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                  Pulso del mercado
                </p>
                {zones.slice(0, 4).map((z, i) => (
                  <motion.div
                    key={z.id}
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.75 + i * 0.12, ease }}
                    className="rounded-xl border border-border bg-background p-3"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold">{z.name}</p>
                      <span
                        className={cn(
                          "text-[10px] font-bold",
                          z.yoyChange >= 5 ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        +{z.yoyChange}%
                      </span>
                    </div>
                    <div className="mt-2 flex h-8 items-end gap-0.5">
                      {z.trend.map((v, j) => (
                        <div
                          key={j}
                          className="flex-1 rounded-sm bg-primary/25"
                          style={{
                            height: `${((v - z.trend[0] + 10) / (z.trend[z.trend.length - 1] - z.trend[0] + 10)) * 100}%`,
                          }}
                        />
                      ))}
                    </div>
                    <p className="mt-1.5 text-[10px] text-muted-foreground">
                      ${z.medianPpsf}/pc mediana
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sombra inferior */}
          <div className="absolute -inset-x-8 -bottom-10 h-24 bg-gradient-to-t from-background to-transparent" />
        </motion.div>
      </div>
    </section>
  )
}

function FloatingCard({
  children,
  className,
  delay,
}: {
  children: React.ReactNode
  className?: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease }}
      className={cn("absolute z-10", className)}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
        className="rounded-xl border border-border bg-card/95 p-3 shadow-lift backdrop-blur"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
