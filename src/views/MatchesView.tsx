'use client'

import { useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TopNav } from '@/components/TopNav'
import { WorkbenchTabs } from '@/components/WorkbenchTabs'
import { KpiCard } from '@/components/KpiCard'
import { findOffer, setupFieldsFor, type SponsorName } from '@/data/mockCareOffers'
import { CONTAINER } from '@/components/container'

type MatchType = 'Full Match' | 'Partial Match'
type Tone = 'blue' | 'green' | 'violet' | 'default'

interface Patient {
  id: string
  matchDate: string
  arm: 'Arm A' | 'Arm B'
  matchType: MatchType
  missing?: string
  adjacent?: string
  engagement: string
  engagementTone: Tone
  state: string
  city: string
}

interface MatchGroup {
  site: string
  patients: Patient[]
}

const matchGroups: MatchGroup[] = [
  {
    site: 'Memorial Sloan Kettering Cancer Center - New York, NY',
    patients: [
      { id: 'PT-2025-08-A1B2C3', matchDate: 'Aug 20, 2025', arm: 'Arm A', matchType: 'Full Match', engagement: 'Email sent Aug 20', engagementTone: 'blue', state: 'NY', city: 'New York' },
      { id: 'PT-2025-08-D4E5F6', matchDate: 'Aug 20, 2025', arm: 'Arm A', matchType: 'Partial Match', missing: 'QTc Interval (ms)', engagement: 'Submitted interest', engagementTone: 'default', state: 'NY', city: 'Brooklyn' },
      { id: 'PT-2025-08-G7H8I9', matchDate: 'Aug 19, 2025', arm: 'Arm B', matchType: 'Full Match', engagement: 'Opened Aug 20', engagementTone: 'green', state: 'NY', city: 'New York' }
    ]
  },
  {
    site: 'MD Anderson Cancer Center - Houston, TX',
    patients: [
      { id: 'PT-2025-08-J1K2L3', matchDate: 'Aug 19, 2025', arm: 'Arm A', matchType: 'Full Match', engagement: 'Enrolled', engagementTone: 'default', state: 'TX', city: 'Houston' },
      { id: 'PT-2025-08-M4N5O6', matchDate: 'Aug 18, 2025', arm: 'Arm B', matchType: 'Partial Match', adjacent: 'Current ECOG Score', engagement: 'Submitted interest', engagementTone: 'default', state: 'TX', city: 'Houston' },
      { id: 'PT-2025-08-P7Q8R9', matchDate: 'Aug 18, 2025', arm: 'Arm A', matchType: 'Full Match', engagement: 'Clicked Aug 19', engagementTone: 'violet', state: 'TX', city: 'Austin' }
    ]
  },
  {
    site: 'Dana-Farber Cancer Institute - Boston, MA',
    patients: [
      { id: 'PT-2025-08-S1T2U3', matchDate: 'Aug 17, 2025', arm: 'Arm A', matchType: 'Full Match', engagement: '-', engagementTone: 'default', state: 'MA', city: 'Boston' },
      { id: 'PT-2025-08-V4W5X6', matchDate: 'Aug 17, 2025', arm: 'Arm B', matchType: 'Partial Match', missing: 'QTc 475 ms', engagement: 'Email sent Aug 18', engagementTone: 'blue', state: 'MA', city: 'Cambridge' }
    ]
  }
]

const toneClass: Record<Tone, string> = {
  blue: 'text-blue-12',
  green: 'text-green-12',
  violet: 'text-violet-11',
  default: 'text-charcoal-15'
}

