/**
 * Mock eligibility-criteria matrix for the Sponsor Setup wizard (step 2).
 * Modeled after KD's spec for NCT02021234 (CX3537982 in KRAS G12C cancer).
 *
 * Used as the default matrix for any care option in the prototype until
 * each offer carries its own criteria payload.
 */

export type CellValue = 'IN' | 'EX' | null

export interface Criterion {
  label: string
  /** Cell value per subgroup (parallel to SUBGROUPS array). */
  cells: CellValue[]
}

export interface CriteriaCategory {
  name: string
  criteria: Criterion[]
}

export const SUBGROUPS = [
  'Dose Escalation',
  'Dose Expansion Mono',
  'NSCLC + Nombro',
  'NSCLC + Chemo',
  'CRC + Bruximab',
  'Pancreatic',
  'CNS Mets'
] as const

export const CATEGORIES: CriteriaCategory[] = [
  {
    name: 'Index Conditions',
    criteria: [
      { label: 'Solid tumor',                cells: ['IN', 'IN', null, null, null, null, 'IN'] },
      { label: 'Non-small cell lung cancer', cells: [null, null, 'IN', 'IN', null, null, null] },
      { label: 'Colorectal cancer',          cells: [null, null, null, null, 'IN', null, null] },
      { label: 'Pancreatic cancer',          cells: [null, null, null, null, null, 'IN', null] }
    ]
  },
  {
    name: 'Disease Descriptors',
    criteria: [
      { label: 'Locally advanced/unresectable/metastatic', cells: ['IN', 'IN', 'IN', 'IN', 'IN', 'IN', 'IN'] }
    ]
  },
  {
    name: 'Biomarkers',
    criteria: [
      { label: 'KRAS G12C mutation', cells: ['IN', 'IN', 'IN', 'IN', 'IN', 'IN', 'IN'] }
    ]
  },
  {
    name: 'Clinical Scores',
    criteria: [
      { label: 'ECOG ≤ 1', cells: ['IN', 'IN', 'IN', 'IN', 'IN', 'IN', 'IN'] }
    ]
  },
  {
    name: 'Secondary Conditions',
    criteria: [
      { label: 'Untreated active CNS metastases', cells: ['EX', 'EX', 'EX', 'EX', 'EX', 'EX', null] },
      { label: 'Active CNS metastases',           cells: [null, null, null, null, null, null, 'IN'] },
      { label: 'Leptomeningeal disease',          cells: ['EX', 'EX', 'EX', 'EX', 'EX', 'EX', 'EX'] }
    ]
  },
  {
    name: 'Comorbidities',
    criteria: [
      { label: 'Serious cardiac condition',  cells: ['EX', 'EX', 'EX', 'EX', 'EX', 'EX', 'EX'] },
      { label: 'Active autoimmune disease',  cells: [null, null, 'EX', 'EX', null, null, null] }
    ]
  },
  {
    name: 'Other Medications',
    criteria: [
      { label: 'Live vaccine within 30 days', cells: [null, null, 'EX', 'EX', null, null, null] }
    ]
  },
  {
    name: 'Demographics',
    criteria: [
      { label: 'Age ≥ 18 years', cells: ['IN', 'IN', 'IN', 'IN', 'IN', 'IN', 'IN'] }
    ]
  }
]
