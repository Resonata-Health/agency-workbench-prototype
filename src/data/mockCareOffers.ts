/**
 * Light data registry for the prototype.
 *
 * One source of truth: the OFFERS array. Each entry is a CareOffer with
 * optional EM seed and an agencyAssigned flag. Everything else derives:
 *   - sponsorPortfolioBySponsor → all offers per sponsor
 *   - careOffersBySponsor       → only offers with agencyAssigned = true
 *   - allOffers / findOffer     → lookups
 *
 * To add a new offer:
 *   1. Drop an EM seed file in src/data/em/<slug>.ts (or skip — STARTER_EM
 *      kicks in if `em` is omitted).
 *   2. Add a new entry to OFFERS below. Set `agencyAssigned: true` if the
 *      offer should also show up on the Agency landing.
 *
 * To add a new sponsor:
 *   1. Append the sponsor name to `sponsors` and update `sponsorMeta`.
 *   2. Add one or more offer entries with that sponsor.
 */

import type { EmData } from './em/types'
import { NCT06414954_EM } from './em/nct06414954'
import { IMAAVY_EM } from './em/imaavy'

export type OfferStatus = 'active' | 'inMlrReview' | 'inDesign' | 'inactive' | 'deactivated' | 'rejectedByMlr'

export type OfferKind = 'approved_treatment' | 'clinical_trial'

export interface CareOffer {
  id: string
  title: string
  internalId: string
  sponsor: string
  sponsorShort: string
  description: string
  subgroups: number
  matchesToDate: number
  status: OfferStatus
  isNew?: boolean
  updatedLabel: string
  officialTitle?: string
  displayTitle?: string
  activationLabel?: string

  // Clinical-trial fields (rendered on the card meta line when present).
  offerKind?: OfferKind
  phase?: string
  arms?: number
  cohorts?: number
  sites?: number
  enrollmentComplete?: boolean

  // Eligibility matrix seed. Falls back to STARTER_EM when omitted.
  em?: EmData

  // True = also visible on the Agency landing for this sponsor. Default false.
  agencyAssigned?: boolean
}

export const sponsors = ['NMD Pharma', 'Janssen'] as const
export type SponsorName = (typeof sponsors)[number]

export interface SponsorMeta {
  outreachSentLast7d: number
}

export const sponsorMeta: Record<SponsorName, SponsorMeta> = {
  'NMD Pharma': { outreachSentLast7d: 0 },
  'Janssen':    { outreachSentLast7d: 0 }
}

/* ------------------------------------------------------------------ */
/* The registry. One record per care option.                          */
/* ------------------------------------------------------------------ */

const OFFERS: CareOffer[] = [
  {
    id: 'nmd670-mg',
    title: 'NMD670 in adult AChR/MuSK-Ab+ Myasthenia Gravis',
    internalId: 'NCT06414954',
    sponsor: 'NMD Pharma',
    sponsorShort: 'NMD',
    description:
      'Proof-of-concept, dose range finding study of NMD670 in adult patients with AChR or MuSK antibody positive MG.',
    subgroups: 0,
    matchesToDate: 0,
    status: 'inDesign',
    updatedLabel: 'Last updated: Jun 17, 2026',
    offerKind: 'clinical_trial',
    officialTitle:
      'A Phase 2b, Randomised, Double-Blind, Placebo-Controlled Study to Evaluate the Efficacy, Safety, and Tolerability of 3 Dose Levels of NMD670 Over 21 Days in Adult Patients With AChR/MuSK-Ab+ Myasthenia Gravis',
    displayTitle: 'NMD670 for AChR/MuSK-Ab+ Myasthenia Gravis',
    phase: 'Phase 2',
    em: NCT06414954_EM
    // agencyAssigned omitted → sponsor-only (no Agency landing entry)
  },
  {
    id: 'imaavy',
    title: 'Nipocalimab (Imaavy) for patients ≥12 years who are AChR or MuSK positive',
    internalId: 'Imaavy',
    sponsor: 'Janssen',
    sponsorShort: 'Janssen',
    description:
      'Nipocalimab (Imaavy) is a high-affinity humanized monoclonal antibody FcRn blocker administered intravenously. FDA approved for generalized myasthenia gravis in adults and pediatric patients 12 years and older who are AChR or MuSK antibody positive.',
    subgroups: 1,
    matchesToDate: 0,
    status: 'active',
    updatedLabel: 'Last updated: Jun 18, 2026',
    offerKind: 'approved_treatment',
    officialTitle:
      'Nipocalimab (Imaavy) is a high-affinity humanized monoclonal antibody FcRn blocker administered intravenously. It reduces circulating IgG levels including pathogenic autoantibodies by blocking the neonatal Fc receptor. FDA approved for generalized myasthenia gravis in adults and pediatric patients 12 years and older who are AChR or MuSK antibody positive, offering treatment across a broader age range than some other approved therapies.',
    displayTitle: 'Generalized Myasthenia Gravis (AChR or MuSK Antibody Positive, age ≥12)',
    em: IMAAVY_EM,
    agencyAssigned: true
  }
]

/* ------------------------------------------------------------------ */
/* Derived views                                                       */
/* ------------------------------------------------------------------ */

export const allOffers: CareOffer[] = OFFERS

function emptyBySponsor(): Record<SponsorName, CareOffer[]> {
  const out = {} as Record<SponsorName, CareOffer[]>
  for (const s of sponsors) out[s] = []
  return out
}

export const sponsorPortfolioBySponsor: Record<SponsorName, CareOffer[]> = OFFERS.reduce(
  (acc, o) => {
    if ((sponsors as readonly string[]).includes(o.sponsor)) {
      acc[o.sponsor as SponsorName].push(o)
    }
    return acc
  },
  emptyBySponsor()
)

export const careOffersBySponsor: Record<SponsorName, CareOffer[]> = OFFERS.reduce(
  (acc, o) => {
    if (o.agencyAssigned && (sponsors as readonly string[]).includes(o.sponsor)) {
      acc[o.sponsor as SponsorName].push(o)
    }
    return acc
  },
  emptyBySponsor()
)

export function findOffer(id: string | null | undefined): CareOffer {
  return allOffers.find(o => o.id === id) ?? allOffers[0]
}

export interface SetupFields {
  offerId: string
  sponsor: string
  officialTitle: string
  displayTitle: string
  briefSummary: string
  offerType: string
  geographies: string[]
  createdLabel: string
  lastUpdatedLabel: string
  activationLabel: string
}

export function setupFieldsFor(offer: CareOffer): SetupFields {
  const dashIndex = offer.title.search(/[—-]/)
  const derivedDisplayTitle =
    dashIndex >= 0 ? offer.title.slice(dashIndex + 1).trim() : offer.title
  const lastUpdated = offer.updatedLabel.replace(/^Last updated:\s*/i, '')

  return {
    offerId: offer.internalId,
    sponsor: offer.sponsor,
    officialTitle: offer.officialTitle ?? offer.description,
    displayTitle: offer.displayTitle ?? derivedDisplayTitle,
    briefSummary: offer.description,
    offerType: offer.offerKind === 'clinical_trial' ? 'Clinical Trial' : 'Approved Treatment',
    geographies: ['US'],
    createdLabel: '—',
    lastUpdatedLabel: lastUpdated,
    activationLabel: offer.activationLabel ?? 'Set when activated'
  }
}
