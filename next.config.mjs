/** @type {import('next').NextConfig} */

// Set by the GitHub Pages workflow to the repo name (e.g. "/agency-workbench-prototype").
// Empty for local dev so http://localhost:3000 still works at the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig = {
  reactStrictMode: true,
  output: 'export',            // static site (no Node server) — works on GitHub Pages
  trailingSlash: true,         // emit /setup/index.html so deep links resolve on Pages
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true }
}

export default nextConfig
