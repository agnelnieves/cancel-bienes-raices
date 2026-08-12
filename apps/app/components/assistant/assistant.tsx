"use client"

import { AnimatePresence } from "motion/react"

import { useAssistantStore } from "@/lib/stores/assistant"
import { useAssistantContext } from "./assistant-provider"
import { FloatingAssistant } from "./floating-assistant"
import { MobileAssistantSheet } from "./mobile-assistant-sheet"

/**
 * Renders whichever assistant shell fits the viewport right now — a mobile
 * bottom drawer, or (on desktop) the floating window. The docked column
 * lives in AppShell itself, since it needs to sit inline in the layout's
 * flex row to push content over; everything else can float free here.
 * Reads the single controller from AssistantProvider — never creates its own.
 */
export function Assistant() {
  const { controller, isMobile } = useAssistantContext()
  const dockMode = useAssistantStore((s) => s.dockMode)

  if (isMobile) {
    return <MobileAssistantSheet controller={controller} />
  }

  if (dockMode === "floating") {
    return (
      <AnimatePresence>
        {controller.open && <FloatingAssistant controller={controller} />}
      </AnimatePresence>
    )
  }

  // dockMode === "sidebar" — the column itself is rendered by AppShell.
  return null
}
