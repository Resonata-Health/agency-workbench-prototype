'use client'

import type { EmailDraft, InheritedMeta } from '@/data/outreachContent'
import { RtToolbar } from './RtToolbar'
import { EditText, EditArea } from './fields'

interface Props {
  draft: EmailDraft
  meta: InheritedMeta
  readOnly?: boolean
  update: (patch: Partial<EmailDraft>) => void
  onOpenRecipients: () => void
}

export function EmailEditor({ draft, meta, readOnly, update, onOpenRecipients }: Props) {
  return (
    <div className="flex flex-col h-full">
      {/* Header strip */}
      <div className="px-4 py-3 border-b border-charcoal-4 bg-charcoal-white space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-[11px] text-charcoal-11 w-14 shrink-0">To</span>
          <button
            type="button"
            onClick={onOpenRecipients}
            className="bg-blue-1 text-blue-12 text-[11px] font-semibold rounded-full px-2 py-0.5 hover:bg-blue-2"
          >
            {meta.recipientCount} selected patients
          </button>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-[11px] text-charcoal-11 w-14 shrink-0">Subject</span>
          <EditText
            value={draft.subject}
            onChange={v => update({ subject: v })}
            disabled={readOnly}
            ariaLabel="Subject line"
            placeholder="Subject line"
            className="text-[13px] font-semibold text-charcoal-18"
          />
        </div>
      </div>

      <RtToolbar />

      {/* Compose surface */}
      <div className="flex-1 overflow-auto px-8 py-6 bg-[#fffefb]">
        <div className="max-w-[620px] space-y-3 text-[13px] leading-7 text-charcoal-18">
          <EditText
            value={draft.greeting}
            onChange={v => update({ greeting: v })}
            disabled={readOnly}
            ariaLabel="Greeting"
          />
          <EditArea
            value={draft.body}
            onChange={v => update({ body: v })}
            disabled={readOnly}
            ariaLabel="Email body"
            placeholder="Write the email body…"
          />

          {/* Insertable callout block */}
          <div className="bg-green-1 border-l-2 border-green-10 rounded-[4px] px-3 py-2.5">
            <EditText
              value={draft.calloutTitle}
              onChange={v => update({ calloutTitle: v })}
              disabled={readOnly}
              ariaLabel="Callout title"
              className="text-[12px] font-semibold text-green-14 mb-1"
            />
            <EditArea
              value={draft.calloutBody}
              onChange={v => update({ calloutBody: v })}
              disabled={readOnly}
              ariaLabel="Callout body"
              className="text-[12px] text-charcoal-14"
            />
          </div>

          {/* CTA button (style fixed) */}
          <div>
            <span className="inline-block bg-green-12 text-charcoal-white rounded-[4px] px-5 py-2.5 text-[13px] font-semibold">
              <EditText
                value={draft.ctaLabel}
                onChange={v => update({ ctaLabel: v })}
                disabled={readOnly}
                ariaLabel="CTA label"
                autoWidth
                className="!border-charcoal-white/40 text-charcoal-white"
              />
            </span>
          </div>

          <p className="text-[11px] text-charcoal-11 pt-3">{draft.footerText}</p>
        </div>
      </div>
    </div>
  )
}
