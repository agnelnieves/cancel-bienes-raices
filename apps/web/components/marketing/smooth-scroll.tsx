"use client"

import * as React from "react"
import Lenis from "lenis"
import { useReducedMotion } from "motion/react"

const LenisContext = React.createContext<Lenis | null>(null)

/** Access the shared Lenis instance (null before mount / when reduced motion). */
export function useLenis() {
  return React.useContext(LenisContext)
}

/**
 * Smooth scroll for the marketing site (darkroom Lenis).
 * Owns the page scroll: anchor links (`#seccion`) route through Lenis,
 * and scroll-driven scenes subscribe via `useLenis()` or `useScroll` on
 * window scroll (Lenis emits native scroll events as it animates).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  const [lenis, setLenis] = React.useState<Lenis | null>(null)

  React.useEffect(() => {
    if (reduce) return

    const instance = new Lenis({
      autoRaf: true,
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: -88 },
      syncTouch: false,
    })
    setLenis(instance)

    return () => {
      instance.destroy()
      setLenis(null)
    }
  }, [reduce])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
