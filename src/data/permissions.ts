/**
 * Permissions model for the Resonata Workbench prototype.
 *
 * - Personas are the user-facing "view as" selector (agency / sponsor / mlr).
 * - Roles are what the admin matrix toggles.
 * - Capabilities are atomic abilities the screens gate on.
 *
 * Pure data + storage helpers. No React imports — safe to use anywhere.
 * The React-friendly hooks live in `src/app/providers.tsx`.
 */

export type Persona = 'agency' | 'sponsor' | 'mlr'

export interface Role {
  id: string
  label: string
  description?: string
}

export interface Capability {
  id: string
  label: string
  group: 'Setup' | 'Matches' | 'Outreach' | 'Admin'
  description?: string
}

/** Placeholder role set for V1. KD will refine. */
export const ROLES: Role[] = [
  { id: 'sponsor_admin', label: 'Sponsor Admin',    description: 'Full access incl. permissions management' },
  { id: 'sponsor_std',   label: 'Sponsor Standard', description: 'Day-to-day clinical ops; no admin' },
  { id: 'mlr',           label: 'MLR Reviewer',     description: 'Approves patient-facing collateral (Form 2253)' },
  { id: 'agency',        label: 'Agency Operator',  description: 'External media-agency campaign operator' }
]

export const CAPABILITIES: Capability[] = [
  { id: 'view_setup',                label: 'View care option details', group: 'Setup' },
  { id: 'edit_setup_clinical',       label: 'Edit clinical fields',     group: 'Setup',    description: 'Official title, brief summary, offer type, geographies, activation date' },
  { id: 'edit_setup_display_title',  label: 'Edit display title',       group: 'Setup' },
  { id: 'edit_setup_end_date',       label: 'Edit end date',            group: 'Setup' },
  { id: 'edit_patient_facing_content', label: 'Edit patient-facing fields', group: 'Setup', description: 'Option name, subtitle, description' },
  { id: 'manage_interventions',      label: 'Manage interventions',     group: 'Setup',    description: 'Spec only — surface not built yet' },
  { id: 'view_eligibility_matrix',   label: 'View eligibility matrix',  group: 'Setup',    description: 'Spec only — surface not built yet' },
  { id: 'view_sites',                label: 'View sites',               group: 'Setup',    description: 'Spec only — surface not built yet' },
  { id: 'activate_care_option',      label: 'Activate care option',     group: 'Setup',    description: 'Spec only — surface not built yet' },
  { id: 'view_matches',              label: 'View and select patients', group: 'Matches' },
  { id: 'select_matches',            label: 'Select patients',          group: 'Matches' },
  { id: 'see_patient_details',       label: 'See patient details',      group: 'Matches',  description: 'Spec only — surface not built yet' },
  { id: 'message_patients',          label: 'Message patient(s)',       group: 'Matches',  description: 'Spec only — surface not built yet' },
  { id: 'view_outreach',             label: 'View outreach',            group: 'Outreach' },
  { id: 'edit_outreach',             label: 'Edit outreach content',    group: 'Outreach' },
  { id: 'submit_outreach',           label: 'Submit for MLR review',    group: 'Outreach' },
  { id: 'approve_outreach',          label: 'Approve outreach',         group: 'Outreach' },
  { id: 'reject_outreach',           label: 'Reject outreach',          group: 'Outreach',  description: 'MLR records a Reason; offer moves to Rejected by MLR' },
  { id: 'manage_permissions',        label: 'Manage permissions',       group: 'Admin' }
]

export type Matrix = Record<string, Record<string, boolean>>

