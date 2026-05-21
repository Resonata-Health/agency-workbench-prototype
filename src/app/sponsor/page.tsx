'use client'

import Link from 'next/link'
import { useState } from 'react'
import { TopNav } from '@/components/TopNav'
import { CONTAINER } from '@/components/container'
import { sponsors, type SponsorName } from '@/data/mockCareOffers'

export default function SponsorHomePage() {
  const [sponsor, setSponsor] = useState<SponsorName>(sponsors[0])

  return (
    <div className="min-h-screen bg-charcoal-1">
      <TopNav activeSponsor={sponsor} onSponsorChange={setSponsor} />

      <main className={`${CONTAINER} py-12`}>
        <div className="bg-charcoal-white border border-charcoal-4 rounded-lg p-8 max-w-2xl shadow-card">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-12 mb-2">
            Sponsor Workbench
          </div>
          <h1 className="text-[24px] font-semibold text-charcoal-18 mb-3 leading-tight">
            Landing page coming after the brand-architecture design decision
          </h1>
          <p className="text-[13px] text-charcoal-14 mb-6 leading-relaxed">
            We&apos;re waiting on 2–3 IA directions from Claude Design before we restructure
            this view to show brands, indications, and programs. In the meantime, jump into
            the admin section or open a care offer flow.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/permissions"
              className="bg-green-12 hover:bg-green-13 text-charcoal-white text-[13px] font-medium rounded-md px-5 py-[10px]"
            >
              Open Admin
            </Link>
            <Link
              href="/setup?offer=toziret"
              className="border border-charcoal-5 hover:bg-charcoal-1 text-[13px] text-charcoal-15 rounded-md px-4 py-[10px]"
            >
              View an offer (TOZIRET)
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
