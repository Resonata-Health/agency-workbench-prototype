# Outreach Screen — Design Context

Hand this to Claude Design as a self-contained brief. It assumes zero prior context.

## What we're designing

The **Outreach** screen in Resonata's **Agency Workbench**. It's the fourth screen in a care-offer flow that already exists as a working prototype. The other three screens (landing, Setup, Matches) are built. Outreach is currently a "coming soon" placeholder.

## Product in one paragraph

Resonata is a patient-matching platform that connects patients to clinical trials and approved treatments. The B2B side has workbenches for different personas. A **Media Agency** is an external partner a pharma sponsor hires to run paid media and patient outreach for a specific treatment. The agency sees a scoped-down version of the sponsor's workbench: they can view the care offer and its matched patients, but they cannot edit clinical details (eligibility, sites, criteria). The one thing they own is patient-facing collateral and outreach.

## The agency persona (who uses this screen)

Daily campaign operator. Plans campaigns, runs targeting, sends outreach, tracks performance, optimizes spend. They will not act until the sponsor's MLR team files Form 2253 (the regulatory gate for any patient-facing material). Assume every email or ad created here eventually needs MLR review before it can go live.

## Where Outreach sits in the flow

```
Landing (Care Offers list)
  → click an offer
Setup (read-only offer details, agency edits only Display Title)
  → "Next Matches"
Matches (matched patients table, agency selects patients for email)
  → "Next Outreach"
Outreach  ← THIS SCREEN
```

Tabs across the offer screens: **Setup | Matches | Outreach**. Each carries an `?offer=<id>` query param.

## The two jobs of this screen (KD is still exploring the design)

1. **Send emails to matched patients.** Using custom copy, or a preselected template. The recipients come from the Matches screen, where the agency checks patients ("Selected for email"). The Matches summary already tallies selected counts by arm.
2. **Design the patient-facing ad and its daughter page.** The ad is the creative that runs in paid media. The daughter page (landing page) is where an interested patient lands after clicking the ad.

These may be two modes/sections of one screen, or two sub-flows. KD wants design exploration here, not a fixed spec.

## Inputs available to this screen

- The selected offer: drug name, display title, sponsor, status, match counts. Example offer "TOZIRET (retatinib)", display title "Adult and Pediatric RET-Altered Cancer Treatment", sponsor "CureX Pharmaceuticals", 342 total matches.
- Patients selected on the Matches screen (currently fake IDs like `PT-2025-08-A1B2C3`, with arm, match type, engagement state, city/state). No real PII — this is a HIPAA-sensitive product, so patient-facing data stays minimal and de-identified in the workbench.
- Engagement signals already shown on Matches: "Email sent", "Opened", "Clicked", "Submitted interest", "Enrolled".

## Constraints

- **MLR gate:** anything patient-facing (email copy, ad, landing page) is subject to MLR / Form 2253 approval. The design should account for a review/approval state, not just "send."
- **Agency permissions:** they create and edit collateral. They do not edit the underlying offer.
- **HIPAA:** no patient names or identifying info beyond the de-identified patient ID. Outreach is delivered through the platform, not by handing the agency a contact list.
- **Trustworthy, professional tone.** Healthcare, not consumer social. Clinical-clean for the workbench; the patient-facing ad/landing page can be warmer and simpler (8th-grade reading level, benefits before features).

## Design system (match the existing prototype)

**Stack:** Next.js (App Router) + TypeScript + Tailwind + Tanstack Query.

**Font:** Poppins (SemiBold headings, Regular body).

**Color tokens** — Figma `Family/Step` convention mapped to Tailwind classes. Six families: green, blue, red, gold, violet, charcoal. Scale 1 (lightest) → 10 (base) → 18 (darkest); step 17 skipped. Charcoal also has `charcoal-white` (#ffffff) and `charcoal-black` (#000000).

Most-used:
- Page background `charcoal-1` (#f7f7f7); cards `charcoal-white`; borders `charcoal-4` (#e2e2e2); secondary text `charcoal-12` (#858585); body text `charcoal-15` (#383838).
- Primary CTA `green-12` (#4aac31) filled, white text; hover `green-13`.
- Links / active tab / drug name `blue-10`–`blue-12` (#3688bf / #03558c).
- Status pills: Active = green, In MLR Review = gold, In Design = violet, Inactive = gray, Deactivated = black outline.
- Full reference: `~/Developer/claude-workspace-resonata/context/memory/tailwind.config.ts` and `resonata-color-tokens.json` in the same folder.

**Established screen patterns to stay consistent with:**
- Top nav: Resonata logo + "Agency Workbench" label (left); sponsor switcher + user avatar (right).
- Offer sub-header bar under the nav: bold drug name (blue) + display title (gray) on the left, "Last updated: <date>" on the right.
- `WorkbenchTabs` row: Setup | Matches | Outreach, blue underline on the active tab.
- Content on `charcoal-1`, centered max-width container, white rounded cards with subtle border and `shadow-card`.
- KPI cards: row of equal-width tiles, small uppercase label, large bold number, caption.
- Tables: uppercase 11–12px gray headers, light row separators, left-border accent for status, blue centered group rows.
- Footer: single green CTA, right-aligned (pattern so far: "Next Matches", "Next Outreach").
- Dialogs: bold title + gray subtitle, optional blue info banner, Cancel (outline) + primary (green) footer.

## Open questions for KD to resolve in design

1. One screen with two modes (Email | Ad & Landing Page) or a sub-nav / stepped flow?
2. Email: template library vs. freeform composer vs. both? What templates exist?
3. Where does MLR review/approval live in this flow — inline status, a submit-for-review action, a separate state?
4. Ad + daughter page: live preview? Device frames? How much layout control does the agency get vs. fixed template slots?
5. What's the "done" action and what happens after (scheduled send, queued for MLR, etc.)?
6. Does the recipient set carry over visibly from Matches (a chip/summary of "N patients selected"), and can it be edited here?

## Deliverable

A design (Figma frame or described layout) that fits the patterns above. KD will bring it back and Claude will adapt it into the prototype at `src/views/OutreachView.tsx` (route `/outreach`, already stubbed and wired into the flow).
