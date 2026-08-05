"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Check,
  LogOut,
  Monitor,
  Moon,
  RotateCcw,
  Settings,
  Sun,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "motion/react"
import { toast } from "sonner"

import { recentActivity } from "@cancel/data"
import {
  Avatar,
  AvatarFallback,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  cn,
} from "@cancel/ui"

import {
  BellIcon,
  ChartColumnIncreasingIcon,
  ConstructionIcon,
  CreditCardIcon,
  FolderKanbanIcon,
  GitCompareArrowsIcon,
  HammerIcon,
  HomeIcon,
  MapIcon,
  PanelLeftOpenIcon,
  SearchIcon,
  UsersIcon,
} from "@/components/icons"
import { useAssistantStore } from "@/lib/stores/assistant"
import { useSavedStore } from "@/lib/stores/saved"
import { usePipelineStore } from "@/lib/stores/pipeline"
import {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
  useShellStore,
} from "@/lib/stores/shell"
import { useUserStore } from "@/lib/stores/user"

/**
 * Jump-free rail geometry
 * ───────────────────────
 * Icons NEVER re-center or change padding. Left inset is fixed so a 20px
 * icon is optically centered in the 48px collapsed rail:
 *   (48 − 20) / 2 = 14px  →  pl-[14px]
 * Labels only use opacity + translateX (no max-width / margin layout).
 * Active chip when collapsed is an absolute 40×40 behind the icon.
 */

const SIDEBAR_EASE = [0.32, 0.72, 0, 1] as const
const SIDEBAR_MS = 0.3

/** Content width of the collapsed rail (matches SIDEBAR_WIDTH_COLLAPSED). */
const RAIL_ICON = 20
const ICON_SCALE_EXPANDED = 18 / RAIL_ICON
const ICON_SCALE_COLLAPSED = 1

function useRailMotion(collapsed: boolean) {
  const reduce = useReducedMotion()
  const spring: Transition = reduce
    ? { duration: 0 }
    : { type: "spring", duration: 0.34, bounce: 0.14 }
  const label: Transition = reduce
    ? { duration: 0 }
    : collapsed
      ? { duration: 0.18, ease: SIDEBAR_EASE }
      : { duration: 0.24, ease: SIDEBAR_EASE, delay: 0.04 }
  const width: Transition = reduce
    ? { duration: 0 }
    : { duration: SIDEBAR_MS, ease: SIDEBAR_EASE }
  return { reduce, spring, label, width }
}

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
      { href: "/comparables", label: "Comparables", icon: MapIcon },
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

/** Fixed 20px glyph; scale eases size without layout. Origin = center of icon. */
function RailIconShell({
  collapsed,
  spring,
  children,
  className,
}: {
  collapsed: boolean
  spring: Transition
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.span
      className={cn(
        "relative z-[1] inline-flex size-5 shrink-0 items-center justify-center [&>div]:flex",
        className
      )}
      initial={false}
      animate={{ scale: collapsed ? ICON_SCALE_COLLAPSED : ICON_SCALE_EXPANDED }}
      transition={spring}
      style={{ transformOrigin: "center center" }}
    >
      {children}
    </motion.span>
  )
}

/**
 * Labels: opacity + x only (no width/margin reflow).
 * Hugs the icon — no flex-1 stretch (that was pushing bottom labels around).
 */
function RailLabel({
  collapsed,
  labelTransition,
  className,
  children,
}: {
  collapsed: boolean
  labelTransition: Transition
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.span
      initial={false}
      animate={{
        opacity: collapsed ? 0 : 1,
        x: collapsed ? -8 : 0,
      }}
      transition={labelTransition}
      className={cn(
        "relative z-[1] ml-2.5 min-w-0 truncate whitespace-nowrap text-left",
        collapsed && "pointer-events-none select-none",
        className
      )}
      aria-hidden={collapsed || undefined}
    >
      {children}
    </motion.span>
  )
}

