'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CONTAINER } from '@/components/container'
import { findOffer } from '@/data/mockCareOffers'
import { getOfferStatus } from '@/data/offerStatusOverrides'

type Tab = 'Setup' | 'Matches' | 'Outreach'

const TABS: { label: Tab; path: string }[] = [
  { label: 'Setup', path: '/setup' },
  { label: 'Matches', path: '/matches' },
  { label: 'Outreach', path: '/outreach' }
]

export function WorkbenchTabs({ active }: { active: Tab }) {
  const router = useRouter()
  const params = useSearchParams()
  const offerId = params.get('offer')
  const qs = offerId ? `?offer=${offerId}` : ''

  // Draft offers have no matched patients yet — hide the Matches tab.
  const offer = findOffer(offerId)
  const status = getOfferStatus(offer.id) ?? offer.status
  const visibleTabs = status === 'inDesign'
    ? TABS.filter(t => t.label !== 'Matches')
    : TABS

  return (
    <div className="bg-charcoal-white border-b border-charcoal-4 w-full">
      <div className={`${CONTAINER} flex items-stretch`}>
        {visibleTabs.map(tab => {
          const isActive = tab.label === active
          return (
            <button
              key={tab.label}
              onClick={() => router.push(`${tab.path}${qs}`)}
              className={`h-[44px] px-1 mr-6 text-[13px] border-b-2 transition-colors ${
                isActive
                  ? 'border-blue-10 text-blue-10 font-medium'
                  : 'border-transparent text-charcoal-12 hover:text-charcoal-15'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
