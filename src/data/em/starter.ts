/**
 * Default empty EM for any care option that doesn't yet have a dedicated
 * seed. Renders the full EM UI with one Main cohort subgroup and zero
 * concepts — the user adds categories and concepts from there.
 */

import type { EmData } from './types'

export const STARTER_EM: EmData = {
  subgroups: [{ id: 'main', label: 'Main cohort' }],
  concepts: []
}
