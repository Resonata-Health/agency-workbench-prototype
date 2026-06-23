/**
 * EM seed for Imaavy (nipocalimab) — Janssen.
 * FDA-approved approved treatment for generalized MG in patients ≥12,
 * AChR or MuSK positive. Single approved population (no subgroups).
 */

import type { EmData } from './types'

const MAIN = 'main'

export const IMAAVY_EM: EmData = {
  subgroups: [
    { id: MAIN, label: 'Approved population' }
  ],
  concepts: [
    {
      id: 'DX-C0000063',
      name: 'Myasthenia gravis, generalized',
      section: 'diagnosis',
      isIndex: true,
      verdicts: { [MAIN]: 'I!' }
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
        { label: 'min', type: 'numeric', values: { [MAIN]: '12' } }
      ]
    }
  ]
}
