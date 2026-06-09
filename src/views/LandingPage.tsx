'use client'

import { useMemo, useState } from 'react'
import { TopNav } from '@/components/TopNav'
import { KpiCard } from '@/components/KpiCard'
import { FilterBar } from '@/components/FilterBar'
import { CareOfferCard } from '@/components/CareOfferCard'
import { careOffersBySponsor, sponsorMeta, type SponsorName } from '@/data/mockCareOffers'
import { getOfferStatus } from '@/data/offerStatusOverrides'
import { CONTAINER } from '@/components/container'

export default function LandingPage() {
  const [sponsor, setSponsor] = useState<SponsorName>('CureX Pharmaceuticals')
  const [statusFilter, setStatusFilter] = useState('All')

  const offers = useMemo(
    () =>
      careOffersBySponsor[sponsor].map(o => ({
        ...o,
        status: getOfferStatus(o.id) ?? o.status
      })),
    [sponsor]
  )

  const filtered = useMemo(() => {
    if (statusFilter === 'All') return offers
    const map: Record<string, string> = {
      'Active': 'active',
      'In MLR Review': 'inMlrReview',
      'In Design': 'inDesign',
      'Inactive': 'inactive',
      'Deactivated': 'deactivated'
    }
    return offers.filter(o => o.status === map[statusFilter])
  }, [offers, statusFilter])

  const kpis = useMemo(() => {
    const total = offers.length
    const inMlr = offers.filter(o => o.status === 'inMlrReview').length
    const active = offers.filter(o => o.status === 'active').length
    const matchedTotal = offers.reduce((sum, o) => sum + o.matchesToDate, 0)
    const outreachSent = sponsorMeta[sponsor].outreachSentLast7d
    return { total, inMlr, active, matchedTotal, outreachSent }
  }, [offers, sponsor])

  return (
    <div className="min-h-screen bg-charcoal-1">
      <TopNav activeSponsor={sponsor} onSponsorChange={setSponsor} />

      <main className={`${CONTAINER} py-8`}>
        <div className="mb-6">
          <h1 className="text-[26px] font-semibold text-charcoal-18 leading-tight">Care Offers</h1>
          <p className="text-[14px] text-charcoal-14 mt-1">
            Care options assigned to your agency by {sponsor}
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <KpiCard label="Assigned offers"   value={kpis.total}        caption={`Across ${sponsor}`} />
          <KpiCard label="In MLR Review"     value={kpis.inMlr}        caption="Awaiting approval" accent="gold" />
          <KpiCard label="Active"            value={kpis.active}       caption="Live with patients" accent="green" />
          <KpiCard label="Matched patients"  value={kpis.matchedTotal.toLocaleString()} caption="Across all offers" accent="blue" />
          <KpiCard label="Outreach sent"     value={kpis.outreachSent.toLocaleString()} caption="Last 7 days" />
        </div>

        <FilterBar
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <div className="flex flex-col gap-3">
          {filtered.map(o => <CareOfferCard key={o.id} offer={o} />)}
          {filtered.length === 0 && (
            <div className="text-center text-charcoal-14 text-[13px] py-10 border border-dashed border-charcoal-5 rounded-lg bg-charcoal-white">
              No care offers match the current filters.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
