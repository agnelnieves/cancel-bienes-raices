"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import { Assistant } from "@/components/assistant/assistant"
import { useHydrated } from "@/lib/use-hydrated"
import { useUserStore } from "@/lib/stores/user"
import { Header } from "./header"
import { Logo } from "./logo"
import { MobileNav, Sidebar } from "./sidebar"

export function AppShell({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated()
  const onboarded = useUserStore((s) => s.profile.onboarded)
  const pathname = usePathname()
  const router = useRouter()

  React.useEffect(() => {
    if (hydrated && !onboarded) router.replace("/onboarding")
  }, [hydrated, onboarded, router, pathname])

  if (!hydrated || !onboarded) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Logo />
          <div className="flex gap-1">
            <span className="size-1.5 rounded-full bg-primary animate-typing" />
            <span className="size-1.5 rounded-full bg-primary animate-typing [animation-delay:150ms]" />
            <span className="size-1.5 rounded-full bg-primary animate-typing [animation-delay:300ms]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-background">
      <Sidebar />
      <div className="lg:pl-60">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 pt-6 pb-24 sm:px-6 lg:pb-10">
          {children}
        </main>
      </div>
      <MobileNav />
      <Assistant />
    </div>
  )
}
