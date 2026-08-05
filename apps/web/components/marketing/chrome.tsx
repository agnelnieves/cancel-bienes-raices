"use client"

import * as React from "react"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowRight, Menu, X } from "lucide-react"

import { Button, cn } from "@cancel/ui"

import { links } from "@/lib/config"
import { Logo } from "./logo"
import { duration, easeVaul } from "./motion"

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
  const reduce = useReducedMotion()

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto transition-[max-width,padding] duration-300 ease-out",
          scrolled ? "max-w-5xl px-3 pt-3 sm:px-4" : "max-w-6xl px-4 pt-0 sm:px-6"
        )}
      >
        <div
          className={cn(
            "transition-all duration-300",
            scrolled || open
              ? "rounded-[22px] border border-border/70 bg-background/90 shadow-soft backdrop-blur-xl"
              : "bg-transparent"
          )}
        >
          <div
            className={cn(
              "flex h-14 items-center justify-between",
              scrolled || open ? "px-3 sm:px-4" : ""
            )}
          >
            <Link
              href="/"
              aria-label="Cancel Bienes Raíces"
              className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              onClick={() => setOpen(false)}
            >
              <Logo />
            </Link>

            <nav className="hidden items-center gap-0.5 md:flex">
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors duration-150 hover:bg-muted/80 hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-1.5 md:flex">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full px-3.5"
                asChild
              >
                <a href={links.login}>Entrar</a>
              </Button>
              <Button size="sm" className="rounded-full gap-1.5 px-4" asChild>
                <a href={links.signup}>
                  Comenzar gratis
                  <ArrowRight className="size-3.5 transition-transform duration-150 group-hover/button:translate-x-0.5" />
                </a>
              </Button>
            </div>

            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  duration: reduce ? duration.fast : 0.28,
                  ease: easeVaul,
                }}
                className="overflow-hidden md:hidden"
              >
                <div className="space-y-0.5 border-t border-border/60 px-2 py-2 sm:px-3">
                  {NAV.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3.5 py-3 text-[15px] font-medium text-foreground/90 transition-colors hover:bg-muted"
                    >
                      {item.label}
                    </a>
                  ))}
                  <div className="flex gap-2 px-1.5 pt-2 pb-2">
                    <Button
                      variant="outline"
                      className="flex-1 rounded-full"
                      asChild
                    >
                      <a href={links.login}>Entrar</a>
                    </Button>
                    <Button className="flex-1 rounded-full" asChild>
                      <a href={links.signup}>Comenzar gratis</a>
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-sidebar">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col justify-between gap-12 md:flex-row md:gap-16">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-[13.5px] leading-relaxed text-muted-foreground">
              Comparables reales y herramientas de inversión para el
              inversionista latino. Hecha en Puerto Rico, para Puerto Rico.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-14">
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
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border/70 pt-6 text-[11.5px] text-muted-foreground sm:flex-row">
          <p>© 2026 Cancel Bienes Raíces.</p>
          <p className="text-center sm:text-right">
            Data con fines educativos. No constituye consejo financiero ni de
            inversión.
          </p>
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
      <p className="text-[13px] font-semibold tracking-tight text-foreground">
        {title}
      </p>
      <ul className="mt-3.5 space-y-2.5">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="text-[13.5px] text-muted-foreground transition-colors duration-150 hover:text-foreground"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
