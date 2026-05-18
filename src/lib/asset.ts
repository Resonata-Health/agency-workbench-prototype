/**
 * Prefix a public asset path with the deploy base path.
 * Local dev → '' (served at root). GitHub Pages → '/agency-workbench-prototype'.
 * Plain <img src> is NOT auto-prefixed by Next, so use this for static assets.
 */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
  return `${base}${path}`
}
