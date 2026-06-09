'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CONTAINER } from '@/components/container'
import { usePermissions } from '@/app/providers'

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
  const { can } = usePermissions()

  // Matches is visible to anyone with view_matches at all times. Selection of patients
  // is gated separately, inside the Matches view, by the offer's approval state.
  const visibleTabs = TABS.filter(t => {
    if (t.label === 'Matches' && !can('view_matches')) return false
    return true
  })

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
