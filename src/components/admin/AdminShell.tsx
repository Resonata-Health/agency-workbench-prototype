'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { TopNav } from '@/components/TopNav'
import { sponsors, type SponsorName } from '@/data/mockCareOffers'

interface NavItem {
  href: string
  label: string
  icon: ReactNode
}

const NAV: NavItem[] = [
  {
    href: '/admin/branding',
    label: 'Branding',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="6" cy="7" r="1.2" fill="currentColor" />
        <path d="M3 12l3.5-4 3 3.5 2-1.5L13 12" stroke="currentColor" strokeWidth="1.4" fill="none" />
      </svg>
    )
  },
  {
    href: '/admin/delegates',
    label: 'Delegates',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="6" cy="6" r="2.3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2 13.5C2 11.6 3.8 10 6 10s4 1.6 4 3.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="11.5" cy="6.5" r="1.6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M10 11c1.4-.4 2.5-.1 3.5 1" stroke="currentColor" strokeWidth="1.4" fill="none" />
      </svg>
    )
  }
]

export function AdminShell({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname() ?? ''
  const [sponsor, setSponsor] = useState<SponsorName>(sponsors[0])

  return (
    <div className="min-h-screen bg-charcoal-1 flex flex-col">
      <TopNav activeSponsor={sponsor} onSponsorChange={setSponsor} />

      <div className="flex-1 flex">
        <aside className="w-[240px] shrink-0 bg-charcoal-white border-r border-charcoal-3 py-6 px-3">
          <div className="px-3 text-[11px] uppercase font-semibold text-charcoal-12 tracking-wide mb-3">
            Admin
          </div>
          <nav className="flex flex-col gap-1">
            {NAV.map(item => {
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] ${
                    active
                      ? 'bg-blue-1 text-blue-13 font-medium'
                      : 'text-charcoal-15 hover:bg-charcoal-1'
                  }`}
                >
                  <span className={active ? 'text-blue-13' : 'text-charcoal-12'}>{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-6 pt-4 border-t border-charcoal-3">
            <button
              type="button"
              onClick={() => router.push('/sponsor')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] text-charcoal-14 hover:bg-charcoal-1"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M8.5 3.5L5 7l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Sponsor Workbench
            </button>
          </div>
        </aside>

        <main className="flex-1 px-10 py-8 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
