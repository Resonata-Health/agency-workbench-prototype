'use client'

import type { Artifact, OutreachDrafts, InheritedMeta } from '@/data/outreachContent'

export function PhonePreview({
  artifact,
  drafts,
  meta
}: {
  artifact: Artifact
  drafts: OutreachDrafts
  meta: InheritedMeta
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="self-start text-[12px] text-charcoal-12 mb-2.5">📱 As patient sees it</div>
      <div className="w-[252px] h-[500px] border-2 border-charcoal-18 rounded-[24px] bg-charcoal-white p-3 shadow-pop flex flex-col">
        <div className="w-12 h-1 bg-charcoal-18 rounded mx-auto mb-2.5 shrink-0" />
        <div className="flex-1 overflow-auto">
          {artifact === 'email' && <EmailMini drafts={drafts} />}
          {artifact === 'card' && <CardMini drafts={drafts} meta={meta} />}
          {artifact === 'details' && <DetailsMini drafts={drafts} meta={meta} />}
        </div>
      </div>
      <div className="text-[11px] text-charcoal-11 mt-2.5">Updates live as you edit ←</div>
    </div>
  )
}

function EmailMini({ drafts }: { drafts: OutreachDrafts }) {
  const e = drafts.email
  return (
    <div className="text-[10px] leading-relaxed text-charcoal-18">
      <div className="text-[9px] text-charcoal-11 mb-1">{e.fromEmail}</div>
      <div className="font-bold text-[11px] mb-1.5 line-clamp-2">{e.subject || 'Subject line'}</div>
      <div className="mb-1.5">{e.greeting}</div>
      <p className="text-charcoal-14 line-clamp-6 whitespace-pre-line mb-2">{e.body}</p>
      {(e.calloutTitle || e.calloutBody) && (
        <div className="bg-green-1 rounded-[2px] p-1.5 text-[9px] text-charcoal-14 mb-2">
          <strong className="text-green-14">{e.calloutTitle} </strong>{e.calloutBody}
        </div>
      )}
      <div className="bg-green-12 text-charcoal-white rounded-[3px] text-center py-1.5 text-[10px] font-semibold">
        {e.ctaLabel}
      </div>
    </div>
  )
}

function CardMini({ drafts, meta }: { drafts: OutreachDrafts; meta: InheritedMeta }) {
  const c = drafts.card
  const isTrial = c.kind === 'trial'

  return (
    <div>
      <div className="text-[9px] text-charcoal-11 mb-1.5">Your matches · 6</div>
      <div
        className={`border-[1.5px] border-green-10 rounded-[6px] px-2.5 py-3 mb-1.5 ${
          isTrial ? 'text-left' : 'text-center'
        }`}
        style={isTrial ? { backgroundColor: '#a8d49e' } : undefined}
      >
        {!isTrial && (
          <span className="inline-block bg-green-1 text-green-14 text-[6px] font-bold tracking-wide rounded-full px-1.5 py-0.5 mb-1.5">
            SPONSORED · {meta.sponsorShort.toUpperCase()}
          </span>
        )}
        <div className="font-bold text-[10px] text-charcoal-18 leading-tight mb-1">{c.headline}</div>
        <div className="text-[7px] text-charcoal-12 leading-snug mb-2 line-clamp-3">{c.subtext}</div>

        {isTrial ? (
          <div className="flex gap-1">
            <div className="flex-1 bg-green-12 text-charcoal-white rounded-[3px] py-1 text-[7px] font-bold text-center leading-tight">
              {c.ctaLabel}
            </div>
            <div className="flex-1 bg-charcoal-white border border-green-12 text-green-12 rounded-[3px] py-1 text-[7px] font-bold text-center leading-tight">
              {c.secondaryCtaLabel}
            </div>
          </div>
        ) : (
          <div className="bg-green-12 text-charcoal-white rounded-[3px] py-1.5 text-[8px] font-bold">
            {c.ctaLabel}
          </div>
        )}
      </div>
      {[0, 1].map(i => (
        <div key={i} className="border border-charcoal-4 rounded-[2px] p-1.5 mb-1 opacity-50">
          <div className="h-1.5 bg-charcoal-4 rounded w-3/4 mb-1" />
          <div className="h-1.5 bg-charcoal-4 rounded w-1/2" />
        </div>
      ))}
    </div>
  )
}

function DetailsMini({ drafts, meta }: { drafts: OutreachDrafts; meta: InheritedMeta }) {
  const d = drafts.details
  return (
    <div className="text-[9px] leading-snug text-charcoal-18">
      <div className="text-[7px] text-green-13 font-semibold mb-1">← Back to results</div>
      <div className="rounded-[2px] p-2 mb-2 text-charcoal-white" style={{ background: 'linear-gradient(135deg,#0e3b2a 0%,#062017 100%)' }}>
        <div className="text-[6px] opacity-70 mb-0.5">FDA APPROVED · {meta.displayTitle.toUpperCase()}</div>
        <div className="text-[12px] font-bold">{meta.brand}</div>
        <div className="text-[7px] opacity-80">{meta.genericName}</div>
        <div className="mt-1 inline-block rounded-[6px] px-1 text-[6px]" style={{ background: 'rgba(125,212,90,0.2)', color: '#7dd45a' }}>
          ✓ May be eligible
        </div>
      </div>
      <div className="font-bold text-[9px] mb-1">{d.howItWorksHeading}</div>
      <p className="text-charcoal-14 line-clamp-3 whitespace-pre-line mb-1.5">{d.howItWorks}</p>
      <div className="grid grid-cols-3 gap-1 mb-2">
        {d.kpis.map((k, i) => (
          <div key={i} className="bg-green-1 py-1 text-center text-[8px] font-bold text-green-13 rounded-[2px]">
            {k.value}
          </div>
        ))}
      </div>
      <div className="font-bold text-[9px] mb-0.5">What to expect</div>
      <p className="text-charcoal-14 line-clamp-2 whitespace-pre-line mb-1.5">{d.whatToExpect}</p>
      <div className="font-bold text-[9px] mb-0.5">⚠ Safety</div>
      <p className="text-charcoal-14 line-clamp-2 whitespace-pre-line mb-1.5">{d.safetyCommon}</p>
      <div className="bg-green-1 p-1.5 rounded-[2px] text-center mb-2">
        <div className="text-[7px] font-bold">{d.ctaHeadline}</div>
        <div className="bg-green-12 text-charcoal-white py-0.5 rounded-[2px] mt-1 text-[7px] font-semibold">{d.ctaPrimary}</div>
      </div>
      <div className="text-[6px] text-charcoal-11 font-bold">IMPORTANT SAFETY INFORMATION</div>
      <p className="text-[6px] text-charcoal-11 line-clamp-3">{d.isi[0]?.body}</p>
    </div>
  )
}
