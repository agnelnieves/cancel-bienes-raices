"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { Skeleton } from "@cancel/ui"
import type { Property } from "@cancel/data"

export interface PropertyMapProps {
  properties: Property[]
  selectedId?: string | null
  onSelect?: (id: string) => void
  className?: string
}

const MapInner = dynamic(() => import("./property-map-inner"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-2xl" />,
})

export function PropertyMap(props: PropertyMapProps) {
  return (
    <div className={props.className}>
      <MapInner {...props} />
    </div>
  )
}
