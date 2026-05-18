import type { OfferStatus } from '@/data/mockCareOffers'

/**
 * Client-side status overrides. Survives in-app (router.push) navigation since
 * module state persists without a full reload. Prototype-only — no backend.
 */
const overrides: Record<string, OfferStatus> = {}

export function setOfferStatus(offerId: string, status: OfferStatus) {
  overrides[offerId] = status
}

export function getOfferStatus(offerId: string): OfferStatus | undefined {
  return overrides[offerId]
}
