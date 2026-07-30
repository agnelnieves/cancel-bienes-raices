"use client"

import { create } from "zustand"
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

interface AssistantState {
  open: boolean
  setOpen: (open: boolean) => void
  toggle: () => void
  messages: AssistantMessage[]
  addMessage: (msg: AssistantMessage) => void
  patchMessage: (id: string, patch: Partial<AssistantMessage>) => void
  clear: () => void
  /** Contexto de la última búsqueda para acciones como "añade la primera al pipeline" */
  lastPropertyIds: string[]
  setLastPropertyIds: (ids: string[]) => void
}

export const useAssistantStore = create<AssistantState>()((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((s) => ({ open: !s.open })),
  messages: [],
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  patchMessage: (id, patch) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    })),
  clear: () => set({ messages: [], lastPropertyIds: [] }),
  lastPropertyIds: [],
  setLastPropertyIds: (ids) => set({ lastPropertyIds: ids }),
}))