export const DEFAULT_MATRIX: Matrix = {
  sponsor_admin: {
    view_setup: true,  edit_setup_clinical: true,  edit_setup_display_title: true,  edit_setup_end_date: true,
    edit_patient_facing_content: true,
    manage_interventions: true, view_eligibility_matrix: true, view_sites: true, activate_care_option: true,
    view_matches: true, select_matches: true, see_patient_details: false, message_patients: true,
    view_outreach: true, edit_outreach: true, submit_outreach: true, approve_outreach: true, reject_outreach: true,
    manage_permissions: true
  },
  sponsor_std: {
    view_setup: true,  edit_setup_clinical: true,  edit_setup_display_title: true,  edit_setup_end_date: true,
    edit_patient_facing_content: true,
    manage_interventions: true, view_eligibility_matrix: true, view_sites: true, activate_care_option: false,
    view_matches: true, select_matches: true, see_patient_details: false, message_patients: true,
    view_outreach: true, edit_outreach: true, submit_outreach: true, approve_outreach: false, reject_outreach: false,
    manage_permissions: false
  },
  mlr: {
    view_setup: true,  edit_setup_clinical: false, edit_setup_display_title: false, edit_setup_end_date: false,
    edit_patient_facing_content: false,
    manage_interventions: false, view_eligibility_matrix: true, view_sites: true, activate_care_option: false,
    view_matches: false, select_matches: false, see_patient_details: false, message_patients: false,
    view_outreach: true, edit_outreach: false, submit_outreach: false, approve_outreach: true, reject_outreach: true,
    manage_permissions: false
  },
  agency: {
    view_setup: true,  edit_setup_clinical: false, edit_setup_display_title: true,  edit_setup_end_date: true,
    edit_patient_facing_content: true,
    manage_interventions: false, view_eligibility_matrix: true, view_sites: true, activate_care_option: false,
    view_matches: true, select_matches: true, see_patient_details: false, message_patients: false,
    view_outreach: true, edit_outreach: true, submit_outreach: true, approve_outreach: false, reject_outreach: false,
    manage_permissions: false
  }
}

export const PERSONA_TO_ROLE: Record<Persona, string> = {
  agency:  'agency',
  sponsor: 'sponsor_admin',
  mlr:     'mlr'
}

export const WORKBENCH_LABEL: Record<Persona, string> = {
  agency:  'Agency Workbench',
  sponsor: 'Sponsor Workbench',
  mlr:     'MLR Workbench'
}

export const PERSONA_HOME: Record<Persona, string> = {
  agency:  '/',
  sponsor: '/sponsor',
  mlr:     '/mlr'
}

export const PERSONA_LABEL: Record<Persona, string> = {
  agency:  'Agency Operator',
  sponsor: 'Sponsor',
  mlr:     'MLR Reviewer'
}

/* ---------- storage ---------- */

// Versioned keys — bump to force everyone back to defaults next load.
const KEY_PERSONA = 'rwb_persona_v3'
const KEY_MATRIX  = 'rwb_permission_matrix_v1'

export function loadPersona(): Persona {
  if (typeof window === 'undefined') return 'sponsor'
  const v = window.localStorage.getItem(KEY_PERSONA)
  if (v === 'sponsor' || v === 'mlr' || v === 'agency') return v
  return 'sponsor'
}
export function savePersona(p: Persona) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY_PERSONA, p)
}
export function loadMatrix(): Matrix {
  if (typeof window === 'undefined') return DEFAULT_MATRIX
  const raw = window.localStorage.getItem(KEY_MATRIX)
  if (!raw) return DEFAULT_MATRIX
  try {
    const parsed = JSON.parse(raw) as Matrix
    // Shallow-merge so newly-added roles/caps still pick up defaults.
    const out: Matrix = { ...DEFAULT_MATRIX }
    for (const role of Object.keys(parsed)) {
      out[role] = { ...(DEFAULT_MATRIX[role] ?? {}), ...parsed[role] }
    }
    return out
  } catch {
    return DEFAULT_MATRIX
  }
}
export function saveMatrix(m: Matrix) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY_MATRIX, JSON.stringify(m))
}
export function clearMatrix() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(KEY_MATRIX)
}

/** Pure cell lookup. */
export function canCap(matrix: Matrix, roleId: string, capId: string): boolean {
  return Boolean(matrix[roleId]?.[capId])
}
