"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2 } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from "@cancel/ui"

import {
  ChartColumnIncreasingIcon,
  ConstructionIcon,
  CreditCardIcon,
  FolderKanbanIcon,
  GitCompareArrowsIcon,
  HammerIcon,
  HomeIcon,
  SearchIcon,
  UsersIcon,
} from "@/components/icons"
import { useSavedStore } from "@/lib/stores/saved"
import { usePipelineStore } from "@/lib/stores/pipeline"
import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
  useShellStore,
} from "@/lib/stores/shell"
import { Logo } from "./logo"

type IconHandle = {
  startAnimation: () => void
  stopAnimation: () => void
}

type AnimatedIcon = React.ForwardRefExoticComponent<
  {
    size?: number
    className?: string
  } & React.RefAttributes<IconHandle> &
    React.HTMLAttributes<HTMLDivElement>
>

interface NavItem {
  href: string
  label: string
  icon: AnimatedIcon
  exact?: boolean
  badge?: "deals" | "compare"
}

const sections: { label: string; items: NavItem[] }[] = [
  {
    label: "Analizar",
    items: [
      { href: "/", label: "Inicio", icon: HomeIcon, exact: true },
      { href: "/comparables", label: "Comparables", icon: SearchIcon },
      {
        href: "/calculadora",
        label: "Calculadora ROI",
        icon: ChartColumnIncreasingIcon,
      },
      { href: "/estimador", label: "Estimador", icon: HammerIcon },
    ],
  },
  {
    label: "Tu portafolio",
    items: [
      {
        href: "/deals",
        label: "Deal Tracker",
        icon: FolderKanbanIcon,
        badge: "deals",
      },
      {
        href: "/comparador",
        label: "Comparador",
        icon: GitCompareArrowsIcon,
        badge: "compare",
      },
      { href: "/credito", label: "Crédito", icon: CreditCardIcon },
    ],
  },
  {
    label: "Red verificada",
    items: [
      { href: "/contratistas", label: "Contratistas", icon: ConstructionIcon },
    ],
  },
  {
    label: "Comunidad",
    items: [{ href: "/comunidad", label: "Comunidad", icon: UsersIcon }],
  },
]

function NavLink({
  item,
  active,
  badge,
  collapsed,
  className,
  ...props
}: {
  item: NavItem
  active: boolean
  badge: number | null
  collapsed: boolean
} & Omit<React.ComponentPropsWithoutRef<typeof Link>, "href" | "children">) {
  const iconRef = React.useRef<IconHandle>(null)
  const Icon = item.icon

  const { onMouseEnter, onMouseLeave, ...rest } = props

  return (
    <Link
      href={item.href}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      {...rest}
      onMouseEnter={(e) => {
        iconRef.current?.startAnimation()
        onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        iconRef.current?.stopAnimation()
        onMouseLeave?.(e)
      }}
      className={cn(
        "group relative flex items-center rounded-lg text-[13px] font-medium transition-[background-color,box-shadow,color] duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        collapsed ? "size-9 justify-center" : "w-full gap-2.5 px-2.5 py-[7px]",
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
          : "text-muted-foreground hover:bg-black/[0.04] hover:text-sidebar-foreground dark:hover:bg-white/[0.05]",
        className
      )}
    >
      <Icon
        ref={iconRef}
        size={15}
        className={cn(
          "pointer-events-none shrink-0 [&>svg]:block",
          active
            ? "text-primary"
            : "text-muted-foreground/70 group-hover:text-sidebar-foreground"
        )}
      />
      {!collapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {badge !== null && (
            <span
              className={cn(
                "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold tabular-nums",
                active
                  ? "bg-muted text-foreground"
                  : "bg-black/[0.05] text-muted-foreground dark:bg-white/10"
              )}
            >
              {badge}
            </span>
          )}
        </>
      )}
      {collapsed && badge !== null && (
        <span className="absolute top-1.5 right-1.5 flex size-1.5 rounded-full bg-primary" />
      )}
    </Link>
  )
}

/** Collapsed rail item — span trigger is reliable with Radix + Next Link */
function CollapsedNavItem({
  item,
  active,
  badge,
}: {
  item: NavItem
  active: boolean
  badge: number | null
}) {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <span className="inline-flex">
          <NavLink item={item} active={active} badge={badge} collapsed />
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="right"
        sideOffset={12}
        className="z-[100] border-0 bg-foreground text-background shadow-soft"
      >
        {item.label}
        {badge !== null ? ` (${badge})` : ""}
      </TooltipContent>
    </Tooltip>
  )
}

/**
 * Desktop sidebar — inset variant (shadcn sidebar-08).
 * Sits on the warm `bg-sidebar` canvas; the main panel floats beside it.
 * Collapses to icon rail via shell store (persisted).
 */
