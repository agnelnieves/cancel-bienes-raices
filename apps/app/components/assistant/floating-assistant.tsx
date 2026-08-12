"use client"

import * as React from "react"
import { GripHorizontal } from "lucide-react"
import {
  animate,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  motion,
  type PanInfo,
} from "motion/react"

import { cn } from "@cancel/ui"

import {
  FLOATING_DEFAULT_SIZE,
  useAssistantStore,
  type FloatingRect,
} from "@/lib/stores/assistant"
import { AssistantPanel } from "./assistant-panel"
import { DockModeMenu } from "./dock-mode-menu"
import { HistoryMenu } from "./history-menu"
import type { AssistantController } from "./use-assistant-controller"

const MARGIN = 16
const { width: PANEL_W, height: PANEL_H } = FLOATING_DEFAULT_SIZE

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

/** Where the panel should rest right now, clamped to the live viewport. */
function defaultRect(): FloatingRect {
  if (typeof window === "undefined") {
    return { x: MARGIN, y: MARGIN, width: PANEL_W, height: PANEL_H }
  }
  return {
    x: window.innerWidth - PANEL_W - MARGIN,
    y: window.innerHeight - PANEL_H - MARGIN,
    width: PANEL_W,
    height: PANEL_H,
  }
}

/**
 * A draggable window, released with a spring "fling" toward whichever
 * corner its velocity was carrying it — same feel as Dia's floating chat.
 */
export function FloatingAssistant({ controller }: { controller: AssistantController }) {
  const { open, setOpen } = controller
  const storedRect = useAssistantStore((s) => s.floating)
  const setFloating = useAssistantStore((s) => s.setFloating)
  const dragControls = useDragControls()
  const reduce = useReducedMotion()

  const initial = React.useMemo(() => storedRect ?? defaultRect(), [storedRect])
  const x = useMotionValue(initial.x)
  const y = useMotionValue(initial.y)
  const [bounds, setBounds] = React.useState(() => ({
    left: MARGIN,
    top: MARGIN,
    right: (typeof window !== "undefined" ? window.innerWidth : 1280) - PANEL_W - MARGIN,
    bottom:
      (typeof window !== "undefined" ? window.innerHeight : 800) - PANEL_H - MARGIN,
  }))

  const recomputeBounds = React.useCallback(() => {
    const right = window.innerWidth - PANEL_W - MARGIN
    const bottom = window.innerHeight - PANEL_H - MARGIN
    setBounds({ left: MARGIN, top: MARGIN, right, bottom })
    x.set(clamp(x.get(), MARGIN, right))
    y.set(clamp(y.get(), MARGIN, bottom))
  }, [x, y])

  React.useEffect(() => {
    if (!open) return
    recomputeBounds()
    window.addEventListener("resize", recomputeBounds)
    return () => window.removeEventListener("resize", recomputeBounds)
  }, [open, recomputeBounds])

  const persist = React.useCallback(() => {
    setFloating({ x: x.get(), y: y.get(), width: PANEL_W, height: PANEL_H })
  }, [setFloating, x, y])

  const onDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (reduce) {
      persist()
      return
    }
    // Project where velocity would carry the panel, then snap to whichever
    // corner is closest to that projected resting point.
    const settleX = clamp(x.get() + info.velocity.x * 0.12, bounds.left, bounds.right)
    const settleY = clamp(y.get() + info.velocity.y * 0.12, bounds.top, bounds.bottom)
    const midX = (bounds.left + bounds.right) / 2
    const midY = (bounds.top + bounds.bottom) / 2
    const targetX = settleX < midX ? bounds.left : bounds.right
    const targetY = settleY < midY ? bounds.top : bounds.bottom

    const spring = { type: "spring" as const, stiffness: 420, damping: 38, mass: 0.9 }
    animate(x, targetX, { ...spring, onComplete: persist })
    animate(y, targetY, spring)
  }

  if (!open) return null

  return (
    <motion.div
      role="dialog"
      aria-label="Copiloto Cancel"
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0.06}
      dragConstraints={bounds}
      onDragEnd={onDragEnd}
      style={{ x, y, top: 0, left: 0, width: PANEL_W, height: PANEL_H }}
      initial={reduce ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.16, ease: [0.32, 0.72, 0, 1] }}
      className={cn(
        "fixed z-50 flex flex-col overflow-hidden rounded-2xl bg-background shadow-lift ring-1 ring-border"
      )}
    >
      {/* Drag handle — a small centered grip, not the full header strip, so
          the history/dock-mode/clear/close buttons beside it stay clickable. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex h-9 items-center justify-center">
        <div
          onPointerDown={(e) => dragControls.start(e)}
          className="pointer-events-auto flex h-6 w-16 cursor-grab items-center justify-center rounded-full active:cursor-grabbing"
        >
          <GripHorizontal className="size-3.5 text-muted-foreground/40" />
        </div>
      </div>
      <AssistantPanel
        controller={controller}
        onRequestClose={() => setOpen(false)}
        headerActions={
          <>
            <HistoryMenu />
            <DockModeMenu />
          </>
        }
        className="rounded-2xl"
      />
    </motion.div>
  )
}
