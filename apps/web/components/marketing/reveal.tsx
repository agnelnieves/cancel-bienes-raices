"use client"

import { motion, useReducedMotion, type Variants } from "motion/react"

import { duration, easeOut } from "./motion"
import { cn } from "@cancel/ui"

type RevealCustom = { delay: number; reduce: boolean }

const variants: Variants = {
  hidden: ({ reduce }: RevealCustom) => ({
    opacity: 0,
    y: reduce ? 0 : 18,
  }),
  visible: ({ delay, reduce }: RevealCustom) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: reduce ? duration.fast : duration.enter,
      delay: reduce ? 0 : delay,
      ease: easeOut,
    },
  }),
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-72px" }}
      custom={{ delay, reduce: !!reduce } satisfies RevealCustom}
    >
      {children}
    </motion.div>
  )
}

/** Section kicker — quiet primary label, not uppercase tracking soup */
export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "text-[13px] font-semibold tracking-tight text-primary",
        className
      )}
    >
      {children}
    </p>
  )
}
