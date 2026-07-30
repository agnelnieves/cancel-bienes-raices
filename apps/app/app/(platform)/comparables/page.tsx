"use client"

import * as React from "react"
import { Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowRight,
  BadgeDollarSign,
  GitCompareArrows,
  Map as MapIcon,
  Search,
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

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Barra de búsqueda */}
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
            >
              <SlidersHorizontal className="size-4" />
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
              <Label className="text-[11px]">Zona</Label>
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
              <Label className="text-[11px]">Tipo</Label>
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
                  <SelectItem value="todas">Vendidas + activas</SelectItem>
                  <SelectItem value="sold">Solo vendidas</SelectItem>
                  <SelectItem value="active">Solo en venta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px]">
                Precio máx. · {formatCompact(maxPrice)}
              </Label>
              <Slider
                value={[maxPrice]}
                onValueChange={([v]) => setMaxPrice(v)}
                min={50000}
                max={800000}
                step={10000}
                className="py-2.5"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px]">Ordenar</Label>
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

          {/* Fuentes */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-muted-foreground">
              Fuentes:
            </span>
            {ALL_SOURCES.map((s) => (
              <button
                key={s}
                onClick={() => toggleSource(s)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  sources.includes(s)
                    ? s === "cash"
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-muted text-foreground"
                    : "border-border text-muted-foreground/60 hover:text-muted-foreground"
                )}
              >
                {sourceMeta[s].label}
              </button>
            ))}
            <button
              onClick={() => setOnlyExclusive((v) => !v)}
              className={cn(
                "ml-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors",
                onlyExclusive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-primary/40 text-primary hover:bg-primary/5"
              )}
            >
              <BadgeDollarSign className="size-3" />
              Solo data exclusiva
            </button>
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

      {/* Stats */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
        <span className="font-semibold">
          {filtered.length}{" "}
          <span className="font-normal text-muted-foreground">
            {filtered.length === 1 ? "resultado" : "resultados"}
          </span>
        </span>
        {stats && (
          <>
            <span className="text-muted-foreground">
              Mediana <span className="font-medium text-foreground">${stats.medianPpsf}/pc</span>
            </span>
            <span className="text-muted-foreground">
              <span className="font-medium text-foreground">{stats.avgDom}d</span> promedio en mercado
            </span>
            {stats.cashCount > 0 && (
              <span className="inline-flex items-center gap-1 text-primary">
                <BadgeDollarSign className="size-3.5" />
                {stats.cashCount} cash deal{stats.cashCount > 1 ? "s" : ""} exclusivo{stats.cashCount > 1 ? "s" : ""}
              </span>
            )}
          </>
        )}
      </div>

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
          <CardContent className="flex flex-col items-center gap-2 py-14 text-center">
            <Search className="size-8 text-muted-foreground/50" />
            <p className="font-medium">Sin resultados con estos filtros</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Prueba ampliando la zona o el precio máximo — o pregúntale al
              copiloto con ⌘K y deja que él busque por ti.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => {
                setQuery("")
                setZoneId("todas")
                setType("todos")
                setStatus("todas")
                setMaxPrice(800000)
                setSources(ALL_SOURCES)
                setOnlyExclusive(false)
              }}
            >
              Limpiar filtros
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
            <Button variant="ghost" size="icon-sm" onClick={clearCompare} aria-label="Limpiar">
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
