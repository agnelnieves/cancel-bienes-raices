"use client"

import * as React from "react"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowRight,
  BadgeCheck,
  BadgeDollarSign,
  GitCompareArrows,
  LayoutList,
  Lightbulb,
  Map as MapIcon,
  PanelLeftClose,
  PanelLeftOpen,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react"

import {
  formatNumber,
  properties,
  propertyTypes,
  sourceMeta,
  zones,
  type PropertySource,
  type PropertyStatus,
} from "@cancel/data"
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@cancel/ui"

import { PropertyMap } from "@/components/map/property-map"
import { PropertyListItem } from "@/components/property-list-item"
import { useSavedStore } from "@/lib/stores/saved"

const ALL_SOURCES: PropertySource[] = ["cash", "mls", "registro", "crim"]

const PRICE_CAPS = [
  { value: 150000, label: "Hasta $150K" },
  { value: 250000, label: "Hasta $250K" },
  { value: 400000, label: "Hasta $400K" },
  { value: 600000, label: "Hasta $600K" },
  { value: 800000, label: "Sin límite" },
] as const

type MobilePane = "list" | "map"

function Chip({
  active,
  onClick,
  children,
  className,
}: {
  active?: boolean
  onClick?: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-medium whitespace-nowrap shadow-soft transition-colors outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring/40",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-foreground hover:border-foreground/40",
        className
      )}
    >
      {children}
    </button>
  )
}

function ComparablesInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { compareIds, clearCompare } = useSavedStore()
  const itemRefs = React.useRef(new Map<string, HTMLDivElement>())

  const [query, setQuery] = React.useState("")
  const [zoneId, setZoneId] = React.useState<string>(
    searchParams.get("zona") ?? "todas"
  )
  const [type, setType] = React.useState<string>("todos")
  const [status, setStatus] = React.useState<"todas" | PropertyStatus>("todas")
  const [maxPrice, setMaxPrice] = React.useState(800000)
  const [sources, setSources] = React.useState<PropertySource[]>(ALL_SOURCES)
  const [onlyExclusive, setOnlyExclusive] = React.useState(false)
  const [sort, setSort] = React.useState("recientes")
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [mobilePane, setMobilePane] = React.useState<MobilePane>("list")
  const [filtersOpen, setFiltersOpen] = React.useState(false)
  const [listOpen, setListOpen] = React.useState(true)

  // Draft state for the filters dialog (apply on confirm)
  const [draft, setDraft] = React.useState({
    zoneId: "todas",
    type: "todos",
    status: "todas" as "todas" | PropertyStatus,
    maxPrice: 800000,
    sources: ALL_SOURCES as PropertySource[],
    onlyExclusive: false,
    sort: "recientes",
  })

  React.useEffect(() => {
    const z = searchParams.get("zona")
    if (z) setZoneId(z)
  }, [searchParams])

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = properties.filter((p) => {
      if (zoneId !== "todas" && p.zone !== zoneId) return false
      if (type !== "todos" && p.type !== type) return false
      if (status !== "todas" && p.status !== status) return false
      if (p.price > maxPrice) return false
      if (!sources.includes(p.source)) return false
      if (onlyExclusive && p.source !== "cash") return false
      if (
        q &&
        !`${p.address} ${p.city} ${p.zipCode}`.toLowerCase().includes(q)
      )
        return false
      return true
    })
    list = [...list].sort((a, b) => {
      if (sort === "precio-asc") return a.price - b.price
      if (sort === "precio-desc") return b.price - a.price
      if (sort === "ppsf") return a.pricePerSqFt - b.pricePerSqFt
      return b.date.localeCompare(a.date)
    })
    return list
  }, [query, zoneId, type, status, maxPrice, sources, onlyExclusive, sort])

  const stats = React.useMemo(() => {
    if (!filtered.length) return null
    const medianPpsf = Math.round(
      filtered.reduce((a, p) => a + p.pricePerSqFt, 0) / filtered.length
    )
    const avgDom = Math.round(
      filtered.reduce((a, p) => a + p.daysOnMarket, 0) / filtered.length
    )
    const cashCount = filtered.filter((p) => p.source === "cash").length
    return { medianPpsf, avgDom, cashCount }
  }, [filtered])

  const activeFilterCount = [
    zoneId !== "todas",
    type !== "todos",
    status !== "todas",
    maxPrice < 800000,
    sources.length !== ALL_SOURCES.length,
    onlyExclusive,
  ].filter(Boolean).length

  const hasActiveFilters = activeFilterCount > 0 || query.trim() !== ""

  const openFiltersDialog = () => {
    setDraft({
      zoneId,
      type,
      status,
      maxPrice,
      sources: [...sources],
      onlyExclusive,
      sort,
    })
    setFiltersOpen(true)
  }

  const applyDraft = () => {
    setZoneId(draft.zoneId)
    setType(draft.type)
    setStatus(draft.status)
    setMaxPrice(draft.maxPrice)
    setSources(draft.sources)
    setOnlyExclusive(draft.onlyExclusive)
    setSort(draft.sort)
    setFiltersOpen(false)
  }

  const resetAll = () => {
    setQuery("")
    setZoneId("todas")
    setType("todos")
    setStatus("todas")
    setMaxPrice(800000)
    setSources(ALL_SOURCES)
    setOnlyExclusive(false)
    setSort("recientes")
    setDraft({
      zoneId: "todas",
      type: "todos",
      status: "todas",
      maxPrice: 800000,
      sources: ALL_SOURCES,
      onlyExclusive: false,
      sort: "recientes",
    })
  }

  const toggleSourceInDraft = (s: PropertySource) =>
    setDraft((d) => ({
      ...d,
      sources: d.sources.includes(s)
        ? d.sources.filter((x) => x !== s)
        : [...d.sources, s],
    }))

  // Preview count for dialog footer
  const draftCount = React.useMemo(() => {
    return properties.filter((p) => {
      if (draft.zoneId !== "todas" && p.zone !== draft.zoneId) return false
      if (draft.type !== "todos" && p.type !== draft.type) return false
      if (draft.status !== "todas" && p.status !== draft.status) return false
      if (p.price > draft.maxPrice) return false
      if (!draft.sources.includes(p.source)) return false
      if (draft.onlyExclusive && p.source !== "cash") return false
      return true
    }).length
  }, [draft])

  React.useEffect(() => {
    if (!selectedId) return
    itemRefs.current
      .get(selectedId)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [selectedId])

  React.useEffect(() => {
    if (selectedId && !filtered.some((p) => p.id === selectedId)) {
      setSelectedId(null)
    }
  }, [filtered, selectedId])

  return (
    <div className="relative h-full w-full">
      {/* ── Layer 0: full-bleed map ───────────────────────────────────── */}
      <PropertyMap
        className="absolute inset-0 h-full w-full"
        properties={filtered}
        selectedId={selectedId}
        boundsPadding={
          listOpen
            ? { top: 56, left: 420, right: 48, bottom: 48 }
            : { top: 56, left: 48, right: 48, bottom: 48 }
        }
        onSelect={(id) => {
          setSelectedId(id)
          if (id && window.matchMedia("(max-width: 1023px)").matches) {
            setMobilePane("map")
          }
        }}
      />

      {/* ── Layer 1: filter chips (no chrome) — map area only ─────────── */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-20 px-3 pt-3 sm:px-4 sm:pt-4 transition-[padding-left] duration-200",
          // Desktop: chips sit in the map gutter to the right of the full-height list
          // left-3 (0.75rem) + panel width + 0.5rem gap
          listOpen &&
            "lg:pl-[calc(0.75rem+min(400px,100%-1.5rem)+0.5rem)]"
        )}
      >
        <div className="pointer-events-auto flex max-w-full items-center gap-1.5">
          <div className="flex min-w-0 flex-1 items-center gap-1.5 scroll-fade-x overflow-x-auto no-scrollbar">
            {/* Desktop: list toggle at the start (where Filtros used to live) */}
            <button
              type="button"
              onClick={() => setListOpen((v) => !v)}
              className="hidden size-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-soft transition-colors hover:border-foreground/40 hover:text-foreground lg:flex"
              aria-label={listOpen ? "Ocultar lista" : "Mostrar lista"}
            >
              {listOpen ? (
                <PanelLeftClose className="size-4" />
              ) : (
                <PanelLeftOpen className="size-4" />
              )}
            </button>

            {/* Mobile: list/map switcher */}
            <div className="flex shrink-0 rounded-full border border-border bg-background p-0.5 shadow-soft lg:hidden">
              <button
                type="button"
                onClick={() => setMobilePane("list")}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full transition-colors",
                  mobilePane === "list"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                )}
                aria-label="Vista lista"
              >
                <LayoutList className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setMobilePane("map")}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full transition-colors",
                  mobilePane === "map"
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground"
                )}
                aria-label="Vista mapa"
              >
                <MapIcon className="size-3.5" />
              </button>
            </div>

            <Chip
              active={onlyExclusive || (sources.length === 1 && sources[0] === "cash")}
              onClick={() => {
                if (onlyExclusive) {
                  setOnlyExclusive(false)
                  setSources(ALL_SOURCES)
                } else {
                  setOnlyExclusive(true)
                  setSources(["cash"])
                }
              }}
            >
              <BadgeDollarSign className="size-3.5" />
              Cash deals
            </Chip>

            <Chip
              active={status === "active"}
              onClick={() =>
                setStatus((s) => (s === "active" ? "todas" : "active"))
              }
            >
              En venta
            </Chip>

            <Chip
              active={status === "sold"}
              onClick={() =>
                setStatus((s) => (s === "sold" ? "todas" : "sold"))
              }
            >
              Vendidas
            </Chip>

            <Chip
              active={maxPrice <= 250000}
              onClick={() =>
                setMaxPrice((p) => (p <= 250000 ? 800000 : 250000))
              }
            >
              ≤ $250K
            </Chip>

            <Chip
              active={type === "Casa"}
              onClick={() => setType((t) => (t === "Casa" ? "todos" : "Casa"))}
            >
              Casa
            </Chip>

            <Chip
              active={type === "Multifamiliar"}
              onClick={() =>
                setType((t) =>
                  t === "Multifamiliar" ? "todos" : "Multifamiliar"
                )
              }
            >
              Multifamiliar
            </Chip>

            <Chip
              active={type === "Apartamento"}
              onClick={() =>
                setType((t) => (t === "Apartamento" ? "todos" : "Apartamento"))
              }
            >
              Apartamento
            </Chip>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAll}
                className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full border border-border bg-background px-3 text-[12px] font-medium text-muted-foreground shadow-soft transition-colors hover:text-foreground"
              >
                <RotateCcw className="size-3" />
                Limpiar
              </button>
            )}
          </div>

          {/* Filtros at the end (where list toggle used to live) */}
          <button
            type="button"
            onClick={openFiltersDialog}
            className={cn(
              "inline-flex h-9 shrink-0 items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium shadow-soft transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
              activeFilterCount > 0
                ? "border-foreground bg-background text-foreground"
                : "border-border bg-background text-foreground hover:border-foreground/40"
            )}
          >
            <SlidersHorizontal className="size-3.5" />
            Filtros
            {activeFilterCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-[11px] font-bold text-background">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Layer 2: full-height results list ─────────────────────────── */}
      <div
        className={cn(
          "absolute z-10 flex flex-col overflow-hidden rounded-2xl border border-border bg-background/98 shadow-lift backdrop-blur-xl transition-all duration-200",
          // Desktop: full height minus corner gaps
          "lg:inset-y-3 lg:left-3 lg:w-[min(400px,calc(100%-1.5rem))]",
          listOpen ? "lg:opacity-100 lg:translate-x-0" : "lg:pointer-events-none lg:opacity-0 lg:-translate-x-2",
          // Mobile: full width under filter chips when list pane active
          mobilePane === "list"
            ? "inset-x-3 top-[4.25rem] bottom-[4.5rem] opacity-100"
            : "pointer-events-none inset-x-3 top-[4.25rem] bottom-[4.5rem] opacity-0 max-lg:hidden"
        )}
      >
        {/* List header: search + meta */}
        <div className="shrink-0 border-b border-border/70 p-3">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar dirección o pueblo…"
              className="h-9 rounded-full border-border bg-background pl-9 text-[13px]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                aria-label="Limpiar"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
            <span>
              <span className="font-semibold tabular-nums">
                {formatNumber(filtered.length)}
              </span>{" "}
              <span className="text-muted-foreground">
                {filtered.length === 1 ? "resultado" : "resultados"}
              </span>
            </span>
            {stats && (
              <>
                <span className="text-muted-foreground">
                  ${stats.medianPpsf}/pc
                </span>
                <span className="text-muted-foreground">~{stats.avgDom}d</span>
                {stats.cashCount > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cash-soft px-1.5 py-0.5 text-[10px] font-semibold text-cash">
                    <BadgeCheck className="size-3" />
                    {stats.cashCount} cash
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 scroll-fade-y overflow-y-auto overscroll-contain">
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <div
                key={p.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(p.id, el)
                  else itemRefs.current.delete(p.id)
                }}
              >
                <PropertyListItem
                  property={p}
                  selected={p.id === selectedId}
                  onSelect={(id) => {
                    setSelectedId(id)
                    if (window.matchMedia("(max-width: 1023px)").matches) {
                      setMobilePane("map")
                    }
                  }}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <span className="flex size-11 items-center justify-center rounded-xl bg-muted">
                <SearchX className="size-5 text-muted-foreground/60" />
              </span>
              <div>
                <p className="font-heading text-sm font-semibold">
                  Nada con estos filtros
                </p>
                <p className="mt-1 max-w-[220px] text-[12px] text-muted-foreground">
                  Amplía el precio, quita la zona o limpia los chips.
                </p>
              </div>
              <ul className="space-y-1.5 text-left text-[12px] text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Lightbulb
                    className="mt-0.5 size-3 shrink-0 text-primary"
                    aria-hidden
                  />
                  Prueba “Sin límite” o desactiva “Cash deals”.
                </li>
              </ul>
              <Button
                size="sm"
                variant="outline"
                className="mt-1 rounded-full"
                onClick={resetAll}
              >
                <RotateCcw className="size-3.5" />
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* ── Filters dialog (Airbnb modal) ─────────────────────────────── */}
      <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
        <DialogContent
          className="flex max-h-[min(720px,90dvh)] max-w-lg flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-lg"
          showCloseButton
        >
          <DialogHeader className="shrink-0 border-b border-border px-5 py-4">
            <DialogTitle className="text-center text-base font-semibold">
              Filtros
            </DialogTitle>
            <DialogDescription className="sr-only">
              Filtra comparables por zona, tipo, precio y fuente
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 space-y-6 scroll-fade-y overflow-y-auto px-5 py-5">
            {/* Quick amenity-style source grid */}
            <section>
              <h3 className="mb-3 text-sm font-semibold">Fuente de data</h3>
              <div className="grid grid-cols-2 gap-2">
                {ALL_SOURCES.map((s) => {
                  const on = draft.sources.includes(s)
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSourceInDraft(s)}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-colors",
                        on
                          ? s === "cash"
                            ? "border-cash/50 bg-cash-soft"
                            : "border-foreground bg-muted/40"
                          : "border-border hover:border-foreground/30"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[13px] font-semibold",
                          s === "cash" && on ? "text-cash" : "text-foreground"
                        )}
                      >
                        {sourceMeta[s].label}
                      </span>
                      <span className="text-[11px] leading-snug text-muted-foreground">
                        {s === "cash"
                          ? "Exclusivo de la red"
                          : sourceMeta[s].description.slice(0, 48) + "…"}
                      </span>
                    </button>
                  )
                })}
              </div>
              <button
                type="button"
                onClick={() =>
                  setDraft((d) => ({
                    ...d,
                    onlyExclusive: !d.onlyExclusive,
                    sources: !d.onlyExclusive ? (["cash"] as PropertySource[]) : ALL_SOURCES,
                  }))
                }
                className={cn(
                  "mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border px-3 py-2.5 text-[13px] font-semibold transition-colors",
                  draft.onlyExclusive
                    ? "border-cash bg-cash text-cash-foreground"
                    : "border-cash/35 text-cash hover:bg-cash-soft/60"
                )}
              >
                <BadgeDollarSign className="size-3.5" />
                Solo cash deals exclusivos
              </button>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold">Tipo de propiedad</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "todos", label: "Todos" },
                  ...propertyTypes.map((t) => ({ id: t, label: t })),
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDraft((d) => ({ ...d, type: opt.id }))}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                      draft.type === opt.id
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-foreground hover:border-foreground/40"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold">Estado</h3>
              <div className="flex gap-1.5 rounded-full border border-border p-1">
                {(
                  [
                    { id: "todas", label: "Todas" },
                    { id: "active", label: "En venta" },
                    { id: "sold", label: "Vendidas" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() =>
                      setDraft((d) => ({ ...d, status: opt.id }))
                    }
                    className={cn(
                      "flex-1 rounded-full px-3 py-2 text-[13px] font-medium transition-colors",
                      draft.status === opt.id
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold">Precio máximo</h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {PRICE_CAPS.map((cap) => (
                  <button
                    key={cap.value}
                    type="button"
                    onClick={() =>
                      setDraft((d) => ({ ...d, maxPrice: cap.value }))
                    }
                    className={cn(
                      "rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-colors",
                      draft.maxPrice === cap.value
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/30"
                    )}
                  >
                    {cap.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold">Zona</Label>
                <Select
                  value={draft.zoneId}
                  onValueChange={(v) =>
                    setDraft((d) => ({ ...d, zoneId: v }))
                  }
                >
                  <SelectTrigger className="h-10 w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las zonas</SelectItem>
                    {zones.map((z) => (
                      <SelectItem key={z.id} value={z.id}>
                        {z.name}, {z.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[12px] font-semibold">Ordenar</Label>
                <Select
                  value={draft.sort}
                  onValueChange={(v) => setDraft((d) => ({ ...d, sort: v }))}
                >
                  <SelectTrigger className="h-10 w-full rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recientes">Más recientes</SelectItem>
                    <SelectItem value="precio-asc">
                      Precio: menor → mayor
                    </SelectItem>
                    <SelectItem value="precio-desc">
                      Precio: mayor → menor
                    </SelectItem>
                    <SelectItem value="ppsf">Mejor $/pc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>
          </div>

          <DialogFooter className="shrink-0 flex-row items-center justify-between gap-3 border-t border-border px-5 py-4 sm:justify-between">
            <button
              type="button"
              onClick={() => {
                resetAll()
                setFiltersOpen(false)
              }}
              className="text-[13px] font-medium text-foreground underline-offset-4 hover:underline"
            >
              Limpiar todo
            </button>
            <Button
              className="rounded-full px-5"
              onClick={applyDraft}
            >
              Ver {formatNumber(draftCount)}{" "}
              {draftCount === 1 ? "resultado" : "resultados"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Compare tray */}
      {compareIds.length > 0 && (
        <div className="fixed inset-x-4 bottom-20 z-40 mx-auto flex max-w-md items-center justify-between gap-3 rounded-full border border-border bg-card/95 py-2 pr-2 pl-5 shadow-lift backdrop-blur-lg lg:bottom-5">
          <div className="flex items-center gap-2 text-sm">
            <GitCompareArrows className="size-4 text-primary" />
            <span className="font-medium">
              {compareIds.length} en el comparador
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={clearCompare}
              aria-label="Limpiar comparador"
            >
              <X className="size-4" />
            </Button>
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => router.push("/comparador")}
            >
              Comparar
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ComparablesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center bg-muted/30">
          <div className="size-8 animate-pulse rounded-full bg-muted" />
        </div>
      }
    >
      <ComparablesInner />
    </Suspense>
  )
}
