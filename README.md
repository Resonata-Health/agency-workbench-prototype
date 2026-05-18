# Resonata — Agency Workbench (Prototype)

A high-fidelity prototype of the Media Agency view of Resonata's Sponsor Workbench. Built as a clickable spec for design and engineering. Not production code.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · TanStack Query · Poppins

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Build: `npm run build` then `npm start`.

## The flow

Care Offers (landing) → click an offer → **Setup** → Matches → Outreach

- **Care Offers** — offers assigned to the agency, with status pills and match counts.
- **Setup** — read-only care option details. Agency can only edit the Display Title.
- **Matches** — matched patients, select recipients for outreach.
- **Outreach** — author the patient-facing Email, Sponsor Card, and Details page, with a live phone preview. "Submit for Sponsor Approval" sends it to MLR review and flips the offer to *In MLR Review*.

## Notes

- Prototype only: no backend. Data is mocked in `src/data/`, and autosave / submit / status changes are simulated client-side.
- Clinical copy is illustrative placeholder, not real labeling.
- Design tokens (the Resonata color system) live in `tailwind.config.ts`.
- `resonata-landing.html` is a standalone dummy marketing page, unrelated to the app.

## Structure

```
src/
  app/         routes (landing, setup, matches, outreach)
  views/       screen-level components
  components/  shared UI (nav, tabs, cards, outreach editors)
  data/        mock offers, templates, seeded content
```
