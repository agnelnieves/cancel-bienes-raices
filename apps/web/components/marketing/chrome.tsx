"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Menu, X } from "lucide-react"

import { Button, cn } from "@cancel/ui"

import { links } from "@/lib/config"
import { Logo } from "./logo"

const NAV = [
  { href: "#herramientas", label: "Herramientas" },
  { href: "#copiloto", label: "Copiloto" },
  { href: "#data", label: "La data" },
  { href: "#precios", label: "Precios" },
  { href: "#faq", label: "FAQ" },
]

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/85 backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="Cancel Bienes Raíces">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[13.5px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <a href={links.login}>Entrar</a>
          </Button>
          <Button size="sm" asChild>
            <a href={links.signup}>
              Comenzar gratis
              <ArrowRight className="size-3.5" />
            </a>
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menú"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-b border-border bg-background/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-4">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" asChild>
                <a href={links.login}>Entrar</a>
              </Button>
              <Button className="flex-1" asChild>
                <a href={links.signup}>Comenzar gratis</a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">
              La plataforma de comparables y herramientas de inversión para el
              inversionista latino. Hecha en Puerto Rico, para Puerto Rico. 🇵🇷
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <FooterCol
              title="Producto"
              items={[
                { label: "Herramientas", href: "#herramientas" },
                { label: "Copiloto AI", href: "#copiloto" },
                { label: "Precios", href: "#precios" },
              ]}
            />
            <FooterCol
              title="Comunidad"
              items={[
                { label: "Cancel Bienes Raíces", href: "#" },
                { label: "YouTube", href: "#" },
                { label: "Instagram", href: "#" },
              ]}
            />
            <FooterCol
              title="Legal"
              items={[
                { label: "Términos", href: "#" },
                { label: "Privacidad", href: "#" },
              ]}
            />
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-[11px] text-muted-foreground">
          © 2026 Cancel Bienes Raíces. Data con fines educativos — no constituye
          consejo financiero ni de inversión.
        </div>
      </div>
    </footer>
  )
}

function FooterCol({
  title,
  items,
}: {
  title: string
  items: { label: string; href: string }[]
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-wide text-foreground uppercase">
        {title}
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
