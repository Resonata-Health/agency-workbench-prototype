'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TopNav } from '@/components/TopNav'
import { WorkbenchTabs } from '@/components/WorkbenchTabs'
import { StatusBadge } from '@/components/StatusBadge'
import { CONTAINER } from '@/components/container'
import { getOfferStatus } from '@/data/offerStatusOverrides'
import { findOffer, setupFieldsFor, type SponsorName } from '@/data/mockCareOffers'
import { usePermissions } from '@/app/providers'

export default function SetupView() {
  const router = useRouter()
  const params = useSearchParams()
  const offer = useMemo(() => findOffer(params.get('offer')), [params])
  const fields = useMemo(() => setupFieldsFor(offer), [offer])
  const { can } = usePermissions()

  const canEditDisplayTitle = can('edit_setup_display_title')
  const canEditEndDate      = can('edit_setup_end_date')
  const canEditClinical     = can('edit_setup_clinical')

  const [sponsor, setSponsor] = useState<SponsorName>(offer.sponsor as SponsorName)
  const [displayTitle, setDisplayTitle] = useState(fields.displayTitle)
  const [endDate, setEndDate] = useState('')

  return (
    <div className="min-h-screen bg-charcoal-1 flex flex-col">
      <TopNav activeSponsor={sponsor} onSponsorChange={setSponsor} />
      <WorkbenchTabs active="Setup" />

      <main className={`flex-1 ${CONTAINER} py-6`}>
        <div>
          {/* Offer status */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[12px] text-charcoal-11">Offer Status:</span>
            <StatusBadge status={getOfferStatus(offer.id) ?? offer.status} />
          </div>

          {canEditClinical && (
            <div className="bg-blue-1 border border-blue-3 text-blue-14 text-[12px] rounded-md px-3 py-2 mb-4">
              You have <span className="font-mono text-[11px]">edit_setup_clinical</span> — the edit UI for clinical fields (Official Title, Brief Summary, Offer Type, Geographic Availability, Activation Date) is being designed and will appear here.
            </div>
          )}

          {/* Card */}
          <div className="bg-charcoal-white rounded-lg shadow-card p-6 flex flex-col gap-8">
            {/* Summary */}
            <section className="flex flex-col gap-4">
              <h2 className="text-[14px] font-semibold text-charcoal-15">Summary</h2>

              <ReadonlyRow label="Offer ID" value={fields.offerId} />
              <ReadonlyRow label="Sponsor" value={fields.sponsor} />
              <ReadonlyRow label="Official Title" value={fields.officialTitle} />

              {/* Display Title — gated by edit_setup_display_title */}
              <FieldRow
                label={
                  <>
                    Display Title{' '}
                    <span className="text-[11px] text-charcoal-10">(optional - for patient-facing communications)</span>
                  </>
                }
              >
                {canEditDisplayTitle ? (
                  <input
                    type="text"
                    value={displayTitle}
                    onChange={e => setDisplayTitle(e.target.value)}
                    className="w-full bg-charcoal-white border border-charcoal-6 rounded-md px-[11px] py-[7px] text-[13px] text-charcoal-18 focus:outline-none focus:border-blue-10"
                  />
                ) : (
                  <ReadonlyBox value={displayTitle} />
                )}
              </FieldRow>

              <FieldRow label="Brief Summary">
                <div className="w-full bg-charcoal-1 border border-charcoal-4 rounded-md px-[11px] py-[7px] text-[13px] text-charcoal-14 leading-[19.5px] cursor-default select-text">
                  {fields.briefSummary}
                </div>
              </FieldRow>

              <FieldRow label="Offer Type" labelWidth={200} inputWidth={352}>
                <ReadonlyBox value={fields.offerType} />
              </FieldRow>

              <FieldRow label="Geographic Availability">
                <div className="flex flex-wrap gap-1">
                  {fields.geographies.map(g => (
                    <span key={g} className="bg-blue-10 text-charcoal-white text-[12px] rounded-full px-2 py-0.5">
                      {g}
                    </span>
                  ))}
                </div>
              </FieldRow>
            </section>

            {/* Offer Timeline */}
            <section className="flex flex-col gap-4">
              <h2 className="text-[14px] font-semibold text-charcoal-15">Offer Timeline on Resonata</h2>

              <div className="flex gap-4">
                <TimelineField title="Created" sub="by filling, upload" value={fields.createdLabel} />
                <TimelineField title="Last Updated" sub="by Manual Import" value={fields.lastUpdatedLabel} />
              </div>

              <div className="flex gap-4">
                <TimelineField title="Activation Date" value={fields.activationLabel} />
                <div className="flex gap-4 flex-1">
                  <div className="w-[200px] text-[12px] text-charcoal-12 pt-[8px]">End Date</div>
                  <div className="flex-1">
                    {canEditEndDate ? (
                      <input
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                        className="w-full max-w-[352px] bg-charcoal-white border border-charcoal-6 rounded-md px-[11px] py-[7px] text-[13px] text-charcoal-18 focus:outline-none focus:border-blue-10"
                      />
                    ) : (
                      <div className="max-w-[352px]">
                        <ReadonlyBox value={endDate || '—'} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Footer — single CTA. Draft offers skip Matches and go straight to Outreach. */}
            {(() => {
              const currentStatus = getOfferStatus(offer.id) ?? offer.status
              const isDraft = currentStatus === 'inDesign'
              const href  = isDraft ? `/outreach?offer=${offer.id}` : `/matches?offer=${offer.id}`
              const label = isDraft ? 'Next Outreach' : 'Next Matches'
              return (
                <div className="flex justify-end pt-6">
                  <button
                    onClick={() => router.push(href)}
                    className="bg-green-12 hover:bg-green-13 text-charcoal-white text-[13px] font-medium rounded-md px-6 py-[10px]"
                  >
                    {label}
                  </button>
                </div>
              )
            })()}
          </div>
        </div>
      </main>
    </div>
  )
}

/* ---------- helpers ---------- */

function FieldRow({
  label,
  children,
  labelWidth = 200,
  inputWidth
}: {
  label: ReactNode
  children: ReactNode
  labelWidth?: number
  inputWidth?: number
}) {
  return (
    <div className="flex gap-4 items-start w-full">
      <div className="pt-[8px] text-[12px] text-charcoal-12 shrink-0" style={{ width: labelWidth }}>
        {label}
      </div>
      <div style={inputWidth ? { width: inputWidth } : undefined} className={inputWidth ? 'shrink-0' : 'flex-1'}>
        {children}
      </div>
    </div>
  )
}

function ReadonlyRow({ label, value }: { label: string; value: string }) {
  return (
    <FieldRow label={label}>
      <div className="w-full bg-charcoal-1 border border-charcoal-4 rounded-md px-[11px] py-[7px] text-[13px] text-charcoal-14 cursor-default select-text">
        {value}
      </div>
    </FieldRow>
  )
}

function ReadonlyBox({ value }: { value: string }) {
  return (
    <div className="w-full bg-charcoal-1 border border-charcoal-4 rounded-md px-[15px] py-[7px] text-[13px] text-charcoal-14 cursor-default select-text">
      {value}
    </div>
  )
}

function TimelineField({ title, sub, value }: { title: string; sub?: string; value: string }) {
  return (
    <div className="flex gap-4 flex-1">
      <div className="w-[200px] shrink-0 pt-[1px]">
        <div className="text-[12px] text-charcoal-12">{title}</div>
        {sub && <div className="text-[11px] text-charcoal-10">{sub}</div>}
      </div>
      <div className="flex-1 text-[13px] font-medium text-charcoal-18 pt-[1px]">{value}</div>
    </div>
  )
}
