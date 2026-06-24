# Eligibility Matrix Authoring — Dev Plan

*Draft for Martin review. Ticketable. One ticket per Tier 0 dataset + one per Tier 1 surface.*

Source of truth: `~/Downloads/CO Vocabulary v3.03.xlsx` + `CO Vocab Conventions Guide v2.01`.
Current matrix renderer: `src/views/setup/EmCriteriaStep.tsx` (read + light edit only). Types: `src/data/em/types.ts`.

Sizing: S = ~1–2 days, M = ~3–5 days, L = ~1–2 weeks. Estimates need eng validation.

---

## Tier 0 — Vocabulary foundation (prerequisite, no UI)

Build script reads the xlsx tabs, emits typed JSON into `src/data/em/vocab/`. One ticket per dataset.

| # | Ticket | Source tab | Acceptance | Backend (prod) | Frontend (prototype) |
|---|---|---|---|---|---|
| T0.1 | Load Concepts | Concepts (928) | Typed JSON: id, name, code, prefix, synonyms[]. Validates row count. | Vocab service or seeded table; concept lookup by id/code/synonym | Import JSON; type in `types.ts` |
| T0.2 | Load Rules | Rules (44 G + 66 S) | JSON keyed by rule id; primacy G/S flag; expression string parsed. | Rule store; expose by primacy | Compound + Add-Screening read this |
| T0.3 | Load ModTypes | ModTypes (32 axes) | JSON of axis id, label, allowed suffix, value kind. | Axis registry | Slot axis picker source |
| T0.4 | Load Modifiers | Modifiers (~90) | Per-concept → allowed axis bindings. | Binding table; query by concept | Filters Slot Add axis list |
| T0.5 | Load ScalesMenus | ScalesMenus (34+) | All scales as ordered option sets (not just MGFA/NYHA/ECOG). | Scale store | Replaces hardcoded `ORDINAL_SCALES` |
| T0.6 | Load Prefixes | Prefixes | Section order + default fold (AND/OR) per prefix. | Section config | Drives section order + `sectionFoldOverrides` |
| T0.7 | Load Reference Lists | Reference Lists (76 classes / ~504 members) | Class → member concepts. | Class expansion at match time | Class drill-down (T2) |
| T0.8 | Load aux sets | Synonyms / Units / RefRanges / Dosing / LOT / Flex | JSON per set; units + ref ranges keyed to concepts. | Units/ranges for ×ULN/×LLN, dosing, LOT | Picker search, ×ULN cells, Flex rows |

**Cross-cutting:** one build script (`scripts/build-vocab.ts`) emitting all 8 JSON files, re-runnable when the xlsx version bumps. Backend: decide whether vocab is owned platform data or synced from external source (CEO decision #3).

---

## Tier 1 — Authoring surfaces (must-have)

Each is a UI surface in or beside the matrix. All depend on the relevant Tier 0 dataset.

| # | Ticket | Depends on | Acceptance | Backend (prod) | Frontend (prototype) |
|---|---|---|---|---|---|
| T1.1 | Concept Picker dialog | T0.1, T0.6, T0.8 | Search by name/code/synonym; filter by prefix matching section; insert as concept row. | Search endpoint over concepts (or ship JSON to client) | New dialog; wire to "+ Add …" links (currently visual-only) |
| T1.2 | Slot Add dialog | T0.3, T0.4, T0.5 | Pick concept → ModType axis (filtered by Modifiers) → suffix → bound scale → emits §4.4 slot-row label. | Validate axis-concept binding server-side | Multi-step dialog; emits `Slot`/`TandemSlot` |
| T1.3 | Per-cell editor by scale | T0.5, T0.8 | Cell opens correct editor for its scale; `(×ULN)`/`(×LLN)` multiplier input; all 34+ scales. | Persist cell values; validate against scale | Replace static badge with scale-aware editor |
| T1.4 | TANDEM gate editor | T0.3 | Structured `IF axis: value [; …]` composer; emits `tandemIf`. | Persist + validate gate | Composer UI on slot row |
| T1.5 | Index `!` toggle | none (UI) | Separate star button on cells, decoupled from I/E verdict cycle (§3.6). | Persist isIndex/isExIndex per cell | Split current 5-way cycle into verdict + star |
| T1.6 | Compound rule builder | T0.1, T0.2 | Operator picker (AND/OR/DUE TO/IF/EXCEPT/WITH) + component picker; GP vs GD switch. | Persist compound expr; validate operands | Builder dialog; emits `isCompound`/`compoundOp`/`components` |
| T1.7 | Add Screening rule | T0.2 | Pick from Rules where Primacy=S; insert under 220-SI. | Rule lookup by primacy | Picker + insert logic |
| T1.8 | Per-CO Custom Logic panel | T0.2, T0.6 | Below matrix: LRS fold overrides (`BM: OR`, `INDEX: AND`) + named-rule boolean box with Criterion ID autocomplete + live parse. | Persist + server-side parse/validate of expression | Panel UI; autocomplete; live parser |

---

## Tier 2 — High value (defer)

| # | Ticket | Notes |
|---|---|---|
| T2.1 | Cell validation inline | numeric bare; pipe `│` not comma for unions; Recency vocab |
| T2.2 | Flex slot row | DXFLEX-001/-002/-003 |
| T2.3 | Class-concept drill-down | from T0.7 |
| T2.4 | Recency default suppression | — |
| T2.5 | Concept help / hover | from T0.1 |

## Tier 3 — Later

Subgroup manage (rename/reorder/delete) · matrix search/filter · save state + dirty indicator · undo/redo · cell audit trail · export back to xlsx · diff vs prior · pending/approved per §2.12.

---

## Sequencing

1. T0.1, T0.5, T0.6, T0.8 first (unblock the most surfaces).
2. T1.1 + T1.3 next — concept pick + cell edit is the minimum usable authoring loop. Shippable subset.
3. T1.2, T1.4, T1.5 — measurement + gating + index.
4. T1.6, T1.7, T1.8 — advanced rule logic last (highest complexity, server-side parse).

## Open eng questions

- Vocab as owned platform data vs. external sync (sets Tier 0 backend shape).
- Where does authored criteria persist, and what's the match-engine contract for consuming it?
- Server-side vs. client-side expression parsing for T1.8 (audit implies server).
