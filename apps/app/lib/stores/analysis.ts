"use client"

import { create } from "zustand"

export type CalcMode = "alquiler" | "flip" | "airbnb"

export interface CalcPrefill {
  propertyId?: string
  address?: string
  zone?: string
  mode: CalcMode
  price?: number
  sqft?: number
  rent?: number
  strNightly?: number
  rehab?: number
}

interface AnalysisState {
  prefill: CalcPrefill | null
  setPrefill: (p: CalcPrefill) => void
  clear: () => void
}

/** Puente entre herramientas: comparables → calculadora, estimador → calculadora */
export const useAnalysisStore = create<AnalysisState>()((set) => ({
  prefill: null,
  setPrefill: (p) => set({ prefill: p }),
  clear: () => set({ prefill: null }),
}))
