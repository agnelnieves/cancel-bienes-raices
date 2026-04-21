// ============================================================================
// Mock Data — Bienes Raíces CR
// All data is fictional but realistic for Puerto Rico market
// ============================================================================

export type PropertyType =
  | "Casa"
  | "Apartamento"
  | "Townhouse"
  | "Multifamiliar"
  | "Comercial"
  | "Terreno"

export type DealStage =
  | "prospecto"
  | "analisis"
  | "oferta"
  | "negociacion"
  | "due-diligence"
  | "cierre"

export interface Property {
  id: string
  address: string
  city: string
  zipCode: string
  type: PropertyType
  price: number
  pricePerSqFt: number
  bedrooms: number
  bathrooms: number
  sqFt: number
  lotSqFt: number
  yearBuilt: number
  dateSold: string
  daysOnMarket: number
  cashDeal: boolean
  verified: boolean
  estimatedRent: number
  imageUrl?: string
}

export interface Deal {
  id: string
  propertyAddress: string
  city: string
  stage: DealStage
  askingPrice: number
  offerPrice: number | null
  estimatedRoi: number
  estimatedCashFlow: number
  notes: string
  createdAt: string
  updatedAt: string
  contactName: string
  contactRole: string
}

export interface CreditCard {
  id: string
  name: string
  issuer: string
  creditLimit: number
  currentBalance: number
  apr: number
  minPayment: number
  dueDate: string
  rewards: string
  allocated: number
}

// ---------------------------------------------------------------------------
// Properties / Comparables
// ---------------------------------------------------------------------------

