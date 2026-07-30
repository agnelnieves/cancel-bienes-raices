// ============================================================================
// Motor del asistente — determinista hoy, reemplazable por un LLM mañana.
// La interfaz (EngineResult) está diseñada para que un modelo real devuelva
// exactamente la misma forma de respuesta vía tool calling.
// ============================================================================

import {
  activeListings,
  contractors,
  formatCompact,
  formatCurrency,
  formatPercent,
  properties,
  soldProperties,
  sourceMeta,
  zoneById,
  zones,
  type Property,
} from "@cancel/data"
import type { AssistantCard, EngineResult } from "./types"

// ---------------------------------------------------------------------------
// Normalización y extracción de entidades
// ---------------------------------------------------------------------------

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")

interface Entities {
  zoneIds: string[]
  maxPrice: number | null
  targetPrice: number | null
  beds: number | null
  type: string | null
  strategy: "flip" | "alquiler" | "airbnb" | null
  wantsActive: boolean
  wantsCash: boolean
  ordinal: number | null
}

const ZONE_ALIASES: Record<string, string[]> = {
  metro: ["condado", "santurce", "viejo-san-juan", "guaynabo", "bayamon", "isla-verde"],
  oeste: ["rincon", "mayaguez"],
  este: ["palmas", "isla-verde"],
  playa: ["condado", "isla-verde", "rincon", "palmas", "dorado"],
  "san juan": ["condado", "santurce", "viejo-san-juan"],
}

function extractEntities(raw: string): Entities {
  const text = normalize(raw)
  const zoneIds = new Set<string>()

  for (const z of zones) {
    if (text.includes(normalize(z.name)) || text.includes(normalize(`${z.name}, ${z.city}`))) {
      zoneIds.add(z.id)
    }
  }
  for (const [alias, ids] of Object.entries(ZONE_ALIASES)) {
    if (new RegExp(`\\b${alias}\\b`).test(text)) ids.forEach((id) => zoneIds.add(id))
  }

  let maxPrice: number | null = null
  let targetPrice: number | null = null
  const moneyRe = /\$?\s*(\d+(?:[.,]\d+)?)\s*(k|mil|m|mm)?/g
  let m: RegExpExecArray | null
  while ((m = moneyRe.exec(text))) {
    let v = parseFloat(m[1].replace(",", "."))
    const suf = m[2]
    if (suf === "k" || suf === "mil") v *= 1000
    if (suf === "m" || suf === "mm") v *= 1_000_000
    if (v < 1000) continue // ignora números sueltos pequeños
    const around = text.slice(Math.max(0, m.index - 20), m.index)
    if (/menos de|bajo|hasta|max|tope|por debajo/.test(around)) maxPrice = v
    else targetPrice = v
  }

  const bedsMatch = text.match(/(\d)\s*(?:cuartos?|habitaciones?|recamaras?|hab\b|bd\b)/)
  const beds = bedsMatch ? parseInt(bedsMatch[1]) : null

  let type: string | null = null
  if (/apartamento|apto|condominio|condo/.test(text)) type = "Apartamento"
  else if (/multifamiliar|multi/.test(text)) type = "Multifamiliar"
  else if (/townhouse|town house/.test(text)) type = "Townhouse"
  else if (/comercial|local/.test(text)) type = "Comercial"
  else if (/terreno|solar/.test(text)) type = "Terreno"
  else if (/\bcasas?\b/.test(text)) type = "Casa"

  let strategy: Entities["strategy"] = null
  if (/flip|flipear|revender|reventa/.test(text)) strategy = "flip"
  else if (/airbnb|corta estancia|str\b|short.?term/.test(text)) strategy = "airbnb"
  else if (/alquiler|renta|rental/.test(text)) strategy = "alquiler"

  return {
    zoneIds: [...zoneIds],
    maxPrice,
    targetPrice,
    beds,
    type,
    strategy,
    wantsActive: /activos?|en venta|listados?|disponibles?/.test(text),
    wantsCash: /cash|efectivo/.test(text),
    ordinal: /primer[oa]?|la 1/.test(text)
      ? 1
      : /segund[oa]?|la 2/.test(text)
        ? 2
        : /tercer[oa]?|la 3/.test(text)
          ? 3
          : null,
  }
}

// ---------------------------------------------------------------------------
// Búsqueda con relajación progresiva de filtros
// ---------------------------------------------------------------------------

