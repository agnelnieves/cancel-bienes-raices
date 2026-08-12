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
 * The assistant as a column beside the content — mirrors the left rail's own
 * "gap spacer + fixed panel" split (see sidebar-gap / sidebar-container in
 * sidebar.tsx). The fixed panel is pinned to the viewport (`h-svh`), so its
 * height NEVER depends on how tall the main content column is — only the
 * conversation scrolls internally. The gap is an in-flow spacer that just
 * reserves room for it in the layout.
 */
export function DockedAssistant({ controller }: { controller: AssistantController }) {
  const { open, setOpen } = controller
  const reduce = useReducedMotion()
  const width = open ? ASSISTANT_DOCK_WIDTH : 0
  const transition = reduce ? { duration: 0 } : { duration: DURATION, ease: EASE }

  return (
    <>
      <motion.div
        data-slot="assistant-gap"
        className="hidden shrink-0 lg:block"
        initial={false}
        animate={{ width }}
        transition={transition}
        aria-hidden
      />

      <motion.div
        data-slot="assistant-container"
        initial={false}
        animate={{ width }}
        transition={transition}
        className="fixed inset-y-0 right-0 z-30 hidden h-svh overflow-hidden p-2 lg:block"
        aria-hidden={!open}
      >
        <div style={{ width: ASSISTANT_DOCK_WIDTH }} className="h-full">
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
            className={cn("lg:rounded-xl lg:shadow-inset-panel")}
          />
        </div>
      </motion.div>
    </>
  )
}