export const mockProperties: Property[] = [
  {
    id: "prop-001",
    address: "Calle Luna 123",
    city: "Viejo San Juan",
    zipCode: "00901",
    type: "Apartamento",
    price: 215000,
    pricePerSqFt: 226,
    bedrooms: 2,
    bathrooms: 1,
    sqFt: 950,
    lotSqFt: 0,
    yearBuilt: 1962,
    dateSold: "2026-03-15",
    daysOnMarket: 34,
    cashDeal: true,
    verified: true,
    estimatedRent: 1800,
  },
  {
    id: "prop-002",
    address: "Ave. Ashford 456, PH-3",
    city: "Condado, San Juan",
    zipCode: "00907",
    type: "Apartamento",
    price: 385000,
    pricePerSqFt: 367,
    bedrooms: 2,
    bathrooms: 2,
    sqFt: 1050,
    lotSqFt: 0,
    yearBuilt: 2004,
    dateSold: "2026-02-28",
    daysOnMarket: 21,
    cashDeal: false,
    verified: true,
    estimatedRent: 2800,
  },
  {
    id: "prop-003",
    address: "Urb. Altamira, Calle 8 #234",
    city: "Guaynabo",
    zipCode: "00969",
    type: "Casa",
    price: 245000,
    pricePerSqFt: 163,
    bedrooms: 3,
    bathrooms: 2,
    sqFt: 1500,
    lotSqFt: 3200,
    yearBuilt: 1988,
    dateSold: "2026-03-02",
    daysOnMarket: 45,
    cashDeal: false,
    verified: true,
    estimatedRent: 2100,
  },
  {
    id: "prop-004",
    address: "Bo. Candelaria, Sector El Cerro",
    city: "Toa Baja",
    zipCode: "00949",
    type: "Multifamiliar",
    price: 275000,
    pricePerSqFt: 115,
    bedrooms: 6,
    bathrooms: 4,
    sqFt: 2400,
    lotSqFt: 4000,
    yearBuilt: 1975,
    dateSold: "2026-01-20",
    daysOnMarket: 62,
    cashDeal: true,
    verified: true,
    estimatedRent: 3600,
  },
  {
    id: "prop-005",
    address: "Calle Comercio 78",
    city: "Ponce",
    zipCode: "00717",
    type: "Casa",
    price: 98000,
    pricePerSqFt: 98,
    bedrooms: 3,
    bathrooms: 1,
    sqFt: 1000,
    lotSqFt: 2800,
    yearBuilt: 1965,
    dateSold: "2026-03-22",
    daysOnMarket: 88,
    cashDeal: true,
    verified: true,
    estimatedRent: 950,
  },
  {
    id: "prop-006",
    address: "Cond. Mar Azul, Apt 12B",
    city: "Isla Verde, Carolina",
    zipCode: "00979",
    type: "Apartamento",
    price: 410000,
    pricePerSqFt: 390,
    bedrooms: 2,
    bathrooms: 2,
    sqFt: 1050,
    lotSqFt: 0,
    yearBuilt: 2018,
    dateSold: "2026-02-14",
    daysOnMarket: 15,
    cashDeal: false,
    verified: true,
    estimatedRent: 3200,
  },
  {
    id: "prop-007",
    address: "Ave. Universidad 890",
    city: "Río Piedras, San Juan",
    zipCode: "00925",
    type: "Multifamiliar",
    price: 195000,
    pricePerSqFt: 108,
    bedrooms: 4,
    bathrooms: 3,
    sqFt: 1800,
    lotSqFt: 2200,
    yearBuilt: 1970,
    dateSold: "2026-03-10",
    daysOnMarket: 53,
    cashDeal: false,
    verified: true,
    estimatedRent: 2400,
  },
  {
    id: "prop-008",
    address: "Carr. 2 Km 15.3, Villa Calma",
    city: "Bayamón",
    zipCode: "00959",
    type: "Casa",
    price: 178000,
    pricePerSqFt: 127,
    bedrooms: 4,
    bathrooms: 2,
    sqFt: 1400,
    lotSqFt: 3600,
    yearBuilt: 1992,
    dateSold: "2026-02-05",
    daysOnMarket: 38,
    cashDeal: true,
    verified: true,
    estimatedRent: 1600,
  },
  {
    id: "prop-009",
    address: "Urb. Country Club, Calle 5 #67",
    city: "Caguas",
    zipCode: "00725",
    type: "Townhouse",
    price: 165000,
    pricePerSqFt: 110,
    bedrooms: 3,
    bathrooms: 2.5,
    sqFt: 1500,
    lotSqFt: 1800,
    yearBuilt: 2001,
    dateSold: "2026-03-18",
    daysOnMarket: 29,
    cashDeal: false,
    verified: true,
    estimatedRent: 1500,
  },
  {
    id: "prop-010",
    address: "Ave. Muñoz Rivera 1200",
    city: "Hato Rey, San Juan",
    zipCode: "00918",
    type: "Comercial",
    price: 550000,
    pricePerSqFt: 172,
    bedrooms: 0,
    bathrooms: 2,
    sqFt: 3200,
    lotSqFt: 5000,
    yearBuilt: 1985,
    dateSold: "2026-01-30",
    daysOnMarket: 120,
    cashDeal: false,
    verified: true,
    estimatedRent: 4500,
  },
  {
    id: "prop-011",
    address: "Urb. Bairoa, Calle 12 #89",
    city: "Caguas",
    zipCode: "00725",
    type: "Casa",
    price: 135000,
    pricePerSqFt: 112,
    bedrooms: 3,
    bathrooms: 2,
    sqFt: 1200,
    lotSqFt: 3000,
    yearBuilt: 1980,
    dateSold: "2026-03-25",
    daysOnMarket: 41,
    cashDeal: true,
    verified: true,
    estimatedRent: 1200,
  },
  {
    id: "prop-012",
    address: "Paseo Caribe, Torre 2, Apt 8A",
    city: "Puerta de Tierra, San Juan",
    zipCode: "00901",
    type: "Apartamento",
    price: 625000,
    pricePerSqFt: 446,
    bedrooms: 3,
    bathrooms: 2,
    sqFt: 1400,
    lotSqFt: 0,
    yearBuilt: 2014,
    dateSold: "2026-04-01",
    daysOnMarket: 12,
    cashDeal: false,
    verified: true,
    estimatedRent: 4200,
  },
]

// ---------------------------------------------------------------------------
// Deals
// ---------------------------------------------------------------------------

export const dealStages: { id: DealStage; label: string; color: string }[] = [
  { id: "prospecto", label: "Prospecto", color: "bg-muted-foreground" },
  { id: "analisis", label: "Análisis", color: "bg-blue-500" },
  { id: "oferta", label: "Oferta", color: "bg-amber-500" },
  { id: "negociacion", label: "Negociación", color: "bg-orange-500" },
  { id: "due-diligence", label: "Due Diligence", color: "bg-purple-500" },
  { id: "cierre", label: "Cierre", color: "bg-emerald-500" },
]

