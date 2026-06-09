'use client'

export type SetupStep = 'overview' | 'criteria' | 'contacts'

const STEPS: { id: SetupStep; label: string; n: number }[] = [
  { id: 'overview', label: 'Overview', n: 1 },
  { id: 'criteria', label: 'Criteria', n: 2 },
  { id: 'contacts', label: 'Contacts', n: 3 }
]

export function SetupStepper({ current }: { current: SetupStep }) {
  const currentIndex = STEPS.findIndex(s => s.id === current)

  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {STEPS.map((s, i) => {
        const status: 'done' | 'active' | 'future' =
          i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'future'

        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`size-9 rounded-full flex items-center justify-center text-[14px] font-semibold ${
                  status === 'done'
                    ? 'bg-blue-10 text-charcoal-white'
                    : status === 'active'
                      ? 'bg-blue-10 text-charcoal-white ring-4 ring-blue-2'
                      : 'bg-charcoal-2 text-charcoal-12'
                }`}
              >
                {status === 'done' ? '✓' : s.n}
              </div>
              <div className={`mt-1 text-[12px] ${
                status === 'future' ? 'text-charcoal-12' : 'text-charcoal-15 font-medium'
              }`}>
                {s.label}
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-[2px] w-[180px] mx-2 mb-5 ${
                  i < currentIndex ? 'bg-blue-10' : 'bg-charcoal-4'
                }`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
