"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface UserProfile {
  name: string
  experience: "novato" | "intermedio" | "avanzado" | null
  strategies: string[]
  zones: string[]
  budget: string | null
  capital: string | null
  onboarded: boolean
}

const emptyProfile: UserProfile = {
  name: "",
  experience: null,
  strategies: [],
  zones: [],
  budget: null,
  capital: null,
  onboarded: false,
}

interface UserState {
  profile: UserProfile
  setProfile: (patch: Partial<UserProfile>) => void
  completeOnboarding: (data: Omit<UserProfile, "onboarded">) => void
  reset: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      profile: emptyProfile,
      setProfile: (patch) =>
        set((s) => ({ profile: { ...s.profile, ...patch } })),
      completeOnboarding: (data) =>
        set({ profile: { ...data, onboarded: true } }),
      reset: () => set({ profile: emptyProfile }),
    }),
    { name: "cbr-user" }
  )
)
