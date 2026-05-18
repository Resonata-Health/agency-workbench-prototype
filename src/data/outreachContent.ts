import type { CareOffer } from '@/data/mockCareOffers'
import { setupFieldsFor } from '@/data/mockCareOffers'

export type Artifact = 'email' | 'card' | 'details'

export interface EmailDraft {
  templateId: string
  fromEmail: string
  fromName: string
  subject: string
  greeting: string
  body: string
  calloutTitle: string
  calloutBody: string
  ctaLabel: string
  footerText: string
}

export interface CardDraft {
  templateId: string
  headline: string
  subtext: string
  ctaLabel: string
}

export interface DetailsKpi { value: string; label: string }
export interface DetailsSection { heading: string; body: string }

export interface DetailsDraft {
  templateId: string
  howItWorksHeading: string
  howItWorks: string
  kpis: DetailsKpi[]
  dataSource: string
  whatToExpect: string
  safetyCommon: string
  safetySerious: string
  safetyDoNot: string
  safetyDisclaimer: string
  ctaEyebrow: string
  ctaHeadline: string
  ctaSub: string
  ctaPrimary: string
  ctaSecondary: string
  isi: DetailsSection[]
  footerDisclosure: string
}

export interface OutreachDrafts {
  email: EmailDraft
  card: CardDraft
  details: DetailsDraft
}

/** Read-only fields inherited from the offer (locked in the editor). */
export interface InheritedMeta {
  drugName: string          // e.g. "TOZIRET (retatinib)"
  brand: string             // e.g. "TOZIRET"
  parentheticalSrc: string  // e.g. "retatinib"
  displayTitle: string      // e.g. "Adult and Pediatric RET-Altered Cancer Treatment"
  sponsor: string           // e.g. "CureX Pharmaceuticals"
  sponsorShort: string      // e.g. "CureX"
  approvalBadge: string     // "FDA-APPROVED"
  matchBadge: string        // "FULL MATCH"
  therapyCategory: string
  therapyType: string
  genericName: string
  recipientCount: number
  recipientBreakdown: string
}

export const templateOptions: Record<Artifact, string[]> = {
  email: [
    'Initial outreach — Approved drug',
    'Follow-up nudge (no open)',
    'Reminder — interest expressed',
    'Trial-style consent invite'
  ],
  card: [
    'Approved drug — Full match',
    'Approved drug — Near match',
    'Clinical trial — Full match',
    'Compassionate use'
  ],
  details: [
    'FDA-approved drug — long form',
    'FDA-approved drug — concise',
    'Clinical trial — Phase 3',
    'Clinical trial — early phase',
    'Expanded access program'
  ]
}

export const defaultTemplate: Record<Artifact, string> = {
  email: templateOptions.email[0],
  card: templateOptions.card[0],
  details: templateOptions.details[0]
}

export const artifactHint: Record<Artifact, string> = {
  email: '',
  card: 'Card in the patient match list. Click any dashed region to edit.',
  details: 'Opens after “Learn more”. Long-form rich text with a required ISI section.'
}

export function inheritedFor(offer: CareOffer): InheritedMeta {
  const fields = setupFieldsFor(offer)
  const drugName = offer.title.split('—')[0].trim()          // "TOZIRET (retatinib)"
  const brand = drugName.replace(/\s*\(.*\)\s*$/, '').trim()  // "TOZIRET"
  const m = drugName.match(/\(([^)]+)\)/)
  const generic = m ? m[1] : ''
  return {
    drugName,
    brand,
    parentheticalSrc: generic,
    displayTitle: fields.displayTitle,
    sponsor: offer.sponsor,
    sponsorShort: offer.sponsorShort,
    approvalBadge: 'FDA-APPROVED',
    matchBadge: 'FULL MATCH',
    therapyCategory: 'Medication',
    therapyType: 'Targeted therapy',
    genericName: generic,
    recipientCount: 187,
    recipientBreakdown: '· RET-altered (124) · MTC (63) · de-identified'
  }
}