function search(e: Entities): { results: Property[]; relaxed: string[] } {
  const pool = e.wantsActive ? activeListings : properties
  const relaxed: string[] = []

  const passes = (p: Property, lvl: number): boolean => {
    if (e.zoneIds.length && !e.zoneIds.includes(p.zone)) return false
    if (lvl < 2 && e.maxPrice && p.price > e.maxPrice) return false
    if (lvl < 1 && e.type && p.type !== e.type) return false
    if (lvl < 1 && e.beds && p.bedrooms < e.beds) return false
    if (e.wantsCash && p.source !== "cash") return false
    return true
  }

  for (let lvl = 0; lvl <= 2; lvl++) {
    const results = pool.filter((p) => passes(p, lvl))
    if (results.length > 0) {
      if (lvl >= 1) relaxed.push("amplié los filtros de tipo/cuartos")
      if (lvl >= 2) relaxed.push("quité el límite de precio")
      return {
        results: results.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6),
        relaxed,
      }
    }
  }
  return { results: [], relaxed }
}

// ---------------------------------------------------------------------------
// Intents
// ---------------------------------------------------------------------------

const isGreeting = (t: string) =>
  /^(hola|buenas|hey|saludos|que tal|klk|wepa)\b/.test(t.trim())

const isHelp = (t: string) =>
  /ayuda|que puedes|como funcionas|que haces|capacidades/.test(t)

const isMarketPulse = (t: string) =>
  /pulso|mercado|tendencia|como esta|zonas calientes|resumen/.test(t)

const isSearch = (t: string) =>
  /busca|encuentra|muestra|comparable|propiedad|deal|que hay|ensename|ver /.test(t)

const isCalc = (t: string) =>
  /calcula|roi|cash ?flow|numeros|rentabilidad|retorno/.test(t)

const isRehab = (t: string) =>
  /remodel|reparar|construccion|cuanto cuesta|renovar|rehab/.test(t)

const isAddPipeline = (t: string) =>
  /(anade|agrega|guarda|mete|pon|manda|suma).*(pipeline|deal|tracker)/.test(t) ||
  /(pipeline|deal|tracker).*(anade|agrega|guarda|mete|suma)/.test(t)

const isCompare = (t: string) => /compara/.test(t)

const isContractor = (t: string) =>
  /contratista|plomero|electricista|techero|pintor|carpintero|handyman|quien (me )?(remodel|repar|pint|instal)|inspeccion/.test(
    t
  )

const CONTRACTOR_TRADE_MAP: [RegExp, string][] = [
  [/electric/, "electricidad"],
  [/plomer/, "plomeria"],
  [/techo/, "techos"],
  [/pint/, "pintura"],
  [/aire|mini.?split/, "aires"],
  [/carpinter|gabinete/, "carpinteria"],
  [/losa|piso/, "pisos"],
  [/verja|exterior/, "exteriores"],
  [/ventana/, "ventanas"],
  [/inspeccion/, "inspeccion"],
]

