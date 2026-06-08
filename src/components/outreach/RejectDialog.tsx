'use client'

import { useState } from 'react'

interface Props {
  busy?: boolean
  onConfirm: (reason: string) => void
  onCancel: () => void
}

export function RejectDialog({ busy, onConfirm, onCancel }: Props) {
  const [reason, setReason] = useState('')
  const canSubmit = reason.trim().length > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-black/40 px-4">
      <div className="w-full max-w-[520px] bg-charcoal-white rounded-lg shadow-pop p-6">
        <h3 className="text-[16px] font-semibold text-charcoal-18">Reject this content</h3>
        <p className="mt-2 text-[13px] text-charcoal-14 leading-relaxed">
          Share why you are rejecting this submission. The agency will see your message
          and can revise and resubmit.
        </p>

        <label className="block mt-4 text-[12px] font-medium text-charcoal-15">
          Reason
        </label>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="What needs to change before this can be approved?"
          rows={6}
          autoFocus
          className="mt-1 w-full bg-charcoal-white border border-charcoal-6 rounded-md px-3 py-2 text-[13px] text-charcoal-18 focus:outline-none focus:border-blue-10 resize-y leading-relaxed"
        />

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 rounded-md border border-charcoal-5 text-[13px] text-charcoal-15 hover:bg-charcoal-1 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(reason.trim())}
            disabled={busy || !canSubmit}
            className="px-4 py-2 rounded-md text-[13px] font-medium text-charcoal-white bg-red-10 hover:bg-red-11 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy && (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-charcoal-white/40 border-t-charcoal-white animate-spin" />
            )}
            Yes, reject
          </button>
        </div>
      </div>
    </div>
  )
}
