'use client'

import {
  AGENCY_BUDGET,
  campaignTotal,
  getCampaigns,
  remainingBudget,
  totalSpent,
  type CampaignSend
} from '@/data/outreachCampaigns'

interface Props {
  open: boolean
  onToggle: () => void
  offerId: string
  /** Bump to force a re-render after a new send is recorded. */
  refreshKey?: number
}

const fmt = (n: number) => `$${n.toLocaleString()}`

export function SelectedPatientsPullTab({ open, onToggle, offerId, refreshKey: _refreshKey }: Props) {
  const campaigns = getCampaigns(offerId)
  const spent     = totalSpent()
  const remaining = remainingBudget()
  const pct       = Math.min(100, Math.round((spent / AGENCY_BUDGET) * 100))
  const barColor  =
    pct >= 80 ? 'bg-red-10'   :
    pct >= 50 ? 'bg-gold-10'  :
                'bg-green-10'

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={onToggle}
          className="fixed right-0 top-[180px] z-30 bg-charcoal-white border border-charcoal-5 border-r-0 rounded-l-lg shadow-pop px-2 py-3 hover:bg-charcoal-1"
          style={{ writingMode: 'vertical-rl' }}
          aria-label="Open outreach cost history"
        >
          <span className="text-[12px] font-semibold text-charcoal-14 rotate-180">
            ◀ Outreach Cost History
          </span>
        </button>
      )}

      {open && (
        <>
          <div className="fixed inset-0 z-30 bg-charcoal-black/20" onClick={onToggle} />
          <aside className="fixed right-0 top-0 bottom-0 z-40 w-[480px] bg-charcoal-white border-l border-charcoal-4 shadow-pop flex flex-col">
            <div className="flex items-center justify-between px-5 h-[52px] border-b border-charcoal-4 shrink-0">
              <h3 className="text-[14px] font-semibold text-charcoal-18">Outreach Cost History</h3>
              <button
                type="button"
                onClick={onToggle}
                className="text-charcoal-12 hover:text-charcoal-15 text-[18px] leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Budget visual */}
            <div className="px-5 pt-5 pb-4 border-b border-charcoal-3 shrink-0">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[12px] font-medium text-charcoal-12 uppercase tracking-wide">Agency budget</span>
                <span className="text-[12px] text-charcoal-14">
                  <span className="font-semibold text-charcoal-18">{fmt(spent)}</span>
                  <span className="text-charcoal-11"> of </span>
                  <span className="text-charcoal-15">{fmt(AGENCY_BUDGET)}</span>
                </span>
              </div>
              <div className="h-2 rounded-full bg-charcoal-2 overflow-hidden">
                <div
                  className={`h-full ${barColor} transition-all duration-300`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-charcoal-12">
                <span>{pct}% used</span>
                <span><span className="font-semibold text-charcoal-15">{fmt(remaining)}</span> remaining</span>
              </div>
            </div>

            {/* Send history */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {campaigns.length === 0 ? (
                <div className="h-full flex items-center justify-center text-center text-[13px] text-charcoal-12 border border-dashed border-charcoal-4 rounded-md py-10 px-4">
                  No campaigns sent yet for this care option. Sends will appear here, newest first.
                </div>
              ) : (
                <ul className="flex flex-col gap-3">
                  {campaigns.map(c => <CampaignRow key={c.id} c={c} />)}
                </ul>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  )
}

function CampaignRow({ c }: { c: CampaignSend }) {
  const total = c.fullCount + c.partialCount
  const grand = campaignTotal(c)
  return (
    <li className="border border-charcoal-4 rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-charcoal-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-charcoal-12">Sent</span>
          <span className="text-[12px] text-charcoal-15">{c.sentAtLabel}</span>
        </div>
        <span className="text-[13px] font-semibold text-blue-14">{fmt(grand)}</span>
      </div>
      <table className="w-full border-collapse text-[12px]">
        <tbody>
          <tr className="border-t border-charcoal-2">
            <td className="px-3 py-1.5 text-charcoal-14">Full match</td>
            <td className="px-3 py-1.5 text-center text-charcoal-15">{c.fullCount}</td>
            <td className="px-3 py-1.5 text-right text-charcoal-14">{fmt(c.costPerEmail)}</td>
            <td className="px-3 py-1.5 text-right text-charcoal-18">{fmt(c.fullCount * c.costPerEmail)}</td>
          </tr>
          <tr className="border-t border-charcoal-2">
            <td className="px-3 py-1.5 text-charcoal-14">Partial Match</td>
            <td className="px-3 py-1.5 text-center text-charcoal-15">{c.partialCount}</td>
            <td className="px-3 py-1.5 text-right text-charcoal-14">{fmt(c.costPerEmail)}</td>
            <td className="px-3 py-1.5 text-right text-charcoal-18">{fmt(c.partialCount * c.costPerEmail)}</td>
          </tr>
          <tr className="border-t border-charcoal-3 bg-charcoal-1">
            <td className="px-3 py-1.5 font-semibold text-charcoal-18">Total</td>
            <td className="px-3 py-1.5 text-center font-semibold text-charcoal-18">{total}</td>
            <td className="px-3 py-1.5 text-right text-charcoal-12">—</td>
            <td className="px-3 py-1.5 text-right font-bold text-blue-14">{fmt(grand)}</td>
          </tr>
        </tbody>
      </table>
    </li>
  )
}
