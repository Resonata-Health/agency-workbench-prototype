/**
 * EM seed for BREVANTA (sulecizumab) — Nuveero · Chronic Heart Failure.
 * Ported from sponsor-em-hf.html. Exercises the full V2 EM pattern set:
 *   - I! (inclusion index) and E! (exclusion index)
 *   - Antisignal [A] slot rows
 *   - TANDEM IF conditional slots
 *   - Compound rules with expandable components
 *   - INDEX: AND fold override on Diagnosis
 */

import type { EmData } from './types'

const HFREF  = 'hfref'
const HFMREF = 'hfmref'
const HFPEF  = 'hfpef'

export const BREVANTA_EM: EmData = {
  subgroups: [
    { id: HFREF,  label: 'HFrEF (EF <40%)' },
    { id: HFMREF, label: 'HFmrEF (EF 40–49%)' },
    { id: HFPEF,  label: 'HFpEF (EF ≥50%)' }
  ],
  sectionFoldOverrides: { diagnosis: 'AND' },
  concepts: [
    // ── DIAGNOSIS ─────────────────────────────────────────────────────────
    {
      id: 'DX-HF001',
      name: 'Heart failure',
      section: 'diagnosis',
      isIndex: true,
      verdicts: { [HFREF]: 'I!', [HFMREF]: 'I!', [HFPEF]: 'I!' },
      slots: [
        { label: 'Severity: NYHA Class (min)', type: 'ordinal',
          values: { [HFREF]: 'II', [HFMREF]: 'II', [HFPEF]: 'II' } },
        { label: 'Severity: NYHA Class (max)', type: 'ordinal',
          values: { [HFREF]: 'IV', [HFMREF]: 'III', [HFPEF]: 'III' } },
        { label: 'LVEF (%) — min', type: 'numeric',
          values: { [HFREF]: null, [HFMREF]: '40', [HFPEF]: '50' } },
        { label: 'LVEF (%) — max', type: 'numeric',
          values: { [HFREF]: '40', [HFMREF]: '49', [HFPEF]: null } }
      ],
      antisignalSlots: [
        { label: '[A] LVEF (%) — nadir (Ever)', type: 'numeric',
          helpText: 'If LVEF was EVER below this threshold, exclude patient.',
          values: { [HFREF]: '15', [HFMREF]: '15', [HFPEF]: null } }
      ]
    },
    {
      id: 'DX-MAL001',
      name: 'Active malignancy',
      section: 'diagnosis',
      isExIndex: true,
      verdicts: { [HFREF]: 'E!', [HFMREF]: 'E!', [HFPEF]: 'E!' },
      slots: [
        { label: 'Exception: non-melanoma skin cancer', type: 'category',
          values: { [HFREF]: 'Allowed', [HFMREF]: 'Allowed', [HFPEF]: 'Allowed' } }
      ]
    },
    {
      id: 'DX-AF001',
      name: 'Atrial fibrillation',
      section: 'diagnosis',
      verdicts: { [HFREF]: 'I', [HFMREF]: 'I', [HFPEF]: 'I' },
      slots: [
        { label: 'Rhythm type', type: 'category',
          values: { [HFREF]: 'Persistent', [HFMREF]: 'Persistent', [HFPEF]: 'Paroxysmal' } }
      ]
    },
    {
      id: 'DX-CA001',
      name: 'Cardiac amyloidosis',
      section: 'diagnosis',
      verdicts: { [HFREF]: null, [HFMREF]: 'I', [HFPEF]: 'I' }
    },

    // ── DISEASE CHARACTERISTIC ────────────────────────────────────────────
    {
      id: 'DC-CHR001',
      name: 'Chronic / stable disease',
      section: 'disease_desc',
      verdicts: { [HFREF]: 'I', [HFMREF]: 'I', [HFPEF]: 'I' },
      slots: [
        { label: 'Stability duration (min)', type: 'duration',
          values: { [HFREF]: '3 months', [HFMREF]: '3 months', [HFPEF]: '6 months' } }
      ]
    },
    {
      id: 'DC-REF001',
      name: 'Refractory disease',
      section: 'disease_desc',
      verdicts: { [HFREF]: 'E', [HFMREF]: 'E', [HFPEF]: null }
    },

    // ── CLINICAL SCORES ───────────────────────────────────────────────────
    {
      id: 'CS-BNP001',
      name: 'BNP (pg/mL)',
      section: 'scores',
      verdicts: { [HFREF]: 'I', [HFMREF]: 'I', [HFPEF]: 'I' },
      tandemSlots: [
        { label: 'BNP — min', type: 'numeric', tandemIf: 'Physiological state: AF',
          values: { [HFREF]: '250', [HFMREF]: '250', [HFPEF]: '300' } },
        { label: 'BNP — min', type: 'numeric', tandemIf: 'Physiological state: Sinus rhythm',
          values: { [HFREF]: '100', [HFMREF]: '100', [HFPEF]: '150' } }
      ]
    },
    {
      id: 'CS-6MWT001',
      name: '6MWT distance (meters)',
      section: 'scores',
      verdicts: { [HFREF]: 'I', [HFMREF]: 'I', [HFPEF]: null },
      slots: [
        { label: 'min', type: 'numeric', values: { [HFREF]: '100', [HFMREF]: '150', [HFPEF]: null } },
        { label: 'max', type: 'numeric', values: { [HFREF]: '450', [HFMREF]: '500', [HFPEF]: null } }
      ]
    },

    // ── BIOMARKERS ────────────────────────────────────────────────────────
    {
      id: 'BM-NT001',
      name: 'NT-proBNP (pg/mL)',
      section: 'biomarkers',
      verdicts: { [HFREF]: 'I', [HFMREF]: 'I', [HFPEF]: 'I' },
      slots: [
        { label: 'min', type: 'numeric', values: { [HFREF]: '400', [HFMREF]: '300', [HFPEF]: '300' } }
      ],
      tandemSlots: [
        { label: 'NT-proBNP — min', type: 'numeric', tandemIf: 'Physiological state: AF',
          values: { [HFREF]: '900', [HFMREF]: '600', [HFPEF]: '900' } },
        { label: 'NT-proBNP — min', type: 'numeric', tandemIf: 'Physiological state: Sinus rhythm',
          values: { [HFREF]: '400', [HFMREF]: '300', [HFPEF]: '300' } }
      ]
    },
    {
      id: 'BM-TROP001',
      name: 'Troponin I (ng/mL)',
      section: 'biomarkers',
      verdicts: { [HFREF]: 'I', [HFMREF]: null, [HFPEF]: 'I' },
      slots: [
        { label: 'max', type: 'numeric', values: { [HFREF]: '0.04', [HFMREF]: null, [HFPEF]: '0.04' } }
      ]
    },
    {
      id: 'BM-TTR001',
      name: 'TTR mutation',
      section: 'biomarkers',
      verdicts: { [HFREF]: null, [HFMREF]: 'I', [HFPEF]: 'I' },
      slots: [
        { label: 'BM/ResultType', type: 'result-type',
          values: { [HFREF]: null, [HFMREF]: 'Present', [HFPEF]: 'Present' } }
      ],
      antisignalSlots: [
        { label: '[A] TTR Mutation — Variant (protective)', type: 'category',
          helpText: 'Protective variants should NOT trigger the inclusion.',
          values: { [HFREF]: null, [HFMREF]: 'R104H', [HFPEF]: 'T119M' } }
      ]
    },

    // ── MEDICATIONS ───────────────────────────────────────────────────────
    {
      id: 'DB-ACE001',
      name: 'ACE inhibitor / ARB',
      section: 'medications',
      verdicts: { [HFREF]: 'I', [HFMREF]: 'I', [HFPEF]: null },
      slots: [
        { label: 'Stable dose duration (min)', type: 'duration',
          values: { [HFREF]: '1 months', [HFMREF]: '1 months', [HFPEF]: null } }
      ]
    },
    {
      id: 'DB-BB001',
      name: 'Beta-blocker',
      section: 'medications',
      verdicts: { [HFREF]: 'I', [HFMREF]: 'I', [HFPEF]: 'I' },
      slots: [
        { label: 'Stable dose duration (min)', type: 'duration',
          values: { [HFREF]: '1 months', [HFMREF]: '1 months', [HFPEF]: '1 months' } }
      ]
    },
    {
      id: 'DB-SGLT2001',
      name: 'SGLT2 inhibitor',
      section: 'medications',
      verdicts: { [HFREF]: 'I', [HFMREF]: 'I', [HFPEF]: null },
      slots: [
        { label: 'Stable dose duration (min)', type: 'duration',
          values: { [HFREF]: '1 months', [HFMREF]: '1 months', [HFPEF]: null } }
      ]
    },
    {
      id: 'DB-RTX001',
      name: 'Rituximab',
      section: 'medications',
      verdicts: { [HFREF]: 'E', [HFMREF]: 'E', [HFPEF]: null },
      slots: [
        { label: 'Recency (within)', type: 'duration',
          values: { [HFREF]: '12 months', [HFMREF]: '12 months', [HFPEF]: null } }
      ]
    },

    // ── PROCEDURES ────────────────────────────────────────────────────────
    {
      id: 'PR-HT001',
      name: 'Prior heart transplant',
      section: 'procedures',
      verdicts: { [HFREF]: 'E', [HFMREF]: 'E', [HFPEF]: 'E' }
    },

    // ── LAB VALUES ────────────────────────────────────────────────────────
    {
      id: 'MS-EGFR001',
      name: 'eGFR (mL/min/1.73m²)',
      section: 'lab_values',
      verdicts: { [HFREF]: 'E', [HFMREF]: 'E', [HFPEF]: 'E' },
      slots: [
        { label: 'threshold (below = exclude)', type: 'numeric',
          values: { [HFREF]: '30', [HFMREF]: '30', [HFPEF]: '25' } }
      ]
    },
    {
      id: 'MS-HGB001',
      name: 'Hemoglobin (g/dL)',
      section: 'lab_values',
      verdicts: { [HFREF]: 'E', [HFMREF]: 'E', [HFPEF]: null },
      slots: [
        { label: 'threshold (below = exclude)', type: 'numeric',
          values: { [HFREF]: '9', [HFMREF]: '9', [HFPEF]: null } }
      ]
    },
    {
      id: 'MS-K001',
      name: 'Potassium (mEq/L)',
      section: 'lab_values',
      verdicts: { [HFREF]: 'E', [HFMREF]: 'E', [HFPEF]: 'E' },
      slots: [
        { label: 'range low (below = exclude)',  type: 'numeric',
          values: { [HFREF]: '3.5', [HFMREF]: '3.5', [HFPEF]: '3.5' } },
        { label: 'range high (above = exclude)', type: 'numeric',
          values: { [HFREF]: '5.5', [HFMREF]: '5.5', [HFPEF]: '5.5' } }
      ]
    },

    // ── DEMOGRAPHICS ──────────────────────────────────────────────────────
    {
      id: 'DM-AGE',
      name: 'Age (Years)',
      section: 'demographics',
      verdicts: { [HFREF]: 'I', [HFMREF]: 'I', [HFPEF]: 'I' },
      slots: [
        { label: 'min', type: 'numeric', values: { [HFREF]: '18', [HFMREF]: '18', [HFPEF]: '18' } },
        { label: 'max', type: 'numeric', values: { [HFREF]: '80', [HFMREF]: '80', [HFPEF]: '85' } }
      ]
    },

    // ── GROUP PARAMETRIC (compound rule) ──────────────────────────────────
    {
      id: 'GR-CNS001',
      name: 'CNS disorder',
      section: 'group_param',
      isCompound: true,
      compoundOp: 'OR',
      compoundExpr: 'Epilepsy OR Neurodegenerative disease OR CNS vasculitis',
      components: [
        { id: 'GR-CNS001-a', name: 'Epilepsy' },
        { id: 'GR-CNS001-b', name: 'Neurodegenerative disease' },
        { id: 'GR-CNS001-c', name: 'CNS vasculitis' }
      ],
      verdicts: { [HFREF]: 'E', [HFMREF]: 'E', [HFPEF]: null }
    },

    // ── SCREENING ─────────────────────────────────────────────────────────
    {
      id: 'SI00000013',
      name: 'Pregnancy',
      section: 'screening',
      verdicts: { [HFREF]: 'E', [HFMREF]: 'E', [HFPEF]: 'E' }
    },
    {
      id: 'SI00000014',
      name: 'Breastfeeding',
      section: 'screening',
      verdicts: { [HFREF]: 'E', [HFMREF]: 'E', [HFPEF]: 'E' }
    }
  ]
}
