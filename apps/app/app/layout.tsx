import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"

import { Providers } from "@/components/providers"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
})

export const metadata: Metadata = {
  title: "Cancel — Plataforma de inversión",
  description:
    "Comparables, calculadora de ROI, deal tracker y más — con data exclusiva de Puerto Rico.",
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning className={jakarta.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
