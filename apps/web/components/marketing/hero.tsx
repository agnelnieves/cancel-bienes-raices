"use client"

import * as React from "react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import {
  ArrowRight,
  BadgeCheck,
  Lock,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react"

import { formatCompact, marketStats, soldProperties, zones } from "@cancel/data"
import { Button, cn } from "@cancel/ui"

import { links } from "@/lib/config"
import { duration, easeOut, easeOutExpo } from "./motion"

/**
 * Hero — scroll-driven stage.
 * The app replica enters tilted in 3D, settles flat as you scroll,
 * and floats with parallax data chips. Lenis emits native scroll events,
 * so `useScroll` stays in sync with the smooth scroll.
 */
export function Hero() {
  const reduce = useReducedMotion()
  const stageRef = React.useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start end", "end start"],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 26,
    mass: 0.4,
  })

  // Panel choreography: tilt in, settle, gentle drift
  const rotateX = useTransform(progress, [0, 0.35], reduce ? [0, 0] : [9, 0])
  const panelY = useTransform(progress, [0, 0.35], reduce ? [0, 0] : [56, 0])
  const panelScale = useTransform(progress, [0, 0.35], [0.94, 1])
  const glow = useTransform(progress, [0, 0.4], [0.35, 0.9])

  // Chips parallax at different rates for depth
  const chipYLeft = useTransform(progress, [0, 1], reduce ? [0, 0] : [40, -46])
  const chipYRight = useTransform(progress, [0, 1], reduce ? [0, 0] : [64, -30])

  const y = (n: number) => (reduce ? 0 : n)

  return (
    <section className="relative overflow-hidden pt-28 pb-6 sm:pt-36">
      {/* Warm atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <motion.div
          style={{ opacity: glow }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_75%_52%_at_50%_-8%,color-mix(in_srgb,var(--primary)_13%,transparent),transparent_70%)]"
        />
        <div className="absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-sidebar/70 via-sidebar/25 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: y(12) }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.enter, ease: easeOut }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-[12.5px] font-medium text-primary">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-40" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              {marketStats.cashDealsThisMonth} cash deals exclusivos este mes
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: y(20) }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: duration.hero,
              delay: reduce ? 0 : 0.06,
              ease: easeOutExpo,
            }}
            className="mt-7 font-heading text-[42px] leading-[1.04] font-bold tracking-tight text-balance text-foreground sm:text-6xl lg:text-[72px] lg:leading-[1.01]"
          >
            Los comparables que los realtors{" "}
            <span className="text-primary">no te enseñan</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: y(14) }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: duration.enter,
              delay: reduce ? 0 : 0.14,
              ease: easeOut,
            }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Ventas reales de Puerto Rico, incluyendo cash deals que no salen en
            ningún portal. Herramientas para decidir si un deal vale la pena,
            en español, para el inversionista latino.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: y(14) }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: duration.enter,
              delay: reduce ? 0 : 0.22,
              ease: easeOut,
            }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button
              size="lg"
              className="h-12 w-full gap-2 rounded-full px-7 text-[15px] shadow-lift sm:w-auto"
              asChild
            >
              <a href={links.signup}>
                Comenzar gratis
                <ArrowRight className="size-4 transition-transform duration-150 group-hover/button:translate-x-0.5" />
              </a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-full rounded-full px-7 text-[15px] sm:w-auto"
              asChild
            >
              <a href="#herramientas">Ver las herramientas</a>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.base, delay: reduce ? 0 : 0.32 }}
            className="mt-5 text-[12.5px] text-muted-foreground"
          >
            5 búsquedas gratis al mes · Sin tarjeta de crédito
          </motion.p>
        </div>
      </div>

      {/* Scroll stage */}
      <div ref={stageRef} className="relative mx-auto mt-10 max-w-6xl px-4 sm:mt-12 sm:px-6">
        <div style={{ perspective: 1400 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.base, delay: reduce ? 0 : 0.3 }}
            style={{ rotateX, y: panelY, scale: panelScale, transformStyle: "preserve-3d" }}
            className="relative mx-auto max-w-5xl will-change-transform"
          >
            <FloatingChip
              style={{ y: chipYLeft }}
              className="top-14 left-0 z-10 max-lg:hidden xl:-left-10"
              delay={0.85}
              reduce={!!reduce}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
                  <TrendingUp className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Cash-on-cash</p>
                  <p className="font-heading text-[15px] font-bold tabular-nums text-primary">
                    14.2%
                  </p>
                </div>
              </div>
            </FloatingChip>

            <FloatingChip
              style={{ y: chipYRight }}
              className="right-0 -bottom-5 z-10 max-lg:hidden xl:-right-6"
              delay={1}
              reduce={!!reduce}
            >
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </div>
                <div className="text-[12px] leading-snug">
                  <p className="font-semibold">Copiloto</p>
                  <p className="text-muted-foreground">Añadí 3 deals a tu pipeline</p>
                </div>
              </div>
            </FloatingChip>

            <AppStage reduce={!!reduce} />
          </motion.div>
        </div>

        {/* Fade into page */}
        <div
          className="pointer-events-none absolute inset-x-0 -bottom-2 h-20 bg-gradient-to-t from-background via-background/85 to-transparent"
          aria-hidden
        />
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------

function FloatingChip({
  children,
  className,
  delay,
  reduce,
  style,
}: {
  children: React.ReactNode
  className?: string
  delay: number
  reduce: boolean
  style?: { y: MotionValue<number> }
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: reduce ? 1 : 0.94, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, delay: reduce ? 0 : delay, ease: easeOut }}
      style={style}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -7, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: duration.float, repeat: Infinity, ease: "easeInOut", delay }
        }
        className="rounded-2xl border border-border/80 bg-card/95 p-3.5 shadow-lift backdrop-blur-md"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// ------------------------------------------------------------- App replica

