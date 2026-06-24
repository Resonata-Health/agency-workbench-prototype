'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { CONTAINER } from '@/components/container'
import { ConfirmDialog } from '@/components/outreach/ConfirmDialog'
import { setEmDirty } from '@/data/emDirty'
import type { CareOffer } from '@/data/mockCareOffers'
import {
  CANONICAL_SECTIONS,
  CATEGORY_OPTIONS,
  DURATION_UNITS,
  ORDINAL_SCALES,
  RESULT_TYPE_OPTIONS,
  type Concept,
  type EmData,
  type Slot,
  type Subgroup,
  type TandemSlot,
  type Verdict
} from '@/data/em/types'

interface Props {
  offer: CareOffer
  seed: EmData
}

export function EmCriteriaStep({ offer, seed }: Props) {
  const router = useRouter()

  // Mutable copies so Add Subgroup / Add Category work in the demo.
  const [subgroups, setSubgroups] = useState<Subgroup[]>(seed.subgroups)
  const [concepts, setConcepts]   = useState<Concept[]>(seed.concepts)
  const [extraSectionIds, setExtraSectionIds] = useState<string[]>([])

  // Section / concept open state.
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(() => new Set())
  const [expandedConcepts, setExpandedConcepts]   = useState<Set<string>>(() => new Set())

  // Verdict + slot overrides (keyed maps so toggles don't mutate seed).
  const [verdictOverrides, setVerdictOverrides] = useState<Record<string, Verdict>>({})
  const [slotOverrides, setSlotOverrides]       = useState<Record<string, string | null>>({})

  // Modal / popover toggles.
  const [showAddSubgroup, setShowAddSubgroup] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showRevertConfirm, setShowRevertConfirm] = useState(false)
  const [pendingDeleteSection, setPendingDeleteSection] = useState<string | null>(null)

  /* ---------- derived state ---------- */

  const sectionsToShow = useMemo(() => {
    const visibleIds = new Set([
      ...concepts.map(c => c.section),
      ...extraSectionIds
    ])
    return CANONICAL_SECTIONS.filter(s => visibleIds.has(s.id))
  }, [concepts, extraSectionIds])

  const availableSectionsToAdd = useMemo(
    () => CANONICAL_SECTIONS.filter(s => !sectionsToShow.some(v => v.id === s.id)),
    [sectionsToShow]
  )

  const conceptsBySection = useMemo(() => {
    const map = new Map<string, Concept[]>()
    for (const c of concepts) {
      const list = map.get(c.section) ?? []
      list.push(c)
      map.set(c.section, list)
    }
    return map
  }, [concepts])

  const allExpanded = expandedConcepts.size > 0 &&
    concepts.filter(hasExpandableChildren).every(c => expandedConcepts.has(c.id))

  /* ---------- effective value lookups ---------- */

  const effectiveVerdict = (conceptId: string, subgroupId: string): Verdict => {
    const key = `${conceptId}::${subgroupId}`
    if (key in verdictOverrides) return verdictOverrides[key]
    return concepts.find(c => c.id === conceptId)?.verdicts[subgroupId] ?? null
  }

  type SlotKind = 'reg' | 'anti' | 'tandem'
  const effectiveSlotValue = (conceptId: string, kind: SlotKind, slotIdx: number, subgroupId: string): string | null => {
    const key = `${conceptId}::${kind}::${slotIdx}::${subgroupId}`
    if (key in slotOverrides) return slotOverrides[key]
    const concept = concepts.find(c => c.id === conceptId)
    const list =
      kind === 'reg'    ? concept?.slots :
      kind === 'anti'   ? concept?.antisignalSlots :
      /* tandem */        concept?.tandemSlots
    return list?.[slotIdx]?.values[subgroupId] ?? null
  }

  /* ---------- original (seed) lookups + change detection ---------- */

  const originalVerdict = (conceptId: string, subgroupId: string): Verdict =>
    seed.concepts.find(c => c.id === conceptId)?.verdicts[subgroupId] ?? null

  const originalSlotValue = (conceptId: string, kind: SlotKind, slotIdx: number, subgroupId: string): string | null => {
    const concept = seed.concepts.find(c => c.id === conceptId)
    const list =
      kind === 'reg'  ? concept?.slots :
      kind === 'anti' ? concept?.antisignalSlots :
      /* tandem */      concept?.tandemSlots
    return list?.[slotIdx]?.values[subgroupId] ?? null
  }

  const verdictChanged = (conceptId: string, subgroupId: string): boolean =>
    effectiveVerdict(conceptId, subgroupId) !== originalVerdict(conceptId, subgroupId)

  const slotChanged = (conceptId: string, kind: SlotKind, slotIdx: number, subgroupId: string): boolean =>
    effectiveSlotValue(conceptId, kind, slotIdx, subgroupId) !== originalSlotValue(conceptId, kind, slotIdx, subgroupId)

  const isDirty =
    extraSectionIds.length > 0 ||
    subgroups.length !== seed.subgroups.length ||
    concepts.length !== seed.concepts.length ||
    Object.entries(verdictOverrides).some(([k, v]) => {
      const [cid, sid] = k.split('::')
      return v !== originalVerdict(cid, sid)
    }) ||
    Object.entries(slotOverrides).some(([k, v]) => {
      const [cid, kind, idx, sid] = k.split('::')
      return v !== originalSlotValue(cid, kind as SlotKind, Number(idx), sid)
    })

  useEffect(() => { setEmDirty(offer.id, isDirty) }, [isDirty, offer.id])

  const revertToOriginal = () => {
    setSubgroups(seed.subgroups)
    setConcepts(seed.concepts)
    setExtraSectionIds([])
    setVerdictOverrides({})
    setSlotOverrides({})
    setCollapsedSections(new Set())
    setExpandedConcepts(new Set())
    setShowRevertConfirm(false)
  }

  /* ---------- handlers ---------- */

  const cycleVerdict = (conceptId: string, subgroupId: string) => {
    const current = effectiveVerdict(conceptId, subgroupId)
    // Cycle stays within IN / IN★ / EX / EX★ — never empties. Empty cells default to IN on first click.
    let next: Verdict
    if (current === 'I')        next = 'I!'
    else if (current === 'I!')  next = 'E'
    else if (current === 'E')   next = 'E!'
    else if (current === 'E!')  next = 'I'
    else /* null */             next = 'I'
    setVerdictOverrides(prev => ({ ...prev, [`${conceptId}::${subgroupId}`]: next }))
  }

  const confirmRemoveSection = () => {
    const sectionId = pendingDeleteSection
    if (!sectionId) return
    setConcepts(prev => prev.filter(c => c.section !== sectionId))
    setExtraSectionIds(prev => prev.filter(id => id !== sectionId))
    setCollapsedSections(prev => {
      const next = new Set(prev)
      next.delete(sectionId)
      return next
    })
    setPendingDeleteSection(null)
  }

  const setSlotValue = (conceptId: string, kind: SlotKind, slotIdx: number, subgroupId: string, value: string) => {
    setSlotOverrides(prev => ({ ...prev, [`${conceptId}::${kind}::${slotIdx}::${subgroupId}`]: value || null }))
  }

  const toggleSection = (sectionId: string) =>
    setCollapsedSections(prev => {
      const next = new Set(prev)
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId)
      return next
    })

  const toggleConcept = (conceptId: string) =>
    setExpandedConcepts(prev => {
      const next = new Set(prev)
      next.has(conceptId) ? next.delete(conceptId) : next.add(conceptId)
      return next
    })

  const toggleAllSlots = () => {
    if (allExpanded) {
      setExpandedConcepts(new Set())
    } else {
      const all = new Set(concepts.filter(hasExpandableChildren).map(c => c.id))
      setExpandedConcepts(all)
    }
  }

  const toggleSectionSlots = (sectionId: string) => {
    const inSection = (conceptsBySection.get(sectionId) ?? []).filter(hasExpandableChildren)
    const allOpen = inSection.length > 0 && inSection.every(c => expandedConcepts.has(c.id))
    setExpandedConcepts(prev => {
      const next = new Set(prev)
      for (const c of inSection) {
        if (allOpen) next.delete(c.id)
        else next.add(c.id)
      }
      return next
    })
  }

  const addSubgroup = (label: string) => {
    const id = `sg_${Date.now()}`
    setSubgroups(prev => [...prev, { id, label }])
    setShowAddSubgroup(false)
  }

  const addCategory = (sectionId: string) => {
    setExtraSectionIds(prev => [...prev, sectionId])
    // Make sure it's expanded so the empty add-row is visible.
    setCollapsedSections(prev => {
      const next = new Set(prev)
      next.delete(sectionId)
      return next
    })
    setShowAddCategory(false)
  }

  const goPrev = () => router.push(`/setup?offer=${offer.id}&step=overview`)
  const goNext = () => router.push(`/setup?offer=${offer.id}&step=contacts`)

  /* ---------- render ---------- */

  return (
    <>
      <button
        type="button"
        onClick={goPrev}
        className="text-[13px] text-blue-12 hover:underline mb-3"
      >
        ← Back
      </button>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[20px] font-semibold text-charcoal-18">
          {offer.internalId} — Eligibility Criteria
        </h2>
        <div className="flex items-center gap-2">
          {isDirty && (
            <button
              type="button"
              onClick={() => setShowRevertConfirm(true)}
              className="inline-flex items-center gap-1.5 border border-charcoal-4 hover:border-red-10 hover:bg-red-1 hover:text-red-13 text-[12px] text-charcoal-12 rounded-md px-3 py-1.5"
            >
              Revert to Original
            </button>
          )}
          <button
            type="button"
            onClick={toggleAllSlots}
            className="inline-flex items-center gap-1.5 border border-charcoal-4 hover:bg-charcoal-1 text-[12px] text-charcoal-12 rounded-md px-3 py-1.5"
          >
            {allExpanded ? 'Collapse all' : 'Expand all'}
          </button>
        </div>
      </div>

      <div className="bg-charcoal-white border border-charcoal-4 rounded-lg overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: 260 }} />
              {subgroups.map(s => <col key={s.id} style={{ width: 140 }} />)}
              <col style={{ width: 130 }} />
            </colgroup>

            <thead>
              <tr>
                <th className="bg-charcoal-1 text-left text-[11px] font-semibold text-charcoal-12 uppercase tracking-wide border-b border-charcoal-4 px-5 py-3 sticky top-0 z-10">
                  Criteria
                </th>
                {subgroups.map(s => (
                  <th
                    key={s.id}
                    className="bg-charcoal-1 text-center text-[11px] font-semibold text-charcoal-12 uppercase tracking-wide border-b border-charcoal-4 px-3 py-3 sticky top-0 z-10"
                  >
                    {s.label}
                  </th>
                ))}
                <th
                  onClick={() => setShowAddSubgroup(true)}
                  className="bg-charcoal-1 text-center text-[11px] font-medium text-blue-12 border-b border-charcoal-4 px-3 py-3 sticky top-0 z-10 cursor-pointer hover:bg-blue-1"
                >
                  + Add Subgroup
                </th>
              </tr>
            </thead>

            <tbody>
              {sectionsToShow.map(section => {
                const sectionConcepts = conceptsBySection.get(section.id) ?? []
                const collapsed = collapsedSections.has(section.id)
                const expandableInSection = sectionConcepts.filter(hasExpandableChildren)
                const allInSectionOpen =
                  expandableInSection.length > 0 &&
                  expandableInSection.every(c => expandedConcepts.has(c.id))

                return (
                  <SectionBlock
                    key={section.id}
                    sectionName={section.name}
                    addLabel={section.addLabel}
                    sectionConceptCount={sectionConcepts.length}
                    collapsed={collapsed}
                    subgroupCount={subgroups.length}
                    showSlotToggle={!collapsed && expandableInSection.length > 0}
                    slotToggleLabel={allInSectionOpen ? 'Collapse slots' : 'Expand slots'}
                    onToggleSection={() => toggleSection(section.id)}
                    onToggleSlots={() => toggleSectionSlots(section.id)}
                    onRemoveSection={() => setPendingDeleteSection(section.id)}
                  >
                    {!collapsed && seed.sectionFoldOverrides?.[section.id] === 'AND' && (
                      <tr>
                        <td colSpan={subgroups.length + 2} className="p-0 border-b border-charcoal-4 bg-blue-1">
                          <div className="flex items-center gap-2 px-5 py-2 text-[11.5px] text-charcoal-14">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-gold-10 text-charcoal-18">INDEX: AND</span>
                            <span>All Index conditions in this section must be satisfied (AND logic). Custom override applied by the pipeline.</span>
                          </div>
                        </td>
                      </tr>
                    )}
                    {!collapsed && sectionConcepts.map(concept => (
                      <ConceptRows
                        key={concept.id}
                        concept={concept}
                        subgroups={subgroups}
                        expanded={expandedConcepts.has(concept.id)}
                        effectiveVerdict={effectiveVerdict}
                        effectiveSlotValue={effectiveSlotValue}
                        verdictChanged={verdictChanged}
                        slotChanged={slotChanged}
                        onCycleVerdict={cycleVerdict}
                        onSetSlot={setSlotValue}
                        onToggleConcept={() => toggleConcept(concept.id)}
                      />
                    ))}
                    {!collapsed && (
                      <tr>
                        <td colSpan={subgroups.length + 2} className="px-5 py-2 border-b border-charcoal-3 bg-charcoal-white">
                          <button type="button" className="text-[12px] font-medium text-blue-12 hover:underline">
                            {section.addLabel}
                          </button>
                        </td>
                      </tr>
                    )}
                  </SectionBlock>
                )
              })}

              <tr>
                <td colSpan={subgroups.length + 2} className="px-5 py-5 text-center relative">
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(o => !o)}
                    className="inline-flex items-center gap-1.5 border border-charcoal-5 hover:border-green-10 hover:bg-green-1 hover:text-green-14 text-[13px] text-charcoal-12 rounded-full px-5 py-2"
                  >
                    + Add Category
                  </button>
                  {showAddCategory && availableSectionsToAdd.length > 0 && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%-8px)] z-30 w-[280px] bg-charcoal-white border border-charcoal-4 rounded-md shadow-pop overflow-hidden text-left">
                      <div className="px-3 py-2 text-[10px] uppercase tracking-wider font-semibold text-charcoal-12 border-b border-charcoal-3">
                        Add a category
                      </div>
                      <div className="max-h-[260px] overflow-auto">
                        {availableSectionsToAdd.map(s => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => addCategory(s.id)}
                            className="block w-full text-left px-3 py-2 text-[13px] text-charcoal-15 hover:bg-green-1 hover:text-green-14"
                          >
                            {s.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className={`${CONTAINER} flex justify-between items-center pt-6`}>
        <button
          type="button"
          onClick={goPrev}
          className="px-4 py-2 rounded-md border border-charcoal-5 text-[13px] text-charcoal-15 hover:bg-charcoal-1"
        >
          Previous: Overview
        </button>
        <button
          type="button"
          onClick={goNext}
          className="px-5 py-2 rounded-md bg-green-12 hover:bg-green-13 text-charcoal-white text-[13px] font-medium"
        >
          Next: Locations →
        </button>
      </div>

      {showAddSubgroup && (
        <AddSubgroupModal onCancel={() => setShowAddSubgroup(false)} onConfirm={addSubgroup} />
      )}

      {showRevertConfirm && (
        <ConfirmDialog
          title="Revert to the original matrix?"
          body="By reverting to original matrix, you will loose all changes. Do you want to proceed?"
          confirmLabel="Yes, revert"
          destructive
          onConfirm={revertToOriginal}
          onCancel={() => setShowRevertConfirm(false)}
        />
      )}

      {pendingDeleteSection && (
        <ConfirmDialog
          title="Are you sure you want to delete this entire criteria?"
          body={`This removes “${sectionsToShow.find(s => s.id === pendingDeleteSection)?.name ?? 'this category'}” and all its criteria. You can re-add the category later from the “+ Add Category” menu.`}
          confirmLabel="Yes, delete"
          destructive
          onConfirm={confirmRemoveSection}
          onCancel={() => setPendingDeleteSection(null)}
        />
      )}
    </>
  )
}

