/**
 * Shared types for the Sponsor Eligibility Matrix (EM).
 * Modeled on HANDOFF-3-Sponsor-EM-Build.md.
 */

export type Verdict = 'I' | 'E' | 'I!' | 'E!' | null

export type SlotType = 'numeric' | 'ordinal' | 'category' | 'duration' | 'result-type'

export interface Subgroup {
  id: string
  label: string
}

export interface Slot {
  label: string
  type: SlotType
  /** subgroupId -> value (string) or null when not set */
  values: Record<string, string | null>
  /** Tooltip text. Used by antisignal slots to explain the inverse semantics. */
  helpText?: string
}

export interface TandemSlot extends Slot {
  /** Gate condition that must be true for the slot to apply, e.g. "Physiological state: AF". */
  tandemIf: string
}

export interface CompoundComponent {
  id?: string
  name: string
}

export interface Concept {
  id: string
  /** Display name, e.g. "Myasthenia gravis, generalized". */
  name: string
  /** Section/category ID, e.g. 'diagnosis'. */
  section: string
  /** True if the concept is the inclusion index for this CO. */
  isIndex?: boolean
  /** True if the concept is the exclusion index for this CO. */
  isExIndex?: boolean
  /** subgroupId -> verdict */
  verdicts: Record<string, Verdict>
  slots?: Slot[]
  /** Inverse-semantics slots. Render after regular slots with an [A] prefix. */
  antisignalSlots?: Slot[]
  /** Conditional slots gated by `tandemIf`. Render after antisignal slots with an IF pill. */
  tandemSlots?: TandemSlot[]

  // Compound rule support — concept stands in for a boolean group of sub-criteria.
  isCompound?: boolean
  compoundOp?: 'OR' | 'AND' | 'EXCEPT' | 'IF'
  compoundExpr?: string
  components?: CompoundComponent[]
}

export interface Section {
  id: string
  /** Display name, uppercased in the UI. */
  name: string
  /** Add-row CTA, e.g. "+ Add Biomarker". */
  addLabel: string
}

/** Canonical section order (handoff table). Only those used in the prototype are seeded. */
export const CANONICAL_SECTIONS: Section[] = [
  { id: 'diagnosis',     name: 'DIAGNOSIS',              addLabel: '+ Add Condition' },
  { id: 'clinical_find', name: 'CLINICAL FINDING',       addLabel: '+ Add Finding' },
  { id: 'disease_desc',  name: 'DISEASE CHARACTERISTIC', addLabel: '+ Add Characteristic' },
  { id: 'histology',     name: 'HISTOLOGY',              addLabel: '+ Add Histology' },
  { id: 'anatomic',      name: 'ANATOMIC LOCATION',      addLabel: '+ Add Location' },
  { id: 'secondary',     name: 'SECONDARY CONDITION',    addLabel: '+ Add Condition' },
  { id: 'scores',        name: 'CLINICAL SCORE',         addLabel: '+ Add Score' },
  { id: 'biomarkers',    name: 'BIOMARKERS',             addLabel: '+ Add Biomarker' },
  { id: 'medications',   name: 'MEDICATIONS',            addLabel: '+ Add Medication' },
  { id: 'procedures',    name: 'PROCEDURES',             addLabel: '+ Add Procedure' },
  { id: 'allergies',     name: 'ALLERGIES / ADVERSE EVENT', addLabel: '+ Add Allergy/AE' },
  { id: 'lab_values',    name: 'LAB VALUES',             addLabel: '+ Add Lab Value' },
  { id: 'vitals',        name: 'VITAL SIGNS',            addLabel: '+ Add Vital Sign' },
  { id: 'diagnostic',    name: 'DIAGNOSTIC DATA',        addLabel: '+ Add Diagnostic' },
  { id: 'encounter',     name: 'ENCOUNTER',              addLabel: '+ Add Encounter' },
  { id: 'social',        name: 'SOCIAL FACTORS',         addLabel: '+ Add Factor' },
  { id: 'demographics',  name: 'DEMOGRAPHICS',           addLabel: '+ Add Demographic' },
  { id: 'group_param',   name: 'GROUP PARAMETRIC',       addLabel: '+ Add Group Parametric' },
  { id: 'group_def',     name: 'GROUP DEFINITIONAL',     addLabel: '+ Add Group Definition' },
  { id: 'screening',     name: 'SCREENING',              addLabel: '+ Add Criterion' }
]

/** Option lists for ordinal/category/result-type slot pickers. */
export const ORDINAL_SCALES: Record<string, string[]> = {
  'MGFA Class': ['I', 'II', 'IIa', 'IIb', 'III', 'IIIa', 'IIIb', 'IV', 'IVa', 'IVb', 'V'],
  'NYHA Class': ['I', 'II', 'III', 'IV'],
  'ECOG':       ['0', '1', '2', '3', '4']
}
export const CATEGORY_OPTIONS: Record<string, string[]> = {
  'Disease Control':     ['Active', 'Inactive', 'Latent', 'Resolved'],
  'Treatment Response':  ['Improvement', 'Stable', 'Worsening', 'No Response']
}
export const RESULT_TYPE_OPTIONS = ['Present', 'Absent', 'Positive', 'Negative']
export const DURATION_UNITS      = ['months', 'years']

export interface EmData {
  subgroups: Subgroup[]
  concepts: Concept[]
  /** Per-section fold overrides. e.g. { diagnosis: 'AND' } renders the INDEX: AND banner under the Diagnosis header. */
  sectionFoldOverrides?: Record<string, 'AND' | 'OR'>
}
