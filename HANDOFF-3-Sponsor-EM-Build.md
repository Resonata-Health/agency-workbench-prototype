# Handoff: Sponsor Eligibility Matrix (EM) Build

**Date:** 2026-06-16
**For:** Claude Code session building production React/TypeScript prototype
**From:** Cowork session (KD's PM copilot)
**Supersedes:** HANDOFF-2-Sponsor-UI.md (outdated, pre-CEO-feedback)

---

## What This Is

The Eligibility Matrix is the core configuration screen in the Sponsor Workbench. A sponsor's clinical operations team uses it to configure which eligibility criteria apply to their care option (clinical trial or approved treatment), what the inclusion/exclusion verdicts are per subgroup (arm/cohort), and what the parametric thresholds are for each criterion.

The screen shows ONE care option at a time, with subgroups as columns. Each row is a concept (eligibility criterion). Under each concept, expandable slot rows carry parametric values.

## Reference Prototypes (HTML)

Two working HTML prototypes exist in this folder. They are the source of truth for visual design, interaction patterns, and data structure. Open them in a browser to see exactly how things should look and behave.

- **`sponsor-em.html`** (~1,100 lines) - Real MG (myasthenia gravis) trial data. NCT06517758 with 3 subgroups.
- **`sponsor-em-hf.html`** (~1,500 lines) - Fake heart failure trial. NCT99000001 with 3 subgroups. Exercises V2 patterns missing from MG data (E!, antisignal [A], TANDEM IF, compound rules, INDEX: AND).

Both are single-file HTML with no dependencies. All JS/CSS inline. The React build should replicate their behavior exactly, then extend.

## Pattern Coverage

| Pattern | MG prototype | HF prototype |
|---------|:---:|:---:|
| IN / EX verdict badges | yes | yes |
| I! (inclusion index, star badge) | yes | yes |
| E! (exclusion index, star badge) | no | yes |
| 3-way verdict cycle (click toggle) | yes | yes |
| Slot rows (numeric, ordinal, categorical, duration, result-type) | yes | yes |
| Antisignal [A] slot rows | no | yes |
| TANDEM IF conditional slots | no | yes |
| Compound rules (expandable components) | no | yes |
| INDEX: AND banner | no | yes |
| Section expand/collapse | yes | yes |
| Concept expand/collapse | yes | yes |
| Global expand/collapse toggle | yes | yes |
| Per-section expand/collapse toggle | yes | yes |
| Add Subgroup modal | yes | yes |
| Add Category dropdown | yes | yes |
| Sticky table header | yes | yes |

---

## Data Model

### Sections (Categories)

Sections group concepts in the matrix. They follow a canonical order defined by type code (ascending). Only sections with at least one concept should render.

Full canonical order:

| Type Code | Prefix | Display Name |
|-----------|--------|--------------|
| - | - | Index (special, not a display section) |
| - | - | Custom logic (special, not a display section) |
| 010-DX | DX | DIAGNOSIS |
| 015-CF | CF | CLINICAL FINDING |
| 030-DC | DC | DISEASE CHARACTERISTIC |
| 090-HT | HT | HISTOLOGY |
| 100-AL | AL | ANATOMIC LOCATION |
| 110-SC | SC | SECONDARY CONDITION |
| 120-CS | CS | CLINICAL SCORE |
| 130-BM | BM | BIOMARKERS |
| 140-DB | DB | MEDICATIONS |
| 150-PR | PR | PROCEDURES |
| 160-AA | AA | ALLERGIES / ADVERSE EVENT |
| 170-LV | LV | LAB VALUES |
| 180-VT | VT | VITAL SIGNS |
| 190-DD | DD | DIAGNOSTIC DATA |
| 195-EN | EN | ENCOUNTER |
| 200-SF | SF | SOCIAL FACTORS |
| 210-DM | DM | DEMOGRAPHICS |
| 215-GP | GP | GROUP PARAMETRIC |
| 216-GD | GD | GROUP DEFINITIONAL |
| 220-SI | SI | SCREENING |

Section header rows have background `#f0f4ff`. Each section shows a concept count badge (blue circle) and is collapsible.

### Concepts (Criteria)

Each concept is one row in the matrix. Structure:

```typescript
interface Concept {
  id: string;              // e.g., "DX-C0000063"
  section: string;         // section ID, e.g., "diagnosis"
  name: string;            // display name, e.g., "Myasthenia gravis, generalized"
  isIndex?: boolean;       // true if I! for this CO
  isExIndex?: boolean;     // true if E! for this CO
  verdicts: Record<string, string | null>;  // subgroupId -> "I" | "E" | "I!" | "E!" | null
  slots?: Slot[];
  antisignalSlots?: Slot[];
  tandemSlots?: TandemSlot[];
  // Compound rule properties
  isCompound?: boolean;
  compoundOp?: string;     // "OR" | "AND" | "EXCEPT" | "IF"
  compoundExpr?: string;   // display expression, e.g., "Epilepsy OR Neurodegenerative disease OR CNS vasculitis"
  components?: { name: string }[];
}
```

### Custom Logic (Per-CO Overrides)

Beyond compound rules and INDEX: AND, the data model includes per-CO custom logic entries that override default evaluation behavior:

- **Section fold overrides:** e.g., `BM: OR` means the Biomarkers section uses OR logic instead of the default AND fold. The section evaluates as "pass if ANY biomarker criterion passes" rather than "pass only if ALL pass."
- **Named-rule boolean expressions:** Complex eligibility logic expressed as boolean combinations over Criterion IDs. These are CO-specific and don't fit the standard concept+verdict model. Example: NCT06517758 has named rules combining specific diagnosis concepts.
- **LRS-level fold overrides:** Change the fold logic (AND/OR) at a specific tier of the LRS cascade for a specific CO.

In the MG Target 3.01 data, there are ~6 custom logic entries for the NCT06517758 trial. These are embedded in the prototype data but not yet rendered in the UI. The React build should plan for a Custom Logic display section (possibly a collapsible panel below the matrix or a separate tab), but the exact design is TBD.

### Slots

Parametric values underneath a concept. Each slot has values per subgroup.

```typescript
interface Slot {
  label: string;           // e.g., "Severity: MGFA Class (min)"
  type: SlotType;          // "numeric" | "ordinal" | "category" | "duration" | "result-type"
  values: Record<string, string | null>;  // subgroupId -> value or null
  helpText?: string;       // tooltip text for antisignal slots
}

interface TandemSlot extends Slot {
  tandemIf: string;        // gate condition, e.g., "Rhythm: Atrial fibrillation"
}
```

### Subgroups

Columns in the matrix. Each subgroup represents a cohort/arm of the trial.

```typescript
interface Subgroup {
  id: string;       // e.g., "achr_main"
  label: string;    // e.g., "AChR+ Main"
}
```

### Verdict Alphabet

| Value | Badge | Star | Meaning | Clickable |
|-------|-------|------|---------|-----------|
| `I` | green "IN" | no | Include | yes (cycles) |
| `E` | red "EX" | no | Exclude | yes (cycles) |
| `I!` | green "IN ★" | amber | Inclusion index | yes (cycles) |
| `E!` | red "EX ★" | amber | Exclusion index | yes (cycles) |
| `null` | dashed empty box | no | Not set | yes (cycles) |

Click cycle: IN > EX > empty > IN (loops). All verdicts are editable, including I! and E!.

---

## Design Decisions (CEO-Approved, 2026-06-16)

These are final unless KD says otherwise. Read all of them before building.

1. **Nothing is locked.** All verdicts and slot values are editable. No disabled inputs, no lock icons, no read-only states. Sponsors have full control.

2. **Verdict editing: 3-way click cycle.** IN > EX > empty > IN. No popover, no dropdown, just click the badge.

3. **Slot values: editable inline.** Numeric fields for numbers, dropdowns for ordinals and categoricals, number+unit combos for durations. All always enabled.

4. **(superseded by #1)**

5. **Default view: all sections open, all concepts collapsed.** No special treatment for index concepts on load. Sponsors can expand what they need.

6. **No INDEX yellow pill. Star stays on I!/E! badges.** The yellow "INDEX" pill next to the concept name is removed. But I! and E! verdict badges keep their amber star (★) to subtly indicate index status. Both are fully clickable.

7. **Antisignal [A] rows: no special colors or icons.** The [A] prefix in the slot label is sufficient. No rose tint, no red border, no warning icon. Plain white background like any other slot row.

8. **TANDEM IF: inline pill tag on slot label.** Small muted pill after the slot name showing the gate condition. Visually quiet.

9. **Compound rules: expandable groups with purple pill.** Purple COMPOUND pill, italic boolean expression, expandable component sub-rows. Components show name only (no verdict flags, per decision #14).

10. **Section order: Diagnosis first.** Follow the canonical type code order (010-DX first, 220-SI last). The LRS cascade order is internal to the matcher, not the display order.

11. **Infinite subgroups.** No cap. Sticky first column (criteria names), horizontal scroll for subgroup columns.

12. **Decisive-criteria reporting is Admin UI only.** The Sponsor EM is configuration only. No knockout/matching output here.

13. **Minimal color palette.** Section headers: `#f0f4ff`. Inputs: plain white. Only verdict badges carry meaningful color (green=IN, red=EX). Everything else is neutral.

14. **Compound sub-parts: no verdict flags.** Component rows show name only. No IN/EX badges, no dashes. All logic rolls up to the compound concept's verdict.

15. **Recency: months and years only.** Days and weeks removed from duration pickers.

16. **Sticky table header.** The column header row (CRITERIA, subgroup names, + ADD SUBGROUP) sticks below the top nav bar (52px) on scroll.

---

## Interaction Patterns

### Verdict Cycling
Click any verdict badge or empty cell. Cycles: IN > EX > empty > IN. The verdictOverrides object tracks changes separate from the base data.

### Expand/Collapse
- **Section level:** Click section header to collapse/expand all concepts in that section.
- **Concept level:** Click chevron (▶) on a concept row to show/hide its slot rows.
- **Global toggle:** Toolbar button above the matrix: "Expand All" / "Collapse All" for all sections and concepts.
- **Per-section toggle:** "Expand slots" / "Collapse slots" text button on section header (appears on hover, uses stopPropagation to not trigger section collapse).

### Carets
Section chevrons (▼/▶) and concept expand chevrons are both 12px font-size.

### Add Subgroup
Modal dialog with text input for subgroup name. Adds a new column to the matrix.

### Add Category
Dropdown below the matrix listing all available categories not currently in the matrix.

---

## Visual Spec

### Layout
- Top nav bar: 52px sticky, Resonata logo + "Sponsor Workbench" + org pill + avatar
- Trial header: NCT ID, description, last updated date, Setup/Matches tabs, stepper (Overview > Criteria > Contacts)
- Content area: centered, max-width 1200px, light gray (#f4f5f7) background
- Matrix: white card with border, rounded corners, shadow
- Bottom bar: Save Draft (left), Previous + Next green CTA (right)

### Colors (from CSS variables in prototypes)
The following are colors in the prototype HTML files, but replace these and/use the colors that are already being used in project and defined in tailwind.config.js
```
--bg: #ffffff
--bg-alt: #f7f8fa
--bg-page: #f4f5f7
--border: #e5e7eb
--brand (green): #16a34a
--brand-soft: #dcfce7
--blue: #2563eb
--blue-soft: #dbeafe
--amber: #d97706
--red: #dc2626
--red-soft: #fee2e2
--purple: #7c3aed
--purple-soft: #ede9fe
```

### Typography
- Font: Poppins (fallback: system stack)
- Section names: 12px, 700 weight, uppercase, letter-spacing 0.4px
- Concept names: 13px, 500 weight
- Slot labels: 12px, normal weight
- Verdict badges: 12px, 600 weight
- Table headers: 11px, 600 weight, uppercase

### Badge Styles
- IN badge: `background: var(--brand-soft); color: var(--brand-deep)` (green tint)
- EX badge: `background: var(--red-soft); color: var(--red)` (red tint)
- Star on I!/E!: `font-size: 10px; color: var(--amber)` (amber/gold)
- Empty cell: dashed border box, no text
- COMPOUND pill: `background: var(--purple-soft); color: var(--purple)` (purple)
- TANDEM IF tag: small pill, muted colors, after slot label
- INDEX: AND banner: `background: #f0f4ff`, plain text, no warning icon

### Slot Input Styles
All inputs have plain white background, standard border (`var(--border)`). No colored backgrounds on any form elements. Input types:
- Numeric: `<input type="number">` or `<input type="text">` for flexible values
- Ordinal: `<select>` with scale options (e.g., NYHA Class I-IV, MGFA Class)
- Category: `<select>` with category options
- Duration: `<input type="number">` + `<select>` for unit (months, years only)
- Result-type: `<select>` (Present, Absent, Positive, Negative)
- Reference-ranged: multiplier thresholds (e.g., xULN values). Render as numeric input with the reference unit label beside it.

---

## What's NOT Built (Extend From Prototypes)

These features exist as interaction shells or not at all in the HTML prototypes. The React build should implement them:

- Persist state (save/load matrix configuration)
- Proper form validation (numeric ranges, required fields)
- Subgroup management (rename, reorder, delete columns)
- Filter/search across criteria
- Bulk operations (select multiple rows, bulk edit)
- Unsaved changes indicator
- Loading, empty, and error states
- Keyboard navigation (tab through cells, enter to edit)
- Undo/redo
- Responsive behavior for many subgroup columns (horizontal scroll with sticky first column)
- Create mode (building an EM from scratch, empty matrix)

---

## Micro-Specs (Pixel-Level Detail)

These details are in the HTML prototypes but easy to miss. Spelled out here so the Code session doesn't have to reverse-engineer them.

### TANDEM IF pill styling
```css
.tandem-tag {
  display: inline-flex; align-items: center; gap: 3px;
  padding: 1px 8px; border-radius: 10px;
  font-size: 10.5px; font-weight: 500;
  background: #f0f4ff; color: #4b6cb7;
  border: 1px solid #d6e0f5;
  margin-left: 6px; white-space: nowrap;
}
.tandem-tag .tandem-if {
  font-weight: 700; color: #3b5998;
}
```
Renders as: `[A] BNP (pg/mL) — min` followed by pill: **IF** Rhythm: Atrial fibrillation

### INDEX: AND banner
```css
.index-fold-banner {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 20px;
  background: #f0f4ff;
  border-bottom: 1px solid var(--border);
  font-size: 11.5px; color: var(--text-muted);
}
.index-fold-badge {
  padding: 1px 7px; border-radius: 3px;
  background: #fbbf24; color: #78350f;
  font-size: 10px; font-weight: 700;
  letter-spacing: 0.3px;
}
```
Banner text: `INDEX: AND` badge + "All Index conditions in this section must be satisfied (AND logic). Custom override applied by the pipeline."

The banner appears below the section header row, only in sections that have the AND override (currently only Diagnosis in HF prototype). Not shown when the section is collapsed.

### Antisignal [A] slot rows
Visually identical to regular slot rows (white background, same indentation). The only distinguishing feature is the `[A]` prefix in the label text, styled with:
```css
.antisignal-label {
  color: var(--rose); font-weight: 600;
}
```
The `[A]` and label text are a single span with rose color (#e11d48) and bold weight. No background tint, no border accent, no icon.

Antisignal slots sit after the regular slots within an expanded concept. They're rendered the same way as regular slots, just with the [A] label styling.

### Add Category dropdown behavior
A centered button below the entire matrix: `⊕ Add Category`. On click, a popover appears above the button listing all available categories not currently in the matrix. Selecting one currently shows an alert (prototype-only). In the React build, selecting a category should:
1. Add an empty section for that category in the canonical type-code position
2. The section appears collapsed with 0 concepts
3. The selected category disappears from the dropdown

The `AVAILABLE_CATEGORIES` list in the prototype is stale (uses old names). The React build should use the canonical 22-category list and filter out categories already present in the matrix.

### Slot row indentation and grouping
Slot rows (regular, antisignal, tandem) are child rows of the concept they belong to. They render with:
- A `↳` character (&#8627;) as a visual indent indicator
- Slot label text after the icon
- One value cell per subgroup column (matching the concept's column structure)
- Same column widths as the concept row above

Slot rows are only visible when their parent concept is expanded (chevron clicked). They appear in order: regular slots first, then antisignal slots, then tandem IF slots.

---

## MG Target 3.01.xlsx Structure

The Code session needs to understand this spreadsheet to work with real data.

**Sheet:** "Criteria" (single sheet)

**Column layout:**
- Column A: `Type` — category type code (e.g., "010-DX", "130-BM", "210-DM"). Category header rows show the full code+name (e.g., "010-0 DIAGNOSIS").
- Column B: `Criterion ID` — concept ID (e.g., "DX-C0000063"). Slot rows use the same ID with `~` suffix (e.g., "DX-C0000063~").
- Column C: `Display Name` — concept or slot display text. Slot rows use format "Concept Name — Slot Label" (e.g., "Myasthenia gravis, generalized — Core").
- Column D: empty (spacer)
- Columns E-Z: One column per care option (22 total). Headers are CO names: 7 approved treatments (Imaavy, MESTINON, RYSTIGGO, SOLIRIS, Ultomiris, vyvgart-hytrulo, ZILBRYSQ) + 15 clinical trials (NCT06106672 through NCT07215949).

**Cell values:**
- Concept rows (no `~` suffix): `I`, `E`, `I!`, `E!`, or empty
- Slot rows (`~` suffix with "Core" label): empty (these are structural grouping rows)
- Slot rows (`~` suffix with parameter label): parameter value as text (e.g., "2 years", "Uncontrolled", "Class IIa-IVb", "40")

**Row count:** ~342 data rows across all categories.

**How to parse:** Group consecutive rows by Criterion ID (ignoring `~` suffix). The first row (no `~`) is the concept with its verdicts. Subsequent rows (with `~`) are its slots. When a `~` row's Display Name contains " — Core", it's a structural marker, not a real slot value. The real slot labels come after " — " (e.g., "Disease Control", "Recency (within)", "MGFA Class (min)").

---

## Source Documents to Add to Code Session

Copy these files into the Claude Code session's context. **Full paths from workspace root (`claude-workspace-resonata/`):**

### Must-have
1. **`cosp admin ui/sponsor-em.html`** - MG prototype (primary reference implementation)
2. **`cosp admin ui/sponsor-em-hf.html`** - HF prototype (V2 pattern reference)
3. **`cosp admin ui/HANDOFF-3-Sponsor-EM-Build.md`** - This file
4. **`Supporting files/MG Target 3.01.xlsx`** - Real eligibility data (22 COs, ~342 rows)
5. **`Supporting files/V2 Engineering Package - Delivery.docx`** - V2 architecture changes, display composition, core rule spec
6. **`Supporting files/V2 Technical overview - Non-engineers (3).docx`** - V2 narrative overview for product audience

### Nice-to-have (deeper context)
7. **`Supporting files/V2 Engineering summary.docx`** - Compact V2 onboarding
8. **`Supporting files/CO Vocab Conventions Guide v2.01.docx`** - Full authoring contract
9. **`Supporting files/Display_Composition_Instructions.md`** - How to compose criterion display text
10. **`context/memory/resonata-color-tokens.json`** - Figma-to-code color token mapping
11. **`context/memory/tailwind.config.ts`** - Tailwind config with Resonata tokens (copy into project)
12. **`context/memory/resonata-b2b-personas.md`** - Sponsor persona details

### Do NOT copy (superseded)
- `cosp admin ui/HANDOFF-1-Admin-UI.md` — superseded by HANDOFF-4, all useful content absorbed
- `cosp admin ui/HANDOFF-2-Sponsor-UI.md` — superseded by this file, all useful content absorbed
- `cosp admin ui/index.html` (old admin UI, separate workstream)
- `cosp admin ui/sponsor-em-backup.html` (stale backup)
- Pre-SMASH files (`MG_EM.xlsx`, `CO Vocabulary v2.59.xlsx`)
- `mg_target_data.json` (referenced in old handoffs but no longer exists)

---

## Tech Stack

- React + TypeScript + Next.js
- Tailwind CSS (Resonata tokens in tailwind.config.ts)
- TanStack Query (for data fetching when backend is ready)
- Font: Poppins (Google Fonts)

Build as a standalone React component first. It will be integrated into the Sponsor Workbench app later.

---

## Open Questions (For KD to Decide)

**A. Reference list drill-down.** When a concept is backed by a reference list (72 class concepts, 504 members), can the sponsor see the member list? Or is that admin-only? KD is checking with CEO.

**B. Post-activation editability.** Once a CO is activated and matching patients, can the sponsor still change everything? Or do some things lock down? Also: can all sponsor personas edit, or are there role-based write permissions? KD hasn't decided yet.

**C. Custom logic visibility.** Are custom logic entries (section fold overrides, named-rule expressions) visible to sponsors? Editable? Or admin-only? Data exists in MG Target but not rendered in either prototype.

**D. Pipeline connection.** Does the Sponsor EM have a "Run Match" or "Preview Match" action that triggers the matching pipeline? Or is matching handled entirely outside this screen?
