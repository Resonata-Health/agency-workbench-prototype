export type OfferStatus = 'active' | 'inMlrReview' | 'inDesign' | 'inactive' | 'deactivated' | 'rejectedByMlr'

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
      activationLabel: 'Jan 15, 2026'
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
      updatedLabel: 'Last updated: Sep 3, 2025'
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
      updatedLabel: 'Last updated: Aug 28, 2025'
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
      updatedLabel: 'Last updated: Sep 1, 2025'
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
      updatedLabel: 'Last updated: Aug 15, 2025'
    }
  ]
}

export const allOffers: CareOffer[] = [
  ...careOffersBySponsor['CureX Pharmaceuticals'],
  ...careOffersBySponsor['Nuveero Therapeutics']
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
    offerType: 'Approved Treatment',
    geographies: ['US'],
    createdLabel: '—',
    lastUpdatedLabel: lastUpdated,
    activationLabel: offer.activationLabel ?? 'Set when activated'
  }
}