/**
 * Shared row shell — SAME geometry expanded and collapsed.
 * Icon column is always pl-[14px] + 20px glyph; labels sit immediately after.
 */
function railItemClass(active?: boolean) {
  return cn(
    "group relative flex h-10 w-full items-center justify-start overflow-hidden rounded-xl text-sm font-medium outline-none",
    "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
    "pl-[14px] pr-2.5",
    !active && "text-muted-foreground hover:text-sidebar-foreground"
  )
}

/**
 * Active highlight — full row when open; 40×40 chip behind the fixed icon
 * when closed. Position is pure CSS (no layout anim) so it can't shove icons.
 */
function RailActive({ collapsed, active }: { collapsed: boolean; active: boolean }) {
  if (!active) return null
  return (
    <span
      className={cn(
        "pointer-events-none absolute bg-sidebar-accent shadow-sm",
        collapsed
          ? "top-0 left-1 size-10 rounded-xl"
          : "inset-0 rounded-xl"
      )}
      aria-hidden
    />
  )
}

function SidebarToggle({
  collapsed,
  className,
}: {
  collapsed: boolean
  className?: string
}) {
  const toggleSidebar = useShellStore((s) => s.toggleSidebar)

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
      aria-pressed={collapsed}
      className={cn(
        "inline-flex shrink-0 items-center justify-center text-sidebar-foreground/70 outline-none transition-colors duration-150",
        "hover:bg-black/[0.06] hover:text-sidebar-foreground",
        "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        "dark:hover:bg-white/[0.08]",
        className
      )}
    >
      <PanelLeftOpenIcon
        size={18}
        className={cn(
          "[&>svg]:block transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          !collapsed && "scale-x-[-1]"
        )}
      />
    </button>
  )
}

function NavLink({
  item,
  active,
  badge,
  collapsed,
  iconMode,
  className,
  ...props
}: {
  item: NavItem
  active: boolean
  badge: number | null
  collapsed: boolean
  iconMode: boolean
  className?: string
} & Omit<React.ComponentPropsWithoutRef<typeof Link>, "href" | "children">) {
  const iconRef = React.useRef<IconHandle>(null)
  const Icon = item.icon
  const { spring, label: labelTransition } = useRailMotion(collapsed)

  const { onMouseEnter, onMouseLeave, ...rest } = props

  const link = (
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
        railItemClass(active),
        !active && "hover:bg-black/[0.04] dark:hover:bg-white/[0.05]",
        className
      )}
    >
      <RailActive collapsed={collapsed} active={active} />

      <RailIconShell collapsed={collapsed} spring={spring}>
        <Icon
          ref={iconRef}
          size={RAIL_ICON}
          className={cn(
            "pointer-events-none [&>svg]:block",
            active
              ? "text-primary"
              : "text-muted-foreground/70 group-hover:text-sidebar-foreground",
            collapsed && !active && "text-sidebar-foreground/85"
          )}
        />
      </RailIconShell>

      <RailLabel
        collapsed={collapsed}
        labelTransition={labelTransition}
        className="flex min-w-0 flex-1 items-center gap-2"
      >
        <span className="truncate">{item.label}</span>
        {badge !== null && (
          <span
            className={cn(
              "flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold tabular-nums",
              active
                ? "bg-muted text-foreground"
                : "bg-black/[0.05] text-muted-foreground dark:bg-white/10"
            )}
          >
            {badge}
          </span>
        )}
      </RailLabel>

      <AnimatePresence>
        {iconMode && badge !== null && (
          <motion.span
            key="dot"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: "spring", duration: 0.28, bounce: 0.2 }}
            className="absolute top-1.5 right-1.5 z-[1] size-2 rounded-full bg-primary ring-2 ring-sidebar"
          />
        )}
      </AnimatePresence>
    </Link>
  )

  if (!iconMode) return link

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <span className="block w-full">{link}</span>
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

