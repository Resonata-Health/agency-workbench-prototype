/**
 * Mock store for sent outreach campaigns + agency budget.
 * Module memory — survives in-app navigation, resets on hard reload.
 */

export interface CampaignSend {
  id: string
  offerId: string
  sentAtLabel: string
  fullCount: number
  partialCount: number
  costPerEmail: number
}

export const COST_PER_EMAIL = 1645
export const AGENCY_BUDGET  = 50_000

const byOfferId = new Map<string, CampaignSend[]>()
let counter = 0

function nowLabel(): string {
  try {
    return new Date().toLocaleString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit'
    })
  } catch {
    return 'Just now'
  }
}

export function recordSend(offerId: string, fullCount: number, partialCount: number): CampaignSend {
  counter += 1
  const send: CampaignSend = {
    id: `cs-${counter}`,
    offerId,
    sentAtLabel: nowLabel(),
    fullCount,
    partialCount,
    costPerEmail: COST_PER_EMAIL
  }
  const list = byOfferId.get(offerId) ?? []
  list.unshift(send) // newest first
  byOfferId.set(offerId, list)
  return send
}

export function getCampaigns(offerId: string): CampaignSend[] {
  return byOfferId.get(offerId) ?? []
}

export function campaignTotal(c: CampaignSend): number {
  return (c.fullCount + c.partialCount) * c.costPerEmail
}

export function totalSpent(): number {
  let total = 0
  for (const list of byOfferId.values()) {
    for (const c of list) total += campaignTotal(c)
  }
  return total
}

export function remainingBudget(): number {
  return Math.max(0, AGENCY_BUDGET - totalSpent())
}
