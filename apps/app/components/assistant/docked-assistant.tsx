"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@cancel/ui"

import { ASSISTANT_DOCK_WIDTH } from "@/lib/stores/shell"
import { AssistantPanel } from "./assistant-panel"
import { DockModeMenu } from "./dock-mode-menu"
import { HistoryMenu } from "./history-menu"
import type { AssistantController } from "./use-assistant-controller"

// Same feel as the left rail's collapse/expand (SIDEBAR_EASE / SIDEBAR_MS in
// sidebar.tsx) so opening the assistant reads as one consistent shell motion.
const EASE = [0.32, 0.72, 0, 1] as const
const DURATION = 0.3

/**
 * The assistant as a column beside the content, inset the same way as the
 * main panel (rounded, shadow-inset-panel) — sharing the bg-sidebar canvas.
 * Width animates open/closed instead of the panel being overlaid.
 */
export function DockedAssistant({ controller }: { controller: AssistantController }) {
  const { open, setOpen } = controller
  const reduce = useReducedMotion()

  return (
    <motion.div
      data-slot="assistant-dock"
      initial={false}
      animate={{ width: open ? ASSISTANT_DOCK_WIDTH : 0 }}
      transition={reduce ? { duration: 0 } : { duration: DURATION, ease: EASE }}
      className="hidden shrink-0 overflow-hidden lg:block"
      aria-hidden={!open}
    >
      <div
        style={{ width: ASSISTANT_DOCK_WIDTH }}
        className={cn(
          "h-full lg:my-2 lg:mr-2 lg:rounded-xl lg:shadow-inset-panel",
          "lg:min-h-[calc(100dvh-1rem)]"
        )}
      >
        <AssistantPanel
          controller={controller}
          onRequestClose={() => setOpen(false)}
          headerActions={
            <>
              <HistoryMenu />
              <DockModeMenu />
            </>
          }
          autoFocus={open}
          className="lg:rounded-xl"
        />
      </div>
    </motion.div>
  )
}
