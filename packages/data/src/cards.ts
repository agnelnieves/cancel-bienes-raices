import type { CreditCard } from "./types"

// ============================================================================
// Tarjetas de crédito — Credit Utilization Planner (mock)
// ============================================================================

export const mockCreditCards: CreditCard[] = [
  {
    id: "cc-001",
    name: "Freedom Unlimited",
    issuer: "Chase",
    creditLimit: 15000,
    currentBalance: 3450,
    apr: 22.49,
    promoApr: null,
    promoEnds: null,
    dueDay: 15,
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
    promoApr: null,
    promoEnds: null,
    dueDay: 20,
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
    promoApr: 0,
    promoEnds: "2027-02-01",
    dueDay: 10,
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
    promoApr: null,
    promoEnds: null,
    dueDay: 25,
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
    promoApr: null,
    promoEnds: null,
    dueDay: 12,
    rewards: "Puntos Popular",
    allocated: 4000,
  },
  {
    id: "cc-006",
    name: "Sapphire Preferred",
    issuer: "Chase",
    creditLimit: 18000,
    currentBalance: 0,
    apr: 21.74,
    promoApr: 0,
    promoEnds: "2026-12-15",
    dueDay: 8,
    rewards: "3x viajes y dining",
    allocated: 0,
  },
]

export const utilization = (card: CreditCard): number =>
  Math.round(((card.currentBalance + card.allocated) / card.creditLimit) * 100)
