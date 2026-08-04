import type {
  Condition,
  Property,
  PropertySource,
  PropertyStatus,
  PropertyType,
} from "./types"

// ============================================================================
// Propiedades — comparables vendidos + listados activos (mock realista PR)
// Coordenadas jittered alrededor del centro de cada zona
// ============================================================================

interface PropInput {
  id: string
  address: string
  zone: string
  city: string
  zip: string
  lat: number
  lng: number
  type: PropertyType
  status: PropertyStatus
  price: number
  bd: number
  ba: number
  sqft: number
  lot?: number
  year: number
  date: string
  dom: number
  source: PropertySource
  condition: Condition
  rent: number
  str?: number
  verified?: boolean
  /** Precio original antes de una reducción (solo listados activos) */
  originalPrice?: number
}

function p(i: PropInput): Property {
  return {
    id: i.id,
    address: i.address,
    zone: i.zone,
    city: i.city,
    zipCode: i.zip,
    lat: i.lat,
    lng: i.lng,
    type: i.type,
    status: i.status,
    price: i.price,
    pricePerSqFt: Math.round(i.price / i.sqft),
    bedrooms: i.bd,
    bathrooms: i.ba,
    sqFt: i.sqft,
    lotSqFt: i.lot ?? 0,
    yearBuilt: i.year,
    date: i.date,
    daysOnMarket: i.dom,
    source: i.source,
    verified: i.verified ?? true,
    condition: i.condition,
    estimatedRent: i.rent,
    originalPrice: i.originalPrice,
    strNightlyRate: i.str,
  }
}