export function Sidebar() {
  const pathname = usePathname()
  const collapsed = useShellStore((s) => s.sidebarCollapsed)
  const { reduce, spring, label: labelTransition, width: widthTransition } =
    useRailMotion(collapsed)
  const compareCount = useSavedStore((s) => s.compareIds.length)
  const dealsCount = usePipelineStore(
    (s) => s.deals.filter((d) => d.stage !== "cierre").length
  )

  const [iconMode, setIconMode] = React.useState(collapsed)
  React.useEffect(() => {
    if (reduce) {
      setIconMode(collapsed)
      return
    }
    if (!collapsed) {
      setIconMode(false)
      return
    }
    const t = window.setTimeout(() => setIconMode(true), SIDEBAR_MS * 1000)
    return () => window.clearTimeout(t)
  }, [collapsed, reduce])

  const badgeValue = (badge?: "deals" | "compare") => {
    if (badge === "compare") return compareCount || null
    if (badge === "deals") return dealsCount || null
    return null
  }

  const gapW = collapsed ? SIDEBAR_WIDTH_COLLAPSED + 16 : SIDEBAR_WIDTH
  const containerW = collapsed ? SIDEBAR_WIDTH_COLLAPSED + 16 : SIDEBAR_WIDTH

  return (
    <>
      <motion.div
        data-slot="sidebar-gap"
        className="hidden shrink-0 lg:block"
        initial={false}
        animate={{ width: gapW }}
        transition={widthTransition}
        aria-hidden
      />

      <motion.div
        data-slot="sidebar-container"
        data-collapsed={collapsed || undefined}
        className="fixed inset-y-0 left-0 z-30 hidden h-svh p-2 lg:flex"
        initial={false}
        animate={{ width: containerW }}
        transition={widthTransition}
      >
        <aside
          data-slot="sidebar-inner"
          className="group/sidebar flex size-full flex-col overflow-hidden text-sidebar-foreground"
        >
          {/* Brand — same fixed left geometry as nav icons */}
          <div className="relative flex h-12 w-full shrink-0 items-center overflow-hidden pl-[14px] pr-2">
            <div
              className="relative z-[1] shrink-0"
              style={{ width: RAIL_ICON, height: RAIL_ICON }}
            >
              {/* Size-10 hit area for mark/toggle, centered on the 20px icon point */}
              <div
                className="absolute top-1/2 left-1/2 size-10 -translate-x-1/2 -translate-y-1/2"
              >
                <motion.div
                  className="absolute inset-0"
                  initial={false}
                  animate={{ scale: collapsed ? 1 : 0.9 }}
                  transition={spring}
                >
                  <Link
                    href="/"
                    aria-label="Inicio"
                    tabIndex={collapsed ? -1 : undefined}
                    className={cn(
                      "flex size-full items-center justify-center rounded-xl bg-sidebar-primary font-heading text-base font-extrabold tracking-tight text-sidebar-primary-foreground outline-none transition-opacity duration-200",
                      collapsed &&
                        "group-hover/sidebar:pointer-events-none group-hover/sidebar:opacity-0"
                    )}
                  >
                    C
                  </Link>
                </motion.div>
                <SidebarToggle
                  collapsed
                  className={cn(
                    "absolute inset-0 size-full rounded-xl transition-opacity duration-200",
                    collapsed
                      ? "opacity-0 pointer-events-none group-hover/sidebar:pointer-events-auto group-hover/sidebar:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100"
                      : "pointer-events-none opacity-0"
                  )}
                />
              </div>
            </div>

            <RailLabel
              collapsed={collapsed}
              labelTransition={labelTransition}
              className="flex min-w-0 flex-1 items-center justify-between gap-2"
            >
              <span className="truncate font-heading text-[17px] font-bold tracking-tight">
                Cancel
                <span className="text-primary">.</span>
              </span>
              <motion.span
                initial={false}
                animate={{
                  opacity: collapsed ? 0 : 1,
                  x: collapsed ? 6 : 0,
                }}
                transition={labelTransition}
                className="shrink-0"
              >
                <SidebarToggle
                  collapsed={false}
                  className="size-8 rounded-lg"
                />
              </motion.span>
            </RailLabel>
          </div>

          <nav className="flex min-h-0 flex-1 flex-col gap-px overflow-x-hidden overflow-y-auto scroll-fade-y py-1">
            {sections.flatMap((section) =>
              section.items.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href)
                const badge = badgeValue(item.badge)

                return (
                  <div key={item.href} className="w-full">
                    <NavLink
                      item={item}
                      active={active}
                      badge={badge}
                      collapsed={collapsed}
                      iconMode={iconMode}
                    />
                  </div>
                )
              })
            )}
          </nav>

          <SidebarAccount
            collapsed={collapsed}
            iconMode={iconMode}
            spring={spring}
            labelTransition={labelTransition}
          />
        </aside>
      </motion.div>
    </>
  )
}

