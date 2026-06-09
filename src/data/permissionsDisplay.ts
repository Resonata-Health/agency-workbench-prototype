/**
 * Documentation table shown on the Admin > Delegates page.
 *
 * Permissions in this release are hard-coded on the backend — sponsors can't
 * edit them. This file is the static, view-only representation of the policy
 * (separate from the runtime DEFAULT_MATRIX that drives capability gating).
 */

export type CellLevel = 'yes' | 'view' | 'no' | 'custom' | 'blank'

export interface DisplayCell {
  level: CellLevel
  /** Text shown in the cell. Required for 'custom'; optional for others (falls back to a default label). */
  text?: string
  /** Optional footnote marker, e.g. '*'. */
  asterisk?: boolean
}

export interface DisplayRoleRow {
  id: string
  label: string
  cells: DisplayCell[]
}

export const DISPLAY_COLUMNS = [
  'Care Option Details',
  'Manage Interventions',
  'Eligibility Matrix',
  'Setup Sites',
  'Activate Care Option',
  'View Patients',
  'Select Patients',
  'See patient details',
  'Message one or more patients',
  'Outreach (Design Promo / interim card / daughter page)'
] as const

const Y: DisplayCell = { level: 'yes' }
const N: DisplayCell = { level: 'no' }
const V: DisplayCell = { level: 'view' }
const B: DisplayCell = { level: 'blank' }

export const DISPLAY_ROLES: DisplayRoleRow[] = [
  {
    id: 'sponsor_admin',
    label: 'Sponsor Admin',
    cells: [Y, Y, Y, Y, Y, Y, Y, Y, N, Y]
  },
  {
    id: 'finance',
    label: 'Finance (Only Non-Commercial)',
    cells: [
      V, N, N, N,
      { level: 'yes', asterisk: true },
      N, N, N, N, N
    ]
  },
  {
    id: 'mlr',
    label: 'MLR',
    cells: [V, V, V, V, N, Y, N, N, N, V]
  },
  {
    id: 'agency',
    label: 'Media Agency',
    cells: [
      { level: 'custom', text: 'Edit only these fields:\nDisplay Title, End Date' },
      N, N, N,
      { level: 'custom', text: 'Yes (Commercial · Approved-Treatment medication only)' },
      Y, Y, N, N, Y
    ]
  },
  {
    id: 'enroller',
    label: 'Enroller',
    cells: [V, V, V, N, N, B, Y, Y, Y, N]
  },
  {
    id: 'clinical',
    label: 'Clinical',
    cells: [V, Y, Y, N, N, N, N, N, N, N]
  }
]

export const FOOTNOTES: string[] = [
  '* Activate is gated to non-commercial use cases.'
]
