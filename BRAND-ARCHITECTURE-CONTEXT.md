# Landing Page — Brand & Program Architecture (Design Brief)

A self-contained brief for a design pass. Zero prior context assumed. The current landing page is attached as a screenshot.

## What we're designing

The **landing page** of Resonata's **Agency Workbench** — the "Care Offers" list. We're restructuring its information architecture so it clearly expresses a multi-brand, multi-indication, multi-program structure. We want 2–3 design directions to choose from.

## Product + persona

Resonata is a patient-matching platform connecting patients to clinical trials and approved treatments. A **Media Agency** is an external partner a pharma **sponsor** hires to run paid media and patient outreach. The user is a **daily campaign operator** at that agency: they juggle several sponsor accounts, and within a sponsor, several drug brands at once. They scan this page to find the right brand/indication/campaign and drop into it.

## The problem

The landing page is **flat**. A sponsor is chosen in the top nav, then the page shows one ungrouped stack of "Care Offer" cards, each combining a drug and an indication in its title. There's no Brand grouping, no way to see one brand spanning multiple indications, and no way to show multiple programs running under one indication.

It must now support:
- **Multiple brands per sponsor** (CureX runs TOZIRET, VELKARA, CLARIMOD).
- **Multiple indications per brand** (TOZIRET approved for RET-altered NSCLC *and* RET-altered medullary thyroid cancer).
- **Multiple programs per indication** (one indication running a direct-to-patient awareness program *and* an HCP-referral program at once).

## Two hierarchy models — show us both

**Model A — 4 levels:** Sponsor → Brand → Indication → **Program**. Today's card becomes a *Program* (one campaign under one indication).

**Model B — 3 levels:** Sponsor → Brand → **Indication**. The program layer collapses; today's card becomes an *Indication*.

We want to see what each looks like on this page so we can decide how deep the hierarchy should go.

## Direction

- **Sponsor stays in the top nav** (don't move it).
- **Brand becomes an on-page filter/switcher** for the selected sponsor — a landing-level control sitting alongside the existing status filter. Show how picking a brand reshapes the page (collapse to that brand's indications? "All brands" = grouped sections?) and how it coexists with the status filter and the KPI row at the top.
- The deepest level (Program in A, Indication in B) is the click target that opens the detail flow — keep it obviously clickable.

## Sample data to design against

**CureX Pharmaceuticals**
- **TOZIRET** (retatinib) — two indications
  - RET-altered NSCLC — programs: DTC awareness; HCP-referral
  - RET-altered medullary thyroid cancer — program: DTC awareness
- **VELKARA** (obistamab) — Moderate-to-Severe Atopic Dermatitis — patient education
- **CLARIMOD** (fenolimide) — Relapsing Multiple Sclerosis — awareness

**Nuveero Therapeutics**
- **BREVANTA** (sulecizumab) — Chronic Heart Failure — DTC outreach
- **LUMIGEN** (tarocetib) — Advanced Renal Cell Carcinoma — HCP + patient awareness

Each leaf carries: a status (Active, In MLR Review, In Design, Inactive, Deactivated), a matched-patient count, and a last-updated date. The KPI row above the list summarizes counts (assigned offers, in MLR review, active, matched patients, outreach sent).

## Constraints

- HIPAA: offers and counts only, no patient-identifying info.
- This is a navigation/IA change, not a new authoring surface — the agency doesn't edit clinical detail here.
- Trustworthy, clinical-clean, scannable. Enterprise data density is fine; noise is not.
- Match the visual language in the attached screenshot: Resonata's existing Care Offers look. Color roles already in use — green = primary/active, gold = in MLR review, blue = links and IDs, violet = secondary accent, charcoal = neutrals/text; status shown as pills. Stay within this; don't introduce a new visual system unless the hierarchy genuinely demands it.

## Deliverable

**2–3 distinct landing-page layout directions**, as wireframes or described layouts. Each should make clear:
1. How the Brand → Indication (→ Program) hierarchy is grouped and scanned.
2. How the brand filter/switcher behaves and coexists with the status filter and KPI row.
3. How it reads under **Model A vs. Model B** (show both, or state which model each direction assumes).
4. The click target into the detail flow.

Design only — no implementation. The chosen direction will be implemented separately.