/* ============================================================ */
/* Sub-components                                                */
/* ============================================================ */

function SectionBlock({
  sectionName,
  addLabel: _addLabel,
  sectionConceptCount,
  collapsed,
  subgroupCount,
  showSlotToggle,
  slotToggleLabel,
  onToggleSection,
  onToggleSlots,
  onRemoveSection,
  children
}: {
  sectionName: string
  addLabel: string
  sectionConceptCount: number
  collapsed: boolean
  subgroupCount: number
  showSlotToggle: boolean
  slotToggleLabel: string
  onToggleSection: () => void
  onToggleSlots: () => void
  onRemoveSection: () => void
  children?: ReactNode
}) {
  return (
    <>
      <tr>
        <td colSpan={subgroupCount + 2} className="p-0 border-b border-charcoal-4 bg-blue-1">
          <div
            onClick={onToggleSection}
            className="group flex items-center gap-2 px-5 py-2.5 cursor-pointer select-none hover:bg-blue-2"
          >
            <span className={`inline-block w-3.5 text-[11px] text-charcoal-11 transition-transform ${collapsed ? '-rotate-90' : ''}`}>
              ▼
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-15">
              {sectionName}
            </span>
            <span className="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-blue-10 text-charcoal-white text-[10px] font-bold">
              {sectionConceptCount}
            </span>
            <div className="ml-auto flex items-center gap-1">
              {showSlotToggle && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onToggleSlots() }}
                  className="opacity-0 group-hover:opacity-100 text-[10.5px] font-medium text-charcoal-11 hover:text-charcoal-15 hover:bg-charcoal-white px-2 py-0.5 rounded transition-opacity"
                >
                  {slotToggleLabel}
                </button>
              )}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemoveSection() }}
                aria-label={`Remove ${sectionName}`}
                title="Remove this category"
                className="opacity-0 group-hover:opacity-100 text-charcoal-11 hover:text-red-13 hover:bg-charcoal-white p-1 rounded transition-opacity"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        </td>
      </tr>
      {children}
    </>
  )
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2.5 4.5h11M6.5 4.5V3a1 1 0 011-1h1a1 1 0 011 1v1.5M4 4.5l.8 9a1 1 0 001 .9h4.4a1 1 0 001-.9l.8-9M6.8 7v5M9.2 7v5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

