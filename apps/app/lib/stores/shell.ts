"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ShellState {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  toggleSidebar: () => void
  /** Ephemeral, not persisted — the rail auto-shrinks to icons while the
   *  docked assistant is open on a viewport too narrow for both. */
  assistantAutoCollapse: boolean
  setAssistantAutoCollapse: (v: boolean) => void
}

export const useShellStore = create<ShellState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleSidebar: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      assistantAutoCollapse: false,
      setAssistantAutoCollapse: (v) => set({ assistantAutoCollapse: v }),
    }),
    {
      name: "cbr-shell",
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
    }
  )
)

/** Whether the rail should render collapsed right now — either the user
 *  pinned it that way, or the docked assistant auto-shrank it for space. */
export function useEffectiveSidebarCollapsed() {
  return useShellStore((s) => s.sidebarCollapsed || s.assistantAutoCollapse)
}

/** Expanded / collapsed desktop widths — keep in sync with sidebar + app-shell.
 *  Inset shell: outer canvas is bg-sidebar; main panel floats beside the nav. */
export const SIDEBAR_WIDTH = 232
export const SIDEBAR_WIDTH_COLLAPSED = 48

/** Docked assistant column width (desktop, dockMode "sidebar"). */
export const ASSISTANT_DOCK_WIDTH = 400
/** Below this, the assistant can't sit docked comfortably next to content —
 *  the rail auto-collapses to icons to make room. */
export const ASSISTANT_AUTOCOLLAPSE_QUERY = "(max-width: 1279px)"
/** Below this, there's no room for a docked or floating panel at all —
 *  the assistant always renders as a full-height bottom drawer. */
export const ASSISTANT_MOBILE_QUERY = "(max-width: 1023px)"
