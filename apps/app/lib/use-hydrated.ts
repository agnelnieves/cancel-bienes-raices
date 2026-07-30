"use client"

import { useEffect, useState } from "react"

/** Evita hydration mismatch con stores persistidos en localStorage */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}
