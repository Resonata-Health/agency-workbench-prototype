'use client'

import Link from 'next/link'
import { useState } from 'react'
import { TopNav } from '@/components/TopNav'
import { CONTAINER } from '@/components/container'
import { sponsors, type SponsorName } from '@/data/mockCareOffers'

export default function MlrHomePage() {
  const [sponsor, setSponsor] = useState<SponsorName>(sponsors[0])

  return (
    <div className="min-h-screen bg-charcoal-1">
      <TopNav activeSponsor={sponsor} onSponsorChange={setSponsor} />

      <main className={`${CONTAINER} py-12`}>
        <div className="bg-charcoal-white border border-charcoal-4 rounded-lg p-8 max-w-2xl shadow-card">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-12 mb-2">
            MLR Review
          </div>
          <h1 className="text-[24px] font-semibold text-charcoal-18 mb-3 leading-tight">
            Dedicated review queue coming soon
          </h1>
          <p className="text-[13px] text-charcoal-14 mb-6 leading-relaxed">
            For now, open a submitted outreach artifact directly. MLR-only Approve and
            Request-changes actions appear in the footer when you have the right
            capabilities.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/outreach?offer=lumigen"
              className="bg-green-12 hover:bg-green-13 text-charcoal-white text-[13px] font-medium rounded-md px-5 py-[10px]"
            >
              Review LUMIGEN outreach
            </Link>
            <Link
              href="/matches?offer=lumigen"
              className="border border-charcoal-5 hover:bg-charcoal-1 text-[13px] text-charcoal-15 rounded-md px-4 py-[10px]"
            >
              View matches
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
