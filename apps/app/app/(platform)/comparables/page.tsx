"use client"

import * as React from "react"
import { Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowRight,
  BadgeCheck,
  BadgeDollarSign,
  GitCompareArrows,
  Lightbulb,
  Map as MapIcon,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react"

import {
  formatCompact,
  properties,
  propertyTypes,
  sourceMeta,
  zones,
  type PropertySource,
  type PropertyStatus,
} from "@cancel/data"
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  cn,
} from "@cancel/ui"

import { PropertyMap } from "@/components/map/property-map"
import { PropertyCard } from "@/components/property-card"
import { useSavedStore } from "@/lib/stores/saved"

const ALL_SOURCES: PropertySource[] = ["cash", "mls", "registro", "crim"]

function ComparablesInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { compareIds, clearCompare } = useSavedStore()

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
  const [showMap, setShowMap] = React.useState(true)
  const [showFilters, setShowFilters] = React.useState(false)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

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

  const toggleSource = (s: PropertySource) =>
    setSources((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]
    )

  const hasActiveFilters =
    query.trim() !== "" ||
    zoneId !== "todas" ||
    type !== "todos" ||
    status !== "todas" ||
    maxPrice < 800000 ||
    sources.length !== ALL_SOURCES.length ||
    onlyExclusive

  const resetFilters = () => {
    setQuery("")
    setZoneId("todas")
    setType("todos")
    setStatus("todas")
    setMaxPrice(800000)
    setSources(ALL_SOURCES)
    setOnlyExclusive(false)
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Búsqueda + filtros guiados */}
      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Dirección, zona o pueblo… ej. Santurce, 00911, Calle Loíza"
                className="h-11 rounded-full pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="lg"
              className="lg:hidden"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="size-4" />
              Filtros
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="hidden sm:inline-flex"
              onClick={() => setShowMap((v) => !v)}
            >
              <MapIcon className="size-4" />
              {showMap ? "Ocultar mapa" : "Ver mapa"}
            </Button>
          </div>

          <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-5", !showFilters && "max-lg:hidden")}>
            <div className="space-y-1.5">
              <Label className="text-[11px]">¿En qué zona?</Label>
              <Select value={zoneId} onValueChange={setZoneId}>
                <SelectTrigger className="w-full">
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
              <Label className="text-[11px]">Tipo de propiedad</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  {propertyTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px]">Estado</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as typeof status)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Vendidas + en venta</SelectItem>
                  <SelectItem value="sold">Solo vendidas</SelectItem>
                  <SelectItem value="active">Solo en venta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px]">
                Precio máximo · {formatCompact(maxPrice)}
              </Label>
              <Slider
                value={[maxPrice]}
                onValueChange={([v]) => setMaxPrice(v)}
                min={50000}
                max={800000}
                step={10000}
                className="py-2.5"
                aria-label="Precio máximo"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px]">Ordenar por</Label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recientes">Más recientes</SelectItem>
                  <SelectItem value="precio-asc">Precio: menor a mayor</SelectItem>
                  <SelectItem value="precio-desc">Precio: mayor a menor</SelectItem>
                  <SelectItem value="ppsf">Mejor $/pc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Fuentes — de dónde sale la data */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-muted-foreground">
              De dónde sale la data:
            </span>
            {ALL_SOURCES.map((s) => (
              <button
                key={s}
                onClick={() => toggleSource(s)}
                aria-pressed={sources.includes(s)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                  sources.includes(s)
                    ? s === "cash"
                      ? "border-cash/40 bg-cash-soft text-cash"
                      : "border-border bg-muted text-foreground"
                    : "border-border text-muted-foreground/60 hover:text-muted-foreground"
                )}
              >
                {s === "cash" && sources.includes(s) && (
                  <BadgeCheck className="size-3" aria-hidden />
                )}
                {sourceMeta[s].label}
              </button>
            ))}
            <button
              onClick={() => setOnlyExclusive((v) => !v)}
              aria-pressed={onlyExclusive}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/40 max-sm:w-full max-sm:justify-center sm:ml-auto",
                onlyExclusive
                  ? "border-cash bg-cash text-cash-foreground"
                  : "border-cash/40 text-cash hover:bg-cash-soft/60"
              )}
            >
              <BadgeDollarSign className="size-3" aria-hidden />
              Solo cash deals exclusivos
            </button>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                <RotateCcw className="size-3" aria-hidden />
                Limpiar filtros
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mapa */}
      {showMap && (
        <PropertyMap
          className="h-[340px] sm:h-[400px]"
          properties={filtered}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
        />
      )}

      {/* Lo que encontré — resumen en palabras sencillas */}
      {filtered.length > 0 && stats && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm shadow-card">
          <span className="font-semibold">
            {filtered.length}{" "}
            <span className="font-normal text-muted-foreground">
              {filtered.length === 1
                ? "propiedad encontrada"
                : "propiedades encontradas"}
            </span>
          </span>
          <span className="text-muted-foreground">
            Precio típico{" "}
            <span className="font-medium text-foreground">
              ${stats.medianPpsf}/pc
            </span>
          </span>
          <span className="text-muted-foreground">
            Se venden en{" "}
            <span className="font-medium text-foreground">
              ~{stats.avgDom} días
            </span>
          </span>
          {stats.cashCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cash/30 bg-cash-soft px-2.5 py-1 text-xs font-semibold text-cash">
              <BadgeCheck className="size-3.5" aria-hidden />
              {stats.cashCount} cash deal{stats.cashCount > 1 ? "s" : ""}{" "}
              exclusivo{stats.cashCount > 1 ? "s" : ""} de la red
            </span>
          )}
        </div>
      )}

      {/* Resultados */}
      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              onMouseEnter={() => setSelectedId(p.id)}
              onMouseLeave={() => setSelectedId(null)}
            >
              <PropertyCard property={p} />
            </div>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-muted">
              <SearchX className="size-6 text-muted-foreground/60" />
            </span>
            <div>
              <p className="font-heading font-semibold">
                Nada por aquí con estos filtros
              </p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                No te preocupes — esto pasa cuando los filtros quedan muy
                estrechos. Esto es lo que puedes hacer:
              </p>
            </div>
            <ul className="mx-auto max-w-sm space-y-1.5 text-left text-[13px] text-muted-foreground">
              <li className="flex items-start gap-2">
                <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                Sube el precio máximo o quita la zona para ver más opciones.
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                Marca todas las fuentes — la exclusiva son solo los cash deals.
              </li>
              <li className="flex items-start gap-2">
                <Lightbulb className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />
                O pídele al copiloto con ⌘K que busque por ti en español.
              </li>
            </ul>
            <Button size="sm" className="mt-1" onClick={resetFilters}>
              <RotateCcw className="size-3.5" />
              Limpiar filtros y empezar de nuevo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Bandeja de comparación */}
      {compareIds.length > 0 && (
        <div className="fixed inset-x-4 bottom-20 z-40 mx-auto flex max-w-md items-center justify-between gap-3 rounded-full border border-border bg-card/95 py-2 pr-2 pl-5 shadow-lift backdrop-blur-lg lg:bottom-5">
          <div className="flex items-center gap-2 text-sm">
            <GitCompareArrows className="size-4 text-primary" />
            <span className="font-medium">
              {compareIds.length} en el comparador
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={clearCompare} aria-label="Limpiar comparador">
              <X className="size-4" />
            </Button>
            <Button size="sm" onClick={() => router.push("/comparador")}>
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
    <Suspense>
      <ComparablesInner />
    </Suspense>
  )
}
