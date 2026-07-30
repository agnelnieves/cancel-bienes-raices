"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SavedState {
  savedIds: string[]
  compareIds: string[]
  toggleSaved: (id: string) => void
  toggleCompare: (id: string) => boolean
  clearCompare: () => void
}

export const MAX_COMPARE = 5

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      savedIds: [],
      compareIds: [],
      toggleSaved: (id) =>
        set((s) => ({
          savedIds: s.savedIds.includes(id)
            ? s.savedIds.filter((x) => x !== id)
            : [...s.savedIds, id],
        })),
      toggleCompare: (id) => {
        const s = get()
        if (s.compareIds.includes(id)) {
          set({ compareIds: s.compareIds.filter((x) => x !== id) })
          return true
        }
        if (s.compareIds.length >= MAX_COMPARE) return false
        set({ compareIds: [...s.compareIds, id] })
        return true
      },
      clearCompare: () => set({ compareIds: [] }),
    }),
    { name: "cbr-saved" }
  )
)
