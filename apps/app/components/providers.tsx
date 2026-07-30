"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "sonner"

import { TooltipProvider } from "@cancel/ui"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      <Toaster position="bottom-left" richColors closeButton />
    </ThemeProvider>
  )
}
