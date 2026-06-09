'use client'

import { useMemo, useState } from 'react'
import { TopNav } from '@/components/TopNav'
import { KpiCard } from '@/components/KpiCard'
import { CareOfferCard } from '@/components/CareOfferCard'
import { CONTAINER } from '@/components/container'
import {
  careOffersBySponsor,
  sponsors,
  type SponsorName
} from '@/data/mockCareOffers'
import { getOfferStatus } from '@/data/offerStatusOverrides'

type Filter = 'All' | 'In MLR Review' | 'Active'

export default function MlrLandingView() {
  const [sponsor, setSponsor] = useState<SponsorName>(sponsors[0])
  const [filter, setFilter] = useState<Filter>('All')

  const offers = useMemo(
    () =>
      careOffersBySponsor[sponsor].map(o => ({
        ...o,
        status: getOfferStatus(o.id) ?? o.status
      })),
    [sponsor]
  )

  // MLR scope: actionable (in review) + informational (active). Hide draft / rejected / inactive / deactivated.
  const visible = useMemo(
    () => offers.filter(o => o.status === 'inMlrReview' || o.status === 'active'),
    [offers]
  )

  const filtered = useMemo(() => {
    if (filter === 'All') return visible
    if (filter === 'In MLR Review') return visible.filter(o => o.status === 'inMlrReview')
    return visible.filter(o => o.status === 'active')
  }, [visible, filter])

  const kpis = useMemo(() => {
    const inReview = visible.filter(o => o.status === 'inMlrReview').length
    const active   = visible.filter(o => o.status === 'active').length
    return { inReview, active }
  }, [visible])

  return (
    <div className="min-h-screen bg-charcoal-1">
      <TopNav activeSponsor={sponsor} onSponsorChange={setSponsor} />

      <main className={`${CONTAINER} py-8`}>
        <div className="mb-6">
          <h1 className="text-[26px] font-semibold text-charcoal-18 leading-tight">Care Options</h1>
          <p className="text-[14px] text-charcoal-14 mt-1">
            Patient-facing content awaiting review for {sponsor}. Click a submission in
            review to read it and approve or reject.
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <KpiCard
            label="Awaiting your review"
            value={kpis.inReview}
            caption="Submitted by the agency"
            accent="gold"
          />
          <KpiCard
            label="Approved & active"
            value={kpis.active}
            caption="Already cleared by MLR"
            accent="green"
          />
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[12px] text-charcoal-12">
            <span>Show:</span>
            {(['All', 'In MLR Review', 'Active'] as Filter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full border text-[12px] ${
                  f === filter
                    ? 'border-blue-10 text-blue-12 bg-blue-1 font-medium'
                    : 'border-charcoal-5 text-charcoal-14 hover:bg-charcoal-1'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="text-[12px] text-charcoal-12">
            {filtered.length} of {visible.length}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map(o => <CareOfferCard key={o.id} offer={o} linkTo="outreach" />)}
          {filtered.length === 0 && (
            <div className="text-center text-charcoal-14 text-[13px] py-10 border border-dashed border-charcoal-5 rounded-lg bg-charcoal-white">
              Nothing to review right now. New submissions from the agency will appear here.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
