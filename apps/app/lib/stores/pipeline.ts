"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { mockDeals, type Deal, type DealStage } from "@cancel/data"

interface PipelineState {
  deals: Deal[]
  addDeal: (deal: Omit<Deal, "id" | "updatedAt"> & { id?: string }) => Deal
  moveDeal: (id: string, stage: DealStage) => void
  updateDeal: (id: string, patch: Partial<Deal>) => void
  removeDeal: (id: string) => void
  reset: () => void
}

let counter = 100

export const usePipelineStore = create<PipelineState>()(
  persist(
    (set) => ({
      deals: mockDeals,
      addDeal: (input) => {
        const { id, ...rest } = input
        const deal: Deal = {
          ...rest,
          id: id ?? `deal-${Date.now()}-${counter++}`,
          updatedAt: new Date().toISOString().slice(0, 10),
        }
        set((s) => ({ deals: [deal, ...s.deals] }))
        return deal
      },
      moveDeal: (id, stage) =>
        set((s) => ({
          deals: s.deals.map((d) =>
            d.id === id
              ? { ...d, stage, updatedAt: new Date().toISOString().slice(0, 10) }
              : d
          ),
        })),
      updateDeal: (id, patch) =>
        set((s) => ({
          deals: s.deals.map((d) =>
            d.id === id
              ? { ...d, ...patch, updatedAt: new Date().toISOString().slice(0, 10) }
              : d
          ),
        })),
      removeDeal: (id) =>
        set((s) => ({ deals: s.deals.filter((d) => d.id !== id) })),
      reset: () => set({ deals: mockDeals }),
    }),
    { name: "cbr-pipeline" }
  )
)
