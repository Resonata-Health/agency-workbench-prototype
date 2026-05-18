'use client'

interface Props {
  title: string
  body: string
  confirmLabel: string
  destructive?: boolean
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({ title, body, confirmLabel, destructive, busy, onConfirm, onCancel }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-black/40 px-4">
      <div className="w-full max-w-[440px] bg-charcoal-white rounded-lg shadow-pop p-6">
        <h3 className="text-[16px] font-semibold text-charcoal-18">{title}</h3>
        <p className="mt-2 text-[13px] text-charcoal-14 leading-relaxed">{body}</p>
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
            onClick={onConfirm}
            disabled={busy}
            className={`px-4 py-2 rounded-md text-[13px] font-medium text-charcoal-white inline-flex items-center gap-2 disabled:opacity-70 ${
              destructive ? 'bg-red-10 hover:bg-red-11' : 'bg-green-12 hover:bg-green-13'
            }`}
          >
            {busy && (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-charcoal-white/40 border-t-charcoal-white animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