/** Build the seeded drafts for an offer (the default-template content). */
export function seedDrafts(offer: CareOffer): OutreachDrafts {
  const meta = inheritedFor(offer)
  const brand = meta.brand

  return {
    email: {
      templateId: defaultTemplate.email,
      fromEmail: 'trials@resonata.health',
      fromName: `${brand} care team`,
      subject: `You may be eligible for ${meta.drugName} — a new treatment option`,
      greeting: 'Hi {{first_name}},',
      body:
        `Based on the information in your Resonata profile, you may be eligible for ${meta.drugName}, ${offer.description}\n\n` +
        `This message is part of a sponsored treatment information program. Resonata is an independent patient matching platform; sponsored placement does not affect your match results.`,
      calloutTitle: 'What happens next:',
      calloutBody: `Click below to view the treatment details. A specialist will reach out if you're interested.`,
      ctaLabel: `Learn more about ${brand} →`,
      footerText:
        `You're receiving this because you opted in to Resonata matches. Unsubscribe · Privacy`
    },
    card: {
      templateId: defaultTemplate.card,
      headline: `Want to learn more about ${brand}?`,
      subtext: 'Cost support options, how it works, and what to expect — all in one place.',
      ctaLabel: `Learn More About ${brand} →`
    },
    details: {
      templateId: defaultTemplate.details,
      howItWorksHeading: `How ${brand} works`,
      howItWorks:
        `${meta.drugName} is a targeted therapy. ${offer.description}\n\n` +
        `Talk to your doctor about whether this treatment is appropriate for your specific situation.`,
      kpis: [
        { value: '—', label: 'Primary endpoint result (template default — replace with label-supported data)' },
        { value: '—', label: 'Secondary measure (template default)' },
        { value: 'Age 12+', label: 'Approved population (template default)' }
      ],
      dataSource:
        'Data from the registrational trial. Individual results may vary. Source: Prescribing Information.',
      whatToExpect:
        'Dosing: As described in the approved labeling.\n' +
        'Setting: Administered by a healthcare provider.\n' +
        'Monitoring: Your doctor will monitor your response and adjust as needed.\n' +
        'Duration: Treatment continues as long as your doctor determines it is beneficial.\n' +
        'Drug interactions: Tell your doctor about all medications you take.',
      safetyCommon: 'Headache\nFatigue\nNausea\nInfusion or injection site reactions',
      safetySerious:
        'Serious infections\nHypersensitivity reactions (including anaphylaxis)\nOther risks described in the full Prescribing Information',
      safetyDoNot:
        'Have a known serious hypersensitivity to the drug or its excipients\nHave an unresolved serious infection',
      safetyDisclaimer:
        'This is not a complete list. See the Important Safety Information below and talk to your doctor.',
      ctaEyebrow: `FROM ${meta.sponsor.toUpperCase()}`,
      ctaHeadline: 'Ready to take the next step?',
      ctaSub: 'Learn about financial support options and find a specialist near you.',
      ctaPrimary: 'Learn about cost support options',
      ctaSecondary: 'Find a specialist near you',
      isi: [
        { heading: 'SERIOUS INFECTIONS', body: 'Monitor for signs and symptoms of infection during treatment. Ensure patients are current on recommended vaccinations prior to initiating treatment.' },
        { heading: 'HYPERSENSITIVITY REACTIONS', body: 'Serious hypersensitivity reactions, including anaphylaxis, have been observed. Discontinue immediately for severe reactions and institute appropriate treatment.' },
        { heading: 'ADVERSE REACTIONS', body: 'The most common adverse reactions are listed in the Safety profile section above and in the full Prescribing Information.' },
        { heading: 'USE IN SPECIFIC POPULATIONS', body: 'Discuss pregnancy and lactation considerations with your doctor. May cause fetal harm based on mechanism of action.' }
      ],
      footerDisclosure:
        `This page was prepared by ${meta.sponsor} and is subject to FDA promotional review. Content reflects the approved labeling. This page is hosted by Resonata Health, Inc. as part of its sponsored treatment information program. Resonata is an independent patient matching platform; sponsored placement does not affect match results.`
    }
  }
}

/** Minimal scaffold for "New from blank" — Details keeps the ISI placeholder. */
export function blankDrafts(offer: CareOffer): OutreachDrafts {
  const seeded = seedDrafts(offer)
  return {
    email: {
      ...seeded.email,
      subject: '',
      greeting: 'Hi {{first_name}},',
      body: '',
      calloutTitle: '',
      calloutBody: '',
      ctaLabel: 'Learn more →'
    },
    card: { ...seeded.card, headline: '', subtext: '', ctaLabel: 'Learn more →' },
    details: {
      ...seeded.details,
      howItWorks: '',
      whatToExpect: '',
      safetyCommon: '',
      safetySerious: '',
      safetyDoNot: '',
      ctaHeadline: '',
      ctaSub: '',
      isi: [{ heading: 'IMPORTANT SAFETY INFORMATION', body: 'Required. Add the approved ISI content for this product.' }]
    }
  }
}
