'use client'

import type { CareOffer } from '@/data/mockCareOffers'
import { EmCriteriaStep } from './EmCriteriaStep'
import { STARTER_EM } from '@/data/em/starter'

export function CriteriaStep({ offer }: { offer: CareOffer }) {
  // Each offer carries its EM seed in mockCareOffers.ts; STARTER_EM is the
  // empty fallback (one Main cohort, zero concepts).
  return <EmCriteriaStep offer={offer} seed={offer.em ?? STARTER_EM} />
}
