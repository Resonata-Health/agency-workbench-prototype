'use client'

import type { RejectionMessage } from '@/data/rejectionMessages'

interface Props {
  messages: RejectionMessage[]
  onClose: () => void
}

export function MessagesDialog({ messages, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-black/40 px-4">
      <div className="w-full max-w-[560px] bg-charcoal-white rounded-lg shadow-pop p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-semibold text-charcoal-18">MLR feedback</h3>
            <p className="mt-1 text-[12px] text-charcoal-12">
              History of rejection messages from the sponsor&apos;s MLR team.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-charcoal-12 hover:text-charcoal-15 text-[18px] leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-5 max-h-[360px] overflow-y-auto flex flex-col gap-3">
          {messages.length === 0 ? (
            <div className="text-center text-[13px] text-charcoal-12 py-8 border border-dashed border-charcoal-4 rounded-md">
              No messages yet.
            </div>
          ) : (
            messages
              .slice()
              .reverse()
              .map((m, i) => (
                <div
                  key={i}
                  className="border-l-[3px] border-l-red-10 bg-charcoal-1 rounded-r-md px-3 py-2.5"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[12px] font-semibold text-charcoal-15">{m.author}</span>
                    <span className="text-[11px] text-charcoal-11">{m.timestampLabel}</span>
                  </div>
                  <p className="text-[13px] text-charcoal-15 leading-relaxed whitespace-pre-wrap">
                    {m.text}
                  </p>
                </div>
              ))
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-charcoal-5 text-[13px] text-charcoal-15 hover:bg-charcoal-1"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
