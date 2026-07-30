import type { Property } from "@cancel/data"

export type AssistantCard =
  | { type: "properties"; title: string; properties: Property[] }
  | { type: "nav"; label: string; href: string; description?: string }
  | {
      type: "stats"
      title: string
      items: { label: string; value: string; delta?: string }[]
    }

export interface EngineResult {
  thinking: string[]
  reply: string
  cards: AssistantCard[]
  /** IDs de propiedades mencionadas (para follow-ups tipo "añade la primera") */
  propertyIds: string[]
  /** Acciones a ejecutar después de responder */
  action?: "open-calculadora" | "open-estimador" | "open-comparador"
  /** Si se setea, la UI crea un deal en el pipeline con esta propiedad */
  addDealPropertyId?: string
  /** Si se setea, la UI pre-llena la calculadora con esta propiedad */
  prefillPropertyId?: string
  prefillMode?: "alquiler" | "flip" | "airbnb"
}