function AppStage({ reduce }: { reduce: boolean }) {
  const cashDeals = React.useMemo(
    () => soldProperties.filter((p) => p.source === "cash").slice(0, 4),
    []
  )
  const [active, setActive] = React.useState(0)

  React.useEffect(() => {
    if (reduce) return
    const t = setInterval(() => setActive((a) => (a + 1) % cashDeals.length), 2600)
    return () => clearInterval(t)
  }, [cashDeals.length, reduce])

  return (
    <div className="relative rounded-[22px] border border-border/60 bg-sidebar p-2 shadow-[0_1px_2px_rgb(34_34_34/0.05),0_32px_80px_-20px_rgb(34_34_34/0.28),0_64px_160px_-48px_rgb(29_158_117/0.14),0_0_0_1px_rgb(34_34_34/0.05)] sm:p-2.5">
      <div className="overflow-hidden rounded-[15px] border border-border/50 bg-background shadow-inset-panel">
        {/* Browser chrome */}
        <div className="flex items-center gap-2.5 border-b border-border/60 bg-muted/40 px-3.5 py-2.5 sm:px-4">
          <div className="flex gap-1.5" aria-hidden>
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="ml-1 flex h-7 flex-1 items-center gap-2 rounded-lg bg-background/90 px-3 text-[11px] text-muted-foreground ring-1 ring-border/50">
            <Lock className="size-3 opacity-50" />
            <span className="truncate">app.cancelpr.com/comparables</span>
          </div>
        </div>

        <div className="grid gap-4 p-3.5 sm:p-5 lg:grid-cols-5">
          {/* Comparables list */}
          <div className="space-y-3 lg:col-span-3">
            <div className="flex h-11 items-center gap-2.5 rounded-full border border-border bg-background px-4 shadow-card">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate text-[13px] text-muted-foreground">
                Santurce · bajo $250K · solo data exclusiva
              </span>
              <span className="ml-auto hidden shrink-0 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground sm:inline">
                Buscar
              </span>
            </div>

            <div className="space-y-2">
              {cashDeals.map((p, i) => (
                <div
                  key={p.id}
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl border p-3 transition-all duration-500 ease-out",
                    i === active
                      ? "border-primary/35 bg-primary/[0.04] shadow-card"
                      : "border-border/80 bg-card"
                  )}
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 rounded-full bg-cash-soft px-2 py-0.5 text-[10px] font-semibold text-cash ring-1 ring-cash/20">
                        <BadgeCheck className="size-2.5" />
                        Cash · Exclusivo
                      </span>
                      <span className="text-[11px] text-muted-foreground">{p.city}</span>
                    </div>
                    <p className="mt-1.5 truncate text-[13px] font-medium tracking-tight">
                      {p.address}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-heading text-[15px] font-bold tabular-nums tracking-tight">
                      {formatCompact(p.price)}
                    </p>
                    <p className="text-[11px] tabular-nums text-muted-foreground">
                      ${p.pricePerSqFt}/pc
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-cash/30 bg-cash-soft/70 px-3.5 py-2.5">
              <Lock className="size-3.5 shrink-0 text-cash" />
              <p className="text-[12px] leading-snug text-cash">
                <strong className="font-semibold">
                  +{marketStats.totalComparables - 4} comparables más
                </strong>
                . La mayoría no existe en Zillow ni MLS.
              </p>
            </div>
          </div>

          {/* Market pulse */}
          <div className="space-y-2.5 max-lg:hidden lg:col-span-2">
            <div className="flex items-baseline justify-between px-0.5">
              <p className="text-[13px] font-semibold tracking-tight">Pulso del mercado</p>
              <span className="text-[11px] text-muted-foreground">YoY</span>
            </div>
            {zones.slice(0, 4).map((z) => {
              const min = Math.min(...z.trend)
              const max = Math.max(...z.trend)
              const range = max - min || 1
              return (
                <div
                  key={z.id}
                  className="rounded-xl border border-border/80 bg-card p-3 shadow-card"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold tracking-tight">{z.name}</p>
                    <span
                      className={cn(
                        "text-[12px] font-semibold tabular-nums",
                        z.yoyChange >= 5 ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      +{z.yoyChange}%
                    </span>
                  </div>
                  <div className="mt-2.5 flex h-9 items-end gap-0.5">
                    {z.trend.map((v, j) => (
                      <motion.div
                        key={j}
                        initial={reduce ? false : { height: "18%" }}
                        animate={{
                          height: `${18 + ((v - min) / range) * 82}%`,
                        }}
                        transition={{
                          duration: 0.7,
                          delay: reduce ? 0 : 0.5 + j * 0.03,
                          ease: easeOut,
                        }}
                        className="flex-1 rounded-sm bg-primary/20 last:bg-primary/55"
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-[11px] tabular-nums text-muted-foreground">
                    ${z.medianPpsf}/pc mediana
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
