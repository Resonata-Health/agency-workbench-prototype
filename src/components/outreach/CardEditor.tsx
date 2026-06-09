'use client'

import type { CardDraft, InheritedMeta } from '@/data/outreachContent'
import { RtToolbar } from './RtToolbar'
import { EditText, EditArea, Locked } from './fields'

interface Props {
  draft: CardDraft
  meta: InheritedMeta
  readOnly?: boolean
  update: (patch: Partial<CardDraft>) => void
}

export function CardEditor({ draft, meta, readOnly, update }: Props) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-2.5 border-b border-charcoal-4 bg-charcoal-white flex items-center justify-between">
        <span className="text-[12px] text-charcoal-12">
          Edit the card directly — it appears in the patient&apos;s match list.
        </span>
        <span className="text-[11px] text-charcoal-12">
          {draft.kind === 'trial'
            ? <>Template: <strong className="text-charcoal-15">Clinical trial — Apply</strong></>
            : <>Template: <strong className="text-charcoal-15">Approved treatment — Sponsored</strong></>}
        </span>
      </div>

      <RtToolbar
        extra={
          <span className="h-7 px-2 inline-flex items-center rounded border border-charcoal-5 bg-charcoal-white text-[11px] text-charcoal-14">
            Brand assets ▾
          </span>
        }
      />

      <div className="flex-1 overflow-auto p-10 bg-charcoal-2 flex justify-center items-start">
        {draft.kind === 'sponsored'
          ? <SponsoredCard draft={draft} meta={meta} readOnly={readOnly} update={update} />
          : <TrialCard draft={draft} readOnly={readOnly} update={update} />}
      </div>
    </div>
  )
}

function SponsoredCard({ draft, meta, readOnly, update }: Props) {
  return (
    <div className="w-[560px] max-w-full bg-charcoal-white border-2 border-green-10 rounded-xl px-8 py-8 shadow-card text-center">
      {/* Sponsored pill — inherited from sponsor meta, not editable */}
      <div className="flex justify-center mb-5">
        <Locked>
          <span className="inline-block bg-green-1 text-green-14 text-[12px] font-bold tracking-wide rounded-full px-4 py-1.5">
            SPONSORED · {meta.sponsorShort.toUpperCase()}
          </span>
        </Locked>
      </div>

      <EditText
        value={draft.headline}
        onChange={v => update({ headline: v })}
        disabled={readOnly}
        ariaLabel="Card headline"
        placeholder="Headline"
        className="text-[22px] font-bold text-charcoal-18 text-center mb-3"
      />

      <EditArea
        value={draft.subtext}
        onChange={v => update({ subtext: v })}
        disabled={readOnly}
        ariaLabel="Card subtext"
        placeholder="Supporting line"
        className="text-[15px] text-charcoal-12 text-center mb-6 max-w-[440px] mx-auto"
      />

      <div className="w-full bg-green-12 rounded-lg px-6 py-4">
        <EditText
          value={draft.ctaLabel}
          onChange={v => update({ ctaLabel: v })}
          disabled={readOnly}
          ariaLabel="CTA label"
          autoWidth
          className="!border-charcoal-white/40 text-charcoal-white text-[16px] font-bold text-center"
        />
      </div>
    </div>
  )
}

function TrialCard({ draft, readOnly, update }: { draft: CardDraft; readOnly?: boolean; update: (p: Partial<CardDraft>) => void }) {
  return (
    <div className="w-[560px] max-w-full bg-charcoal-white border-2 border-green-10 rounded-xl px-8 py-7 shadow-card">
      <EditText
        value={draft.headline}
        onChange={v => update({ headline: v })}
        disabled={readOnly}
        ariaLabel="Card headline"
        placeholder="Headline"
        className="text-[22px] font-bold text-charcoal-18 mb-3"
      />

      <EditArea
        value={draft.subtext}
        onChange={v => update({ subtext: v })}
        disabled={readOnly}
        ariaLabel="Card subtext"
        placeholder="Supporting line"
        className="text-[14px] text-charcoal-14 leading-relaxed mb-5"
      />

      <div className="flex gap-3">
        <div className="flex-1 bg-green-12 rounded-lg px-5 py-3.5">
          <EditText
            value={draft.ctaLabel}
            onChange={v => update({ ctaLabel: v })}
            disabled={readOnly}
            ariaLabel="Primary CTA label"
            autoWidth
            className="!border-charcoal-white/40 text-charcoal-white text-[14px] font-bold text-center"
          />
        </div>
        <div className="flex-1 bg-charcoal-white border-2 border-green-12 rounded-lg px-5 py-3.5">
          <EditText
            value={draft.secondaryCtaLabel ?? ''}
            onChange={v => update({ secondaryCtaLabel: v })}
            disabled={readOnly}
            ariaLabel="Secondary CTA label"
            autoWidth
            className="!border-green-12/40 text-green-12 text-[14px] font-bold text-center"
          />
        </div>
      </div>
    </div>
  )
}
