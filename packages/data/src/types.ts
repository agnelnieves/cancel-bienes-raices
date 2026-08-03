// ============================================================================
// Types — Cancel Bienes Raíces
// ============================================================================

export type PropertyType =
  | "Casa"
  | "Apartamento"
  | "Townhouse"
  | "Multifamiliar"
  | "Comercial"
  | "Terreno"

/** Fuente de la data. "cash" es la data exclusiva de la red de realtors. */
export type PropertySource = "cash" | "mls" | "registro" | "crim"

export type PropertyStatus = "sold" | "active"

export type Condition =
  | "Excelente"
  | "Buena"
  | "Necesita reparos"
  | "Para remodelar"

export interface Property {
  id: string
  address: string
  /** Zone id (referencia a Zone.id) */
  zone: string
  /** Display: "Condado, San Juan" */
  city: string
  zipCode: string
  lat: number
  lng: number
  type: PropertyType
  status: PropertyStatus
  price: number
  pricePerSqFt: number
  bedrooms: number
  bathrooms: number
  sqFt: number
  lotSqFt: number
  yearBuilt: number
  /** Fecha de venta (sold) o de listado (active), ISO */
  date: string
  daysOnMarket: number
  source: PropertySource
  verified: boolean
  condition: Condition
  estimatedRent: number
  /** Tarifa noche estimada para short-term rental, si aplica */
  strNightlyRate?: number
}

export interface Zone {
  id: string
  name: string
  city: string
  lat: number
  lng: number
  /** Mediana de precio por pie cuadrado en la zona */
  medianPpsf: number
  /** Cambio año contra año, % */
  yoyChange: number
  /** Días promedio en el mercado */
  avgDom: number
  /** % de transacciones en efectivo (cash deals) */
  cashShare: number
  /** 12 puntos: mediana $/pc mensual, más viejo → más reciente */
  trend: number[]
  /** Average daily rate para short-term rentals, si aplica */
  strAdr?: number
  /** Ocupación STR promedio (0-1) */
  strOccupancy?: number
  /** Descripción corta del carácter de la zona */
  vibe: string
}

export type DealStage =
  | "prospecto"
  | "analisis"
  | "oferta"
  | "negociacion"
  | "due-diligence"
  | "cierre"

export interface Deal {
  id: string
  address: string
  city: string
  stage: DealStage
  askingPrice: number
  offerPrice: number | null
  roi: number
  cashFlow: number
  notes: string
  contactName: string
  contactRole: string
  updatedAt: string
}

export interface CreditCard {
  id: string
  name: string
  issuer: string
  creditLimit: number
  currentBalance: number
  apr: number
  /** APR promocional (ej. 0% intro), si existe */
  promoApr: number | null
  /** ISO date de cuándo termina la promo */
  promoEnds: string | null
  dueDay: number
  rewards: string
  /** Cuánto de esta tarjeta está asignado a la jugada actual */
  allocated: number
}

export interface PostComment {
  id: string
  author: string
  initials: string
  content: string
  time: string
}

export interface CommunityPost {
  id: string
  channel: string
  author: string
  initials: string
  role: string
  time: string
  content: string
  likes: number
  comments: PostComment[]
  pinned?: boolean
  tag?: string
}

export interface Channel {
  id: string
  name: string
  description: string
}

export interface Member {
  name: string
  initials: string
  role: "Fundador" | "Pro" | "Realtor verificado" | "Miembro"
  online: boolean
}

export interface ActivityItem {
  id: string
  type: "comparable" | "deal" | "cash" | "sistema"
  message: string
  time: string
}

export interface Testimonial {
  quote: string
  name: string
  initials: string
  role: string
}

// ---------------------------------------------------------------------------
// Red de contratistas
// ---------------------------------------------------------------------------

export type ContractorTrade =
  | "remodelacion"
  | "electricidad"
  | "plomeria"
  | "techos"
  | "pintura"
  | "pisos"
  | "aires"
  | "carpinteria"
  | "exteriores"
  | "ventanas"
  | "inspeccion"

export interface Contractor {
  id: string
  /** Nombre de la compañía o del contratista */
  name: string
  /** Persona de contacto */
  contact: string
  initials: string
  trades: ContractorTrade[]
  baseCity: string
  /** Municipios que cubre, o ["Toda la isla"] */
  zonesServed: string[]
  rating: number
  reviews: number
  /** Trabajos completados dentro de la plataforma */
  jobsDone: number
  /** 1=$ · 2=$$ · 3=$$$ */
  priceTier: 1 | 2 | 3
  responseTime: string
  phone: string
  /** Pasó el proceso de vetting: licencia + seguro + referencias */
  verified: boolean
  licensed: boolean
  insured: boolean
  yearsExp: number
  /** Una línea de especialidad/bio */
  specialty: string
}

/**
 * Precio de referencia de un oficio, alineado con las partidas del estimador.
 * `unit` describe cómo se cobra; los rangos son precio típico con mano de obra
 * en PR (2026) por nivel de acabado.
 */
export interface TradePrice {
  trade: ContractorTrade
  label: string
  /** Cómo se cobra: total, por pie cuadrado, por baño, por unidad, etc. */
  unit: string
  /** Rango típico [min, max] en USD para acabado estándar */
  range: [number, number]
}
