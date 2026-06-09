'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { StatusBadge } from '@/components/StatusBadge'
import { CONTAINER } from '@/components/container'
import { getOfferStatus } from '@/data/offerStatusOverrides'
import type { CareOffer } from '@/data/mockCareOffers'
import { setupFieldsFor } from '@/data/mockCareOffers'

interface Intervention {
  id: string
  name: string
  type: string
  category: string
}

const DEFAULT_INTERVENTIONS_BY_OFFER: Record<string, Intervention[]> = {
  'cx3537982': [
    { id: 'i1', name: 'CX3537982',      type: 'KRAS G12C inhibitor', category: 'Targeted Therapy' },
    { id: 'i2', name: 'pembrolizumab',  type: 'PD-1 inhibitor',      category: 'Immunotherapy' },
    { id: 'i3', name: 'cetuximab',      type: 'EGFR inhibitor',      category: 'Targeted Therapy' },
    { id: 'i4', name: 'pemetrexed',     type: 'Antifolate',          category: 'Chemotherapy' },
    { id: 'i5', name: 'cisplatin',      type: 'Platinum agent',      category: 'Chemotherapy' },
    { id: 'i6', name: 'carboplatin',    type: 'Platinum agent',      category: 'Chemotherapy' }
  ],
  'tirzepatide-t2d': [
    { id: 'i1', name: 'tirzepatide',  type: 'GIP/GLP-1 agonist', category: 'Targeted Therapy' },
    { id: 'i2', name: 'dulaglutide',  type: 'GLP-1 agonist',     category: 'Comparator' }
  ],
  'tirzepatide-t1d': [
    { id: 'i1', name: 'tirzepatide',  type: 'GIP/GLP-1 agonist', category: 'Targeted Therapy' },
    { id: 'i2', name: 'dulaglutide',  type: 'GLP-1 agonist',     category: 'Comparator' }
  ]
}

const ALL_GEOGRAPHIES = ['US', 'Australia', 'Canada', 'France', 'Japan', 'Korea', 'UK', 'Germany']