type SlotKind = 'reg' | 'anti' | 'tandem'

function ConceptRows({
  concept,
  subgroups,
  expanded,
  effectiveVerdict,
  effectiveSlotValue,
  verdictChanged,
  slotChanged,
  onCycleVerdict,
  onSetSlot,
  onToggleConcept
}: {
  concept: Concept
  subgroups: Subgroup[]
  expanded: boolean
  effectiveVerdict: (cid: string, sid: string) => Verdict
  effectiveSlotValue: (cid: string, kind: SlotKind, sIdx: number, sid: string) => string | null
  verdictChanged: (cid: string, sid: string) => boolean
  slotChanged: (cid: string, kind: SlotKind, sIdx: number, sid: string) => boolean
  onCycleVerdict: (cid: string, sid: string) => void
  onSetSlot: (cid: string, kind: SlotKind, sIdx: number, sid: string, value: string) => void
  onToggleConcept: () => void
}) {
  const regSlots   = concept.slots ?? []
  const antiSlots  = concept.antisignalSlots ?? []
  const tandSlots  = concept.tandemSlots ?? []
  const isCompound = !!concept.isCompound
  const components = concept.components ?? []
  const hasChildren = regSlots.length + antiSlots.length + tandSlots.length + (isCompound ? components.length : 0) > 0

  return (
    <>
      <tr className="hover:bg-charcoal-1">
        <td className="p-0 border-b border-charcoal-3 align-middle">
          <div className="flex items-start gap-2 pl-10 pr-3 py-2.5 min-h-[44px]">
            {hasChildren ? (
              <button
                type="button"
                onClick={onToggleConcept}
                className={`text-[12px] text-charcoal-11 w-4 mt-0.5 text-center transition-transform ${expanded ? 'rotate-90' : ''}`}
                aria-label={expanded ? 'Collapse' : 'Expand'}
              >
                ▶
              </button>
            ) : (
              <span className="w-4" />
            )}
            <div className="flex flex-col gap-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] text-charcoal-15">{concept.name}</span>
                {isCompound && <CompoundPill op={concept.compoundOp} />}
              </div>
              {isCompound && concept.compoundExpr && (
                <span className="text-[11.5px] italic text-charcoal-12">{concept.compoundExpr}</span>
              )}
            </div>
          </div>
        </td>
        {subgroups.map(s => (
          <td
            key={s.id}
            className={`p-0 border-b border-charcoal-3 align-middle ${verdictChanged(concept.id, s.id) ? 'bg-gold-1' : ''}`}
          >
            <VerdictBadge
              verdict={effectiveVerdict(concept.id, s.id)}
              indexConcept={!!concept.isIndex || !!concept.isExIndex}
              onClick={() => onCycleVerdict(concept.id, s.id)}
            />
          </td>
        ))}
        <td className="border-b border-charcoal-3" />
      </tr>

      {expanded && regSlots.map((slot, sIdx) => (
        <SlotRow
          key={`${concept.id}-reg-${sIdx}`}
          concept={concept} kind="reg" sIdx={sIdx} slot={slot}
          subgroups={subgroups}
          effectiveSlotValue={effectiveSlotValue}
          slotChanged={slotChanged}
          onSetSlot={onSetSlot}
        />
      ))}

      {expanded && antiSlots.map((slot, sIdx) => (
        <SlotRow
          key={`${concept.id}-anti-${sIdx}`}
          concept={concept} kind="anti" sIdx={sIdx} slot={slot}
          subgroups={subgroups}
          effectiveSlotValue={effectiveSlotValue}
          slotChanged={slotChanged}
          onSetSlot={onSetSlot}
        />
      ))}

      {expanded && tandSlots.map((slot, sIdx) => (
        <SlotRow
          key={`${concept.id}-tandem-${sIdx}`}
          concept={concept} kind="tandem" sIdx={sIdx} slot={slot}
          subgroups={subgroups}
          effectiveSlotValue={effectiveSlotValue}
          slotChanged={slotChanged}
          onSetSlot={onSetSlot}
        />
      ))}

      {expanded && isCompound && components.map((comp, cIdx) => (
        <tr key={`${concept.id}-comp-${cIdx}`} className="bg-violet-1">
          <td className="p-0 border-b border-charcoal-3">
            <div className="flex items-center gap-1.5 pl-[60px] pr-3 py-2 text-[12.5px] text-charcoal-14">
              <span className="text-charcoal-10 text-[11px]">↳</span>
              <span>{comp.name}</span>
            </div>
          </td>
          {subgroups.map(s => <td key={s.id} className="border-b border-charcoal-3" />)}
          <td className="border-b border-charcoal-3" />
        </tr>
      ))}
    </>
  )
}

