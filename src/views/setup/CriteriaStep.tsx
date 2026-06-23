'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CONTAINER } from '@/components/container'
import type { CareOffer } from '@/data/mockCareOffers'
import { CATEGORIES, SUBGROUPS, type CellValue, type CriteriaCategory } from '@/data/mockEligibilityCriteria'
import { EmCriteriaStep } from './EmCriteriaStep'
import { NCT06414954_EM } from '@/data/em/nct06414954'
import { TOZIRET_001_EM } from '@/data/em/toziret-001'
import type { EmData } from '@/data/em/types'

// Offers with a real Sponsor Eligibility Matrix render the full EM.
// Everything else keeps the lightweight in/out grid below.
const EM_BY_OFFER_ID: Record<string, EmData | undefined> = {
  'nmd670-mg': NCT06414954_EM,
  'toziret':   TOZIRET_001_EM
}

export function CriteriaStep({ offer }: { offer: CareOffer }) {
  const realEm = EM_BY_OFFER_ID[offer.id]
  if (realEm) {
    return <EmCriteriaStep offer={offer} seed={realEm} />
  }
  return <SimpleCriteriaGrid offer={offer} />
}

function SimpleCriteriaGrid({ offer }: { offer: CareOffer }) {
  const router = useRouter()
  const [categories, setCategories] = useState<CriteriaCategory[]>(CATEGORIES)
  const [subgroups, setSubgroups] = useState<string[]>([...SUBGROUPS])

  const cycleCell = (catIdx: number, critIdx: number, colIdx: number) => {
    setCategories(prev => {
      const next = prev.map(c => ({ ...c, criteria: c.criteria.map(r => ({ ...r, cells: [...r.cells] })) }))
      const cur = next[catIdx].criteria[critIdx].cells[colIdx]
      const nextVal: CellValue = cur === null ? 'IN' : cur === 'IN' ? 'EX' : null
      next[catIdx].criteria[critIdx].cells[colIdx] = nextVal
      return next
    })
  }

  const addSubgroup = () => {
    const name = prompt('Subgroup name?')
    if (!name) return
    setSubgroups(prev => [...prev, name])
    setCategories(prev =>
      prev.map(c => ({
        ...c,
        criteria: c.criteria.map(r => ({ ...r, cells: [...r.cells, null] }))
      }))
    )
  }

  const goPrev = () => router.push(`/setup?offer=${offer.id}&step=overview`)
  const goNext = () => router.push(`/setup?offer=${offer.id}&step=contacts`)

  return (
    <>
      <div className="bg-charcoal-white rounded-lg shadow-card p-6">
        <button
          type="button"
          onClick={goPrev}
          className="text-[13px] text-blue-12 hover:underline mb-3"
        >
          ← Back
        </button>

        <h2 className="text-[20px] font-semibold text-charcoal-18 mb-5">
          {offer.internalId} — Eligibility Criteria
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="text-left text-[11px] font-semibold text-charcoal-12 uppercase">
                <th className="border-b-2 border-charcoal-4 px-3 py-3 w-[240px]">Criteria</th>
                {subgroups.map(s => (
                  <th key={s} className="border-b-2 border-charcoal-4 px-2 py-3 text-center min-w-[110px]">
                    <div className="leading-tight">{s}</div>
                  </th>
                ))}
                <th className="border-b-2 border-charcoal-4 px-2 py-3 text-right">
                  <button
                    type="button"
                    onClick={addSubgroup}
                    className="text-[12px] text-blue-12 font-medium hover:underline whitespace-nowrap"
                  >
                    + Add Subgroup
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, catIdx) => (
                <CategoryBlock
                  key={cat.name}
                  cat={cat}
                  catIdx={catIdx}
                  colCount={subgroups.length}
                  onCellCycle={cycleCell}
                />
              ))}
              <tr>
                <td colSpan={subgroups.length + 2} className="px-3 py-4 text-center">
                  <button
                    type="button"
                    className="border border-dashed border-charcoal-7 hover:bg-charcoal-1 text-[12px] text-charcoal-15 rounded-md px-4 py-1.5"
                  >
                    + Add Category
                  </button>
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
          Next: Contacts →
        </button>
      </div>
    </>
  )
}

function CategoryBlock({
  cat,
  catIdx,
  colCount,
  onCellCycle
}: {
  cat: CriteriaCategory
  catIdx: number
  colCount: number
  onCellCycle: (catIdx: number, critIdx: number, colIdx: number) => void
}) {
  return (
    <>
      <tr className="bg-charcoal-1">
        <td colSpan={colCount + 2} className="px-3 py-2">
          <div className="flex items-center gap-1 text-[11px] font-semibold uppercase text-charcoal-15 tracking-wide">
            {cat.name}
            <span className="text-blue-10 text-[12px]">ⓘ</span>
          </div>
        </td>
      </tr>
      {cat.criteria.map((crit, critIdx) => (
        <tr key={crit.label} className="border-b border-charcoal-2">
          <td className="px-3 py-2.5 text-[13px] text-charcoal-15">{crit.label}</td>
          {crit.cells.map((v, colIdx) => (
            <td key={colIdx} className="px-2 py-2.5 text-center">
              <button
                type="button"
                onClick={() => onCellCycle(catIdx, critIdx, colIdx)}
                title="Click to cycle: empty → IN → EX → empty"
                className={`inline-flex items-center justify-center rounded-[4px] text-[11px] font-semibold px-2 py-1 min-w-[36px] ${
                  v === 'IN'
                    ? 'bg-green-2 text-green-14 border border-green-5'
                    : v === 'EX'
                      ? 'bg-red-1 text-red-14 border border-red-5'
                      : 'bg-charcoal-1 text-transparent border border-charcoal-3 hover:border-charcoal-5'
                }`}
              >
                {v ?? '–'}
              </button>
            </td>
          ))}
          <td />
        </tr>
      ))}
      <tr>
        <td colSpan={colCount + 2} className="px-3 py-1.5">
          <button
            type="button"
            className="text-[12px] text-blue-12 hover:underline font-medium"
          >
            + Add Condition
          </button>
        </td>
      </tr>
    </>
  )
}
