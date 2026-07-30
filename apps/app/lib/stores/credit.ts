"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { mockCreditCards, type CreditCard } from "@cancel/data"

interface CreditState {
  cards: CreditCard[]
  updateCard: (id: string, patch: Partial<CreditCard>) => void
  addCard: (card: Omit<CreditCard, "id">) => void
  removeCard: (id: string) => void
  applyPlan: (allocations: Record<string, number>) => void
  reset: () => void
}

export const useCreditStore = create<CreditState>()(
  persist(
    (set) => ({
      cards: mockCreditCards,
      updateCard: (id, patch) =>
        set((s) => ({
          cards: s.cards.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        })),
      addCard: (card) =>
        set((s) => ({
          cards: [...s.cards, { ...card, id: `cc-${Date.now()}` }],
        })),
      removeCard: (id) =>
        set((s) => ({ cards: s.cards.filter((c) => c.id !== id) })),
      applyPlan: (allocations) =>
        set((s) => ({
          cards: s.cards.map((c) => ({
            ...c,
            allocated: allocations[c.id] ?? 0,
          })),
        })),
      reset: () => set({ cards: mockCreditCards }),
    }),
    { name: "cbr-credit" }
  )
)
