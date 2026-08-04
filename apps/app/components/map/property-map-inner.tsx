"use client"

import * as React from "react"
import maplibregl from "maplibre-gl"
import {
  Calculator,
  GitCompareArrows,
  Home,
  Plus,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  formatCompact,
  formatCurrency,
  sourceMeta,
  type Property,
} from "@cancel/data"
import { Button, cn } from "@cancel/ui"

import {
  Map,
  MapControls,
  MapMarker,
  MapPopup,
  MarkerContent,
  MarkerTooltip,
  useMap,
} from "@/components/ui/map"
import { SourceChip } from "@/components/source-chip"
import { useAnalysisStore } from "@/lib/stores/analysis"
import { usePipelineStore } from "@/lib/stores/pipeline"
import { useSavedStore } from "@/lib/stores/saved"
import type { PropertyMapProps } from "./property-map"

const PR_CENTER: [number, number] = [-66.45, 18.22]

/** Keep map canvas in sync when the container is resized (split panes, drawers). */
function MapResize() {
  const { map } = useMap()
  React.useEffect(() => {
    if (!map) return
    const container = map.getContainer()
    const ro = new ResizeObserver(() => {
      map.resize()
    })
    ro.observe(container)
    // First paint often needs an extra resize after layout settles
    const t = window.setTimeout(() => map.resize(), 80)
    return () => {
      ro.disconnect()
      window.clearTimeout(t)
    }
  }, [map])
  return null
}

