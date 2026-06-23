'use client'

import type { CareOffer } from '@/data/mockCareOffers'
import { EmCriteriaStep } from './EmCriteriaStep'
import { NCT06414954_EM } from '@/data/em/nct06414954'
import { TOZIRET_001_EM } from '@/data/em/toziret-001'
import { STARTER_EM } from '@/data/em/starter'
import type { EmData } from '@/data/em/types'

// Offers with a dedicated EM seed render their real data; everything else
// gets the starter EM (one Main cohort, zero concepts — user builds from there).
const EM_BY_OFFER_ID: Record<string, EmData> = {
  'nmd670-mg': NCT06414954_EM,
  'toziret':   TOZIRET_001_EM
}

export function CriteriaStep({ offer }: { offer: CareOffer }) {
  const seed = EM_BY_OFFER_ID[offer.id] ?? STARTER_EM
  return <EmCriteriaStep offer={offer} seed={seed} />
}
