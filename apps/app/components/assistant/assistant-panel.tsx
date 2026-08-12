"use client"

import * as React from "react"
import { ArrowDown, ArrowUp, Eraser, Plus, Sparkles, X } from "lucide-react"

import { Button, cn } from "@cancel/ui"

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
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const endRef = React.useRef<HTMLDivElement>(null)
  const [showJump, setShowJump] = React.useState(false)

  React.useEffect(() => {
    if (open && autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 150)
      return () => clearTimeout(t)
    }
  }, [open, autoFocus])

  // Auto-grow the composer textarea with its content, capped at ~6 lines.
  React.useEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 148)}px`
  }, [input])

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

      {/* Input — a pill that grows into a rounded rect as text wraps, with
          the plus/send controls pinned to the bottom corners. */}
      <div className="shrink-0 px-4 pb-4 pt-1">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex items-end gap-1.5 rounded-[28px] border border-input bg-card p-1.5 shadow-soft transition-colors focus-within:border-ring/60"
        >
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled
            title="Adjuntar (próximamente)"
            className="size-9 shrink-0 rounded-full text-muted-foreground/60 disabled:opacity-100"
          >
            <Plus className="size-4" />
          </Button>
          <textarea
            ref={inputRef}
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
            className="max-h-[148px] min-h-9 flex-1 resize-none self-center bg-transparent px-1.5 py-1.5 text-sm leading-6 outline-none placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim()}
            aria-label="Enviar"
            className="size-9 shrink-0 rounded-full"
          >
            <ArrowUp className="size-4" />
          </Button>
        </form>
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