function SlotRow({
  concept,
  kind,
  sIdx,
  slot,
  subgroups,
  effectiveSlotValue,
  slotChanged,
  onSetSlot
}: {
  concept: Concept
  kind: SlotKind
  sIdx: number
  slot: Slot
  subgroups: Subgroup[]
  effectiveSlotValue: (cid: string, kind: SlotKind, sIdx: number, sid: string) => string | null
  slotChanged: (cid: string, kind: SlotKind, sIdx: number, sid: string) => boolean
  onSetSlot: (cid: string, kind: SlotKind, sIdx: number, sid: string, value: string) => void
}) {
  const isAnti   = kind === 'anti'
  const isTandem = kind === 'tandem'
  const tandemIf = isTandem ? (slot as TandemSlot).tandemIf : null
  return (
    <tr className="bg-charcoal-1">
      <td className="p-0 border-b border-charcoal-3">
        <div className="flex items-center gap-1.5 pl-[60px] pr-3 py-2 text-[12.5px]">
          <span className="text-charcoal-10 text-[11px]">↳</span>
          {isAnti ? (
            <span className="text-red-13 font-semibold" title={slot.helpText}>{slot.label}</span>
          ) : (
            <span className="text-charcoal-12">{slot.label}</span>
          )}
          {tandemIf && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] bg-blue-1 text-blue-13 border border-blue-3">
              <span className="font-bold">IF</span>
              <span>{tandemIf}</span>
            </span>
          )}
        </div>
      </td>
      {subgroups.map(s => (
        <td
          key={s.id}
          className={`p-0 border-b border-charcoal-3 ${slotChanged(concept.id, kind, sIdx, s.id) ? 'bg-gold-1' : ''}`}
        >
          <div className="flex justify-center py-1.5">
            <SlotInput
              slot={slot}
              value={effectiveSlotValue(concept.id, kind, sIdx, s.id)}
              onChange={(v) => onSetSlot(concept.id, kind, sIdx, s.id, v)}
            />
          </div>
        </td>
      ))}
      <td className="border-b border-charcoal-3" />
    </tr>
  )
}

