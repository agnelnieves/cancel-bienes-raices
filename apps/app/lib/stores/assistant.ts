"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { AssistantCard } from "../assistant/types"

export interface AssistantMessage {
  id: string
  role: "user" | "assistant"
  content: string
  /** Texto completo destino; content se va llenando (streaming) */
  fullContent?: string
  thinking?: string[]
  cards?: AssistantCard[]
  pending?: boolean
}

/** Una conversación archivada — aparece en el historial del asistente. */
export interface AssistantSession {
  id: string
  title: string
  updatedAt: number
  messages: AssistantMessage[]
  lastPropertyIds: string[]
}

export type AssistantDockMode = "sidebar" | "floating"

export interface FloatingRect {
  x: number
  y: number
  width: number
  height: number
}

export const FLOATING_DEFAULT_SIZE = { width: 380, height: 600 }

let sessionCounter = 0
const nextSessionId = () => `session-${Date.now()}-${sessionCounter++}`

function titleFromMessages(messages: AssistantMessage[]): string {
  const firstUser = messages.find((m) => m.role === "user")?.content.trim()
  if (!firstUser) return "Nueva conversación"
  return firstUser.length > 46 ? `${firstUser.slice(0, 46)}…` : firstUser
}

interface AssistantState {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void

  dockMode: AssistantDockMode
  setDockMode: (mode: AssistantDockMode) => void

  floating: FloatingRect | null
  setFloating: (rect: FloatingRect) => void

  messages: AssistantMessage[]
  addMessage: (msg: AssistantMessage) => void
  patchMessage: (id: string, patch: Partial<AssistantMessage>) => void
  /** Archiva la conversación activa (si tiene mensajes) y empieza una nueva. */
  clear: () => void

  /** Contexto de la última búsqueda para acciones como "añade la primera al pipeline" */
  lastPropertyIds: string[]
  setLastPropertyIds: (ids: string[]) => void

  /** Historial de conversaciones pasadas, más reciente primero. */
  history: AssistantSession[]
  openSession: (id: string) => void
  deleteSession: (id: string) => void
  clearHistory: () => void
}

export const useAssistantStore = create<AssistantState>()(
  persist(
    (set, get) => ({
      open: false,
      setOpen: (open) => set({ open }),
      toggle: () => set((s) => ({ open: !s.open })),

      dockMode: "sidebar",
      setDockMode: (mode) => set({ dockMode: mode }),

      floating: null,
      setFloating: (rect) => set({ floating: rect }),

      messages: [],
      addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
      patchMessage: (id, patch) =>
        set((s) => ({
          messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),

      clear: () => {
        const { messages, lastPropertyIds, history } = get()
        if (messages.length === 0) return
        const archived: AssistantSession = {
          id: nextSessionId(),
          title: titleFromMessages(messages),
          updatedAt: Date.now(),
          messages,
          lastPropertyIds,
        }
        set({
          messages: [],
          lastPropertyIds: [],
          history: [archived, ...history].slice(0, 30),
        })
      },

      lastPropertyIds: [],
      setLastPropertyIds: (ids) => set({ lastPropertyIds: ids }),

      history: [],
      openSession: (id) => {
        const { messages, lastPropertyIds, history } = get()
        const target = history.find((s) => s.id === id)
        if (!target) return
        const remaining = history.filter((s) => s.id !== id)
        const restored: AssistantSession[] =
          messages.length > 0
            ? [
                {
                  id: nextSessionId(),
                  title: titleFromMessages(messages),
                  updatedAt: Date.now(),
                  messages,
                  lastPropertyIds,
                },
                ...remaining,
              ]
            : remaining
        set({
          messages: target.messages,
          lastPropertyIds: target.lastPropertyIds,
          history: restored.slice(0, 30),
        })
      },
      deleteSession: (id) =>
        set((s) => ({ history: s.history.filter((session) => session.id !== id) })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "cbr-assistant",
      partialize: (s) => ({
        dockMode: s.dockMode,
        floating: s.floating,
        history: s.history,
      }),
    }
  )
)