export const mockDeals: Deal[] = [
  {
    id: "deal-001",
    propertyAddress: "Calle Sol 45, Viejo San Juan",
    city: "San Juan",
    stage: "negociacion",
    askingPrice: 198000,
    offerPrice: 175000,
    estimatedRoi: 14.2,
    estimatedCashFlow: 680,
    notes: "Vendedor motivado. Propiedad necesita pintura y reparaciones menores.",
    createdAt: "2026-03-01",
    updatedAt: "2026-04-18",
    contactName: "María Torres",
    contactRole: "Realtor",
  },
  {
    id: "deal-002",
    propertyAddress: "Urb. Los Filtros, Calle B #12",
    city: "Guaynabo",
    stage: "analisis",
    askingPrice: 310000,
    offerPrice: null,
    estimatedRoi: 8.5,
    estimatedCashFlow: 420,
    notes: "Buena zona. Revisar comparables recientes en la urbanización.",
    createdAt: "2026-04-10",
    updatedAt: "2026-04-15",
    contactName: "Carlos Rivera",
    contactRole: "Propietario",
  },
  {
    id: "deal-003",
    propertyAddress: "Carr. 1 Km 30.5",
    city: "Caguas",
    stage: "prospecto",
    askingPrice: 125000,
    offerPrice: null,
    estimatedRoi: 18.3,
    estimatedCashFlow: 890,
    notes: "Multifamiliar con 3 unidades. Dos unidades alquiladas actualmente.",
    createdAt: "2026-04-14",
    updatedAt: "2026-04-14",
    contactName: "Pedro Méndez",
    contactRole: "Realtor",
  },
  {
    id: "deal-004",
    propertyAddress: "Cond. Playa Dorada, Apt 5C",
    city: "Carolina",
    stage: "due-diligence",
    askingPrice: 245000,
    offerPrice: 230000,
    estimatedRoi: 11.7,
    estimatedCashFlow: 560,
    notes: "Inspección programada para el 25 de abril. Financiamiento pre-aprobado.",
    createdAt: "2026-02-20",
    updatedAt: "2026-04-19",
    contactName: "Ana Colón",
    contactRole: "Realtor",
  },
  {
    id: "deal-005",
    propertyAddress: "Calle Marina 89",
    city: "Ponce",
    stage: "oferta",
    askingPrice: 87000,
    offerPrice: 72000,
    estimatedRoi: 22.1,
    estimatedCashFlow: 1050,
    notes: "Cash deal. Propiedad en subasta del banco. Necesita rehabilitación.",
    createdAt: "2026-04-05",
    updatedAt: "2026-04-17",
    contactName: "Luis Ortiz",
    contactRole: "Agente de banco",
  },
  {
    id: "deal-006",
    propertyAddress: "Ave. Fernández Juncos 567",
    city: "Santurce, San Juan",
    stage: "cierre",
    askingPrice: 340000,
    offerPrice: 315000,
    estimatedRoi: 9.8,
    estimatedCashFlow: 380,
    notes: "Cierre programado para el 30 de abril. Todo listo.",
    createdAt: "2026-01-15",
    updatedAt: "2026-04-20",
    contactName: "Sofía Hernández",
    contactRole: "Realtor",
  },
  {
    id: "deal-007",
    propertyAddress: "Urb. Torrimar, Calle 14 #56",
    city: "Guaynabo",
    stage: "prospecto",
    askingPrice: 420000,
    offerPrice: null,
    estimatedRoi: 7.2,
    estimatedCashFlow: 290,
    notes: "Zona premium. Evaluar si el ROI justifica la inversión.",
    createdAt: "2026-04-18",
    updatedAt: "2026-04-18",
    contactName: "Roberto Vega",
    contactRole: "Propietario",
  },
]

// ---------------------------------------------------------------------------
// Credit Cards
// ---------------------------------------------------------------------------

