# Session Handoff — Agency / Sponsor / MLR Workbench Prototype

For the next Claude session. Picks up exactly where this one ended (context limit).

---

## 1. Orientation

- **Repo:** `Resonata-Health/agency-workbench-prototype` (GitHub, private)
- **Canonical clone:** `~/Developer/claude-workspace-resonata/Github/agency-workbench-prototype` (KD's main checkout, branch `main`)
- **This worktree:** `~/Developer/claude-workspace-resonata/Github/agency-workbench-prototype/.claude/worktrees/amazing-morse-b0675f` (branch `claude/amazing-morse-b0675f`). Shares `.git` with the canonical clone.
- **Deploy:** GitHub Actions builds Next.js static export on every push to `main` → publishes to `https://resonata-health.github.io/agency-workbench-prototype/` in ~1–2 min. `NEXT_PUBLIC_BASE_PATH` is set in `.github/workflows/deploy.yml`.
- **Local dev:** `npm run dev` on port 3000. Launch config at `.claude/launch.json`.
- **Tech stack:** Next.js 14 (App Router) · TypeScript · Tailwind · TanStack Query (unused so far) · Poppins. `output: 'export'` — pure static, no server runtime.
- **Push workflow:** I commit on this worktree's branch and push with `git push origin claude/amazing-morse-b0675f:main` (publishes my commits straight to remote `main`). KD pulls into his canonical clone with `git pull --ff-only origin main`. If push fails non-fast-forward, `git fetch && git rebase origin/main && git push …` (KD sometimes pushes his own commits — handoff docs, .gitignore tweaks).

### Latest pushed commit
`0f82de3` — Restore Nuveero + BREVANTA; render full V2 EM patterns
(plus any subsequent KD/me commits — fetch to verify)

---

## 2. What's live

### Personas (top-right "For Dev Only: Viewing as…")
- **Sponsor** — default on first load
- **Agency Operator**
- **MLR Reviewer**

Persona switcher routes to that persona's home (`/sponsor` · `/` · `/mlr`) and hides cross-persona routes (`/sponsor` and `/mlr` redirect away if persona doesn't match).

### Sponsors
- **NMD Pharma** — default on first load. Clinical Trial use case.
- **Janssen** — Drug use case.
- **Nuveero Therapeutics** — Heart Failure use case (BREVANTA, full V2 EM pattern coverage).

