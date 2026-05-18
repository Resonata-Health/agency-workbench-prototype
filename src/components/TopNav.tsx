import { useState } from 'react'
import Link from 'next/link'
import { sponsors, type SponsorName } from '@/data/mockCareOffers'
import { CONTAINER } from '@/components/container'
import { asset } from '@/lib/asset'

interface Props {
  activeSponsor: SponsorName
  onSponsorChange: (s: SponsorName) => void
}

export function TopNav({ activeSponsor, onSponsorChange }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <header className="bg-charcoal-white border-b border-charcoal-2">
      <div className={`${CONTAINER} h-16 flex items-center justify-between`}>
        {/* Left: logo + workbench label (links to landing) */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3 group" aria-label="Go to Care Offers">
            <img src={asset('/resonata-logo.svg')} alt="Resonata" width={28} height={28} className="shrink-0" />
            <span className="font-semibold text-[17px] text-charcoal-18 group-hover:text-blue-12 transition-colors">
              Resonata
            </span>
          </Link>
          <span className="text-charcoal-12">·</span>
          <span className="text-[14px] text-charcoal-14">Agency Workbench</span>
        </div>

        {/* Right: sponsor switcher + avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setOpen(o => !o)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-charcoal-5 hover:border-charcoal-7 text-[13px] text-charcoal-15 bg-charcoal-white"
            >
              <span className="text-charcoal-12">Sponsor:</span>
              <span className="font-medium text-charcoal-18">{activeSponsor}</span>
              <Chevron />
            </button>
            {open && (
              <div className="absolute right-0 mt-1 w-56 bg-charcoal-white border border-charcoal-5 rounded-md shadow-pop py-1 z-10">
                {sponsors.map(s => (
                  <button
                    key={s}
                    onClick={() => { onSponsorChange(s); setOpen(false) }}
                    className={`w-full text-left px-3 py-2 text-[13px] hover:bg-charcoal-1 ${
                      s === activeSponsor ? 'text-blue-10 font-medium' : 'text-charcoal-15'
                    }`}
                  >
                    {s}
                    {s === activeSponsor && <span className="ml-2">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            className="h-8 w-8 rounded-full bg-blue-10 text-charcoal-white flex items-center justify-center text-[13px] font-semibold"
            title="Jane Doe"
          >
            JD
          </div>
        </div>
      </div>
    </header>
  )
}

function Chevron() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
      <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