function hasExpandableChildren(c: Concept): boolean {
  return (c.slots?.length ?? 0) > 0
    || (c.antisignalSlots?.length ?? 0) > 0
    || (c.tandemSlots?.length ?? 0) > 0
    || (!!c.isCompound && (c.components?.length ?? 0) > 0)
}

function CompoundPill({ op }: { op?: string }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wide bg-violet-2 text-violet-14 border border-violet-5">
      COMPOUND{op ? ` · ${op}` : ''}
    </span>
  )
}

function VerdictBadge({
  verdict,
  indexConcept,
  onClick
}: {
  verdict: Verdict
  indexConcept: boolean
  onClick: () => void
}) {
  if (verdict === null) {
    // Not applicable to this subgroup. A verdict cell never sits empty/editable —
    // it either holds an IN/EX value or reads N/A here.
    return (
      <div className="flex justify-center py-2">
        <span className="text-charcoal-9 text-[12px]" title="Not applicable to this subgroup">—</span>
      </div>
    )
  }

  const isIn  = verdict === 'I'  || verdict === 'I!'
  const star  = verdict === 'I!' || verdict === 'E!'
  const cls = isIn
    ? 'bg-green-2 text-green-14 hover:ring-2 hover:ring-green-10'
    : 'bg-red-1 text-red-14 hover:ring-2 hover:ring-red-10'
  const label = isIn ? 'IN' : 'EX'

  return (
    <div className="flex justify-center py-2">
      <button
        type="button"
        onClick={onClick}
        className={`inline-flex items-center justify-center min-w-[42px] px-3 py-1 rounded text-[11.5px] font-semibold tracking-wide ${cls}`}
        title={indexConcept ? 'Index condition' : undefined}
      >
        {label}
        {star && <span className="text-gold-12 text-[10px] ml-1">★</span>}
      </button>
    </div>
  )
}

