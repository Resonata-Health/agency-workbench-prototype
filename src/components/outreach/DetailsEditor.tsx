'use client'

import type { DetailsDraft, InheritedMeta } from '@/data/outreachContent'
import { RtToolbar } from './RtToolbar'
import { EditText, EditArea, Locked } from './fields'

interface Props {
  draft: DetailsDraft
  meta: InheritedMeta
  readOnly?: boolean
  update: (patch: Partial<DetailsDraft>) => void
}

export function DetailsEditor({ draft, meta, readOnly, update }: Props) {
  const setKpi = (i: number, patch: Partial<{ value: string; label: string }>) =>
    update({ kpis: draft.kpis.map((k, idx) => (idx === i ? { ...k, ...patch } : k)) })

  const setIsi = (i: number, patch: Partial<{ heading: string; body: string }>) =>
    update({ isi: draft.isi.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) })

  const addIsi = () =>
    update({ isi: [...draft.isi, { heading: 'NEW SECTION', body: '' }] })

  const removeIsi = (i: number) =>
    update({ isi: draft.isi.filter((_, idx) => idx !== i) })

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2.5 border-b border-charcoal-4 bg-charcoal-white flex items-center justify-between">
        <span className="text-[12px] text-charcoal-12">Details page · opens when patient clicks “Learn more” on the card</span>
        <span className="text-[11px] text-charcoal-12">{draft.isi.length} ISI sections · ISI required</span>
      </div>

      <RtToolbar
        extra={
          <>
            <button
              type="button"
              onClick={addIsi}
              disabled={readOnly}
              className="h-7 px-2 rounded border border-charcoal-5 bg-charcoal-white text-[11px] text-charcoal-14 hover:bg-charcoal-2 disabled:opacity-50"
            >
              + Section
            </button>
            <span className="h-7 px-2 inline-flex items-center rounded border border-charcoal-5 bg-charcoal-white text-[11px] text-charcoal-14">
              Block ▾
            </span>
          </>
        }
      />

      <div className="flex-1 overflow-auto p-8 bg-charcoal-2">
        <div className="max-w-[720px] mx-auto bg-charcoal-white rounded-md shadow-card overflow-hidden">
          {/* Top chrome — fixed */}
          <div className="px-5 py-2.5 flex justify-between items-center border-b border-charcoal-4 text-[11px]">
            <span className="text-green-13 font-semibold">✓ Resonata</span>
            <span className="bg-charcoal-2 text-charcoal-11 px-2 py-0.5 rounded-[2px] font-semibold tracking-wide text-[10px]">SPONSORED</span>
          </div>
          <div className="px-5 py-2 text-[11px] text-charcoal-11">← Back to your results</div>

          {/* Hero — inherited */}
          <div className="px-6 py-6 text-charcoal-white" style={{ background: 'linear-gradient(135deg,#0e3b2a 0%,#062017 100%)' }}>
            <Locked className="text-[10px] !text-charcoal-white/80">
              <span className="inline-block px-2 py-0.5 rounded-[3px] bg-white/10 border border-white/15">
                {meta.sponsor} · Sponsored
              </span>
            </Locked>
            <div className="text-[11px] opacity-75 tracking-wide mt-3 mb-1.5">
              <Locked className="!text-charcoal-white/80">FDA APPROVED · {meta.displayTitle.toUpperCase()}</Locked>
            </div>
            <Locked className="!text-charcoal-white">
              <span className="text-[28px] font-bold">{meta.brand}</span>
            </Locked>
            <div className="text-[13px] opacity-85 mt-0.5 mb-3">
              <Locked className="!text-charcoal-white/85">{meta.genericName}</Locked>
            </div>
            <span className="inline-block text-[12px] font-semibold px-3 py-1.5 rounded-full" style={{ background: 'rgba(74,172,49,0.18)', color: '#7dd45a', border: '1px solid rgba(125,212,90,0.4)' }}>
              ✓ You may be eligible
            </span>
          </div>

          {/* How it works */}
          <div className="px-6 py-5 border-b border-charcoal-4">
            <EditText
              value={draft.howItWorksHeading}
              onChange={v => update({ howItWorksHeading: v })}
              disabled={readOnly}
              ariaLabel="How it works heading"
              className="text-[16px] font-bold text-charcoal-18 mb-2"
            />
            <EditArea
              value={draft.howItWorks}
              onChange={v => update({ howItWorks: v })}
              disabled={readOnly}
              ariaLabel="How it works body"
              className="text-[12px] text-charcoal-14 leading-6"
            />
          </div>

          {/* KPI tiles */}
          <div className="px-6 py-4 grid grid-cols-3 gap-2.5 border-b border-charcoal-4">
            {draft.kpis.map((k, i) => (
              <div key={i} className="bg-green-1 rounded-[4px] p-3 border border-charcoal-4">
                <EditText
                  value={k.value}
                  onChange={v => setKpi(i, { value: v })}
                  disabled={readOnly}
                  ariaLabel={`KPI ${i + 1} value`}
                  className="text-[18px] font-bold text-green-13 mb-1"
                />
                <EditArea
                  value={k.label}
                  onChange={v => setKpi(i, { label: v })}
                  disabled={readOnly}
                  ariaLabel={`KPI ${i + 1} label`}
                  className="text-[10px] text-charcoal-14 leading-tight"
                />
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-b border-charcoal-4">
            <EditArea
              value={draft.dataSource}
              onChange={v => update({ dataSource: v })}
              disabled={readOnly}
              ariaLabel="Data source citation"
              className="text-[10px] text-charcoal-11"
            />
          </div>

          {/* What to expect */}
          <div className="px-6 py-5 border-b border-charcoal-4">
            <div className="text-[16px] font-bold text-charcoal-18 mb-2">What to expect</div>
            <EditArea
              value={draft.whatToExpect}
              onChange={v => update({ whatToExpect: v })}
              disabled={readOnly}
              ariaLabel="What to expect"
              className="text-[12px] text-charcoal-14 leading-7"
            />
          </div>

          {/* Safety profile */}
          <div className="px-6 py-5 border-b border-charcoal-4 space-y-3">
            <div className="text-[16px] font-bold text-charcoal-18">⚠ Safety profile</div>
            {[
              ['Most common adverse reactions', draft.safetyCommon, (v: string) => update({ safetyCommon: v })],
              ['Serious risks to discuss with your doctor', draft.safetySerious, (v: string) => update({ safetySerious: v })],
              ['Do not use if you', draft.safetyDoNot, (v: string) => update({ safetyDoNot: v })]
            ].map(([label, val, set]) => (
              <div key={label as string}>
                <div className="text-[12px] font-bold text-charcoal-15 mb-1">{label as string}:</div>
                <EditArea
                  value={val as string}
                  onChange={set as (v: string) => void}
                  disabled={readOnly}
                  ariaLabel={label as string}
                  className="text-[12px] text-charcoal-14 leading-6"
                />
              </div>
            ))}
            <EditArea
              value={draft.safetyDisclaimer}
              onChange={v => update({ safetyDisclaimer: v })}
              disabled={readOnly}
              ariaLabel="Safety disclaimer"
              className="text-[10px] text-charcoal-11"
            />
          </div>

          {/* CTA card */}
          <div className="px-6 py-5 bg-green-1 border-y border-charcoal-4 text-center">
            <EditText
              value={draft.ctaEyebrow}
              onChange={v => update({ ctaEyebrow: v })}
              disabled={readOnly}
              ariaLabel="CTA eyebrow"
              className="text-[10px] text-charcoal-11 tracking-wide mb-1 text-center"
            />
            <EditText
              value={draft.ctaHeadline}
              onChange={v => update({ ctaHeadline: v })}
              disabled={readOnly}
              ariaLabel="CTA headline"
              className="text-[16px] font-bold text-charcoal-18 mb-1 text-center"
            />
            <EditArea
              value={draft.ctaSub}
              onChange={v => update({ ctaSub: v })}
              disabled={readOnly}
              ariaLabel="CTA sub"
              className="text-[12px] text-charcoal-14 mb-3 text-center"
            />
            <div className="flex flex-col gap-2 max-w-[360px] mx-auto">
              <span className="bg-green-12 text-charcoal-white rounded-[4px] px-4 py-2.5 text-[12px] font-semibold">
                <EditText value={draft.ctaPrimary} onChange={v => update({ ctaPrimary: v })} disabled={readOnly} ariaLabel="CTA primary" autoWidth className="!border-charcoal-white/40 text-charcoal-white text-center" />
              </span>
              <span className="bg-charcoal-white text-green-13 border-[1.5px] border-green-12 rounded-[4px] px-4 py-2.5 text-[12px] font-semibold">
                <EditText value={draft.ctaSecondary} onChange={v => update({ ctaSecondary: v })} disabled={readOnly} ariaLabel="CTA secondary" autoWidth className="!border-green-12/40 text-green-13 text-center" />
              </span>
              <span className="text-[11px] text-blue-12 underline mt-1">Visit the product site for full prescribing information →</span>
            </div>
          </div>

          {/* ISI — required */}
          <div className="px-6 py-5 bg-charcoal-1 border-b border-charcoal-4">
            <div className="text-[11px] font-bold text-charcoal-14 tracking-wide mb-2">IMPORTANT SAFETY INFORMATION</div>
            <Locked className="text-[12px] font-bold text-charcoal-18">{meta.drugName}</Locked>
            <div className="mt-3 space-y-3">
              {draft.isi.map((s, i) => (
                <div key={i} className="relative pr-6">
                  <EditText
                    value={s.heading}
                    onChange={v => setIsi(i, { heading: v })}
                    disabled={readOnly}
                    ariaLabel={`ISI section ${i + 1} heading`}
                    className="text-[11px] font-bold text-charcoal-14 tracking-wide mb-1"
                  />
                  <EditArea
                    value={s.body}
                    onChange={v => setIsi(i, { body: v })}
                    disabled={readOnly}
                    ariaLabel={`ISI section ${i + 1} body`}
                    className="text-[11px] text-charcoal-14 leading-5"
                  />
                  {!readOnly && draft.isi.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIsi(i)}
                      className="absolute right-0 top-0 text-charcoal-11 hover:text-red-10 text-[14px] leading-none"
                      aria-label={`Remove ISI section ${i + 1}`}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-charcoal-14 mt-3">
              Please see full <span className="text-blue-12 underline">Prescribing Information</span> and{' '}
              <span className="text-blue-12 underline">Medication Guide</span>.
            </p>
          </div>

          {/* Footer disclosure */}
          <div className="px-6 py-4">
            <EditArea
              value={draft.footerDisclosure}
              onChange={v => update({ footerDisclosure: v })}
              disabled={readOnly}
              ariaLabel="Footer disclosure"
              className="text-[10px] text-charcoal-11 leading-5"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
