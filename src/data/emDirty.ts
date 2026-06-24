// Tracks whether an offer's eligibility matrix has unsaved edits, keyed by offer id.
// Module memory (resets on hard reload), like the other mock stores. Lets the
// Contacts step warn on "Complete Setup and Activate" about overwriting the matrix
// even though the Criteria step unmounted on navigation.

const dirtyByOffer: Record<string, boolean> = {}

export function setEmDirty(offerId: string, dirty: boolean) {
  dirtyByOffer[offerId] = dirty
}

export function getEmDirty(offerId: string): boolean {
  return dirtyByOffer[offerId] ?? false
}