export function OverviewStep({ offer }: { offer: CareOffer }) {
  const router = useRouter()
  const fields = useMemoFields(offer)
  const status = getOfferStatus(offer.id) ?? offer.status
  const isClinicalTrial = offer.offerKind === 'clinical_trial'

  const [offerId, setOfferId]               = useState(fields.offerId)
  const [sponsor, setSponsor]               = useState(fields.sponsor)
  const [officialTitle, setOfficialTitle]   = useState(fields.officialTitle)
  const [displayTitle, setDisplayTitle]     = useState(fields.displayTitle)
  const [briefSummary, setBriefSummary]     = useState(fields.briefSummary)
  const [offerType, setOfferType]           = useState(fields.offerType)
  const [phase, setPhase]                   = useState(offer.phase ?? '')
  const [geographies, setGeographies]       = useState<string[]>(
    isClinicalTrial ? ['US', 'Australia', 'Canada', 'France', 'Japan', 'Korea'] : fields.geographies
  )
  const [interventions, setInterventions]   = useState<Intervention[]>(
    DEFAULT_INTERVENTIONS_BY_OFFER[offer.id] ?? [
      { id: 'i1', name: offer.title.split(/[—-]/)[0].trim(), type: '—', category: '—' }
    ]
  )
  const [endDate, setEndDate]               = useState('')

  const removeIntervention = (id: string) =>
    setInterventions(prev => prev.filter(i => i.id !== id))
  const addIntervention = () =>
    setInterventions(prev => [
      ...prev,
      { id: `i${Date.now()}`, name: '', type: '', category: '' }
    ])
  const updateIntervention = (id: string, patch: Partial<Intervention>) =>
    setInterventions(prev => prev.map(i => (i.id === id ? { ...i, ...patch } : i)))

  const toggleGeography = (g: string) =>
    setGeographies(prev => (prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]))

  const goNext = () =>
    router.push(`/setup?offer=${offer.id}&step=criteria`)

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-[12px] text-charcoal-11">Offer Status:</span>
          <StatusBadge status={status} />
        </div>
        <span className="text-[12px] text-charcoal-11">{offer.updatedLabel}</span>
      </div>

      <div className="bg-charcoal-white rounded-lg shadow-card p-6 flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-charcoal-15">
            Summary <span className="text-[11px] font-normal text-red-13 ml-1">* Required</span>
          </h2>

          <Field label="Offer ID" required>
            <input value={offerId} onChange={e => setOfferId(e.target.value)} className={inputClass} />
          </Field>

          <Field label="Sponsor" required>
            <input value={sponsor} onChange={e => setSponsor(e.target.value)} className={inputClass} />
          </Field>

          <Field label="Official Title" required>
            <input value={officialTitle} onChange={e => setOfficialTitle(e.target.value)} className={inputClass} />
          </Field>

          <Field label={<>Display Title <span className="text-[11px] text-charcoal-10">(optional - for patient-facing communications)</span></>}>
            <input value={displayTitle} onChange={e => setDisplayTitle(e.target.value)} className={inputClass} />
          </Field>

          <Field label="Brief Summary" required>
            <textarea
              value={briefSummary}
              onChange={e => setBriefSummary(e.target.value)}
              rows={3}
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </Field>

          <div className="flex gap-4 items-start w-full">
            <div className="pt-[8px] text-[12px] text-charcoal-12 shrink-0 w-[200px]">
              Offer Type <span className="text-red-13">*</span>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <select
                value={offerType}
                onChange={e => setOfferType(e.target.value)}
                className={inputClass}
              >
                <option>Clinical Trial</option>
                <option>Approved Treatment</option>
              </select>
              {isClinicalTrial && (
                <div className="flex items-center gap-3">
                  <label className="text-[12px] text-charcoal-12 shrink-0">
                    Phase <span className="text-[11px] text-charcoal-10">(clinical trials only)</span>
                  </label>
                  <input
                    value={phase}
                    onChange={e => setPhase(e.target.value)}
                    className={inputClass}
                  />
                </div>
              )}
            </div>
          </div>

          <Field label="Geographic Availability" required>
            <div className="flex flex-wrap gap-1">
              {ALL_GEOGRAPHIES.map(g => {
                const on = geographies.includes(g)
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGeography(g)}
                    className={`text-[12px] rounded-full px-3 py-0.5 ${
                      on
                        ? 'bg-blue-10 text-charcoal-white'
                        : 'bg-charcoal-white border border-charcoal-5 text-charcoal-14'
                    }`}
                  >
                    {g}
                  </button>
                )
              })}
            </div>
          </Field>
        </section>

        {isClinicalTrial && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-[14px] font-semibold text-charcoal-15">Interventions</h2>
              <button
                type="button"
                onClick={addIntervention}
                className="border border-charcoal-5 hover:bg-charcoal-1 text-[12px] text-charcoal-15 rounded-md px-2 py-1"
              >
                + Add
              </button>
            </div>

            <div className="border border-charcoal-4 rounded-lg overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-charcoal-1">
                  <tr className="text-left text-[11px] font-semibold text-charcoal-12 uppercase">
                    <th className="px-3 py-2 border-b border-charcoal-4">Intervention</th>
                    <th className="px-3 py-2 border-b border-charcoal-4">Type</th>
                    <th className="px-3 py-2 border-b border-charcoal-4">Category</th>
                    <th className="px-3 py-2 border-b border-charcoal-4 w-[40px]" />
                  </tr>
                </thead>
                <tbody>
                  {interventions.map(i => (
                    <tr key={i.id} className="border-b border-charcoal-2">
                      <td className="px-3 py-2">
                        <input
                          value={i.name}
                          onChange={e => updateIntervention(i.id, { name: e.target.value })}
                          className="w-full bg-transparent text-[13px] text-charcoal-15 focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={i.type}
                          onChange={e => updateIntervention(i.id, { type: e.target.value })}
                          className="w-full bg-transparent text-[13px] text-charcoal-12 focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2">
                        <input
                          value={i.category}
                          onChange={e => updateIntervention(i.id, { category: e.target.value })}
                          className="w-full bg-transparent text-[13px] text-charcoal-12 focus:outline-none"
                        />
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removeIntervention(i.id)}
                          className="text-charcoal-12 hover:text-red-13"
                          aria-label="Remove"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section className="flex flex-col gap-4">
          <h2 className="text-[14px] font-semibold text-charcoal-15">Offer Timeline on Resonata</h2>
          <div className="flex gap-4">
            <TimelineField title="Created" sub="by filling, upload" value="July 2, 2021" />
            <TimelineField title="Last Updated" sub="by Manual Import" value={fields.lastUpdatedLabel} />
          </div>
          <div className="flex gap-4">
            <TimelineField title="Activation Date" value="July 19, 2021" />
            <div className="flex gap-4 flex-1">
              <div className="w-[200px] pt-[1px]">
                <div className="text-[12px] text-charcoal-12">End Date</div>
                <div className="text-[11px] text-charcoal-10">Set on Activation page</div>
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full max-w-[352px] bg-charcoal-white border border-charcoal-6 rounded-md px-[11px] py-[7px] text-[13px] text-charcoal-18 focus:outline-none focus:border-blue-10"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <FooterNav>
        <button
          type="button"
          className="px-4 py-2 rounded-md border border-charcoal-5 text-[13px] text-charcoal-15 hover:bg-charcoal-1"
        >
          Save Draft
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            disabled
            className="px-4 py-2 rounded-md border border-charcoal-5 text-[13px] text-charcoal-12 disabled:opacity-50"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={goNext}
            className="px-5 py-2 rounded-md bg-green-12 hover:bg-green-13 text-charcoal-white text-[13px] font-medium"
          >
            Next: Criteria →
          </button>
        </div>
      </FooterNav>
    </>
  )
}

/* ---------- shared building blocks (also used by Criteria/Contacts) ---------- */

export const inputClass =
  'w-full bg-charcoal-white border border-charcoal-6 rounded-md px-[11px] py-[7px] text-[13px] text-charcoal-18 focus:outline-none focus:border-blue-10'

export function Field({
  label,
  required,
  children
}: {
  label: ReactNode
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex gap-4 items-start w-full">
      <div className="pt-[8px] text-[12px] text-charcoal-12 shrink-0 w-[200px]">
        {label}
        {required && <span className="text-red-13"> *</span>}
      </div>
      <div className="flex-1">{children}</div>
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

export function FooterNav({ children }: { children: ReactNode }) {
  return (
    <div className={`${CONTAINER} flex justify-between items-center pt-6`}>
      {children}
    </div>
  )
}

/* Compute initial fields once. Imported helper from data layer. */
function useMemoFields(offer: CareOffer) {
  // Not actually memoized here — fields are derived synchronously and only
  // used as initial state. Keeping the function name to read like intent.
  return setupFieldsFor(offer)
}
