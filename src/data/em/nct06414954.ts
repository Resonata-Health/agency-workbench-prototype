/**
 * EM seed data for NCT06414954 — NMD Pharma · NMD670 Phase 2b in AChR/MuSK-Ab+ MG.
 * Mirrors the criteria spreadsheet KD shared (only the NCT06414954 column).
 *
 * "Core" slot rows from the source spreadsheet are structural markers per the
 * handoff and are intentionally omitted (the verdict on the concept itself
 * already carries that info).
 */

import type { EmData } from './types'

const MAIN = 'main'

export const NCT06414954_EM: EmData = {
  subgroups: [
    { id: MAIN, label: 'Main cohort' }
  ],
  concepts: [
    {
      id: 'DX-C0000063',
      name: 'Myasthenia gravis, generalized',
      section: 'diagnosis',
      isIndex: true,
      verdicts: { [MAIN]: 'I!' },
      slots: [
        { label: 'Severity: MGFA Class (min)', type: 'ordinal', values: { [MAIN]: 'II' } },
        { label: 'Severity: MGFA Class (max)', type: 'ordinal', values: { [MAIN]: 'IV' } }
      ]
    },
    {
      id: 'BM-C0000077',
      name: 'AChR antibodies',
      section: 'biomarkers',
      verdicts: { [MAIN]: 'I' },
      slots: [
        { label: 'BM/ResultType', type: 'result-type', values: { [MAIN]: 'Present' } }
      ]
    },
    {
      id: 'BM-C0000056',
      name: 'MuSK antibodies',
      section: 'biomarkers',
      verdicts: { [MAIN]: 'I' },
      slots: [
        { label: 'BM/ResultType', type: 'result-type', values: { [MAIN]: 'Present' } }
      ]
    },
    {
      id: 'DM-C0000001',
      name: 'Age (Years)',
      section: 'demographics',
      verdicts: { [MAIN]: 'I' },
      slots: [
        { label: 'min', type: 'numeric', values: { [MAIN]: '18' } }
      ]
    },
    {
      id: 'SI00000014',
      name: 'Breastfeeding',
      section: 'screening',
      verdicts: { [MAIN]: 'E' }
    },
    {
      id: 'SI00000013',
      name: 'Pregnancy',
      section: 'screening',
      verdicts: { [MAIN]: 'E' }
    }
  ]
}