export default function MatchesView() {
  const router = useRouter()
  const params = useSearchParams()
  const offer = useMemo(() => findOffer(params.get('offer')), [params])
  const fields = useMemo(() => setupFieldsFor(offer), [offer])

  const [sponsor, setSponsor] = useState<SponsorName>(offer.sponsor as SponsorName)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const drugName = offer.title.split('—')[0].trim()

  const allPatients = useMemo(() => matchGroups.flatMap(g => g.patients), [])

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const allSelected = allPatients.length > 0 && allPatients.every(p => selected.has(p.id))
  const someSelected = selected.size > 0 && !allSelected

  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(allPatients.map(p => p.id)))

  const summary = useMemo(() => {
    let full = 0, partial = 0
    allPatients.forEach(p => {
      if (selected.has(p.id)) p.matchType === 'Full Match' ? full++ : partial++
    })
    return { full, partial, total: full + partial }
  }, [selected, allPatients])

  const outreachHref = `/outreach?offer=${offer.id}&selected=${summary.total}`

  return (
    <div className="min-h-screen bg-charcoal-1 flex flex-col">
      <TopNav activeSponsor={sponsor} onSponsorChange={setSponsor} />

      {/* Offer sub-header */}
      <div className="bg-charcoal-white border-b border-charcoal-4">
        <div className={`${CONTAINER} h-[45px] flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <span className="text-[13px] font-semibold text-blue-12">{drugName}</span>
            <span className="text-[13px] text-charcoal-12">{fields.displayTitle}</span>
          </div>
          <span className="text-[12px] text-charcoal-11">{offer.updatedLabel}</span>
        </div>
      </div>

      <WorkbenchTabs active="Matches" />

      <main className={`flex-1 ${CONTAINER} py-6`}>
        <div className="flex flex-col gap-6">
          {/* KPI row */}
          <div className="flex gap-4">
            <KpiCard label="Total Matches"   value={offer.matchesToDate.toLocaleString()} caption="Last 30 days" />
            <KpiCard label="Full Matches"    value={218} caption="63.7%" accent="green" />
            <KpiCard label="Partial Matches" value={124} caption="36.3%" accent="gold" />
            <KpiCard label="Emails Sent"     value={89}  caption="26% of matches" accent="blue" />
            <KpiCard label="Email Opens"     value={67}  caption="75.3% open rate" accent="blue" />
          </div>

          {/* Matched patients table */}
          <div className="bg-charcoal-white border border-charcoal-4 rounded-lg overflow-hidden">
            <div className="bg-charcoal-1 border-b border-charcoal-4 flex items-center justify-between px-4 py-3">
              <h2 className="text-[16px] font-semibold text-charcoal-15">Matched Patients</h2>
              <div className="flex gap-2">
                <button className="bg-charcoal-white border border-charcoal-6 rounded-md px-3 py-[7px] text-[12px] text-charcoal-12 hover:bg-charcoal-1">Filter</button>
                <button className="bg-charcoal-white border border-charcoal-6 rounded-md px-3 py-[7px] text-[12px] text-charcoal-12 hover:bg-charcoal-1">Export</button>
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-charcoal-white">
                <tr className="text-left text-[12px] font-semibold text-charcoal-12">
                  <th className="border-b-2 border-charcoal-4 px-3 py-[10px] w-[40px] text-center">
                    <input
                      type="checkbox"
                      aria-label="Select all patients"
                      checked={allSelected}
                      ref={el => { if (el) el.indeterminate = someSelected }}
                      onChange={toggleAll}
                      className="size-4 rounded-[2.5px] border border-charcoal-12 accent-blue-10 cursor-pointer"
                    />
                  </th>
                  <Th>Patient ID</Th>
                  <Th>Match Date</Th>
                  <Th>Match Type</Th>
                  <Th>Missing</Th>
                  <Th>Adjacent</Th>
                  <Th>Pt Engagement</Th>
                  <Th>State</Th>
                  <Th>City</Th>
                </tr>
              </thead>
              <tbody>
                {matchGroups.map(group => (
                  <GroupRows
                    key={group.site}
                    group={group}
                    selected={selected}
                    onToggle={toggle}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="bg-charcoal-white border border-charcoal-4 rounded-lg p-[17px] flex flex-col gap-3">
            <h3 className="text-[16px] font-semibold text-charcoal-15">Summary</h3>
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="text-left text-charcoal-12 font-semibold">
                  <th className="border-b-2 border-charcoal-4 px-[10px] py-2 w-3/4">Match Status</th>
                  <th className="border-b-2 border-charcoal-4 px-[10px] py-2 text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                <SummaryRow label="Full match"    total={summary.full} />
                <SummaryRow label="Partial match" total={summary.partial} />
                <SummaryRow label="Total matches" total={summary.total} bold rowClass="bg-charcoal-1" />
              </tbody>
            </table>

            <div className="bg-blue-1 rounded-md p-3 text-center text-[13px] text-blue-14">
              To contact patients, go to the{' '}
              <button
                onClick={() => router.push(outreachHref)}
                className="font-semibold text-blue-12 hover:underline"
              >
                Outreach tab
              </button>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="flex justify-end">
            <button
              onClick={() => router.push(outreachHref)}
              className="bg-green-12 hover:bg-green-13 text-charcoal-white text-[13px] font-medium rounded-md px-6 py-[10px]"
            >
              Next Outreach
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

/* ---------- helpers ---------- */

function Th({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <th className={`border-b-2 border-charcoal-4 px-3 py-[10px] ${className}`}>{children}</th>
  )
}

function GroupRows({
  group,
  selected,
  onToggle
}: {
  group: MatchGroup
  selected: Set<string>
  onToggle: (id: string) => void
}) {
  return (
    <>
      <tr>
        <td colSpan={9} className="bg-blue-1 border-b border-charcoal-2 text-center py-1.5 text-[13px] font-semibold text-blue-14">
          {group.site}
        </td>
      </tr>
      {group.patients.map(p => {
        const accent = p.matchType === 'Full Match' ? 'border-l-green-10' : 'border-l-gold-10'
        return (
          <tr key={p.id} className={`border-l-[3px] ${accent} border-b border-charcoal-2 hover:bg-charcoal-1`}>
            <td className="px-3 py-3 text-center">
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                onChange={() => onToggle(p.id)}
                className="size-4 rounded-[2.5px] border border-charcoal-12 accent-blue-10 cursor-pointer"
              />
            </td>
            <td className="px-3 py-3 text-[12px] text-charcoal-15">{p.id}</td>
            <td className="px-3 py-3 text-[13px] text-charcoal-15">{p.matchDate}</td>
            <td className="px-3 py-3 text-[13px] text-charcoal-15">{p.matchType}</td>
            <td className="px-3 py-3">{p.missing ? <CriterionBadge label={p.missing} /> : <Dash />}</td>
            <td className="px-3 py-3">{p.adjacent ? <CriterionBadge label={p.adjacent} /> : <Dash />}</td>
            <td className={`px-3 py-3 text-[12px] font-medium ${toneClass[p.engagementTone]}`}>{p.engagement}</td>
            <td className="px-3 py-3 text-[13px] text-charcoal-15">{p.state}</td>
            <td className="px-3 py-3 text-[13px] text-charcoal-15">{p.city}</td>
          </tr>
        )
      })}
    </>
  )
}

function CriterionBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="inline-flex items-center bg-green-2 border border-green-7 text-green-13 text-[11px] font-medium rounded-[3px] px-[7px] py-[3px]">
        I
      </span>
      <span className="text-[13px] text-charcoal-15">{label}</span>
    </span>
  )
}

function Dash() {
  return <span className="text-[13px] text-charcoal-15">-</span>
}

function SummaryRow({
  label, total, bold, rowClass = '', labelClass = 'text-charcoal-12'
}: {
  label: string
  total: number
  bold?: boolean
  rowClass?: string
  labelClass?: string
}) {
  const num = bold ? 'font-semibold text-charcoal-15' : 'text-charcoal-15'
  return (
    <tr className={rowClass}>
      <td className={`border-b border-charcoal-2 px-[10px] py-[9px] font-medium ${labelClass}`}>{label}</td>
      <td className={`border-b border-charcoal-2 px-[10px] py-[9px] text-center ${num}`}>{total}</td>
    </tr>
  )
}