function SlotInput({
  slot,
  value,
  onChange
}: {
  slot: Slot
  value: string | null
  onChange: (v: string) => void
}) {
  if (slot.type === 'numeric') {
    return (
      <input
        type="number"
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        className="w-[60px] text-center px-2 py-1 rounded border border-charcoal-4 text-[12px] font-mono bg-charcoal-white text-charcoal-18 focus:outline-none focus:border-blue-10"
      />
    )
  }
  if (slot.type === 'ordinal') {
    const scaleKey = Object.keys(ORDINAL_SCALES).find(k => slot.label.includes(k))
    const options = scaleKey ? ORDINAL_SCALES[scaleKey] : value ? [value] : []
    return <Select value={value} options={options} onChange={onChange} />
  }
  if (slot.type === 'category') {
    const catKey = Object.keys(CATEGORY_OPTIONS).find(k => slot.label.includes(k))
    const options = catKey ? CATEGORY_OPTIONS[catKey] : value ? [value] : []
    return <Select value={value} options={options} onChange={onChange} />
  }
  if (slot.type === 'result-type') {
    return <Select value={value} options={RESULT_TYPE_OPTIONS} onChange={onChange} />
  }
  if (slot.type === 'duration') {
    const [num, unit] = (value ?? ' months').split(' ')
    return (
      <div className="inline-flex items-center gap-1">
        <input
          type="number"
          value={num}
          onChange={e => onChange(`${e.target.value} ${unit || 'months'}`)}
          className="w-[50px] text-center px-1.5 py-1 rounded border border-charcoal-4 text-[12px] font-mono bg-charcoal-white text-charcoal-18 focus:outline-none focus:border-blue-10"
        />
        <Select value={unit ?? 'months'} options={DURATION_UNITS} onChange={u => onChange(`${num || ''} ${u}`)} />
      </div>
    )
  }
  return <span className="text-[12px] text-charcoal-11">—</span>
}

