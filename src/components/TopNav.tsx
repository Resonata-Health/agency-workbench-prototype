'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { sponsors, type SponsorName } from '@/data/mockCareOffers'
import { CONTAINER } from '@/components/container'
import { asset } from '@/lib/asset'
import { usePermissions } from '@/app/providers'
import { getStoredLogo, subscribeLogo } from '@/data/logoStore'
import {
  PERSONA_HOME,
  PERSONA_LABEL,
  WORKBENCH_LABEL,
  type Persona
} from '@/data/permissions'

interface Props {
  activeSponsor: SponsorName
  onSponsorChange: (s: SponsorName) => void
}

const PERSONAS: Persona[] = ['agency', 'sponsor', 'mlr']

export function TopNav({ activeSponsor, onSponsorChange }: Props) {
  const router = useRouter()
  const pathname = usePathname() ?? ''
  const onAdmin = pathname.startsWith('/admin')
  const [sponsorOpen, setSponsorOpen] = useState(false)
  const [personaOpen, setPersonaOpen] = useState(false)
  const { persona, setPersona, can } = usePermissions()

  // Sponsor logo (uploaded on /admin/branding). Re-renders when Branding saves.
  const [sponsorLogo, setSponsorLogo] = useState<string | null>(null)
  useEffect(() => {
    setSponsorLogo(getStoredLogo())
    return subscribeLogo(() => setSponsorLogo(getStoredLogo()))
  }, [])

  // Sponsor switcher is only for agency operators (they work across multiple
  // sponsors). Sponsor IS the sponsor; MLR is a department inside one sponsor.
  const showSponsorSwitcher = persona === 'agency'
  const showAdminLink = can('manage_permissions')

  const handlePersonaPick = (p: Persona) => {
    setPersona(p)
    setPersonaOpen(false)
    router.push(PERSONA_HOME[p])
  }

  return (
    <header className="bg-charcoal-white border-b border-charcoal-2">
      <div className={`${CONTAINER} h-16 flex items-center justify-between`}>
        {/* Left: logo + workbench label + (admin breadcrumb when on admin pages) */}
        <div className="flex items-center gap-3">
          <Link href={PERSONA_HOME[persona]} className="flex items-center gap-3 group" aria-label="Home">
            <img src={asset('/resonata-logo.svg')} alt="Resonata" width={28} height={28} className="shrink-0" />
            <span className="font-semibold text-[17px] text-charcoal-18 group-hover:text-blue-12 transition-colors">
              Resonata
            </span>
          </Link>
          <span className="text-charcoal-12">·</span>
          <Link
            href={PERSONA_HOME[persona]}
            className="text-[14px] text-charcoal-14 hover:text-blue-12 transition-colors"
          >
            {WORKBENCH_LABEL[persona]}
          </Link>
          {onAdmin && showAdminLink && (
            <>
              <span className="text-charcoal-12">·</span>
              <span className="text-[14px] text-charcoal-14">Admin</span>
            </>
          )}
        </div>

        {/* Right: persona switcher + (sponsor switcher) + avatar */}
        <div className="flex items-center gap-3">
          {/* Persona switcher */}
          <div className="relative">
            <button
              onClick={() => setPersonaOpen(o => !o)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-charcoal-5 hover:border-charcoal-7 text-[13px] text-charcoal-15 bg-charcoal-white"
              aria-haspopup="listbox"
              aria-expanded={personaOpen}
            >
              <span className="text-charcoal-12">For Dev Only: Viewing as…</span>
              <span className="font-medium text-charcoal-18">{PERSONA_LABEL[persona]}</span>
              <Chevron />
            </button>
            {personaOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-charcoal-white border border-charcoal-5 rounded-md shadow-pop py-1 z-20">
                {PERSONAS.map(p => (
                  <button
                    key={p}
                    onClick={() => handlePersonaPick(p)}
                    className={`w-full text-left px-3 py-2 text-[13px] hover:bg-charcoal-1 ${
                      p === persona ? 'text-blue-10 font-medium' : 'text-charcoal-15'
                    }`}
                  >
                    {PERSONA_LABEL[p]}
                    {p === persona && <span className="ml-2">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sponsor switcher (Agency persona only) */}
          {showSponsorSwitcher && (
            <div className="relative">
              <button
                onClick={() => setSponsorOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-charcoal-5 hover:border-charcoal-7 text-[13px] text-charcoal-15 bg-charcoal-white"
              >
                <span className="text-charcoal-12">Sponsor:</span>
                <span className="font-medium text-charcoal-18">{activeSponsor}</span>
                <Chevron />
              </button>
              {sponsorOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-charcoal-white border border-charcoal-5 rounded-md shadow-pop py-1 z-10">
                  {sponsors.map(s => (
                    <button
                      key={s}
                      onClick={() => {
                        onSponsorChange(s)
                        setSponsorOpen(false)
                      }}
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
          )}

          {sponsorLogo && (
            <img
              src={sponsorLogo}
              alt="Sponsor logo"
              className="h-7 max-w-[120px] object-contain"
            />
          )}
          {showAdminLink && !onAdmin && (
            <Link
              href="/admin/branding"
              aria-label="Admin settings"
              className="text-charcoal-12 hover:text-charcoal-15 p-1"
            >
              <GearIcon />
            </Link>
          )}
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
      <path
        d="M2 4l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function GearIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 13a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M16.5 10c0-.5-.05-.98-.14-1.45l1.34-1.05-1.5-2.6-1.6.55a6.5 6.5 0 00-2.5-1.45L11.75 2h-3.5l-.35 1.99a6.5 6.5 0 00-2.5 1.45l-1.6-.54-1.5 2.6 1.34 1.05A6.7 6.7 0 003.5 10c0 .5.05.98.14 1.45l-1.34 1.05 1.5 2.6 1.6-.54a6.5 6.5 0 002.5 1.44L8.25 18h3.5l.35-1.99a6.5 6.5 0 002.5-1.44l1.6.54 1.5-2.6-1.34-1.05c.09-.47.14-.95.14-1.45z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}
