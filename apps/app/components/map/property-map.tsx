"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@cancel/ui"
import type { Property } from "@cancel/data"

export interface PropertyMapProps {
  properties: Property[]
  selectedId?: string | null
  onSelect?: (id: string | null) => void
  className?: string
  /** When true, skip auto fitBounds (e.g. after user has panned) */
  lockViewport?: boolean
  /** Extra padding for fitBounds when floating UI covers the map */
  boundsPadding?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
}

const MapInner = dynamic(() => import("./property-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted/40">
      <Skeleton className="h-full w-full rounded-xl" />
    </div>
  ),
})

export function PropertyMap(props: PropertyMapProps) {
  return (
    <div className={props.className}>
      <MapInner {...props} />
    </div>
  )
}
