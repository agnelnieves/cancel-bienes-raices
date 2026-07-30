"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  Calculator,
  GitCompareArrows,
  HardHat,
  Home,
  KanbanSquare,
  Landmark,
  Ruler,
  Search,
  Users,
} from "lucide-react"

import { cn } from "@cancel/ui"

import { useSavedStore } from "@/lib/stores/saved"
import { usePipelineStore } from "@/lib/stores/pipeline"
import { Logo } from "./logo"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  exact?: boolean
  badge?: "deals" | "compare"
}

const sections: { label: string; items: NavItem[] }[] = [
  {
    label: "Analizar",
    items: [
      { href: "/", label: "Inicio", icon: Home, exact: true },
      { href: "/comparables", label: "Comparables", icon: Search },
      { href: "/calculadora", label: "Calculadora ROI", icon: Calculator },
      { href: "/estimador", label: "Estimador", icon: Ruler },
    ],
  },
  {
    label: "Tu portafolio",
    items: [
      { href: "/deals", label: "Deal Tracker", icon: KanbanSquare, badge: "deals" },
      { href: "/comparador", label: "Comparador", icon: GitCompareArrows, badge: "compare" },
      { href: "/credito", label: "Crédito", icon: Landmark },
    ],
  },
  {
    label: "Red verificada",
    items: [{ href: "/contratistas", label: "Contratistas", icon: HardHat }],
  },
  {
    label: "Comunidad",
    items: [{ href: "/comunidad", label: "Comunidad", icon: Users }],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const compareCount = useSavedStore((s) => s.compareIds.length)
  const dealsCount = usePipelineStore(
    (s) => s.deals.filter((d) => d.stage !== "cierre").length
  )

  const badgeValue = (badge?: "deals" | "compare") => {
    if (badge === "compare") return compareCount || null
    if (badge === "deals") return dealsCount || null
    return null
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center px-5">
        <Link href="/" aria-label="Inicio">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-2">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="mb-1.5 px-2.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
                const badge = badgeValue(item.badge)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "size-4 shrink-0",
                        active ? "text-primary" : "text-muted-foreground/70 group-hover:text-foreground"
                      )}
                    />
                    <span className="flex-1 truncate">{item.label}</span>
                    {badge !== null && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/12 px-1.5 text-[10px] font-semibold text-primary">
                        {badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-xl bg-sidebar-accent/60 p-3">
          <div className="flex items-center gap-2">
            <Building2 className="size-3.5 text-primary" />
            <p className="text-[11px] font-semibold">Data exclusiva</p>
          </div>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            23 cash deals reportados este mes por la red de realtors.
          </p>
        </div>
      </div>
    </aside>
  )
}

const mobileItems = [
  { href: "/", label: "Inicio", icon: Home, exact: true },
  { href: "/comparables", label: "Comparables", icon: Search },
  { href: "/deals", label: "Deals", icon: KanbanSquare },
  { href: "/contratistas", label: "Contratistas", icon: HardHat },
  { href: "/comunidad", label: "Comunidad", icon: Users },
]

export function MobileNav() {
  const pathname = usePathname()
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-lg lg:hidden">
      <div className="grid grid-cols-5">
        {mobileItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