export function interpret(input: string, lastPropertyIds: string[]): EngineResult {
  const t = normalize(input)
  const e = extractEntities(input)

  // -------------------------------------------------------------- saludo
  if (isGreeting(t)) {
    return {
      thinking: [],
      reply:
        "¡Wepa! Soy tu copiloto de inversión. Puedo buscar comparables, correr números de ROI, estimar remodelaciones y mover deals en tu pipeline — todo con la data de Puerto Rico, incluyendo los cash deals exclusivos de la red. ¿Qué buscamos hoy?",
      cards: [
        { type: "nav", label: "Ver pulso del mercado", href: "/", description: "Cómo están tus zonas esta semana" },
      ],
      propertyIds: [],
    }
  }

  // -------------------------------------------------------------- ayuda
  if (isHelp(t)) {
    return {
      thinking: [],
      reply:
        "Esto es lo que puedo hacer por ti:\n\n• **Buscar comparables** — \"busca casas en Bayamón bajo $200K\"\n• **Correr números** — \"calcula el ROI de un apartamento en Condado de $380K\"\n• **Estimar remodelación** — \"cuánto cuesta remodelar 1,200 pies cuadrados\"\n• **Manejar tu pipeline** — \"añade la primera al pipeline\"\n• **Pulso del mercado** — \"cómo está el mercado en Rincón\"\n\nHáblame natural, en español o spanglish. Yo me encargo del resto.",
      cards: [],
      propertyIds: [],
    }
  }

  // ---------------------------------------------------- añadir al pipeline
  if (isAddPipeline(t)) {
    const ids = e.ordinal ? [lastPropertyIds[e.ordinal - 1]] : lastPropertyIds.slice(0, 1)
    const prop = ids[0] ? properties.find((p) => p.id === ids[0]) : undefined
    if (!prop) {
      return {
        thinking: [],
        reply:
          "No tengo una propiedad en contexto todavía. Primero dime algo como \"busca casas en Bayamón bajo $200K\" y luego me dices \"añade la primera al pipeline\".",
        cards: [],
        propertyIds: [],
      }
    }
    return {
      thinking: ["Creando deal en tu pipeline…"],
      reply: `Listo — añadí **${prop.address}** (${formatCurrency(prop.price)}) a tu pipeline como prospecto. Puedes verlo y moverlo de etapa en el Deal Tracker.`,
      cards: [
        { type: "properties", title: "Añadida al pipeline", properties: [prop] },
        { type: "nav", label: "Abrir Deal Tracker", href: "/deals" },
      ],
      propertyIds: [prop.id],
      addDealPropertyId: prop.id,
    }
  }

  // -------------------------------------------------------------- contratistas
  if (isContractor(t)) {
    const match = CONTRACTOR_TRADE_MAP.find(([re]) => re.test(t))
    const trade = match?.[1]
    const count = trade
      ? contractors.filter((c) => c.trades.includes(trade as (typeof c.trades)[number])).length
      : contractors.length
    return {
      thinking: ["Buscando en la red de contratistas vetados…"],
      reply: trade
        ? `Tengo **${count} profesionales** de ese oficio en la red — todos con licencia verificada, seguro al día y referencias de miembros de la comunidad. Te dejé el filtro puesto:`
        : `La red tiene **${count} contratistas vetados** — electricistas, plomeros, techeros, remodelación completa y más. Todos pasaron el proceso de verificación de la comunidad (licencia DACO + seguro + referencias).`,
      cards: [
        {
          type: "nav",
          label: "Ver contratistas",
          href: trade ? `/contratistas?oficio=${trade}` : "/contratistas",
          description: trade
            ? "Con el filtro de oficio ya aplicado"
            : "Filtra por oficio, municipio y rating",
        },
      ],
      propertyIds: [],
    }
  }

  // -------------------------------------------------------------- comparar
  if (isCompare(t)) {
    return {
      thinking: [],
      reply:
        "Para comparar, toca el botón **Comparar** en cualquier propiedad (hasta 5) y te llevo al comparador con scoring automático. Si quieres, dime \"busca apartamentos en Isla Verde\" y te enseño opciones para ir añadiendo.",
      cards: [{ type: "nav", label: "Abrir comparador", href: "/comparador" }],
      propertyIds: [],
    }
  }

  // -------------------------------------------------------------- remodelación
  if (isRehab(t)) {
    const sqftMatch = t.match(/(\d{3,5})\s*(pies|pc|sq|metros|ft)/)
    const sqft = sqftMatch ? parseInt(sqftMatch[1]) : null
    return {
      thinking: ["Preparando el estimador de remodelación…"],
      reply: sqft
        ? `Dale — abrí el estimador con **${sqft.toLocaleString()} pies cuadrados**. Ajusta el alcance (cocina, baños, pisos…) y el nivel de acabado, y te da el presupuesto detallado con precios de PR.`
        : "Dale — abrí el estimador de remodelación. Dime los pies cuadrados y el alcance del trabajo, y te armo el presupuesto con precios reales de PR (mano de obra incluida).",
      cards: [{ type: "nav", label: "Abrir estimador", href: "/estimador", description: "Presupuesto por partida con precios locales" }],
      propertyIds: [],
      action: "open-estimador",
    }
  }

  // -------------------------------------------------------------- cálculo ROI
  if (isCalc(t)) {
    const { results } = search(e)
    const prop = results[0]
    const desc = prop
      ? `Pre-llené la calculadora con ${prop.address} — ${formatCurrency(prop.price)}, renta est. ${formatCurrency(prop.estimatedRent)}/mes.`
      : "La calculadora está lista — métete y corre los números."
    return {
      thinking: prop
        ? ["Buscando la propiedad…", "Pre-llenando la calculadora…"]
        : ["Abriendo la calculadora…"],
      reply: prop
        ? `${desc} Modo ${e.strategy === "airbnb" ? "Airbnb" : e.strategy === "flip" ? "Flip" : "Alquiler"}. Ajústalo a tu gusto — cap rate, cash-on-cash y break-even se calculan solos.`
        : "Te llevé a la calculadora de ROI. Pon precio, renta y gastos — cap rate, cash-on-cash y break-even se calculan solos. También puedes decirme \"calcula el ROI de una casa en Ponce de $90K\" y la pre-lleno yo.",
      cards: [
        ...(prop ? [{ type: "properties", title: "Analizando", properties: [prop] } as AssistantCard] : []),
        { type: "nav", label: "Abrir calculadora", href: "/calculadora" },
      ],
      propertyIds: prop ? [prop.id] : [],
      action: "open-calculadora",
      prefillPropertyId: prop?.id,
      prefillMode: e.strategy === "airbnb" ? "airbnb" : e.strategy === "flip" ? "flip" : "alquiler",
    }
  }

  // -------------------------------------------------------------- pulso del mercado
  if (isMarketPulse(t)) {
    const list = e.zoneIds.length ? e.zoneIds.map(zoneById).filter(Boolean) : zones.slice(0, 4)
    const items = list.map((z) => ({
      label: `${z!.name}, ${z!.city}`,
      value: `$${z!.medianPpsf}/pc`,
      delta: `${z!.yoyChange > 0 ? "+" : ""}${formatPercent(z!.yoyChange)} año`,
    }))
    const hottest = [...zones].sort((a, b) => b.yoyChange - a.yoyChange)[0]
    return {
      thinking: ["Leyendo tendencias de las zonas…"],
      reply: e.zoneIds.length
        ? `Así está ${list.map((z) => z!.name).join(", ")}:`
        : `Pulso rápido: **${hottest.name}** es la zona más caliente (+${formatPercent(hottest.yoyChange)} año contra año), y ${zones.find((z) => z.id === "rincon")!.name} tiene la mayor proporción de cash deals (${zones.find((z) => z.id === "rincon")!.cashShare}%). Detalles:`,
      cards: [{ type: "stats", title: "Mediana de precio por pie cuadrado", items }],
      propertyIds: [],
    }
  }

  // -------------------------------------------------------------- búsqueda
  const looksLikeSearch =
    isSearch(t) || e.zoneIds.length > 0 || e.maxPrice !== null || e.type !== null

  if (looksLikeSearch) {
    const { results, relaxed } = search(e)
    if (results.length === 0) {
      return {
        thinking: ["Buscando en la base de datos…"],
        reply:
          "No encontré nada con esos filtros exactos. Prueba con otra zona, sube el presupuesto, o dime algo como \"casas en Caguas bajo $150K\". Recuerda que la data de cash deals cubre sobre todo zona metro, Rincón, Ponce y Caguas por ahora.",
        cards: [],
        propertyIds: [],
      }
    }
    const cashCount = results.filter((p) => p.source === "cash").length
    const medianPpsf = Math.round(
      results.reduce((a, p) => a + p.pricePerSqFt, 0) / results.length
    )
    const where = e.zoneIds.length
      ? e.zoneIds.map((id) => zoneById(id)!.name).join(", ")
      : "Puerto Rico"
    const priceNote = e.maxPrice ? ` bajo ${formatCompact(e.maxPrice)}` : ""
    const typeNote = e.type ? ` (${e.type.toLowerCase()})` : ""

    return {
      thinking: [
        `Buscando ${e.wantsActive ? "listados activos" : "comparables"} en ${where}…`,
        "Cruzando MLS, Registro y la red de cash deals…",
        ...(cashCount ? [`${cashCount} cash deal${cashCount > 1 ? "s" : ""} exclusivo${cashCount > 1 ? "s" : ""} encontrado${cashCount > 1 ? "s" : ""}…`] : []),
      ],
      reply: `Encontré **${results.length} ${e.wantsActive ? "listados" : "comparables"}** en ${where}${priceNote}${typeNote}. Mediana: **$${medianPpsf}/pc**.${cashCount ? ` ${cashCount} ${cashCount > 1 ? "son" : "es"} **cash deal${cashCount > 1 ? "s" : ""}** — data que no sale en ningún otro sistema.` : ""}${relaxed.length ? ` (Nota: ${relaxed.join(" y ")}.)` : ""} Puedes guardarlas, compararlas o decirme \"añade la primera al pipeline\".`,
      cards: [
        { type: "properties", title: `${e.wantsActive ? "Listados" : "Comparables"} · ${where}`, properties: results },
        { type: "nav", label: "Ver en el buscador", href: "/comparables", description: "Con filtros, mapa y más resultados" },
      ],
      propertyIds: results.map((p) => p.id),
    }
  }

  // -------------------------------------------------------------- fallback
  return {
    thinking: [],
    reply:
      "Hmm, no estoy seguro de qué necesitas. Prueba algo como:\n\n• \"Busca casas en Bayamón bajo $200K\"\n• \"Calcula el ROI de un apartamento en Condado\"\n• \"¿Cómo está el mercado en Rincón?\"\n• \"Cuánto cuesta remodelar 1,200 pies\"\n\nO dime \"ayuda\" para ver todo lo que puedo hacer.",
    cards: [],
    propertyIds: [],
  }
}