export const mockCreditCards: CreditCard[] = [
  {
    id: "cc-001",
    name: "Freedom Unlimited",
    issuer: "Chase",
    creditLimit: 15000,
    currentBalance: 3450,
    apr: 22.49,
    minPayment: 69,
    dueDate: "2026-05-15",
    rewards: "1.5% cash back",
    allocated: 5000,
  },
  {
    id: "cc-002",
    name: "Venture X",
    issuer: "Capital One",
    creditLimit: 25000,
    currentBalance: 11250,
    apr: 21.99,
    minPayment: 225,
    dueDate: "2026-05-20",
    rewards: "2x millas",
    allocated: 8000,
  },
  {
    id: "cc-003",
    name: "Discover It",
    issuer: "Discover",
    creditLimit: 12000,
    currentBalance: 1440,
    apr: 18.99,
    minPayment: 29,
    dueDate: "2026-05-10",
    rewards: "5% categorías rotativas",
    allocated: 3000,
  },
  {
    id: "cc-004",
    name: "Blue Cash Preferred",
    issuer: "American Express",
    creditLimit: 20000,
    currentBalance: 13400,
    apr: 19.49,
    minPayment: 268,
    dueDate: "2026-05-25",
    rewards: "6% supermercados",
    allocated: 0,
  },
  {
    id: "cc-005",
    name: "Platinum",
    issuer: "Banco Popular",
    creditLimit: 10000,
    currentBalance: 2200,
    apr: 24.99,
    minPayment: 44,
    dueDate: "2026-05-12",
    rewards: "Puntos Popular",
    allocated: 4000,
  },
]

// ---------------------------------------------------------------------------
// Dashboard Stats
// ---------------------------------------------------------------------------

export const dashboardStats = {
  totalComparables: 1284,
  activeDeals: 7,
  avgPropertyValue: 245000,
  avgRoi: 13.1,
  cashDealsThisMonth: 23,
  newListingsThisWeek: 47,
}

export const recentActivity = [
  {
    id: "act-1",
    type: "comparable" as const,
    message: "Nuevo comparable en Condado — $385,000",
    timestamp: "Hace 2 horas",
  },
  {
    id: "act-2",
    type: "deal" as const,
    message: "Deal en Ponce movido a Oferta",
    timestamp: "Hace 4 horas",
  },
  {
    id: "act-3",
    type: "cash" as const,
    message: "Venta en efectivo reportada en Toa Baja — $178,000",
    timestamp: "Hace 6 horas",
  },
  {
    id: "act-4",
    type: "comparable" as const,
    message: "12 nuevos comparables en zona metro",
    timestamp: "Hace 1 día",
  },
  {
    id: "act-5",
    type: "deal" as const,
    message: "Cierre completado — Ave. Fernández Juncos",
    timestamp: "Hace 1 día",
  },
  {
    id: "act-6",
    type: "cash" as const,
    message: "Venta en efectivo reportada en Caguas — $135,000",
    timestamp: "Hace 2 días",
  },
]

// ---------------------------------------------------------------------------
// Property Cities (for filters)
// ---------------------------------------------------------------------------

export const prCities = [
  "San Juan",
  "Bayamón",
  "Carolina",
  "Ponce",
  "Caguas",
  "Guaynabo",
  "Toa Baja",
  "Toa Alta",
  "Trujillo Alto",
  "Arecibo",
  "Mayagüez",
  "Humacao",
  "Fajardo",
  "Dorado",
  "Hatillo",
  "Manatí",
  "Aguadilla",
  "Cabo Rojo",
  "Vega Baja",
  "Isabela",
]

export const propertyTypes: PropertyType[] = [
  "Casa",
  "Apartamento",
  "Townhouse",
  "Multifamiliar",
  "Comercial",
  "Terreno",
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}

export function getStageColor(stage: DealStage): string {
  return dealStages.find((s) => s.id === stage)?.color ?? "bg-muted"
}

export function getStageLabel(stage: DealStage): string {
  return dealStages.find((s) => s.id === stage)?.label ?? stage
}

export function getUtilizationColor(percent: number): string {
  if (percent <= 30) return "text-emerald-500"
  if (percent <= 50) return "text-amber-500"
  return "text-red-500"
}

export function getUtilizationBg(percent: number): string {
  if (percent <= 30) return "bg-emerald-500"
  if (percent <= 50) return "bg-amber-500"
  return "bg-red-500"
}