(CureX and Nuveero's prior offers were removed. Nuveero came back to host BREVANTA.)

### Care options
| id | sponsor | title | offerKind | status | agencyAssigned | EM seed |
|---|---|---|---|---|---|---|
| `nmd670-mg` | NMD Pharma | NMD670 in adult AChR/MuSK-Ab+ MG (NCT06414954) | clinical_trial | inDesign (Draft) | false | `nct06414954.ts` |
| `imaavy` | Janssen | Nipocalimab (Imaavy) for ≥12 AChR/MuSK MG | approved_treatment | inDesign (Draft) | true | `imaavy.ts` |
| `brevanta` | Nuveero | BREVANTA (sulecizumab) — Chronic Heart Failure | approved_treatment | active | true | `brevanta.ts` (full V2 patterns) |

### Storage keys (localStorage, bumped on default change)
- `rwb_persona_v3` — persona
- `rwb_sponsor_v3` — sponsor
- `rwb_permission_matrix_v1` — admin matrix overrides
- `rwb_sponsor_logo_v1` — uploaded logo
- Bump suffix to force everyone to fresh defaults across sessions.

---

## 3. Product rules embedded in code

Don't break these without confirming with KD.

### Persona / role
- Default = Sponsor + NMD Pharma. Defined in `src/app/providers.tsx`.
- Persona switcher prefix reads literally `For Dev Only: Viewing as…` (it's a prototype affordance, not a product feature).
- Sponsor switcher + persona switcher are **visible only on landing pages** (`/`, `/sponsor`, `/mlr`). Hidden everywhere else (wizard, matches, outreach, admin) so they can't change context mid-step. `onLanding` gate in `src/components/TopNav.tsx`.
- "Resonata" logo + workbench label are both **clickable** to that persona's home.
- Admin breadcrumb (`· Admin`) shows on `/admin/*` pages as plain text (not a link — user is already there).
- Gear icon (admin entry) shows only when `manage_permissions` capability AND not on `/admin/*`.
- Sponsor logo (if uploaded via `/admin/branding`) renders left of avatar on every page for every persona.

### Care offer card meta line
- Approved treatment: `Approved Treatment · Advertising Offer · N matches to date · last updated`
- Clinical trial: `Phase · N sites · Enrollment complete · last updated`
- **Removed and not coming back without explicit ask:** "N subgroups", "N arms", "N cohorts" — KD pruned those.

### Setup wizard branching (`src/views/SetupView.tsx`)
- `can('edit_setup_clinical')` true → 3-step wizard (Overview · Criteria · Contacts)
- Else → read-only summary view (Agency / MLR)

### Setup Overview — Patient + Provider sections (split per HANDOFF-2)
- Two stacked sections in this order: "For patient-facing communications" (green PATIENT chip) → "For provider-facing communications" (violet PROVIDER chip + "Copy from patient-facing" link).
- Same 3 required fields each: Option name · Option subtitle · Description.
- Per-field red asterisks. **No** "* Required" on section heading.
- "Copy from patient-facing" confirms before overwriting non-empty provider fields.
- "Display Title" hidden under `SHOW_DISPLAY_TITLE = false` flag in both Setup paths — kept in code, don't remove.

### Setup Contacts step
- Last-step button reads **"Complete Setup and Activate"**. Click → sets offer status to `'active'` + routes to `/matches?offer=<id>`.

### Matches (`src/views/MatchesView.tsx`)
- Tab visible to anyone with `view_matches` capability (Sponsor + Agency by default; MLR hidden).
- **Checkboxes hidden** unless `offer.status === 'active'` AND persona !== sponsor (Sponsor never selects).
- Selection-locked banner shows for Agency only when status !== 'active' ("Patients can be selected for outreach once the outreach and patient-facing content has been designed and approved.").
- Email-related KPIs (Emails Sent, Email Opens) hidden for Sponsor.
- Match data is MG-themed (Mass General Neuro / Hopkins / Mayo · 8 patients with AChR/MuSK/MGFA references).

### Outreach (`src/views/OutreachView.tsx`)
- 3 artifacts: Email · Sponsor Card · Details page. **Sponsor never sees Email** — `allowedArtifacts` filters it out; default artifact becomes Card.
- Sponsor Card template auto-picks by offer kind (`approved_treatment` → "Sponsored", `clinical_trial` → "Apply"). **No template picker for Card** (only Email + Details have it).
- Trial card background = `#f2f9f0`, equal-width CTA grid.
- Edit-mode rule:
  - Draft → editors unlocked, primary CTA shows always
  - Active / RejectedByMlr → starts read-only with **Edit** button left of where Submit/Activate would be; once `dirty`, primary CTA shows
  - InMlrReview → fully locked, footer hint shown
- Primary CTA label by context:
  - Sponsor + Clinical Trial → "Activate Offer" (skips MLR; sets status to active directly)
  - Else → "Submit for MLR Approval →"
- **Discard** button: only when `editMode && dirty`. Reseeds Email + Details (Card is auto-template, leaves alone).
- **Send Email** button (Agency · Active · selectedCount > 0 · no prior send) opens `SendCampaignDialog` with cost breakdown (Full / Partial × $/Email). After send: hide.
- Rejected-by-MLR red banner at top of Outreach with "View MLR feedback" → opens `MessagesDialog` (rejection-message history, newest first).
- MLR-only buttons (Reject with reason textarea, Approve ✓) gated by capability AND `status === 'inMlrReview'`.

### Outreach Cost History (right-edge drawer)
- Pull-tab label and drawer title: **"Outreach Cost History"**.
- Budget visual: horizontal bar, color shifts at 50% / 80% (`bg-green-10` / `bg-gold-10` / `bg-red-10`).
- Constants in `src/data/outreachCampaigns.ts`: `AGENCY_BUDGET = 50_000`, `COST_PER_EMAIL = 1_645`.
- History rows per offer, newest first.

### Eligibility Matrix (Criteria step)
- Single component `EmCriteriaStep` for every offer. Reads `offer.em` (optional EmData) or falls back to `STARTER_EM` (one Main cohort, 0 concepts).
- 5-way verdict cycle: empty → I → I! → E → E! → empty
- Per-section trash icon on hover (confirms then removes section + concepts)
- INDEX:AND banner under sections listed in `seed.sectionFoldOverrides` with value `'AND'`
- Antisignal `[A]` slot rows: red label, `helpText` tooltip
- TANDEM IF slot rows: small blue pill `IF {gate}` after label
- Compound rows: violet `COMPOUND · OP` pill + italic `compoundExpr`; expand reveals component sub-rows (name only, no verdicts) on a violet-1 band
- Slot override key: `${conceptId}::${kind}::${slotIdx}::${subgroupId}` (kind = reg / anti / tandem)
- Section header has Expand-slots / Collapse-slots hover toggle + trash icon
- Bottom toolbar: Global Expand all / Collapse all
- "+ Add Subgroup" header link → modal · "+ Add Category" centered button → dropdown of canonical sections not yet shown
- "+ Add Condition / Biomarker / Demographic / Criterion" link per section — **visual only, not wired**

### MLR Workflow
- MLR landing scope = sponsor portfolio filtered to status in `['inMlrReview', 'active']`. Card click → `/outreach` directly.
- Approve dialog body verbatim: "By approving this content, you are acknowledging that you have reviewed the content, Form 2253 has been submitted and patient outreach can begin."
- Reject dialog: Reason textarea required, "Yes, reject" button; records `RejectionMessage` + flips status to `rejectedByMlr` + routes to `/mlr`.
- After reject: Agency can edit + resubmit; history persists across rounds.

### Admin
- Sidebar layout (no "ADMIN" header, no "Back to Sponsor Workbench" link — those were removed).
- Two pages: **Branding** (logo upload, persists to localStorage, broadcasts `rwb-logo-changed`) and **Delegates** (invite form + people list + read-only role-permissions matrix).
- Permissions matrix is documentation only (`src/data/permissionsDisplay.ts`) — KD said permissions are backend-defined; sponsor sees but can't edit.
- "Sponsor Admin" hidden from Delegates invite role dropdown (provisioned by Resonata).
- `/admin` and `/admin/permissions` are client redirects (to `/admin/branding` and `/admin/delegates` respectively).

---

## 4. Data layer architecture

### Light registry pattern (`src/data/mockCareOffers.ts`)
Single `OFFERS: CareOffer[]` array is the source of truth.

Each offer record carries:
- Standard card fields (id, title, internalId, sponsor, sponsorShort, description, status, updatedLabel, offerKind, phase, etc.)
- Optional `em?: EmData` — its EM seed (omit → `STARTER_EM` used)
- Optional `agencyAssigned?: boolean` — true means also shows on Agency landing for that sponsor

Derived views (all computed via `.reduce` over `OFFERS`):
- `allOffers`
- `sponsorPortfolioBySponsor` (everything)
- `careOffersBySponsor` (only `agencyAssigned: true`)
- `findOffer(id)` helper

**To add a new offer:** drop one record in `OFFERS`. To add a new sponsor: append to `sponsors` tuple + `sponsorMeta`. EM seed lives in `src/data/em/<slug>.ts`. Recipe is at the top of `mockCareOffers.ts`.

### EM types (`src/data/em/types.ts`)
- `Verdict = 'I' | 'E' | 'I!' | 'E!' | null`
- `SlotType = 'numeric' | 'ordinal' | 'category' | 'duration' | 'result-type'`
- `Slot { label, type, values, helpText? }`
- `TandemSlot extends Slot { tandemIf: string }`
- `CompoundComponent { id?, name }`
- `Concept { id, name, section, isIndex?, isExIndex?, verdicts, slots?, antisignalSlots?, tandemSlots?, isCompound?, compoundOp?, compoundExpr?, components? }`
- `Section { id, name, addLabel }` + `CANONICAL_SECTIONS` (20 entries per spec)
- `ORDINAL_SCALES` (MGFA, NYHA, ECOG only — hardcoded; needs Tier 0 vocab work)
- `CATEGORY_OPTIONS`, `RESULT_TYPE_OPTIONS`, `DURATION_UNITS`
- `EmData { subgroups, concepts, sectionFoldOverrides? }`

### EM seeds
- `src/data/em/nct06414954.ts` — NMD MG, 1 subgroup, basic
- `src/data/em/imaavy.ts` — Janssen Imaavy, 1 subgroup, basic
- `src/data/em/brevanta.ts` — Nuveero HF, 3 subgroups, **full V2 patterns**: I! · E! · antisignal · TANDEM · compound · INDEX:AND
- `src/data/em/starter.ts` — empty fallback

### Mock stores (module memory; reset on hard reload)
- `src/data/offerStatusOverrides.ts` — runtime status changes (e.g., after Submit / Approve / Activate)
- `src/data/rejectionMessages.ts` — MLR rejection history per offer
- `src/data/outreachCampaigns.ts` — campaign send history per offer + budget
- `src/data/logoStore.ts` — uploaded sponsor logo (this one persists to localStorage)

### Capabilities (`src/data/permissions.ts`)
17 capabilities × 4 roles (sponsor_admin · sponsor_std · mlr · agency). `DEFAULT_MATRIX` is the runtime ground truth for gating; `permissionsDisplay.ts` is the separate static spec table for the admin Delegates page.

---

## 5. Component map

### TopNav (`src/components/TopNav.tsx`)
Reads from `usePermissions()` for persona / sponsor / can. Decides switcher visibility by `onLanding`. Renders gear, breadcrumb, persona switcher, sponsor switcher, sponsor logo, avatar (JD).

### WorkbenchTabs (`src/components/WorkbenchTabs.tsx`)
Gates Matches tab by `can('view_matches')`. (Draft offers also previously hid Matches; that rule was reverted — Matches now visible for any status if capability allows.)

### EmCriteriaStep (`src/views/setup/EmCriteriaStep.tsx`)
~520 lines. Contains: state (subgroups, concepts, extraSectionIds, collapsedSections, expandedConcepts, verdictOverrides, slotOverrides), all handlers (cycleVerdict, removeSection, setSlotValue, toggleSection, toggleConcept, toggleAllSlots, toggleSectionSlots, addSubgroup, addCategory), and child components (`SectionBlock`, `ConceptRows`, `SlotRow`, `VerdictBadge`, `SlotInput`, `Select`, `AddSubgroupModal`, `TrashIcon`, `CompoundPill`).

### SponsorLandingView / MlrLandingView / LandingPage
Each one reads sponsor from `usePermissions()`, filters its offer source, renders KPI cards + status chip filter + offer card list. Sponsor landing has the searchbox + status chips inline (per KD's earlier ask).

### OutreachView (`src/views/OutreachView.tsx`)
~500 lines. State machine for the whole outreach lifecycle. Footer button visibility logic is the trickiest piece — re-read it before touching.

### SetupView + SetupWizard
Branches on capability. Wizard has 3 steps in `src/views/setup/` (OverviewStep · CriteriaStep · ContactsStep).

### Admin
`src/components/admin/AdminShell.tsx` — sidebar layout. Two pages render `AdminBrandingView` and `AdminDelegatesView`.

### Outreach helpers (`src/components/outreach/`)
ConfirmDialog · RejectDialog · MessagesDialog · SendCampaignDialog · SelectedPatientsPullTab (renamed semantically — actually renders Outreach Cost History) · Segmented · TemplatesBar · EmailEditor · CardEditor · DetailsEditor · PhonePreview · RtToolbar · fields (EditText / EditArea / Locked)

---

## 6. Outstanding work — EM authoring

KD aligned on this gap analysis at end of session. Next session likely starts here.

### Tier 0 — Prerequisite: load CO Vocabulary v3.03.xlsx as JSON
Build script reads `~/Downloads/CO Vocabulary v3.03.xlsx` → emits typed JSON into `src/data/em/vocab/`.

| Source tab | Powers (Tier 1/2 features) |
|---|---|
| Concepts (928) | Concept Picker, hover/help |
| Rules (44 G + 66 S) | Compound builder, Add Screening |
| ModTypes (32 axes) | Slot axis picker, TANDEM gate |
| Modifiers (~90 bindings) | Per-concept axis filter |
| ScalesMenus (34+ scales) | Cell editor options |
| Prefixes | Section order, default folds |
| Reference Lists (76 classes / ~504 members) | Class-concept drill-down |
| Synonyms / Units / RefRanges / Dosing / LOT / Flex | Picker search, ×ULN cells, Flex |

### Tier 1 — Must-have authoring surfaces
1. **Concept Picker dialog** — search Concepts by name / code / synonym; filter by prefix matching section
2. **Slot Add dialog** — pick concept → ModType axis (filtered by Modifiers binding) → suffix → bound scale → emits §4.4 slot-row label
3. **Per-cell editor by ScalesMenus** — load all 34+ scales (not just hardcoded MGFA/NYHA/ECOG); `(×ULN)` / `(×LLN)` multiplier input
4. **TANDEM gate editor** — structured `IF axis: value [; …]` composer
5. **Index `!` toggle** — separate star button on cells, not bundled into the I/E cycle (per §3.6)
6. **Compound rule builder** — operator picker (AND/OR/DUE TO/IF/EXCEPT/WITH) + component picker; GP vs GD switch (GD = inline modifier specs)
7. **Add Screening rule** — pick from Rules tab where Primacy=S; insert under 220-SI
8. **Per-CO Custom Logic panel** — below matrix: LRS fold overrides (`BM: OR`, `INDEX: AND`) + named-rule boolean expression box with Criterion ID autocomplete and live parse

### Tier 2 — High value
- **10** Cell validation inline (numeric = bare; pipe `│` not comma for multi-union; Recency vocab `Current / Ever / Within N`)
- **11** Flex slot row (DXFLEX-001 CV / -002 Cancer / -003 MG)
- **12** Class-concept Reference List drill-down
- **13** Recency default suppression
- **15** Concept-level help / hover

### Tier 3 — Later
- **9** Subgroup manage (rename / reorder / delete) — KD pushed from Tier 2
- **14** Matrix search/filter — KD pushed from Tier 2
- Save state + dirty indicator · Undo/redo · Cell audit trail · Export back to xlsx · Diff vs prior · Pending/approved per §2.12

### Pending KD ask
End of session he asked: *"Want me to write this up as a dev-ticketable doc (one ticket per Tier 0 dataset + one per Tier 1 surface)?"* — he hadn't answered when context ran out.

---

## 7. Reference docs in the repo

| File | Purpose |
|---|---|
| `HANDOFF-3-Sponsor-EM-Build.md` | Original Sponsor EM build spec from KD's cowork session |
| `HANDOFF-4-Admin-UI-Build.md` | (Exists in `cosp admin ui/` — not in this repo. KD's admin spec.) |
| `BRAND-ARCHITECTURE-CONTEXT.md` | Design brief sent to Claude Design re: multi-brand IA (outcome not back yet) |
| `OUTREACH-CONTEXT.md` | Original outreach design brief |
| `sponsor-em.html` | Reference HTML prototype — MG trial NCT06517758 (V1 patterns) |
| `sponsor-em-hf.html` | Reference HTML prototype — HF trial (V2 patterns; ported into BREVANTA seed) |

Outside the repo (KD's workspace):
- `~/Downloads/CO Vocabulary v3.03.xlsx` — the canonical concept/rule/scale/modifier vocab. Source of Tier 0 work.
- `~/Downloads/CO Vocab Conventions Guide v2.01 (1).docx` — the 17-chapter authoring contract for the vocab. Comprehensive reference for what every EM authoring surface should accept/emit. Cited heavily in the Tier 1/2 plan.
- `~/Developer/claude-workspace-resonata/cosp admin ui/` — original HTML prototypes + handoff docs (KD's cowork session). Contains the canonical HF prototype `sponsor-em-hf.html` and the conventions/handoff files.

---

## 8. Operational gotchas

### Git push
- Uses SSH with host alias `github-resonata` (see `~/.ssh/config`). Key at `~/.ssh/id_ed25519_resonata`, passphrase in macOS keychain.
- If push 403s / "Permission denied (publickey)": agent lost the key. Run from this worktree:
  ```bash
  ssh-add --apple-load-keychain
  ```
  Then retry push. If keychain is empty too, KD must run `ssh-add --apple-use-keychain ~/.ssh/id_ed25519_resonata` once in his Terminal.
- If push rejected non-fast-forward: `git fetch origin && git rebase origin/main && git push …` — KD sometimes pushes his own commits between mine.

### Dev server cache corruption
Symptom: browser console floods with 404s for `layout.css`, `main-app.js`, `page.js`, etc. KD reports the page renders unstyled HTML. Cause: my `npm run build` (production) clobbered `.next/` while the dev server (also writes to `.next/`) was running.

Fix:
```bash
pkill -f next-server
rm -rf .next
npm run dev
```

Avoid running `npm run build` while dev server is running. Use `npx tsc --noEmit` for typecheck instead.

### Preview MCP
- `mcp__Claude_Preview__preview_start` with `name: "agency-workbench"` — config in `.claude/launch.json`.
- If port 3000 is held by a stale Next dev server, find PID with `lsof -i :3000`, kill it, restart preview.
- Hard navigation via `window.location.href = '/foo'` resets module-state stores (offerStatusOverrides etc.). For preserving in-app state during testing, soft-nav via `router.push` (not directly accessible from `preview_eval`).
- Preview tools occasionally hit Anthropic classifier outages — they error transiently. Retry after a minute or skip verification and trust the build.

### TypeScript / build
- `npx tsc --noEmit` — fast typecheck only
- `npm run build` — full production build. Don't run while dev server is up (see above).
- All routes are pre-rendered as static via `output: 'export'`. Server-side `redirect()` from a page component doesn't work — must use client-side `router.replace()` in a useEffect.

---

## 9. Working with KD

### Style rules (from `~/Developer/claude-workspace-resonata/CLAUDE.md`)
- **Short, specific, actionable.** No throat-clearing ("Got it", "Sure", "Of course"). No re-stating his ask. One unique idea per line.
- When coding: no chatter, no code repetition (only diffs), no explanations unless asked, explicit file/function refs, no out-of-scope changes.
- Never use em dashes — use commas, periods, or parentheses. (I've slipped on this several times; KD hasn't called it out but his CLAUDE.md is firm.)
- Bullet points over paragraphs.
- Tables where they carry meaning without prose underneath.

### Behavioral preferences
- KD is the PM/designer, not the dev. He defines what gets built, not how. But he is technical enough to follow the prototype's code at a high level.
- He likes seeing intermediate results: when a UI change is observable, verify in the preview and report back. When it's data-only, the build pass is enough.
- He pushes back fast when something's wrong ("you broke X" / "actually do the opposite"). When that happens, fix it in the same turn — don't re-litigate.
- Default to one tight clarifying question via AskUserQuestion when scope is genuinely ambiguous. Don't bury him in 4 questions when 1 is the real blocker.
- He'll often type a typo or imprecise phrase ("right to" meaning "right next to", "Tier 5" meaning "Tier 1"). Interpret charitably, ask only if it really changes the work.

### Saved memories that matter
- `~/.claude/projects/-Users-kdarneja-Developer-claude-workspace-resonata-Github-agency-workbench-prototype/memory/MEMORY.md` indexes:
  - `feedback_planning_style.md` — terse, no proactive plans, ask before sketching screens
  - `project_deploy_setup.md` — git clone is canonical; push to main auto-deploys
  - `project_design_tokens.md` — Charcoal/White token convention mapped to Tailwind classes (use the Tailwind tokens, never raw hex)

### Demos
KD demos this prototype to SMEs / devs / stakeholders. He has drafted demo scripts (saved in chat) for:
- Sponsor → Agency → MLR end-to-end on Imaavy
- NMD MG full sponsor flow (Setup → Criteria → Contacts → Outreach → Activate)
- Patient-side preview matches (Q&A based, no records)

When he asks for a "script for X workflow", model after those: numbered steps with persona switches, clicks, narration, ~3–5 min total.

---

## 10. Branch / commit hygiene

- Working branch: `claude/amazing-morse-b0675f` (this worktree). Push to remote `main`.
- Commits follow the pattern in `git log` — first line < 70 chars, body explains the why + key behaviors, trailer `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>`.
- Stage files explicitly (never `git add -A` — `.next/` cache + `tsconfig.tsbuildinfo` leak in).
- After every multi-file change: `npx tsc --noEmit` before commit.

---

## 11. Quick "where is X?" index

| Looking for… | Path |
|---|---|
| Personas / capabilities / matrix | `src/data/permissions.ts` |
| Sponsors / offers registry | `src/data/mockCareOffers.ts` |
| EM types | `src/data/em/types.ts` |
| EM seeds | `src/data/em/{nct06414954,imaavy,brevanta,starter}.ts` |
| Outreach drafts + templates | `src/data/outreachContent.ts` |
| Outreach campaign store | `src/data/outreachCampaigns.ts` |
| Sponsor logo store | `src/data/logoStore.ts` |
| MLR rejection messages | `src/data/rejectionMessages.ts` |
| Offer status overrides | `src/data/offerStatusOverrides.ts` |
| Permissions display table | `src/data/permissionsDisplay.ts` |
| Setup wizard steps | `src/views/setup/{OverviewStep,CriteriaStep,ContactsStep,SetupWizard}.tsx` |
| EM main UI | `src/views/setup/EmCriteriaStep.tsx` |
| Admin views | `src/views/{AdminBrandingView,AdminDelegatesView}.tsx` |
| Admin shell | `src/components/admin/AdminShell.tsx` |
| Top nav | `src/components/TopNav.tsx` |
| Care offer card | `src/components/CareOfferCard.tsx` |
| Outreach footer + dialogs | `src/views/OutreachView.tsx` + `src/components/outreach/*` |
| Sponsor landing | `src/views/SponsorLandingView.tsx` |
| MLR landing | `src/views/MlrLandingView.tsx` |
| Agency landing | `src/views/LandingPage.tsx` |
| Matches | `src/views/MatchesView.tsx` |

---

## 12. First moves for next session

1. Read this doc + `CLAUDE.md` (for the style rules).
2. `git fetch origin && git log --oneline -10` to see what's landed since `0f82de3`.
3. Confirm with KD whether to proceed with the dev-ticket doc he was about to greenlight (Tier 0 + Tier 1 surfaces from §6).
4. If yes: write the ticket doc to repo root as `EM-AUTHORING-DEV-SPEC.md`, one section per dataset (Tier 0) + one per surface (Tier 1), with acceptance criteria. Then ask whether to start the Tier 0 xlsx-to-JSON build script.
5. If KD redirects to something else, do that.

— End of handoff —
