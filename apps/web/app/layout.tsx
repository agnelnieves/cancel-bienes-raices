import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"

import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
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
      <body>{children}</body>
    </html>
  )
}