export function Sidebar() {
  const pathname = usePathname()
  const collapsed = useShellStore((s) => s.sidebarCollapsed)
  const compareCount = useSavedStore((s) => s.compareIds.length)
  const dealsCount = usePipelineStore(
    (s) => s.deals.filter((d) => d.stage !== "cierre").length
  )

  const badgeValue = (badge?: "deals" | "compare") => {
    if (badge === "compare") return compareCount || null
    if (badge === "deals") return dealsCount || null
    return null
  }

  // Expanded: gap = sidebar width (p-2 lives inside). Collapsed icon mode:
  // gap/container grow by the horizontal padding so the rail stays comfortable.
  const gapW = collapsed ? SIDEBAR_WIDTH_COLLAPSED + 16 : SIDEBAR_WIDTH
  const containerW = collapsed ? SIDEBAR_WIDTH_COLLAPSED + 16 : SIDEBAR_WIDTH

  return (
    <>
      {/* Layout spacer — reserves space next to the floating inset panel */}
      <div
        data-slot="sidebar-gap"
        className="hidden shrink-0 transition-[width] duration-200 ease-out lg:block"
        style={{ width: gapW }}
        aria-hidden
      />

      {/* Fixed sidebar on the canvas */}
      <div
        data-slot="sidebar-container"
        data-collapsed={collapsed || undefined}
        className="fixed inset-y-0 left-0 z-30 hidden h-svh p-2 transition-[width] duration-200 ease-out lg:flex"
        style={{ width: containerW }}
      >
        <aside
          data-slot="sidebar-inner"
          className="flex size-full flex-col text-sidebar-foreground"
        >
          {/* Header — brand */}
          <div
            className={cn(
              "flex h-12 shrink-0 items-center",
              collapsed ? "justify-center px-0" : "px-2"
            )}
          >
            <Link href="/" aria-label="Inicio" className="outline-none">
              {collapsed ? (
                <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary font-heading text-[15px] font-extrabold tracking-tight text-sidebar-primary-foreground">
                  C
                </span>
              ) : (
                <Logo />
              )}
            </Link>
          </div>

          {/* Content — nav groups */}
          <nav
            className={cn(
              "flex min-h-0 flex-1 flex-col scroll-fade-y overflow-y-auto py-1",
              collapsed
                ? "items-center gap-1 overflow-x-visible px-0"
                : "gap-5 overflow-x-hidden px-1"
            )}
          >
            {sections.map((section) => (
              <div
                key={section.label}
                className={cn(
                  "flex flex-col",
                  collapsed ? "w-full items-center gap-1" : "gap-1"
                )}
              >
                {!collapsed && (
                  <p className="mb-0.5 px-2.5 text-[10px] font-medium tracking-[0.08em] text-muted-foreground/80 uppercase">
                    {section.label}
                  </p>
                )}
                {collapsed && section !== sections[0] && (
                  <div className="mx-auto my-1 h-px w-6 bg-sidebar-border" />
                )}
                <ul
                  className={cn(
                    "flex flex-col",
                    collapsed ? "w-full items-center gap-1" : "gap-px"
                  )}
                >
                  {section.items.map((item) => {
                    const active = item.exact
                      ? pathname === item.href
                      : pathname.startsWith(item.href)
                    const badge = badgeValue(item.badge)

                    return (
                      <li
                        key={item.href}
                        className={collapsed ? "flex justify-center" : "w-full"}
                      >
                        {collapsed ? (
                          <CollapsedNavItem
                            item={item}
                            active={active}
                            badge={badge}
                          />
                        ) : (
                          <NavLink
                            item={item}
                            active={active}
                            badge={badge}
                            collapsed={false}
                          />
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer — exclusive data blurb when expanded */}
          {!collapsed && (
            <div className="shrink-0 p-2 pt-1">
              <div className="rounded-xl bg-sidebar-accent/80 px-3 py-2.5 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <Building2 className="size-3 text-primary" />
                  <p className="text-[11px] font-semibold">Data exclusiva</p>
                </div>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
                  23 cash deals reportados este mes por la red de realtors.
                </p>
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}

const mobileItems: {
  href: string
  label: string
  icon: AnimatedIcon
  exact?: boolean
}[] = [
  { href: "/", label: "Inicio", icon: HomeIcon, exact: true },
  { href: "/comparables", label: "Comparables", icon: SearchIcon },
  { href: "/deals", label: "Deals", icon: FolderKanbanIcon },
  { href: "/contratistas", label: "Contratistas", icon: ConstructionIcon },
  { href: "/comunidad", label: "Comunidad", icon: UsersIcon },
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
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon size={20} className="[&>svg]:block" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
