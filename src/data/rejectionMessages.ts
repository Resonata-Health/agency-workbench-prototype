/**
 * Mock store for MLR rejection messages on a care offer.
 *
 * Lives in module memory so navigation in the prototype keeps the history
 * intact, but resets on full page reload. Same pattern as offerStatusOverrides.
 */

export interface RejectionMessage {
  author: string
  text: string
  timestampLabel: string
}

const messages = new Map<string, RejectionMessage[]>()

function timestamp(): string {
  // Static label so prototype reads consistent across reloads.
  return 'Just now'
}

export function addRejectionMessage(offerId: string, text: string, author = 'MLR Reviewer') {
  const list = messages.get(offerId) ?? []
  list.push({ author, text, timestampLabel: timestamp() })
  messages.set(offerId, list)
}

export function getRejectionMessages(offerId: string): RejectionMessage[] {
  return messages.get(offerId) ?? []
}
