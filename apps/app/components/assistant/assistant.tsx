"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { Eraser, SendHorizonal, Sparkles, X } from "lucide-react"
import { toast } from "sonner"

import { propertyById, formatCurrency } from "@cancel/data"
import { Button, ScrollArea, Sheet, SheetContent, SheetTitle, cn } from "@cancel/ui"

import { interpret } from "@/lib/assistant/engine"
import { useAnalysisStore } from "@/lib/stores/analysis"
import { useAssistantStore, type AssistantMessage } from "@/lib/stores/assistant"
import { usePipelineStore } from "@/lib/stores/pipeline"
import { useUserStore } from "@/lib/stores/user"
import { CardRenderer } from "./message-cards"
import { MarkdownLite } from "./markdown"

const SUGGESTIONS: Record<string, string[]> = {
  default: [
    "Busca casas en Bayamón bajo $200K",
    "¿Cómo está el mercado en Rincón?",
    "Cash deals en Caguas",
    "¿Qué puedes hacer?",
  ],
  "/comparables": [
    "Cash deals en zona metro",
    "Apartamentos en Isla Verde",
    "Multifamiliares en Ponce",
  ],
  "/calculadora": [
    "Calcula el ROI de una casa en Ponce de $90K",
    "Calcula un Airbnb en Condado",
  ],
  "/deals": ["Añade la primera al pipeline", "¿Qué zonas están calientes?"],
  "/estimador": ["Cuánto cuesta remodelar 1,200 pies", "Necesito un plomero en Bayamón"],
}

let msgCounter = 0
const nextId = () => `msg-${Date.now()}-${msgCounter++}`

export function Assistant() {
  const router = useRouter()
  const pathname = usePathname()
  const {
    open,
    setOpen,
    toggle,
    messages,
    addMessage,
    patchMessage,
    clear,
    lastPropertyIds,
    setLastPropertyIds,
  } = useAssistantStore()
  const userName = useUserStore((s) => s.profile.name)
  const [input, setInput] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const endRef = React.useRef<HTMLDivElement>(null)
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])

  // Atajo global: Cmd/Ctrl + K
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        toggle()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [toggle])

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150)
  }, [open])

  // Auto-scroll al final
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" })
  }, [messages])

  React.useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const runEffects = (result: ReturnType<typeof interpret>) => {
    if (result.addDealPropertyId) {
      const p = propertyById(result.addDealPropertyId)
      if (p) {
        usePipelineStore.getState().addDeal({
          address: p.address,
          city: p.city,
          stage: "prospecto",
          askingPrice: p.price,
          offerPrice: null,
          roi: 0,
          cashFlow: 0,
          notes: `Añadida desde el asistente. Renta est. ${formatCurrency(p.estimatedRent)}/mes.`,
          contactName: "",
          contactRole: "",
        })
        toast.success("Deal añadido al pipeline")
      }
    }
    if (result.action === "open-calculadora" || result.prefillPropertyId) {
      const p = result.prefillPropertyId
        ? propertyById(result.prefillPropertyId)
        : undefined
      if (p) {
        useAnalysisStore.getState().setPrefill({
          propertyId: p.id,
          address: p.address,
          zone: p.zone,
          mode: result.prefillMode ?? "alquiler",
          price: p.price,
          sqft: p.sqFt,
          rent: p.estimatedRent,
          strNightly: p.strNightlyRate,
        })
      }
      router.push("/calculadora")
      setOpen(false)
    } else if (result.action === "open-estimador") {
      router.push("/estimador")
      setOpen(false)
    } else if (result.action === "open-comparador") {
      router.push("/comparador")
      setOpen(false)
    }
  }

  const send = (raw?: string) => {
    const text = (raw ?? input).trim()
    if (!text) return
    setInput("")

    addMessage({ id: nextId(), role: "user", content: text })

    const result = interpret(text, lastPropertyIds)
    const assistantId = nextId()
    const steps = result.thinking.length ? result.thinking : ["Pensando…"]

    addMessage({
      id: assistantId,
      role: "assistant",
      content: "",
      fullContent: result.reply,
      thinking: steps,
      pending: true,
    })

    // Fase 1: pasos de "pensamiento"
    const thinkMs = 650 * steps.length + 350
    steps.forEach((_, i) => {
      timers.current.push(
        setTimeout(() => {
          patchMessage(assistantId, { thinking: steps.slice(0, i + 1) })
        }, 350 + i * 650)
      )
    })

    // Fase 2: streaming de la respuesta
    timers.current.push(
      setTimeout(() => {
        const full = result.reply
        let i = 0
        const interval = setInterval(() => {
          i = Math.min(i + 4, full.length)
          patchMessage(assistantId, {
            content: full.slice(0, i),
            thinking: undefined,
            pending: i < full.length,
          })
          if (i >= full.length) {
            clearInterval(interval)
            patchMessage(assistantId, {
              cards: result.cards,
              fullContent: undefined,
            })
            setLastPropertyIds(result.propertyIds)
            runEffects(result)
          }
        }, 12)
        timers.current.push(interval as unknown as ReturnType<typeof setTimeout>)
      }, thinkMs)
    )
  }

  const suggestions = SUGGESTIONS[pathname] ?? SUGGESTIONS.default
  const firstName = userName.split(" ")[0]

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir asistente"
        className={cn(
          "fixed right-5 bottom-20 z-40 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lift transition-all hover:scale-105 active:scale-95 sm:bottom-5",
          open && "pointer-events-none scale-75 opacity-0"
        )}
      >
        <Sparkles className="size-5" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="flex flex-col gap-0 p-0 sm:max-w-md"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border/70 px-5 py-4">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </div>
              <div>
                <SheetTitle className="text-sm font-semibold">
                  Copiloto Cancel
                </SheetTitle>
                <p className="text-[11px] text-muted-foreground">
                  Tu asistente de inversión · Beta
                </p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
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
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Mensajes */}
          <ScrollArea className="flex-1">
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
          </ScrollArea>

          {/* Input */}
          <div className="border-t border-border p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Busca comparables, calcula ROI…"
                className="h-10 flex-1 rounded-full border border-input bg-transparent px-4 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 dark:bg-input/30"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                aria-label="Enviar"
              >
                <SendHorizonal className="size-4" />
              </Button>
            </form>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Demo con data mock · <kbd className="rounded border border-border px-1">⌘K</kbd> para abrir/cerrar
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
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
    <div className="animate-fade-in">
      <div className="max-w-full rounded-2xl rounded-bl-md border border-border bg-muted/50 px-4 py-3 text-sm leading-relaxed text-foreground/90">
        {/* Pasos de pensamiento */}
        {m.thinking && m.thinking.length > 0 && (
          <div className="space-y-1.5">
            {m.thinking.map((step, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-xs text-muted-foreground animate-fade-in"
              >
                <span className="flex gap-0.5">
                  <span className="size-1 rounded-full bg-primary animate-typing" />
                  <span className="size-1 rounded-full bg-primary animate-typing [animation-delay:150ms]" />
                  <span className="size-1 rounded-full bg-primary animate-typing [animation-delay:300ms]" />
                </span>
                {step}
              </div>
            ))}
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