export const properties: Property[] = [
  // ------------------------------------------------------------- CONDADO
  p({ id: "p-001", address: "Ave. Ashford 1120, Apt 7B", zone: "condado", city: "Condado, San Juan", zip: "00907", lat: 18.4589, lng: -66.0742, type: "Apartamento", status: "sold", price: 415000, bd: 2, ba: 2, sqft: 1080, year: 2004, date: "2026-07-08", dom: 19, source: "mls", condition: "Excelente", rent: 2900, str: 235 }),
  p({ id: "p-002", address: "Calle Candina 45, Apt 3", zone: "condado", city: "Condado, San Juan", zip: "00907", lat: 18.4568, lng: -66.0778, type: "Apartamento", status: "sold", price: 365000, bd: 2, ba: 1, sqft: 940, year: 1978, date: "2026-06-21", dom: 26, source: "cash", condition: "Buena", rent: 2400, str: 190 }),
  p({ id: "p-003", address: "Cond. Gallery Plaza, PH-1", zone: "condado", city: "Condado, San Juan", zip: "00907", lat: 18.4595, lng: -66.0725, type: "Apartamento", status: "sold", price: 690000, bd: 3, ba: 2, sqft: 1560, year: 2016, date: "2026-07-15", dom: 11, source: "cash", condition: "Excelente", rent: 4600, str: 320 }),
  p({ id: "p-004", address: "Calle Caribe 12", zone: "condado", city: "Condado, San Juan", zip: "00907", lat: 18.4572, lng: -66.0791, type: "Casa", status: "active", price: 585000, bd: 3, ba: 2, sqft: 1750, lot: 1800, year: 1965, date: "2026-07-19", dom: 10, source: "mls", condition: "Necesita reparos", rent: 3600, str: 260 }),
  // ------------------------------------------------------------- SANTURCE
  p({ id: "p-005", address: "Calle Loíza 1802", zone: "santurce", city: "Santurce, San Juan", zip: "00911", lat: 18.4451, lng: -66.0698, type: "Casa", status: "sold", price: 228000, bd: 3, ba: 2, sqft: 1150, lot: 1200, year: 1958, date: "2026-07-02", dom: 31, source: "cash", condition: "Necesita reparos", rent: 1900, str: 150 }),
  p({ id: "p-006", address: "Ave. Ponce de León 954, Apt 6A", zone: "santurce", city: "Santurce, San Juan", zip: "00907", lat: 18.4462, lng: -66.0735, type: "Apartamento", status: "sold", price: 172000, bd: 2, ba: 1, sqft: 850, year: 1972, date: "2026-06-14", dom: 44, source: "registro", condition: "Buena", rent: 1400, str: 115 }),
  p({ id: "p-007", address: "Calle Cerra 620", zone: "santurce", city: "Santurce, San Juan", zip: "00907", lat: 18.4428, lng: -66.0672, type: "Multifamiliar", status: "sold", price: 310000, bd: 5, ba: 3, sqft: 2100, lot: 2400, year: 1963, date: "2026-07-11", dom: 38, source: "cash", condition: "Para remodelar", rent: 3200 }),
  p({ id: "p-008", address: "Calle Hoare 1510", zone: "santurce", city: "Santurce, San Juan", zip: "00911", lat: 18.4441, lng: -66.0661, type: "Casa", status: "active", price: 189000, originalPrice: 205000, bd: 3, ba: 1, sqft: 1050, lot: 1500, year: 1955, date: "2026-07-24", dom: 5, source: "mls", condition: "Para remodelar", rent: 1500 }),
  p({ id: "p-009", address: "Ave. Fernández Juncos 1430, Apt 202", zone: "santurce", city: "Santurce, San Juan", zip: "00909", lat: 18.4471, lng: -66.0752, type: "Apartamento", status: "sold", price: 145000, bd: 1, ba: 1, sqft: 620, year: 1985, date: "2026-05-30", dom: 29, source: "mls", condition: "Buena", rent: 1150, str: 95 }),
  // ------------------------------------------------------- VIEJO SAN JUAN
  p({ id: "p-010", address: "Calle Luna 255, Apt 2N", zone: "viejo-san-juan", city: "Viejo San Juan", zip: "00901", lat: 18.4662, lng: -66.1162, type: "Apartamento", status: "sold", price: 265000, bd: 2, ba: 1, sqft: 920, year: 1920, date: "2026-06-28", dom: 36, source: "cash", condition: "Buena", rent: 1950, str: 175 }),
  p({ id: "p-011", address: "Calle Sol 108", zone: "viejo-san-juan", city: "Viejo San Juan", zip: "00901", lat: 18.4648, lng: -66.1145, type: "Casa", status: "sold", price: 395000, bd: 3, ba: 2, sqft: 1400, lot: 900, year: 1890, date: "2026-07-05", dom: 48, source: "registro", condition: "Necesita reparos", rent: 2600, str: 210 }),
  p({ id: "p-012", address: "Calle Tetuán 302, Apt 1", zone: "viejo-san-juan", city: "Viejo San Juan", zip: "00901", lat: 18.4641, lng: -66.1188, type: "Apartamento", status: "active", price: 298000, bd: 2, ba: 1, sqft: 980, year: 1935, date: "2026-07-21", dom: 8, source: "mls", condition: "Excelente", rent: 2100, str: 185 }),
  // ----------------------------------------------------------- ISLA VERDE
  p({ id: "p-013", address: "Cond. Marbella del Caribe, Apt 14D", zone: "isla-verde", city: "Isla Verde, Carolina", zip: "00979", lat: 18.4408, lng: -66.0188, type: "Apartamento", status: "sold", price: 425000, bd: 2, ba: 2, sqft: 1150, year: 1989, date: "2026-07-12", dom: 16, source: "mls", condition: "Excelente", rent: 3100, str: 205 }),
  p({ id: "p-014", address: "Ave. Isla Verde 5902, Apt 305", zone: "isla-verde", city: "Isla Verde, Carolina", zip: "00979", lat: 18.4392, lng: -66.0215, type: "Apartamento", status: "sold", price: 315000, bd: 1, ba: 1, sqft: 780, year: 1975, date: "2026-06-19", dom: 22, source: "cash", condition: "Buena", rent: 2100, str: 155 }),
  p({ id: "p-015", address: "Cond. Galaxy, Apt 9C", zone: "isla-verde", city: "Isla Verde, Carolina", zip: "00979", lat: 18.4415, lng: -66.0162, type: "Apartamento", status: "active", price: 368000, bd: 2, ba: 2, sqft: 1050, year: 1982, date: "2026-07-26", dom: 3, source: "mls", condition: "Buena", rent: 2600, str: 185 }),
  // ------------------------------------------------------------- GUAYNABO
  p({ id: "p-016", address: "Urb. Altamira, Calle 8 #B-23", zone: "guaynabo", city: "Guaynabo", zip: "00969", lat: 18.3612, lng: -66.1118, type: "Casa", status: "sold", price: 268000, bd: 3, ba: 2, sqft: 1520, lot: 3200, year: 1988, date: "2026-07-01", dom: 41, source: "mls", condition: "Buena", rent: 2200 }),
  p({ id: "p-017", address: "Urb. Garden Hills, Calle 15 #C-7", zone: "guaynabo", city: "Guaynabo", zip: "00966", lat: 18.3578, lng: -66.1145, type: "Casa", status: "sold", price: 342000, bd: 4, ba: 2.5, sqft: 1980, lot: 4100, year: 1996, date: "2026-06-25", dom: 35, source: "registro", condition: "Buena", rent: 2650 }),
  p({ id: "p-018", address: "Urb. Villa Caparra, Calle 3 #112", zone: "guaynabo", city: "Guaynabo", zip: "00966", lat: 18.3645, lng: -66.1092, type: "Casa", status: "sold", price: 198000, bd: 3, ba: 1, sqft: 1250, lot: 2800, year: 1979, date: "2026-07-16", dom: 52, source: "cash", condition: "Necesita reparos", rent: 1650 }),
  p({ id: "p-019", address: "Cond. El Monte Norte, Apt 12F", zone: "guaynabo", city: "Guaynabo", zip: "00969", lat: 18.3591, lng: -66.1161, type: "Apartamento", status: "active", price: 225000, bd: 2, ba: 2, sqft: 1180, year: 2008, date: "2026-07-23", dom: 6, source: "mls", condition: "Excelente", rent: 1850 }),
  // -------------------------------------------------------------- BAYAMÓN
  p({ id: "p-020", address: "Urb. Santa Juanita, Calle 12 #45", zone: "bayamon", city: "Bayamón", zip: "00956", lat: 18.3912, lng: -66.1538, type: "Casa", status: "sold", price: 152000, bd: 3, ba: 2, sqft: 1200, lot: 2600, year: 1985, date: "2026-07-09", dom: 39, source: "mls", condition: "Buena", rent: 1350 }),
  p({ id: "p-021", address: "Carr. 2 Km 8.1, Villa Calma", zone: "bayamon", city: "Bayamón", zip: "00959", lat: 18.3865, lng: -66.1572, type: "Casa", status: "sold", price: 178000, bd: 4, ba: 2, sqft: 1400, lot: 3600, year: 1992, date: "2026-06-17", dom: 45, source: "cash", condition: "Buena", rent: 1600 }),
  p({ id: "p-022", address: "Urb. Flamboyanes, Calle 6 #89", zone: "bayamon", city: "Bayamón", zip: "00959", lat: 18.3898, lng: -66.1521, type: "Casa", status: "sold", price: 124000, bd: 3, ba: 1, sqft: 1050, lot: 2400, year: 1974, date: "2026-07-20", dom: 58, source: "cash", condition: "Para remodelar", rent: 1150 }),
  p({ id: "p-023", address: "Urb. Sierra Bayamón, Calle 22 #16", zone: "bayamon", city: "Bayamón", zip: "00961", lat: 18.3921, lng: -66.1589, type: "Multifamiliar", status: "active", price: 215000, bd: 5, ba: 3, sqft: 1900, lot: 3000, year: 1981, date: "2026-07-18", dom: 11, source: "mls", condition: "Necesita reparos", rent: 2300 }),
  p({ id: "p-024", address: "Cond. Plaza del Parque, Apt 8B", zone: "bayamon", city: "Bayamón", zip: "00961", lat: 18.3879, lng: -66.1545, type: "Apartamento", status: "sold", price: 98000, bd: 2, ba: 1, sqft: 820, year: 1990, date: "2026-06-08", dom: 33, source: "mls", condition: "Buena", rent: 950 }),
  // --------------------------------------------------------------- CAGUAS
  p({ id: "p-025", address: "Urb. Bairoa, Calle 12 #89", zone: "caguas", city: "Caguas", zip: "00725", lat: 18.2352, lng: -66.0338, type: "Casa", status: "sold", price: 135000, bd: 3, ba: 2, sqft: 1200, lot: 3000, year: 1980, date: "2026-07-14", dom: 43, source: "cash", condition: "Buena", rent: 1200 }),
  p({ id: "p-026", address: "Urb. Country Club, Calle 5 #67", zone: "caguas", city: "Caguas", zip: "00725", lat: 18.2328, lng: -66.0362, type: "Townhouse", status: "sold", price: 168000, bd: 3, ba: 2.5, sqft: 1500, lot: 1800, year: 2001, date: "2026-06-27", dom: 36, source: "mls", condition: "Excelente", rent: 1500 }),
  p({ id: "p-027", address: "Carr. 1 Km 30.5, Bo. Río Cañas", zone: "caguas", city: "Caguas", zip: "00725", lat: 18.2295, lng: -66.0315, type: "Multifamiliar", status: "active", price: 142000, bd: 4, ba: 2, sqft: 1650, lot: 2800, year: 1972, date: "2026-07-22", dom: 7, source: "cash", condition: "Necesita reparos", rent: 1850 }),
  p({ id: "p-028", address: "Urb. Las Catalinas, Calle 9 #D-12", zone: "caguas", city: "Caguas", zip: "00727", lat: 18.2368, lng: -66.0385, type: "Casa", status: "sold", price: 105000, bd: 3, ba: 1, sqft: 1100, lot: 2500, year: 1976, date: "2026-05-25", dom: 61, source: "registro", condition: "Necesita reparos", rent: 1050 }),
  // --------------------------------------------------------------- DORADO
  p({ id: "p-029", address: "Dorado Beach East, Villa 214", zone: "dorado", city: "Dorado", zip: "00646", lat: 18.4612, lng: -66.2665, type: "Casa", status: "sold", price: 785000, bd: 4, ba: 3, sqft: 2650, lot: 5200, year: 2012, date: "2026-07-06", dom: 24, source: "cash", condition: "Excelente", rent: 5800, str: 420 }),
  p({ id: "p-030", address: "Urb. Sabanera Dorado, Calle 2 #18", zone: "dorado", city: "Dorado", zip: "00646", lat: 18.4585, lng: -66.2701, type: "Casa", status: "sold", price: 495000, bd: 4, ba: 2.5, sqft: 2100, lot: 3800, year: 2015, date: "2026-06-22", dom: 19, source: "mls", condition: "Excelente", rent: 3600 }),
  p({ id: "p-031", address: "Carr. 693 Km 6.2, Bo. Higuillar", zone: "dorado", city: "Dorado", zip: "00646", lat: 18.4562, lng: -66.2638, type: "Casa", status: "active", price: 289000, bd: 3, ba: 2, sqft: 1450, lot: 4200, year: 1994, date: "2026-07-25", dom: 4, source: "cash", condition: "Necesita reparos", rent: 2100 }),
  // --------------------------------------------------------------- RINCÓN
  p({ id: "p-032", address: "Carr. 115 Km 12.4, Bo. Puntas", zone: "rincon", city: "Rincón", zip: "00677", lat: 18.3412, lng: -67.2515, type: "Casa", status: "sold", price: 385000, bd: 3, ba: 2, sqft: 1600, lot: 4500, year: 2005, date: "2026-07-10", dom: 27, source: "cash", condition: "Buena", rent: 2800, str: 230 }),
  p({ id: "p-033", address: "Calle Vista al Mar 8", zone: "rincon", city: "Rincón", zip: "00677", lat: 18.3385, lng: -67.2482, type: "Casa", status: "sold", price: 525000, bd: 4, ba: 3, sqft: 2100, lot: 5100, year: 2011, date: "2026-06-29", dom: 21, source: "cash", condition: "Excelente", rent: 3900, str: 290 }),
  p({ id: "p-034", address: "Bo. Ensenada, Carr. 413 Int.", zone: "rincon", city: "Rincón", zip: "00677", lat: 18.3428, lng: -67.2541, type: "Casa", status: "active", price: 245000, bd: 2, ba: 1, sqft: 1100, lot: 3200, year: 1988, date: "2026-07-27", dom: 2, source: "mls", condition: "Para remodelar", rent: 1700, str: 150 }),
  // ---------------------------------------------------------------- PONCE
  p({ id: "p-035", address: "Calle Comercio 78", zone: "ponce", city: "Ponce", zip: "00717", lat: 18.0118, lng: -66.6128, type: "Casa", status: "sold", price: 98000, bd: 3, ba: 1, sqft: 1000, lot: 2800, year: 1965, date: "2026-07-04", dom: 72, source: "cash", condition: "Necesita reparos", rent: 950 }),
  p({ id: "p-036", address: "Urb. La Alhambra, Calle 14 #22", zone: "ponce", city: "Ponce", zip: "00716", lat: 18.0095, lng: -66.6162, type: "Casa", status: "sold", price: 145000, bd: 4, ba: 2, sqft: 1550, lot: 3400, year: 1983, date: "2026-06-15", dom: 58, source: "mls", condition: "Buena", rent: 1250 }),
  p({ id: "p-037", address: "Calle Marina 89, Playa de Ponce", zone: "ponce", city: "Ponce", zip: "00734", lat: 18.0132, lng: -66.6095, type: "Casa", status: "active", price: 87000, originalPrice: 98000, bd: 3, ba: 1, sqft: 950, lot: 2200, year: 1958, date: "2026-07-20", dom: 9, source: "crim", condition: "Para remodelar", rent: 850 }),
  p({ id: "p-038", address: "Urb. El Tuque, Calle 5 #31", zone: "ponce", city: "Ponce", zip: "00728", lat: 18.0105, lng: -66.6181, type: "Multifamiliar", status: "sold", price: 118000, bd: 4, ba: 2, sqft: 1500, lot: 2600, year: 1970, date: "2026-05-28", dom: 66, source: "cash", condition: "Buena", rent: 1500 }),
  // ------------------------------------------------------------ PALMAS DEL MAR
  p({ id: "p-039", address: "Palmas del Mar, Villa Tranquila 42", zone: "palmas", city: "Humacao", zip: "00791", lat: 18.0892, lng: -65.7985, type: "Townhouse", status: "sold", price: 328000, bd: 3, ba: 2.5, sqft: 1700, lot: 2100, year: 1998, date: "2026-07-13", dom: 32, source: "mls", condition: "Excelente", rent: 2400, str: 190 }),
  p({ id: "p-040", address: "Palmas del Mar, Beach Village 118", zone: "palmas", city: "Humacao", zip: "00791", lat: 18.0865, lng: -65.8012, type: "Apartamento", status: "active", price: 265000, bd: 2, ba: 2, sqft: 1250, year: 2005, date: "2026-07-28", dom: 1, source: "mls", condition: "Excelente", rent: 2000, str: 165 }),
  // ------------------------------------------------------------- MAYAGÜEZ
  p({ id: "p-041", address: "Calle Méndez Vigo 45", zone: "mayaguez", city: "Mayagüez", zip: "00680", lat: 18.2018, lng: -67.1382, type: "Casa", status: "sold", price: 72000, bd: 3, ba: 1, sqft: 980, lot: 2100, year: 1962, date: "2026-06-30", dom: 81, source: "cash", condition: "Para remodelar", rent: 750 }),
  p({ id: "p-042", address: "Urb. Llanos González, Calle 7 #19", zone: "mayaguez", city: "Mayagüez", zip: "00682", lat: 18.1995, lng: -67.1405, type: "Multifamiliar", status: "sold", price: 128000, bd: 5, ba: 3, sqft: 1750, lot: 2800, year: 1975, date: "2026-07-17", dom: 69, source: "registro", condition: "Buena", rent: 1650 }),
  // ----------------------------------------------------- MÁS ZONA METRO
  p({ id: "p-043", address: "Ave. Muñoz Rivera 1200", zone: "santurce", city: "Hato Rey, San Juan", zip: "00918", lat: 18.4412, lng: -66.0645, type: "Comercial", status: "active", price: 550000, bd: 0, ba: 2, sqft: 3200, lot: 5000, year: 1985, date: "2026-07-15", dom: 14, source: "mls", condition: "Buena", rent: 4500 }),
  p({ id: "p-044", address: "Cond. Torre de las Américas, Apt 18C", zone: "santurce", city: "Hato Rey, San Juan", zip: "00918", lat: 18.4398, lng: -66.0668, type: "Apartamento", status: "sold", price: 238000, bd: 2, ba: 2, sqft: 1120, year: 1995, date: "2026-07-07", dom: 25, source: "mls", condition: "Excelente", rent: 1900 }),
  p({ id: "p-045", address: "Calle Cervantes 22, Pueblo Viejo", zone: "guaynabo", city: "Guaynabo", zip: "00969", lat: 18.3625, lng: -66.1128, type: "Casa", status: "sold", price: 112000, bd: 3, ba: 1, sqft: 1050, lot: 1900, year: 1968, date: "2026-06-11", dom: 74, source: "cash", condition: "Para remodelar", rent: 1100 }),
]

