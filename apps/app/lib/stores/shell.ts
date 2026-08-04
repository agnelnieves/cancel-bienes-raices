"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ShellState {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  toggleSidebar: () => void
}

export const useShellStore = create<ShellState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
    }),
    { name: "cbr-shell" }
  )
)

/** Expanded / collapsed desktop widths — keep in sync with sidebar + app-shell */
export const SIDEBAR_WIDTH = 232
export const SIDEBAR_WIDTH_COLLAPSED = 64
