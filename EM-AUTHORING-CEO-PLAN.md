# Eligibility Matrix Authoring — Executive Plan

*Draft for Martin. Not yet committed to roadmap. Timeline ranges need eng validation.*

## The so-what

Today a Sponsor can *view* an eligibility matrix, in the workbench and make small changes, but can't add concepts, modifiers etc per V2 refactor. Nor can thhey *build* one from scratch. Criteria are hand-seeded by us per offer. To scale past a handful of demo offers, sponsors (and our clinical ops) need to author criteria themselves against Resonata's controlled vocabulary. This plan turns the matrix from a psuedo-read-only artifact into an authoring surface.

## Why it matters now

- Every new care option needs an eligibility matrix. Manual seeding doesn't scale past pilots.
- The vocabulary is already defined (928 concepts, 110 rules, 34+ scales in `CO Vocabulary v3.03`). The gap is the tooling that lets a human pick from it correctly.
- Audit-ready criteria are a sponsor buying requirement. Free-text criteria can't be matched or audited; vocabulary-bound criteria can.

## What we'd build, in two phases

| Phase | What it delivers | Who unblocks | Relative effort |
|---|---|---|---|
| **Phase 0 — Vocabulary foundation** | If not already done, load ALL of the canonical vocab (concepts, rules, scales, modifiers) into the platform as structured data. No UI. | Prerequisite for everything below. | Medium |
| **Phase 1 — Authoring surfaces** | The 8 tools an author uses: pick a concept, add a measurement, set a cell value, build compound rules, add screening logic. | Sponsors + clinical ops author criteria without us. | Large |

Phase 0 has no user-visible output on its own. It's the data spine. Phase 1 is where the sponsor sees a real authoring experience.

## Decision needed from you

1. **Out of scope for Phase 1** - Please look through the Phase 1 must-haves according to KD and suggest if something can be moved out to Phase 2 or 3 or brought in from Phase 2 or 3. We are beyond MVP (Day 1) now. Hence, a MoSCoW strategy is being used to prioritize these items. Main criteria for phasing has been "value add" and what customers cannot live without on Day 2

## Risks / open questions

- Estimates above are relative sizing, not committed dates. Eng needs to size Phase 0 before we put it on a calendar.
- Phase 1 is 8 distinct surfaces. We can ship a usable subset (concept pick + cell edit) before the advanced rule builders, if we want value sooner.

## What this is not

This plan covers authoring criteria. It does not change how patients are matched against criteria (that's the matching engine, separate). It makes the *inputs* to matching authorable.

# Roadmap for EM authoring capability

## Phase 0 — Vocabulary foundation (prerequisite, no UI)

For data, the following is an exhaustive inventory of changes. Only items that are NOT alrady in the system will be implemented

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

---

## Phase 1 — Authoring surfaces (must-have)

Each is a UI surface in or beside the matrix. All depend on the relevant Phase 0 dataset. None of this functionality exists today.

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
| T1.9 | EM Comments | none | User can save comments date wize | per EM comment history story | Dialog box to capture comments for a day and edit any of the past ones. |

---

## Phase 2 — High value (defer)

| # | Ticket | Notes |
|---|---|---|
| T2.1 | Cell validation inline | numeric bare; pipe `│` not comma for unions; Recency vocab |
| T2.2 | Flex slot row | DXFLEX-001/-002/-003 |
| T2.3 | Class-concept drill-down | from T0.7 |
| T2.4 | Recency default suppression | — |
| T2.5 | Concept help / hover | from T0.1 |
| T2.6 | Cell level comments / context menu on cell | compliments T1.9 |

## Phase 3 — Later

Subgroup manage (rename/reorder/delete) · matrix search/filter · save state + dirty indicator · undo/redo · cell audit trail · export back to xlsx · diff vs prior · pending/approved per §2.12.

---

## Sequencing

1. T0.1, T0.5, T0.6, T0.8 first (unblock the most surfaces).
2. T1.1 + T1.3 next — concept pick + cell edit is the minimum usable authoring loop. Shippable subset.
3. T1.2, T1.4, T1.5 — measurement + gating + index.
4. T1.6, T1.7, T1.8 — advanced rule logic last (highest complexity, server-side parse).
