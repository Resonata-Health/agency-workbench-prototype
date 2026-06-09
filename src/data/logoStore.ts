/**
 * Sponsor logo mock store.
 *
 * The Branding admin page writes the uploaded logo here as a data URL.
 * TopNav reads it (and re-renders on change via a custom event) to show
 * the logo next to the avatar.
 */

const KEY = 'rwb_sponsor_logo_v1'
const EVENT = 'rwb-logo-changed'

export function getStoredLogo(): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(KEY)
}

export function setStoredLogo(dataUrl: string | null) {
  if (typeof window === 'undefined') return
  if (dataUrl) window.localStorage.setItem(KEY, dataUrl)
  else window.localStorage.removeItem(KEY)
  window.dispatchEvent(new CustomEvent(EVENT))
}

export function subscribeLogo(fn: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const h = () => fn()
  window.addEventListener(EVENT, h)
  return () => window.removeEventListener(EVENT, h)
}
