"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"

import { cn } from "@cancel/ui"

import { Assistant } from "@/components/assistant/assistant"
import { AssistantProvider, useAssistantContext } from "@/components/assistant/assistant-provider"
import { DockedAssistant } from "@/components/assistant/docked-assistant"
import { useHydrated } from "@/lib/use-hydrated"
import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
  useEffectiveSidebarCollapsed,
  useShellStore,
} from "@/lib/stores/shell"
import { useUserStore } from "@/lib/stores/user"
import { Logo } from "./logo"
import { MobileNav, Sidebar } from "./sidebar"

/** Routes that own the full content canvas (map tools, etc.) */
const FULL_BLEED = new Set(["/comparables"])

/**
 * Inset app shell — same pattern as shadcn sidebar-08:
 * outer canvas is `bg-sidebar`, desktop nav sits inset on the left,
 * and the main surface is a floating rounded panel (`SidebarInset`).
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AssistantProvider>
      <AppShellLayout>{children}</AppShellLayout>
    </AssistantProvider>
  )
}

function AppShellLayout({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated()
  const onboarded = useUserStore((s) => s.profile.onboarded)
  const pathname = usePathname()
  const router = useRouter()
  const collapsed = useEffectiveSidebarCollapsed()
  const toggleSidebar = useShellStore((s) => s.toggleSidebar)
  const { controller: assistant, isDocked } = useAssistantContext()
  const fullBleed = FULL_BLEED.has(pathname)
  const sidebarW = collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH

  React.useEffect(() => {
    if (hydrated && !onboarded) router.replace("/onboarding")
  }, [hydrated, onboarded, router, pathname])

  // ⌘B / Ctrl+B — same shortcut as shadcn SidebarProvider
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleSidebar()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [toggleSidebar])

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
    <div
      className="group/shell flex min-h-dvh w-full bg-background lg:bg-sidebar"
      data-collapsed={collapsed || undefined}
      style={
        {
          "--sidebar-w": `${sidebarW}px`,
          "--sidebar-w-expanded": `${SIDEBAR_WIDTH}px`,
          "--sidebar-w-icon": `${SIDEBAR_WIDTH_COLLAPSED}px`,
        } as React.CSSProperties
      }
    >
      <Sidebar />

      {/* SidebarInset — floating content panel on desktop */}
      <div
        className={cn(
          "relative flex min-w-0 flex-1 flex-col bg-background",
          "lg:m-2 lg:ml-0 lg:rounded-xl lg:shadow-inset-panel",
          "transition-[margin] duration-200 ease-out",
          fullBleed
            ? "h-dvh max-h-dvh overflow-hidden lg:h-[calc(100dvh-1rem)] lg:max-h-[calc(100dvh-1rem)]"
            : "min-h-dvh lg:min-h-[calc(100dvh-1rem)]"
        )}
      >
        {fullBleed ? (
          <main className="relative min-h-0 flex-1 overflow-hidden max-lg:pb-16 lg:rounded-xl">
            {children}
          </main>
        ) : (
          <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 pt-8 pb-24 sm:px-6 lg:px-8 lg:pt-10 lg:pb-12 lg:rounded-xl">
            {children}
          </main>
        )}
      </div>

      {isDocked && <DockedAssistant controller={assistant} />}

      <MobileNav />
      <Assistant />
    </div>
  )
}
