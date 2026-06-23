'use client'

import { COST_PER_EMAIL } from '@/data/outreachCampaigns'

interface Props {
  fullCount: number
  partialCount: number
  busy?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const fmt = (n: number) => `$${n.toLocaleString()}`

export function SendCampaignDialog({ fullCount, partialCount, busy, onConfirm, onCancel }: Props) {
  const total = fullCount + partialCount
  const fullTotal    = fullCount    * COST_PER_EMAIL
  const partialTotal = partialCount * COST_PER_EMAIL
  const grandTotal   = fullTotal + partialTotal

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-black/40 px-4">
      <div className="w-full max-w-[560px] bg-charcoal-white rounded-lg shadow-pop p-6">
        <h3 className="text-[16px] font-semibold text-charcoal-18">Selected Patients &amp; Cost</h3>

        <div className="mt-4 border border-charcoal-4 rounded-md overflow-hidden">
          <table className="w-full border-collapse text-[13px]">
            <thead className="bg-charcoal-1 text-[11px] uppercase font-semibold text-charcoal-12">
              <tr>
                <th className="text-left px-4 py-2 border-b border-charcoal-4">Match Type</th>
                <th className="text-center px-4 py-2 border-b border-charcoal-4">Count</th>
                <th className="text-right px-4 py-2 border-b border-charcoal-4">$/Email</th>
                <th className="text-right px-4 py-2 border-b border-charcoal-4">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-charcoal-2">
                <td className="px-4 py-2.5 text-charcoal-15">Full match</td>
                <td className="px-4 py-2.5 text-center text-charcoal-15">{fullCount}</td>
                <td className="px-4 py-2.5 text-right text-charcoal-15">{fmt(COST_PER_EMAIL)}</td>
                <td className="px-4 py-2.5 text-right font-semibold text-blue-14">{fmt(fullTotal)}</td>
              </tr>
              <tr className="border-b border-charcoal-2">
                <td className="px-4 py-2.5 text-charcoal-15">Partial Match</td>
                <td className="px-4 py-2.5 text-center text-charcoal-15">{partialCount}</td>
                <td className="px-4 py-2.5 text-right text-charcoal-15">{fmt(COST_PER_EMAIL)}</td>
                <td className="px-4 py-2.5 text-right font-semibold text-blue-14">{fmt(partialTotal)}</td>
              </tr>
              <tr className="bg-charcoal-1">
                <td className="px-4 py-2.5 font-semibold text-charcoal-18">Total</td>
                <td className="px-4 py-2.5 text-center font-semibold text-charcoal-18">{total}</td>
                <td className="px-4 py-2.5 text-right text-charcoal-12">—</td>
                <td className="px-4 py-2.5 text-right font-bold text-blue-14">{fmt(grandTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-start gap-2 bg-gold-1 border border-gold-5 rounded-md px-3 py-2.5 text-[12.5px] text-charcoal-15">
          <span className="text-gold-14 leading-none mt-0.5">⚠</span>
          <span>
            This action will send emails to <strong>{total}</strong> selected patients and charge your account. This action cannot be undone. Do you want to proceed?
          </span>
        </div>

        <div className="mt-5 flex justify-end gap-2">
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
            disabled={busy || total === 0}
            className="px-5 py-2 rounded-md bg-green-12 hover:bg-green-13 text-charcoal-white text-[13px] font-medium inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy && (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-charcoal-white/40 border-t-charcoal-white animate-spin" />
            )}
            Yes, send
          </button>
        </div>
      </div>
    </div>
  )
}