export const soldProperties = properties.filter((x) => x.status === "sold")
export const activeListings = properties.filter((x) => x.status === "active")

export const propertyById = (id: string): Property | undefined =>
  properties.find((x) => x.id === id)

export const propertiesByZone = (zoneId: string): Property[] =>
  properties.filter((x) => x.zone === zoneId)

export const propertyTypes: PropertyType[] = [
  "Casa",
  "Apartamento",
  "Townhouse",
  "Multifamiliar",
  "Comercial",
  "Terreno",
]

export const sourceMeta: Record<
  PropertySource,
  { label: string; short: string; exclusive: boolean; description: string }
> = {
  cash: {
    label: "Cash deal · Exclusivo",
    short: "Cash",
    exclusive: true,
    description:
      "Reportado directamente por la red de realtors. No aparece en ningún sistema público.",
  },
  mls: {
    label: "MLS",
    short: "MLS",
    exclusive: false,
    description: "Listado y venta reportada en el sistema MLS de Puerto Rico.",
  },
  registro: {
    label: "Registro de la Propiedad",
    short: "Registro",
    exclusive: false,
    description: "Escritura registrada en el Registro de la Propiedad de PR.",
  },
  crim: {
    label: "CRIM",
    short: "CRIM",
    exclusive: false,
    description: "Data del Centro de Recaudación de Ingresos Municipales.",
  },
}

// ---------------------------------------------------------------------------
// Stats globales para dashboard y marketing
// ---------------------------------------------------------------------------

export const marketStats = {
  totalComparables: 1284,
  cashDealsThisMonth: 23,
  newThisWeek: 47,
  verifiedRealtors: 18,
  municipalities: 32,
  avgRoiMarket: 13.1,
}
