"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"

import { propertyById, formatCurrency } from "@cancel/data"

import { interpret } from "@/lib/assistant/engine"
import { useAnalysisStore } from "@/lib/stores/analysis"
import { useAssistantStore } from "@/lib/stores/assistant"
import { usePipelineStore } from "@/lib/stores/pipeline"
import { useUserStore } from "@/lib/stores/user"

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

/**
 * All assistant behavior (message engine, effects, suggestions) lives here so
 * the docked / floating / mobile-drawer shells can render the exact same
 * conversation without duplicating logic.
 */
export function useAssistantController() {
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

  return {
    open,
    setOpen,
    toggle,
    messages,
    clear,
    input,
    setInput,
    send,
    suggestions,
    firstName,
  }
}

export type AssistantController = ReturnType<typeof useAssistantController>
