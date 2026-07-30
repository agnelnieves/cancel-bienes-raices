// ============================================================================
// Finanzas — helpers de la calculadora
// ============================================================================

/** Pago mensual de hipoteca (P&I) */
export function monthlyPayment(
  principal: number,
  annualRatePct: number,
  years: number
): number {
  if (principal <= 0) return 0
  const r = annualRatePct / 100 / 12
  const n = years * 12
  if (r === 0) return principal / n
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export interface RentalInputs {
  price: number
  closingPct: number
  rehab: number
  financed: boolean
  downPct: number
  ratePct: number
  years: number
  monthlyRent: number
  taxesAnnual: number
  insuranceAnnual: number
  hoaMonthly: number
  maintenancePct: number
  vacancyPct: number
  mgmtPct: number
}

export interface RentalResult {
  cashNeeded: number
  loanAmount: number
  mortgageMonthly: number
  grossMonthly: number
  expensesMonthly: number
  noiMonthly: number
  cashFlowMonthly: number
  capRate: number
  cashOnCash: number
  breakEvenMonths: number | null
  dscr: number | null
  totalAnnualExpenses: number
}

export function computeRental(i: RentalInputs): RentalResult {
  const closing = (i.price * i.closingPct) / 100
  const loanAmount = i.financed ? i.price * (1 - i.downPct / 100) : 0
  const downPayment = i.financed ? i.price - loanAmount : i.price
  const cashNeeded = downPayment + closing + i.rehab
  const mortgageMonthly = i.financed
    ? monthlyPayment(loanAmount, i.ratePct, i.years)
    : 0

  const vacancy = (i.monthlyRent * i.vacancyPct) / 100
  const maintenance = (i.monthlyRent * i.maintenancePct) / 100
  const mgmt = (i.monthlyRent * i.mgmtPct) / 100
  const opexMonthly =
    vacancy + maintenance + mgmt + i.taxesAnnual / 12 + i.insuranceAnnual / 12 + i.hoaMonthly

  const grossMonthly = i.monthlyRent
  const noiMonthly = grossMonthly - opexMonthly
  const cashFlowMonthly = noiMonthly - mortgageMonthly

  const totalCost = i.price + closing + i.rehab
  const capRate = totalCost > 0 ? ((noiMonthly * 12) / totalCost) * 100 : 0
  const cashOnCash =
    cashNeeded > 0 ? ((cashFlowMonthly * 12) / cashNeeded) * 100 : 0
  const breakEvenMonths =
    cashFlowMonthly > 0 ? Math.ceil(cashNeeded / cashFlowMonthly) : null
  const dscr = mortgageMonthly > 0 ? noiMonthly / mortgageMonthly : null

  return {
    cashNeeded,
    loanAmount,
    mortgageMonthly,
    grossMonthly,
    expensesMonthly: opexMonthly + mortgageMonthly,
    noiMonthly,
    cashFlowMonthly,
    capRate,
    cashOnCash,
    breakEvenMonths,
    dscr,
    totalAnnualExpenses: opexMonthly * 12,
  }
}

export interface FlipInputs {
  price: number
  rehab: number
  closingBuyPct: number
  holdingMonths: number
  holdingMonthly: number
  sellingPct: number
  arv: number
}

export interface FlipResult {
  totalInvestment: number
  sellingCosts: number
  netProfit: number
  roi: number
  annualizedRoi: number
  marginOnArv: number
  breakEvenSale: number
}

export function computeFlip(i: FlipInputs): FlipResult {
  const closingBuy = (i.price * i.closingBuyPct) / 100
  const holding = i.holdingMonths * i.holdingMonthly
  const totalInvestment = i.price + i.rehab + closingBuy + holding
  const sellingCosts = (i.arv * i.sellingPct) / 100
  const netProfit = i.arv - totalInvestment - sellingCosts
  const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0
  const annualizedRoi =
    i.holdingMonths > 0 ? roi * (12 / i.holdingMonths) : roi
  const marginOnArv = i.arv > 0 ? (netProfit / i.arv) * 100 : 0
  const breakEvenSale = totalInvestment / (1 - i.sellingPct / 100)

  return {
    totalInvestment,
    sellingCosts,
    netProfit,
    roi,
    annualizedRoi,
    marginOnArv,
    breakEvenSale,
  }
}

export interface StrInputs {
  adr: number
  occupancyPct: number
  cleaningPerStay: number
  avgStayNights: number
  platformPct: number
  mgmtPct: number
  utilitiesMonthly: number
}

export interface StrResult {
  nightsBooked: number
  grossMonthly: number
  netMonthly: number
  expensesMonthly: number
}

export function computeStr(i: StrInputs): StrResult {
  const nightsBooked = Math.round(30 * (i.occupancyPct / 100))
  const stays = i.avgStayNights > 0 ? nightsBooked / i.avgStayNights : 0
  const grossMonthly = nightsBooked * i.adr + stays * i.cleaningPerStay
  const platform = (grossMonthly * i.platformPct) / 100
  const mgmt = (grossMonthly * i.mgmtPct) / 100
  const expensesMonthly = platform + mgmt + i.utilitiesMonthly
  return {
    nightsBooked,
    grossMonthly,
    expensesMonthly,
    netMonthly: grossMonthly - expensesMonthly,
  }
}

/** Proyección a 10 años para la gráfica */
export function projection10Years(
  r: RentalResult,
  i: RentalInputs,
  appreciationPct = 3,
  rentGrowthPct = 2
) {
  return Array.from({ length: 11 }, (_, year) => {
    const value = i.price * Math.pow(1 + appreciationPct / 100, year)
    const rent = i.monthlyRent * Math.pow(1 + rentGrowthPct / 100, year)
    const scale = i.monthlyRent > 0 ? rent / i.monthlyRent : 1
    const cf = r.cashFlowMonthly * scale
    return {
      year: `Año ${year}`,
      valor: Math.round(value),
      acumulado: Math.round(cf * 12 * year + r.cashNeeded * 0), // cash flow acumulado
    }
  })
}
