'use client'

interface Props {
  open: boolean
  onToggle: () => void
  patientCount: number
  costLabel: string
}

/** Right-edge pull tab + empty drawer. Drawer contents are out of scope this iteration. */
export function SelectedPatientsPullTab({ open, onToggle, patientCount, costLabel }: Props) {
  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={onToggle}
          className="fixed right-0 top-[180px] z-30 bg-charcoal-white border border-charcoal-5 border-r-0 rounded-l-lg shadow-pop px-2 py-3 hover:bg-charcoal-1"
          style={{ writingMode: 'vertical-rl' }}
          aria-label="Open selected patients and cost"
        >
          <span className="text-[12px] font-semibold text-charcoal-14 rotate-180">
            ◀ {patientCount} patients · {costLabel}
          </span>
        </button>
      )}

      {open && (
        <>
          <div className="fixed inset-0 z-30 bg-charcoal-black/20" onClick={onToggle} />
          <aside className="fixed right-0 top-0 bottom-0 z-40 w-[400px] bg-charcoal-white border-l border-charcoal-4 shadow-pop flex flex-col">
            <div className="flex items-center justify-between px-5 h-[52px] border-b border-charcoal-4">
              <h3 className="text-[14px] font-semibold text-charcoal-18">Selected Patients &amp; Cost</h3>
              <button
                type="button"
                onClick={onToggle}
                className="text-charcoal-12 hover:text-charcoal-15 text-[18px] leading-none"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center text-center px-6">
              <div>
                <p className="text-[13px] font-medium text-charcoal-15">
                  {patientCount} patients selected · {costLabel}
                </p>
                <p className="text-[12px] text-charcoal-12 mt-1">
                  Recipient list and cost breakdown coming in a later iteration.
                </p>
              </div>
            </div>
          </aside>
        </>
      )}
    </>
  )
}
