/**
 * EM seed data for TOZIRET-001 — CureX · TOZIRET (retatinib) for RET-altered
 * adult & pediatric cancers (NSCLC, MTC, differentiated thyroid cancer).
 * Prototype data — plausible criteria, not the regulatory truth.
 */

import type { EmData } from './types'

const NSCLC = 'nsclc'
const THYR  = 'thyroid'
const PED   = 'pediatric'

export const TOZIRET_001_EM: EmData = {
  subgroups: [
    { id: NSCLC, label: 'Adult NSCLC (RET+)' },
    { id: THYR,  label: 'Adult Thyroid (RET+)' },
    { id: PED,   label: 'Pediatric (RET+)' }
  ],
  concepts: [
    {
      id: 'DX-NSCLC',
      name: 'Non-small cell lung cancer',
      section: 'diagnosis',
      verdicts: { [NSCLC]: 'I', [THYR]: null, [PED]: null }
    },
    {
      id: 'DX-MTC',
      name: 'Medullary thyroid carcinoma',
      section: 'diagnosis',
      verdicts: { [NSCLC]: null, [THYR]: 'I', [PED]: null }
    },
    {
      id: 'DX-DTC',
      name: 'Differentiated thyroid cancer',
      section: 'diagnosis',
      verdicts: { [NSCLC]: null, [THYR]: 'I', [PED]: null }
    },
    {
      id: 'DX-SOLID-RET',
      name: 'RET-altered solid tumor',
      section: 'diagnosis',
      verdicts: { [NSCLC]: null, [THYR]: null, [PED]: 'I' }
    },
    {
      id: 'DC-METAST',
      name: 'Locally advanced / metastatic',
      section: 'disease_desc',
      verdicts: { [NSCLC]: 'I', [THYR]: 'I', [PED]: 'I' }
    },
    {
      id: 'BM-RET-FUSION',
      name: 'RET gene fusion',
      section: 'biomarkers',
      isIndex: true,
      verdicts: { [NSCLC]: 'I!', [THYR]: 'I!', [PED]: 'I!' },
      slots: [
        { label: 'BM/ResultType', type: 'result-type', values: { [NSCLC]: 'Positive', [THYR]: 'Positive', [PED]: 'Positive' } }
      ]
    },
    {
      id: 'BM-RET-MUT',
      name: 'RET activating mutation',
      section: 'biomarkers',
      verdicts: { [NSCLC]: null, [THYR]: 'I!', [PED]: 'I!' },
      slots: [
        { label: 'BM/ResultType', type: 'result-type', values: { [NSCLC]: null, [THYR]: 'Positive', [PED]: 'Positive' } }
      ]
    },
    {
      id: 'CS-ECOG-ADULT',
      name: 'ECOG performance status',
      section: 'scores',
      verdicts: { [NSCLC]: 'I', [THYR]: 'I', [PED]: null },
      slots: [
        { label: 'ECOG (max)', type: 'ordinal', values: { [NSCLC]: '2', [THYR]: '2', [PED]: null } }
      ]
    },
    {
      id: 'DM-AGE',
      name: 'Age (Years)',
      section: 'demographics',
      verdicts: { [NSCLC]: 'I', [THYR]: 'I', [PED]: 'I' },
      slots: [
        { label: 'min', type: 'numeric', values: { [NSCLC]: '18', [THYR]: '18', [PED]: '12' } },
        { label: 'max', type: 'numeric', values: { [NSCLC]: null, [THYR]: null, [PED]: '17' } }
      ]
    },
    {
      id: 'SC-CNS-SYMP',
      name: 'Symptomatic CNS metastases',
      section: 'secondary',
      verdicts: { [NSCLC]: 'E', [THYR]: 'E', [PED]: 'E' }
    },
    {
      id: 'SI-PREG',
      name: 'Pregnancy',
      section: 'screening',
      verdicts: { [NSCLC]: 'E', [THYR]: 'E', [PED]: 'E' }
    },
    {
      id: 'SI-BF',
      name: 'Breastfeeding',
      section: 'screening',
      verdicts: { [NSCLC]: 'E', [THYR]: 'E', [PED]: 'E' }
    }
  ]
}
