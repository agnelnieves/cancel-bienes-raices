"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import { Assistant } from "@/components/assistant/assistant"
import { useHydrated } from "@/lib/use-hydrated"
import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
  useShellStore,
} from "@/lib/stores/shell"
import { useUserStore } from "@/lib/stores/user"
import { Header } from "./header"
import { Logo } from "./logo"
import { MobileNav, Sidebar } from "./sidebar"

/** Routes that own the full content canvas (map tools, etc.) */
const FULL_BLEED = new Set(["/comparables"])

export function AppShell({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated()
  const onboarded = useUserStore((s) => s.profile.onboarded)
  const pathname = usePathname()
  const router = useRouter()
  const collapsed = useShellStore((s) => s.sidebarCollapsed)
  const fullBleed = FULL_BLEED.has(pathname)
  const sidebarW = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH

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
      <div
        className="transition-[padding] duration-200 ease-out lg:pl-[var(--sidebar-w)]"
        style={
          {
            "--sidebar-w": `${sidebarW}px`,
          } as React.CSSProperties
        }
      >
        <Header />
        {fullBleed ? (
          <main className="relative h-[calc(100dvh-3.5rem)] overflow-hidden pb-[env(safe-area-inset-bottom)] max-lg:pb-16">
            {children}
          </main>
        ) : (
          <main className="mx-auto w-full max-w-[1200px] px-4 pt-6 pb-24 sm:px-6 lg:px-8 lg:pb-12">
            {children}
          </main>
        )}
      </div>
      <MobileNav />
      <Assistant />
    </div>
  )
}
