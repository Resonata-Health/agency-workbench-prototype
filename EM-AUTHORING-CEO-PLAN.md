# Eligibility Matrix Authoring — Executive Plan

*Draft for Martin. Not yet committed to roadmap. Timeline ranges need eng validation.*

## The so-what

Today a Sponsor can *view* an eligibility matrix in the workbench but can't *build* one. Criteria are hand-seeded by us per offer. To scale past a handful of demo offers, sponsors (and our clinical ops) need to author criteria themselves against Resonata's controlled vocabulary. This plan turns the matrix from a read-only artifact into an authoring surface.

## Why it matters now

- Every new care option needs an eligibility matrix. Manual seeding doesn't scale past pilots.
- The vocabulary is already defined (928 concepts, 110 rules, 34+ scales in `CO Vocabulary v3.03`). The gap is the tooling that lets a human pick from it correctly.
- Audit-ready criteria are a sponsor buying requirement. Free-text criteria can't be matched or audited; vocabulary-bound criteria can.

## What we'd build, in two phases

| Phase | What it delivers | Who unblocks | Relative effort |
|---|---|---|---|
| **Phase 0 — Vocabulary foundation** | Load the canonical vocab (concepts, rules, scales, modifiers) into the platform as structured data. No UI. | Prerequisite for everything below. | Medium |
| **Phase 1 — Authoring surfaces** | The 8 tools an author uses: pick a concept, add a measurement, set a cell value, build compound rules, add screening logic. | Sponsors + clinical ops author criteria without us. | Large |

Phase 0 has no user-visible output on its own. It's the data spine. Phase 1 is where the sponsor sees a real authoring experience.

## Decision needed from you

1. **Greenlight to scope Phase 0 + Phase 1 as buildable tickets?** (Dev plan is drafted and ready.)
2. **Is this a near-term roadmap item or a fast-follow** after the current outreach/MLR flows land?
3. **Build vs. buy on the vocabulary service** — do we own the vocab as platform data, or treat it as an external reference we sync? Affects Phase 0 shape.

## Risks / open questions

- The vocabulary is a living spec (currently v3.03). We need an owner and an update cadence, or the authoring tools drift from the source.
- Estimates above are relative sizing, not committed dates. Eng needs to size Phase 0 before we put it on a calendar.
- Phase 1 is 8 distinct surfaces. We can ship a usable subset (concept pick + cell edit) before the advanced rule builders, if we want value sooner.

## What this is not

This plan covers authoring criteria. It does not change how patients are matched against criteria (that's the matching engine, separate). It makes the *inputs* to matching authorable.
