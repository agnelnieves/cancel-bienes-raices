// ============================================================================
// Formatting helpers — es-PR / USD
// ============================================================================

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const usdExact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const num = new Intl.NumberFormat("en-US")

export function formatCurrency(value: number): string {
  return usd.format(value)
}

export function formatCurrencyExact(value: number): string {
  return usdExact.format(value)
}

/** $120K / $1.4M — formato compacto para pills y mapas */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) {
    const v = value / 1_000_000
    return `$${v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}M`
  }
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`
  return `$${value}`
}

export function formatNumber(value: number): string {
  return num.format(value)
}

export function formatPercent(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`
}

export function formatSigned(value: number, digits = 1): string {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(digits)}%`
}

export function formatDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00`)
  return new Intl.DateTimeFormat("es-PR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

export function formatDateShort(iso: string): string {
  const date = new Date(`${iso}T12:00:00`)
  return new Intl.DateTimeFormat("es-PR", {
    day: "numeric",
    month: "short",
  }).format(date)
}

/** Parsea input de dinero flexible: "120k", "$120,000", "120 mil" → 120000 */
export function parseMoney(input: string): number | null {
  const cleaned = input.toLowerCase().replace(/[$,\s]/g, "")
  const match = cleaned.match(/^(\d+(?:\.\d+)?)(k|mil|m|mm)?$/)
  if (!match) return null
  let value = parseFloat(match[1])
  const suffix = match[2]
  if (suffix === "k" || suffix === "mil") value *= 1_000
  if (suffix === "m" || suffix === "mm") value *= 1_000_000
  return value
}
