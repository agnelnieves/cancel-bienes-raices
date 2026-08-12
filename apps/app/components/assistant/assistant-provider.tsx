"use client"

import * as React from "react"

import { useAssistantStore } from "@/lib/stores/assistant"
import {
  ASSISTANT_AUTOCOLLAPSE_QUERY,
  ASSISTANT_MOBILE_QUERY,
  useShellStore,
} from "@/lib/stores/shell"
import { useMediaQuery } from "@/lib/use-media-query"
import { useAssistantController, type AssistantController } from "./use-assistant-controller"

interface AssistantContextValue {
  controller: AssistantController
  isMobile: boolean
  /** Docked column is actually rendered right now (mode is "sidebar" and
   *  there's room for it — on mobile it's always a drawer instead). */
  isDocked: boolean
}

const AssistantContext = React.createContext<AssistantContextValue | null>(null)

/**
 * Owns the single shared assistant controller — the ⌘K shortcut, message
 * engine, timers — so the docked column, floating window, and mobile drawer
 * all read and drive the exact same conversation instead of each mounting
 * its own copy (which would double-fire shortcuts and streaming timers).
 * Also drives the rail's auto-collapse while the dock is open on a viewport
 * too narrow for both.
 */
export function AssistantProvider({ children }: { children: React.ReactNode }) {
  const controller = useAssistantController()
  const dockMode = useAssistantStore((s) => s.dockMode)
  const isMobile = useMediaQuery(ASSISTANT_MOBILE_QUERY)
  const isNarrow = useMediaQuery(ASSISTANT_AUTOCOLLAPSE_QUERY)
  const setAssistantAutoCollapse = useShellStore((s) => s.setAssistantAutoCollapse)

  const isDocked = dockMode === "sidebar" && !isMobile

  React.useEffect(() => {
    setAssistantAutoCollapse(isDocked && controller.open && isNarrow)
    return () => setAssistantAutoCollapse(false)
  }, [isDocked, controller.open, isNarrow, setAssistantAutoCollapse])

  const value = React.useMemo<AssistantContextValue>(
    () => ({ controller, isMobile, isDocked }),
    [controller, isMobile, isDocked]
  )

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>
}

export function useAssistantContext() {
  const ctx = React.useContext(AssistantContext)
  if (!ctx) {
    throw new Error("useAssistantContext must be used within an AssistantProvider")
  }
  return ctx
}