/** Fit all result markers when the filtered set changes — not on selection. */
function FitToResults({
  properties,
  enabled,
  boundsPadding,
}: {
  properties: Property[]
  enabled: boolean
  boundsPadding?: PropertyMapProps["boundsPadding"]
}) {
  const { map, isLoaded } = useMap()
  const idsKey = properties.map((p) => p.id).join("|")
  const padKey = JSON.stringify(boundsPadding ?? {})

  React.useEffect(() => {
    if (!map || !isLoaded || !enabled) return
    const padding = {
      top: 72,
      bottom: 56,
      left: 48,
      right: 48,
      ...boundsPadding,
    }
    if (properties.length === 0) {
      map.easeTo({ center: PR_CENTER, zoom: 8.4, duration: 400 })
      return
    }
    if (properties.length === 1) {
      map.flyTo({
        center: [properties[0].lng, properties[0].lat],
        zoom: 13,
        duration: 550,
        essential: true,
        padding,
      })
      return
    }
    const bounds = new maplibregl.LngLatBounds()
    for (const p of properties) bounds.extend([p.lng, p.lat])
    map.fitBounds(bounds, {
      padding,
      maxZoom: 13,
      duration: 550,
      essential: true,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- idsKey/padKey are stable signatures
  }, [map, isLoaded, enabled, idsKey, padKey])

  return null
}

/** Soft fly when the user picks a property from the list or a pin. */
function FlyToSelected({ property }: { property?: Property }) {
  const { map, isLoaded } = useMap()
  const prevId = React.useRef<string | null>(null)

  React.useEffect(() => {
    if (!map || !isLoaded || !property) return
    // Avoid re-flying on the same selection (e.g. re-render)
    if (prevId.current === property.id) return
    prevId.current = property.id
    const z = map.getZoom()
    map.flyTo({
      center: [property.lng, property.lat],
      zoom: Math.max(z, 12.2),
      duration: 650,
      essential: true,
      offset: [0, -40],
    })
  }, [map, isLoaded, property])

  // Reset tracker when selection clears so re-selecting works
  React.useEffect(() => {
    if (!property) prevId.current = null
  }, [property])

  return null
}

/** Bumps the MapLibre marker element z-index so the selected pin stacks above neighbors. */
function MarkerZIndex({
  active,
  children,
}: {
  active: boolean
  children: React.ReactNode
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    const host = ref.current?.parentElement
    if (!host) return
    host.style.zIndex = active ? "30" : ""
  }, [active])
  return <div ref={ref}>{children}</div>
}

function PricePin({
  property,
  active,
}: {
  property: Property
  active: boolean
}) {
  const isCash = property.source === "cash"
  const isListing = property.status === "active"

  return (
    <div
      className={cn(
        "relative select-none rounded-full border px-2 py-1 font-heading text-[11px] font-bold tracking-tight tabular-nums shadow-md transition-transform duration-150",
        active && "z-20 scale-110",
        isCash
          ? "border-cash bg-cash text-cash-foreground"
          : isListing
            ? "border-primary/40 bg-primary text-primary-foreground"
            : "border-border bg-card text-foreground",
        active && !isCash && "ring-2 ring-ring ring-offset-1 ring-offset-background"
      )}
    >
      {formatCompact(property.price)}
      {isCash && (
        <span
          className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-cash-foreground/90 ring-1 ring-cash"
          aria-hidden
        />
      )}
    </div>
  )
}

function SelectedPopup({
  property,
  onClose,
}: {
  property: Property
  onClose: () => void
}) {
  const router = useRouter()
  const addDeal = usePipelineStore((s) => s.addDeal)
  const setPrefill = useAnalysisStore((s) => s.setPrefill)
  const { compareIds, toggleCompare } = useSavedStore()
  const comparing = compareIds.includes(property.id)
  const meta = sourceMeta[property.source]
  const isActive = property.status === "active"

  return (
    <MapPopup
      longitude={property.lng}
      latitude={property.lat}
      offset={28}
      closeButton
      closeOnClick={false}
      onClose={onClose}
      className="min-w-[240px] max-w-[280px] rounded-xl border-border p-0 shadow-lift"
      focusAfterOpen={false}
    >
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 pr-5">
          <div className="min-w-0">
            <p className="font-heading text-lg font-semibold tracking-tight tabular-nums">
              {formatCurrency(property.price)}
            </p>
            <p className="mt-0.5 truncate text-[12px] font-medium">
              {property.address}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {property.city} · {property.type}
            </p>
          </div>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Home className="size-3.5 text-muted-foreground" />
          </span>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          <SourceChip source={property.source} verified={property.verified} />
          {isActive ? (
            <span className="rounded-md bg-info-soft px-1.5 py-0.5 text-[10px] font-semibold text-info">
              En venta · {property.daysOnMarket}d
            </span>
          ) : (
            <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              Vendida
            </span>
          )}
          <span className="text-[11px] tabular-nums text-muted-foreground">
            ${property.pricePerSqFt}/pc
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <Button
            size="xs"
            variant={comparing ? "secondary" : "outline"}
            className="rounded-md"
            onClick={() => {
              const ok = toggleCompare(property.id)
              if (ok)
                toast(
                  comparing ? "Quitada del comparador" : "Añadida al comparador"
                )
              else toast.error("Máximo 5 en el comparador")
            }}
          >
            <GitCompareArrows data-icon="inline-start" />
            {comparing ? "Comparando" : "Comparar"}
          </Button>
          <Button
            size="xs"
            className="rounded-md"
            onClick={() => {
              setPrefill({
                propertyId: property.id,
                address: property.address,
                zone: property.zone,
                mode: "alquiler",
                price: property.price,
                sqft: property.sqFt,
                rent: property.estimatedRent,
                strNightly: property.strNightlyRate,
              })
              router.push("/calculadora")
            }}
          >
            <Calculator data-icon="inline-start" />
            Analizar
          </Button>
          <Button
            size="xs"
            variant="outline"
            className="rounded-md"
            onClick={() => {
              addDeal({
                address: property.address,
                city: property.city,
                stage: "prospecto",
                askingPrice: property.price,
                offerPrice: null,
                roi: 0,
                cashFlow: 0,
                notes: `Fuente: ${meta.label}. Renta est. ${formatCurrency(property.estimatedRent)}/mes.`,
                contactName: "",
                contactRole: "",
              })
              toast.success("Añadida al pipeline")
            }}
          >
            <Plus data-icon="inline-start" />
            Pipeline
          </Button>
        </div>
      </div>
    </MapPopup>
  )
}

export default function PropertyMapInner({
  properties,
  selectedId,
  onSelect,
  lockViewport = false,
  boundsPadding,
}: PropertyMapProps) {
  const selected = properties.find((p) => p.id === selectedId)

  return (
    <div className="relative h-full w-full overflow-hidden bg-muted/30">
      <Map
        center={PR_CENTER}
        zoom={8.5}
        minZoom={7}
        maxZoom={16}
        className="h-full w-full [&_.maplibregl-canvas]:outline-none"
      >
        <MapResize />
        <FitToResults
          properties={properties}
          enabled={!lockViewport}
          boundsPadding={boundsPadding}
        />
        <FlyToSelected property={selected} />
        <MapControls
          position="bottom-right"
          showZoom
          showFullscreen
          showCompass={false}
          className="bottom-3 right-3"
        />

        {properties.map((p) => {
          const active = p.id === selectedId
          return (
            <MapMarker
              key={p.id}
              longitude={p.lng}
              latitude={p.lat}
              onClick={(e) => {
                e.stopPropagation()
                onSelect?.(active ? null : p.id)
              }}
            >
              <MarkerContent>
                <MarkerZIndex active={active}>
                  <PricePin property={p} active={active} />
                </MarkerZIndex>
              </MarkerContent>
              <MarkerTooltip offset={22} className="max-w-[180px]">
                <span className="font-medium">{p.address}</span>
                <span className="mt-0.5 block opacity-80">
                  {p.city} · ${p.pricePerSqFt}/pc
                </span>
              </MarkerTooltip>
            </MapMarker>
          )
        })}

        {selected && (
          <SelectedPopup
            property={selected}
            onClose={() => onSelect?.(null)}
          />
        )}
      </Map>

      {/* Legend */}
      <div className="pointer-events-none absolute bottom-3 left-3 z-10 flex flex-wrap gap-1.5">
        <span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-background/95 px-2 py-1 text-[10px] font-medium shadow-sm backdrop-blur-sm">
          <span className="size-2 rounded-full bg-cash" />
          Cash deal
        </span>
        <span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-background/95 px-2 py-1 text-[10px] font-medium shadow-sm backdrop-blur-sm">
          <span className="size-2 rounded-full bg-primary" />
          En venta
        </span>
        <span className="pointer-events-auto inline-flex items-center gap-1.5 rounded-md border border-border bg-background/95 px-2 py-1 text-[10px] font-medium shadow-sm backdrop-blur-sm">
          <span className="size-2 rounded-full bg-card ring-1 ring-border" />
          Vendida
        </span>
      </div>
    </div>
  )
}
