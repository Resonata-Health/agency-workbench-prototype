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

  // Optional, richer fields used by the Sponsor portfolio (clinical trials etc.)
  // Existing Agency offers omit these and render as before.
  offerKind?: OfferKind
  phase?: string                  // e.g. 'Phase 1/2', 'Phase 3'
  arms?: number
  cohorts?: number
  sites?: number
  enrollmentComplete?: boolean
}

export const sponsors = ['CureX Pharmaceuticals', 'Nuveero Therapeutics'] as const
export type SponsorName = (typeof sponsors)[number]

export interface SponsorMeta {
  outreachSentLast7d: number
}

export const sponsorMeta: Record<SponsorName, SponsorMeta> = {
  'CureX Pharmaceuticals': { outreachSentLast7d: 18420 },
  'Nuveero Therapeutics':  { outreachSentLast7d: 7840 }
}

/* ------------------------------------------------------------------ */
/* Agency view: offers assigned to the agency.                         */
/* (Unchanged — keeps existing Agency Workbench flow working as-is.)   */
/* ------------------------------------------------------------------ */

export const careOffersBySponsor: Record<SponsorName, CareOffer[]> = {
  'CureX Pharmaceuticals': [
    {
      id: 'toziret',
      title: 'TOZIRET (retatinib) — RET-Altered Cancer Treatment',
      internalId: 'TOZIRET-001',
      sponsor: 'CureX Pharmaceuticals',
      sponsorShort: 'CureX',
      description:
        'FDA-approved treatment for adult and pediatric patients with RET-altered cancers including NSCLC, thyroid cancer, and MTC. Direct-to-patient awareness campaign.',
      subgroups: 4,
      matchesToDate: 342,
      status: 'inDesign',
      updatedLabel: 'Last updated: Feb 1, 2026',
      officialTitle:
        'FDA-approved treatment for adult and pediatric patients with RET-altered cancers including NSCLC, thyroid cancer, and MTC',
      displayTitle: 'Adult and Pediatric RET-Altered Cancer Treatment',
      activationLabel: 'Jan 15, 2026',
      offerKind: 'approved_treatment'
    },
    {
      id: 'velkara',
      title: 'VELKARA (obistamab) — Moderate-to-Severe Atopic Dermatitis',
      internalId: 'VELK-012',
      sponsor: 'CureX Pharmaceuticals',
      sponsorShort: 'CureX',
      description:
        'Biologic therapy for adults with moderate-to-severe atopic dermatitis inadequately controlled by topical therapies. Patient education and treatment awareness.',
      subgroups: 2,
      matchesToDate: 1204,
      status: 'active',
      updatedLabel: 'Last updated: Sep 3, 2025',
      offerKind: 'approved_treatment'
    },
    {
      id: 'clarimod',
      title: 'CLARIMOD (fenolimide) — Relapsing Multiple Sclerosis',
      internalId: 'CLARI-005',
      sponsor: 'CureX Pharmaceuticals',
      sponsorShort: 'CureX',
      description:
        'Oral disease-modifying therapy for relapsing forms of multiple sclerosis in adults. Physician and patient awareness program.',
      subgroups: 3,
      matchesToDate: 587,
      status: 'active',
      updatedLabel: 'Last updated: Aug 28, 2025',
      offerKind: 'approved_treatment'
    }
  ],
  'Nuveero Therapeutics': [
    {
      id: 'brevanta',
      title: 'BREVANTA (sulecizumab) — Chronic Heart Failure',
      internalId: 'BREV-003',
      sponsor: 'Nuveero Therapeutics',
      sponsorShort: 'Nuveero',
      description:
        'Injectable biologic for adults with symptomatic chronic heart failure with reduced ejection fraction. Direct-to-patient outreach.',
      subgroups: 2,
      matchesToDate: 891,
      status: 'active',
      updatedLabel: 'Last updated: Sep 1, 2025',
      offerKind: 'approved_treatment'
    },
    {
      id: 'lumigen',
      title: 'LUMIGEN (tarocetib) — Advanced Renal Cell Carcinoma',
      internalId: 'LUMI-008',
      sponsor: 'Nuveero Therapeutics',
      sponsorShort: 'Nuveero',
      description:
        'Targeted kinase inhibitor for adults with advanced renal cell carcinoma following prior systemic therapy. HCP and patient awareness.',
      subgroups: 3,
      matchesToDate: 456,
      status: 'inMlrReview',
      updatedLabel: 'Last updated: Aug 15, 2025',
      offerKind: 'approved_treatment'
    }
  ]
}

