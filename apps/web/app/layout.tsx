import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"

import { SmoothScroll } from "@/components/marketing/smooth-scroll"

import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Cancel Bienes Raíces — Data real para invertir en Puerto Rico",
  description:
    "Comparables reales, incluyendo ventas en efectivo que no aparecen en ningún otro sistema. Herramientas de inversión para el inversionista latino en Puerto Rico.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={jakarta.variable}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
