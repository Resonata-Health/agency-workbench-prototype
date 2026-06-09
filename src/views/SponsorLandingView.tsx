'use client'

import { useMemo, useState } from 'react'
import { TopNav } from '@/components/TopNav'
import { KpiCard } from '@/components/KpiCard'
import { CareOfferCard } from '@/components/CareOfferCard'
import { CONTAINER } from '@/components/container'
import {
  sponsorPortfolioBySponsor,
  sponsors,
  type SponsorName
} from '@/data/mockCareOffers'
import { getOfferStatus } from '@/data/offerStatusOverrides'

type Filter = 'All' | 'Draft' | 'In MLR Review' | 'Active' | 'Inactive' | 'Deactivated'

const STATUS_MAP: Record<Exclude<Filter, 'All'>, string> = {
  Draft: 'inDesign',
  'In MLR Review': 'inMlrReview',
  Active: 'active',
  Inactive: 'inactive',
  Deactivated: 'deactivated'
}

export default function SponsorLandingView() {
  const [sponsor, setSponsor] = useState<SponsorName>(sponsors[0])
  const [filter, setFilter] = useState<Filter>('All')

  const offers = useMemo(
    () =>
      sponsorPortfolioBySponsor[sponsor].map(o => ({
        ...o,
        status: getOfferStatus(o.id) ?? o.status
      })),
    [sponsor]
  )

  const filtered = useMemo(() => {
    if (filter === 'All') return offers
    return offers.filter(o => o.status === STATUS_MAP[filter])
  }, [offers, filter])

  const kpis = useMemo(() => {
    return {
      total: offers.length,
      trials: offers.filter(o => o.offerKind === 'clinical_trial').length,
      treatments: offers.filter(o => o.offerKind === 'approved_treatment').length,
      active: offers.filter(o => o.status === 'active').length,
      inDesign: offers.filter(o => o.status === 'inDesign').length
    }
  }, [offers])

  return (
    <div className="min-h-screen bg-charcoal-1">
      <TopNav activeSponsor={sponsor} onSponsorChange={setSponsor} />

      <main className={`${CONTAINER} py-8`}>
        <div className="flex items-end justify-between mb-6 gap-4">
          <div>
            <h1 className="text-[26px] font-semibold text-charcoal-18 leading-tight">
              Care Options
            </h1>
            <p className="text-[14px] text-charcoal-14 mt-1">
              Your clinical trials and approved treatments in {sponsor}.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="bg-green-12 hover:bg-green-13 text-charcoal-white text-[13px] font-medium rounded-md px-4 py-[8px]"
            >
              + New Care Option
            </button>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <KpiCard label="Total care options" value={kpis.total}      caption={`Across ${sponsor}`} />
          <KpiCard label="Clinical trials"    value={kpis.trials}     caption="Phase 1 – 4" accent="blue" />
          <KpiCard label="Approved treatments" value={kpis.treatments} caption="Marketed products" accent="green" />
          <KpiCard label="Active"             value={kpis.active}     caption="Live with patients" accent="green" />
          <KpiCard label="Drafts"             value={kpis.inDesign}   caption="Awaiting setup" accent="gold" />
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[12px] text-charcoal-12 flex-wrap">
            <span>Show:</span>
            {(['All', 'Draft', 'In MLR Review', 'Active', 'Inactive', 'Deactivated'] as Filter[]).map(f => (
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
            {filtered.length} of {offers.length}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map(o => <CareOfferCard key={o.id} offer={o} linkTo="setup" />)}
          {filtered.length === 0 && (
            <div className="text-center text-charcoal-14 text-[13px] py-10 border border-dashed border-charcoal-5 rounded-lg bg-charcoal-white">
              No care options match the current filter.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