/* ------------------------------------------------------------------ */
/* Sponsor view: the sponsor's portfolio (clinical trials + treatments)*/
/* This is what the Sponsor persona sees on /sponsor.                  */
/* ------------------------------------------------------------------ */

export const sponsorPortfolioBySponsor: Record<SponsorName, CareOffer[]> = {
  'CureX Pharmaceuticals': [
    {
      id: 'cx3537982',
      title: 'CX3537982 in KRAS G12C Cancer',
      internalId: 'NCT02021234',
      sponsor: 'CureX Pharmaceuticals',
      sponsorShort: 'CureX',
      description:
        'Phase 1/2 study of LY3537982 in patients with solid tumors harboring KRAS G12C mutation. Multiple cohorts including monotherapy and combinations with pembrolizumab, cetuximab, and chemotherapy.',
      subgroups: 0,
      matchesToDate: 0,
      status: 'inDesign',
      updatedLabel: 'Last updated: Aug 20, 2025',
      offerKind: 'clinical_trial',
      officialTitle: 'Study of CX3537982 in Cancer Patients With a Specific Genetic Mutation (KRAS G12C)',
      displayTitle: 'KRAS G12C Targeted Therapy Study',
      phase: 'Phase 1/2',
      cohorts: 7,
      sites: 10
    },
    {
      id: 'toziret-sponsor',
      title: 'TOZIRET (retatinib) - RET-Altered Cancer Treatment',
      internalId: 'TOZIRET-001',
      sponsor: 'CureX Pharmaceuticals',
      sponsorShort: 'CureX',
      description:
        'FDA-approved treatment for adult and pediatric patients with RET-altered cancers including NSCLC, thyroid cancer, and MTC. Direct-to-patient awareness campaign.',
      subgroups: 4,
      matchesToDate: 342,
      status: 'inactive',
      updatedLabel: 'Last updated: Aug 20, 2025',
      offerKind: 'approved_treatment',
      displayTitle: 'Adult and Pediatric RET-Altered Cancer Treatment'
    },
    {
      id: 'tirzepatide-t2d',
      title: 'Tirzepatide in Type 2 Diabetes with Cardiovascular Disease',
      internalId: 'NCT04255433',
      sponsor: 'CureX Pharmaceuticals',
      sponsorShort: 'CureX',
      description:
        'Phase 3 study evaluating tirzepatide versus dulaglutide in adults with type 2 diabetes and increased cardiovascular risk. Primary endpoint: MACE reduction.',
      subgroups: 0,
      matchesToDate: 0,
      status: 'active',
      updatedLabel: 'Last updated: Aug 20, 2025',
      offerKind: 'clinical_trial',
      displayTitle: 'Tirzepatide T2D Cardiovascular Outcomes',
      phase: 'Phase 3',
      arms: 2,
      sites: 47,
      enrollmentComplete: true
    },
    {
      id: 'tirzepatide-t1d',
      title: 'Tirzepatide in Type 1 Diabetes',
      internalId: 'NCT04255433',
      sponsor: 'CureX Pharmaceuticals',
      sponsorShort: 'CureX',
      description:
        'Phase 2 study evaluating tirzepatide versus dulaglutide in adults with type 2 diabetes and increased cardiovascular risk. Primary endpoint: MACE reduction.',
      subgroups: 0,
      matchesToDate: 0,
      status: 'deactivated',
      updatedLabel: 'Last updated: Aug 20, 2025',
      offerKind: 'clinical_trial',
      displayTitle: 'Tirzepatide T1D Outcomes',
      phase: 'Phase 2',
      arms: 2,
      sites: 47,
      enrollmentComplete: true
    }
  ],
  'Nuveero Therapeutics': careOffersBySponsor['Nuveero Therapeutics']
}

export const allOffers: CareOffer[] = [
  ...careOffersBySponsor['CureX Pharmaceuticals'],
  ...careOffersBySponsor['Nuveero Therapeutics'],
  ...sponsorPortfolioBySponsor['CureX Pharmaceuticals'].filter(
    o => !careOffersBySponsor['CureX Pharmaceuticals'].some(a => a.id === o.id)
  )
]

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