function Select({
  value,
  options,
  onChange
}: {
  value: string | null
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      className="px-2 pr-6 py-1 rounded border border-charcoal-4 text-[12px] font-medium bg-charcoal-white text-charcoal-18 focus:outline-none focus:border-blue-10"
    >
      {value === null && <option value="" disabled>—</option>}
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function AddSubgroupModal({
  onCancel,
  onConfirm
}: {
  onCancel: () => void
  onConfirm: (label: string) => void
}) {
  const [label, setLabel] = useState('')
  const canSubmit = label.trim().length > 0
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-black/40 px-4">
      <div className="w-full max-w-[420px] bg-charcoal-white rounded-lg shadow-pop p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[16px] font-semibold text-charcoal-18">Add Subgroup</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-charcoal-12 hover:text-charcoal-15 text-[18px] leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <label className="block text-[11px] font-medium uppercase tracking-wide text-charcoal-12 mb-1.5">
          Subgroup name
        </label>
        <input
          type="text"
          value={label}
          autoFocus
          onChange={e => setLabel(e.target.value)}
          placeholder="e.g. AChR+ Main"
          className="w-full px-3 py-2 rounded-md border border-charcoal-5 text-[13px] text-charcoal-18 focus:outline-none focus:border-blue-10"
        />
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-charcoal-5 text-[13px] text-charcoal-15 hover:bg-charcoal-1"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => onConfirm(label.trim())}
            className="px-4 py-2 rounded-md bg-green-12 hover:bg-green-13 text-charcoal-white text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Subgroup
          </button>
        </div>
      </div>
    </div>
  )
}
