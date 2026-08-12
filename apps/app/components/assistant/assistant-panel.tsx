"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, Eraser, Plus, Sparkles, X } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import { Button, cn } from "@cancel/ui"

/** Match the sidebar's open/close feel so the composer reflow feels native. */
const COMPOSER_EASE = [0.32, 0.72, 0, 1] as const
const COMPOSER_MS = 0.3

import type { AssistantMessage } from "@/lib/stores/assistant"
import { CardRenderer } from "./message-cards"
import { MarkdownLite } from "./markdown"
import type { AssistantController } from "./use-assistant-controller"

interface AssistantPanelProps {
  controller: AssistantController
  onRequestClose: () => void
  /** History + dock-mode dropdown triggers, rendered before Clear/Close. */
  headerActions?: React.ReactNode
  className?: string
  autoFocus?: boolean
}

/**
 * The assistant's body — header, message scroller, composer. Shared verbatim
 * across the docked column, the floating window, and the mobile drawer so
 * the conversation never re-renders differently depending on where it lives.
 */
export function AssistantPanel({
  controller,
  onRequestClose,
  headerActions,
  className,
  autoFocus = true,
}: AssistantPanelProps) {
  const { open, messages, clear, input, setInput, send, suggestions, firstName } =
    controller
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const mirrorRef = React.useRef<HTMLDivElement>(null)
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const endRef = React.useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const [showJump, setShowJump] = React.useState(false)
  // Once the composer wraps past one line, the toolbar (+/send) drops to its
  // own row below the text instead of hugging the last visible line.
  const [multiline, setMultiline] = React.useState(false)
  // True only once the textarea has hit its max height and actually scrolls.
  const [scrolls, setScrolls] = React.useState(false)

  React.useEffect(() => {
    if (open && autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 150)
      return () => clearTimeout(t)
    }
  }, [open, autoFocus])

  /**
   * Auto-grow the textarea AND decide inline-vs-stacked.
   *
   * The stacked decision is measured on a hidden mirror pinned to the *inline*
   * text width (container − the +/send button column), never on the live
   * textarea. That matters: the live textarea is `flex-1` when inline but
   * `basis-full` when stacked, so measuring it directly created a feedback
   * loop — going stacked widened it, which made the text fit one line, which
   * flipped it back to inline, and so on (the "jumps 10 times" jitter). The
   * mirror's width is independent of the current state, so the result is
   * stable: it only collapses back to inline when the text genuinely fits one
   * line at the inline width.
   */
  const measure = React.useCallback(() => {
    const ta = inputRef.current
    if (ta) {
      ta.style.height = "auto"
      ta.style.height = `${Math.min(ta.scrollHeight, 148)}px`
      setScrolls(ta.scrollHeight > 148)
    }
    const form = formRef.current
    const mirror = mirrorRef.current
    if (form && mirror && ta) {
      // 12px = form p-1.5 both sides · 84px = two size-9 buttons + two gaps.
      mirror.style.width = `${Math.max(form.clientWidth - 12 - 84, 0)}px`
      mirror.textContent = ta.value || ""
      // One line ≈ 36px (leading-6 + py-1.5); 40 clears it, 2 lines is ~60.
      setMultiline(mirror.scrollHeight > 40)
    }
  }, [])

  React.useLayoutEffect(() => {
    measure()
  }, [input, measure])

  // Re-measure when the panel itself is resized (dock ↔ float ↔ mobile).
  // measure() mutates layout (textarea height + mirror width), so running it
  // synchronously inside the observer callback re-triggers the observer and
  // throws "ResizeObserver loop completed with undelivered notifications".
  // Deferring to the next frame breaks that cycle.
  React.useEffect(() => {
    const form = formRef.current
    if (!form) return
    let raf = 0
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => measure())
    })
    ro.observe(form)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [measure])

  // Stick to the bottom on new content — unless the user has scrolled up to
  // read history, in which case a jump-to-latest pill appears instead.
  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    if (distanceFromBottom < 160) {
      endRef.current?.scrollIntoView({ block: "end" })
    }
  }, [messages])

  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
      setShowJump(distanceFromBottom > 120)
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col bg-sidebar text-sidebar-foreground",
        className
      )}
    >
      {/* Header — no border; the scroller's own fade dissolves content under it */}
      <div className="relative z-10 flex shrink-0 items-center justify-between gap-2 px-5 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              Copiloto Cancel
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              Tu asistente de inversión · Beta
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          {headerActions}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={clear}
            aria-label="Limpiar conversación"
            className="text-muted-foreground hover:text-foreground"
          >
            <Eraser className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onRequestClose}
            aria-label="Cerrar"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* Mensajes */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          className="scroll-fade-y h-full overflow-y-auto"
        >
          <div className="space-y-5 px-5 py-5">
            {messages.length === 0 && (
              <div className="animate-fade-in">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  ¡Wepa{firstName ? `, ${firstName}` : ""}! Soy tu copiloto de
                  inversión. Puedo buscar comparables, correr números, estimar
                  remodelaciones y mover tu pipeline — con data real de PR,
                  incluyendo los cash deals exclusivos.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            <div ref={endRef} className="h-px" />
          </div>
        </div>

        <button
          onClick={() => endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" })}
          className={cn(
            "absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground shadow-soft transition-all",
            showJump
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-2 opacity-0"
          )}
        >
          <ArrowDown className="size-3.5" />
          Más recientes
        </button>
      </div>

      {/* Input — a pill that grows into a rounded rect as text wraps. The
          same DOM nodes just change flex "order"/basis (they never unmount, so
          focus/caret survive); `motion` layout animations glide the +/send
          buttons to their new row and smoothly resize the textarea, matching
          the sidebar's easing. When stacked, the toolbar wraps to its own row
          below the text instead of hugging the last visible line. */}
      <div className="shrink-0 px-4 pb-4 pt-1">
        <motion.form
          ref={formRef}
          layout
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: COMPOSER_MS, ease: COMPOSER_EASE }
          }
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          // One constant radius for both inline and stacked — matching it
          // exactly kills the snap that came from animating borderRadius
          // alongside a `layout` transform (the two fought over timing).
          className="relative flex flex-wrap items-center justify-between gap-1.5 rounded-[22px] border border-input bg-card p-1.5 shadow-soft transition-colors duration-300 focus-within:border-ring/60"
        >
          {/* Hidden mirror: measures wrap at the fixed inline text width. */}
          <div
            ref={mirrorRef}
            aria-hidden
            className="invisible pointer-events-none absolute left-0 top-0 -z-10 box-border whitespace-pre-wrap break-words px-1.5 py-1.5 text-sm leading-6"
          />

          <motion.div
            layout
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: COMPOSER_MS, ease: COMPOSER_EASE }
            }
            className={cn("shrink-0", multiline ? "order-2" : "order-1")}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled
              title="Adjuntar (próximamente)"
              className="size-9 rounded-full text-muted-foreground/60 disabled:opacity-100"
            >
              <Plus className="size-4" />
            </Button>
          </motion.div>

          <motion.textarea
            ref={inputRef}
            // Position-only: a full `layout` animation scales the element via
            // a CSS transform while it resizes, and a native <textarea>'s text
            // rendering visibly stretches/squishes during that scale (you can
            // see the glyphs distort before the size correction snaps them
            // back). "position" only translates the element, never scales it,
            // so the height itself is instead grown smoothly below via a
            // plain CSS transition on the JS-driven inline height.
            layout="position"
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: COMPOSER_MS, ease: COMPOSER_EASE }
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key !== "Enter" || e.shiftKey) return
              // Don't submit while a CJK IME is composing (or on Safari's
              // unreliable final keyCode-229 composition event).
              if (e.nativeEvent.isComposing || e.keyCode === 229) return
              e.preventDefault()
              send()
            }}
            placeholder="Busca comparables, calcula ROI…"
            rows={1}
            style={{ transition: reduceMotion ? "none" : "height 0.3s cubic-bezier(0.32, 0.72, 0, 1)" }}
            className={cn(
              "max-h-[148px] min-h-9 resize-none bg-transparent px-1.5 py-1.5 text-sm leading-6 outline-none placeholder:text-muted-foreground",
              scrolls ? "scroll-fade-y overflow-y-auto" : "overflow-hidden",
              multiline ? "order-1 basis-full" : "order-2 flex-1"
            )}
          />

          <motion.div
            layout
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: COMPOSER_MS, ease: COMPOSER_EASE }
            }
            className="order-3 shrink-0"
          >
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim()}
              aria-label="Enviar"
              className="size-9 rounded-full"
            >
              <ArrowUp className="size-4" />
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  )
}

function MessageBubble({ message: m }: { message: AssistantMessage }) {
  if (m.role === "user") {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          {m.content}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-full animate-fade-in">
      <div className="min-w-0 text-sm leading-relaxed text-foreground/90">
        {/* Pasos de pensamiento */}
        {m.thinking && m.thinking.length > 0 && (
          <div className="space-y-1">
            {m.thinking.map((step, i) => {
              const isLast = i === m.thinking!.length - 1
              return (
                <p
                  key={i}
                  className={cn(
                    "animate-fade-in text-xs",
                    isLast ? "shimmer-text font-medium" : "text-muted-foreground/60"
                  )}
                >
                  {step}
                </p>
              )
            })}
          </div>
        )}
        {m.content && <MarkdownLite text={m.content} />}
        {m.pending && m.content && (
          <span className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse rounded-sm bg-primary align-middle" />
        )}
        {m.cards?.map((card, i) => <CardRenderer key={i} card={card} />)}
      </div>
    </div>
  )
}