const activityDot: Record<string, string> = {
  cash: "bg-cash",
  comparable: "bg-info",
  deal: "bg-primary",
  sistema: "bg-muted-foreground/40",
}

function SidebarAccount({
  collapsed,
  iconMode,
  spring,
  labelTransition,
}: {
  collapsed: boolean
  iconMode: boolean
  spring: Transition
  labelTransition: Transition
}) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const openAssistant = useAssistantStore((s) => s.setOpen)
  const profile = useUserStore((s) => s.profile)
  const resetUser = useUserStore((s) => s.reset)

  const bellRef = React.useRef<IconHandle>(null)
  const searchRef = React.useRef<IconHandle>(null)

  const firstName = profile.name.split(" ")[0] || "Cuenta"
  const initials =
    profile.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "TU"

  const resetDemo = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("cbr-"))
      .forEach((k) => localStorage.removeItem(k))
    toast.success("Demo restablecido")
    resetUser()
    setTimeout(() => window.location.reload(), 400)
  }

  const wrapTooltip = (label: string, node: React.ReactNode) => {
    if (!iconMode || !collapsed) return node
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <span className="block w-full">{node}</span>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={12}
          className="z-[100] border-0 bg-foreground text-background shadow-soft"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  const itemClass = cn(
    railItemClass(false),
    "hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
  )

  const iconClass =
    "pointer-events-none text-muted-foreground/70 group-hover:text-sidebar-foreground [&>svg]:block"

  const themeOptions = [
    { id: "light" as const, label: "Claro", icon: Sun },
    { id: "dark" as const, label: "Oscuro", icon: Moon },
    { id: "system" as const, label: "Sistema", icon: Monitor },
  ]

  return (
    <div className="mt-auto shrink-0 space-y-px border-t border-sidebar-border/60 pt-2 pb-1">
      {/* Notifications */}
      {wrapTooltip(
        "Notificaciones",
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={itemClass}
              aria-label="Notificaciones"
              onMouseEnter={() => bellRef.current?.startAnimation()}
              onMouseLeave={() => bellRef.current?.stopAnimation()}
            >
              <RailIconShell collapsed={collapsed} spring={spring}>
                <span className="relative inline-flex">
                  <BellIcon
                    ref={bellRef}
                    size={RAIL_ICON}
                    className={iconClass}
                  />
                  <span className="absolute top-0 right-0 size-1.5 rounded-full bg-primary ring-2 ring-sidebar" />
                </span>
              </RailIconShell>
              <RailLabel
                collapsed={collapsed}
                labelTransition={labelTransition}
              >
                Notificaciones
              </RailLabel>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="right"
            align="end"
            sideOffset={12}
            className="w-80"
          >
            <DropdownMenuLabel>Actividad reciente</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {recentActivity.slice(0, 5).map((a) => (
              <DropdownMenuItem
                key={a.id}
                className="flex items-start gap-2.5 py-2.5"
              >
                <span
                  className={cn(
                    "mt-1.5 size-1.5 shrink-0 rounded-full",
                    activityDot[a.type] ?? "bg-muted-foreground/40"
                  )}
                />
                <span className="min-w-0">
                  <span className="block truncate text-[13px]">
                    {a.message}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {a.time}
                  </span>
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Copiloto */}
      {wrapTooltip(
        "Copiloto (⌘K)",
        <button
          type="button"
          onClick={() => openAssistant(true)}
          className={itemClass}
          aria-label="Pregúntale al copiloto"
          onMouseEnter={() => searchRef.current?.startAnimation()}
          onMouseLeave={() => searchRef.current?.stopAnimation()}
        >
          <RailIconShell collapsed={collapsed} spring={spring}>
            <SearchIcon
              ref={searchRef}
              size={RAIL_ICON}
              className={iconClass}
            />
          </RailIconShell>
          <RailLabel collapsed={collapsed} labelTransition={labelTransition}>
            <span className="inline-flex items-center gap-2">
              Copiloto
              <kbd className="hidden rounded border border-border bg-muted/80 px-1.5 py-px text-[10px] font-medium text-muted-foreground xl:inline">
                ⌘K
              </kbd>
            </span>
          </RailLabel>
        </button>
      )}

      {/* Account — ChatGPT/Grok: larger avatar, menu opens upward */}
      {wrapTooltip(
        profile.name || firstName,
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Cuenta"
              className={cn(
                "group relative flex w-full items-center justify-start overflow-hidden rounded-xl text-left outline-none",
                "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                "hover:bg-black/[0.04] dark:hover:bg-white/[0.05]",
                // Larger hit row; pad so 32px avatar centers in 48px collapsed rail
                "h-12 pl-2 pr-2.5"
              )}
            >
              <motion.span
                className="relative z-[1] shrink-0"
                initial={false}
                animate={{ scale: 1 }}
                transition={spring}
              >
                <Avatar className="size-8 border border-border shadow-sm">
                  <AvatarFallback className="bg-primary/15 text-[11px] font-bold text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </motion.span>

              <RailLabel
                collapsed={collapsed}
                labelTransition={labelTransition}
                className="flex min-w-0 flex-col items-start justify-center gap-0 leading-tight"
              >
                <span className="w-full truncate text-sm font-medium text-foreground">
                  {profile.name || firstName}
                </span>
                <span className="w-full truncate text-[11px] text-muted-foreground">
                  Cuenta demo
                </span>
              </RailLabel>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            align="start"
            sideOffset={8}
            alignOffset={0}
            className="w-56"
          >
            <div className="px-2 py-2">
              <p className="mb-2 px-1 text-[11px] font-medium text-muted-foreground">
                Tema
              </p>
              <div
                className="grid grid-cols-3 gap-1"
                role="group"
                aria-label="Tema"
              >
                {themeOptions.map((opt) => {
                  const active = theme === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTheme(opt.id)}
                      aria-pressed={active}
                      className={cn(
                        "relative flex flex-col items-center gap-1 rounded-lg border px-1.5 py-2 text-[11px] font-medium transition-colors",
                        active
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {active && (
                        <span className="absolute top-1 right-1 flex size-3.5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-2" />
                        </span>
                      )}
                      <opt.icon className="size-3.5" />
                      {opt.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/configuracion")}>
              <Settings className="size-4" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuItem onClick={resetDemo}>
              <RotateCcw className="size-4" />
              Restablecer demo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={resetDemo}>
              <LogOut className="size-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

const mobileItems: {
  href: string
  label: string
  icon: AnimatedIcon
  exact?: boolean
}[] = [
  { href: "/", label: "Inicio", icon: HomeIcon, exact: true },
  { href: "/comparables", label: "Comparables", icon: MapIcon },
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
