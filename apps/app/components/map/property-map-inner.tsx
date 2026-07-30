"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import maplibregl from "maplibre-gl"

import { formatCompact, formatCurrency, sourceMeta } from "@cancel/data"

import type { PropertyMapProps } from "./property-map"

const LIGHT_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
const DARK_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"

// Centro de Puerto Rico
const PR_CENTER: [number, number] = [-66.45, 18.21]

export default function PropertyMapInner({
  properties,
  selectedId,
  onSelect,
}: PropertyMapProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const mapRef = React.useRef<maplibregl.Map | null>(null)
  const markersRef = React.useRef<
    { marker: maplibregl.Marker; el: HTMLButtonElement; id: string }[]
  >([])
  const popupRef = React.useRef<maplibregl.Popup | null>(null)
  const { resolvedTheme } = useTheme()
  const [ready, setReady] = React.useState(false)
  const onSelectRef = React.useRef(onSelect)
  onSelectRef.current = onSelect

  // Init del mapa (una sola vez)
  React.useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: resolvedTheme === "dark" ? DARK_STYLE : LIGHT_STYLE,
      center: PR_CENTER,
      zoom: 8.7,
      attributionControl: { compact: true },
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right")
    map.on("load", () => setReady(true))
    mapRef.current = map
    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cambio de tema
  React.useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.setStyle(resolvedTheme === "dark" ? DARK_STYLE : LIGHT_STYLE)
  }, [resolvedTheme])

  // Marcadores
  React.useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return

    // Limpia anteriores
    markersRef.current.forEach(({ marker }) => marker.remove())
    markersRef.current = []
    popupRef.current?.remove()

    const primary = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim()

    for (const p of properties) {
      const isCash = p.source === "cash"
      const isActive = p.status === "active"

      const el = document.createElement("button")
      el.type = "button"
      el.textContent = formatCompact(p.price)
      el.style.cssText = `
        padding: 4px 8px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        font-family: inherit;
        letter-spacing: -0.01em;
        cursor: pointer;
        border: 1.5px solid ${isCash ? primary : "rgba(120,130,125,0.35)"};
        background: ${isCash ? primary : isActive ? "var(--card)" : "color-mix(in srgb, var(--card) 88%, transparent)"};
        color: ${isCash ? "var(--primary-foreground)" : "var(--foreground)"};
        box-shadow: 0 2px 8px rgb(0 0 0 / 0.14);
        transition: transform 120ms ease, box-shadow 120ms ease;
        white-space: nowrap;
      `
      el.onmouseenter = () => {
        el.style.transform = "scale(1.08)"
        el.style.zIndex = "10"
      }
      el.onmouseleave = () => {
        el.style.transform = ""
        el.style.zIndex = ""
      }
      el.onclick = (e) => {
        e.stopPropagation()
        onSelectRef.current?.(p.id)
        popupRef.current?.remove()
        const meta = sourceMeta[p.source]
        const popup = new maplibregl.Popup({
          closeButton: false,
          offset: 14,
          maxWidth: "260px",
        })
          .setLngLat([p.lng, p.lat])
          .setHTML(
            `<div style="padding:12px 14px;font-family:inherit">
              <div style="font-size:13px;font-weight:600;line-height:1.3">${p.address}</div>
              <div style="font-size:11px;opacity:0.65;margin-top:2px">${p.city} · ${p.type}</div>
              <div style="display:flex;align-items:baseline;gap:8px;margin-top:8px">
                <span style="font-size:16px;font-weight:800">${formatCurrency(p.price)}</span>
                <span style="font-size:11px;opacity:0.65">$${p.pricePerSqFt}/pc</span>
              </div>
              <div style="display:inline-block;margin-top:8px;font-size:10px;font-weight:700;padding:3px 8px;border-radius:999px;${
                meta.exclusive
                  ? "background:color-mix(in srgb, var(--primary) 14%, transparent);color:var(--primary)"
                  : "background:var(--muted);color:var(--muted-foreground)"
              }">${meta.label}</div>
            </div>`
          )
          .addTo(map)
        popupRef.current = popup
        map.flyTo({ center: [p.lng, p.lat], zoom: Math.max(map.getZoom(), 12), speed: 1.4 })
      }

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([p.lng, p.lat])
        .addTo(map)
      markersRef.current.push({ marker, el, id: p.id })
    }

    // Encuadra resultados
    if (properties.length > 0) {
      const bounds = new maplibregl.LngLatBounds()
      properties.forEach((p) => bounds.extend([p.lng, p.lat]))
      map.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 12.5,
        duration: 600,
      })
    }
  }, [properties, ready])

  // Selección externa → resaltar marcador
  React.useEffect(() => {
    for (const { el, id } of markersRef.current) {
      el.style.outline = id === selectedId ? "2px solid var(--ring)" : ""
      el.style.outlineOffset = "2px"
    }
  }, [selectedId, properties])

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-hidden rounded-2xl border border-border"
    />
  )
}
