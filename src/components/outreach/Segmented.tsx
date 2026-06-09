'use client'

import type { Artifact } from '@/data/outreachContent'

const OPTS: { id: Artifact; label: string }[] = [
  { id: 'email', label: 'Email' },
  { id: 'card', label: 'Sponsor Card' },
  { id: 'details', label: 'Details page' }
]

export function Segmented({
  active,
  onChange,
  disabled
}: {
  active: Artifact
  onChange: (a: Artifact) => void
  disabled?: boolean
}) {
  return (
    <div className="inline-flex bg-charcoal-white border border-charcoal-5 rounded-md p-1 gap-1">
      {OPTS.map(o => {
        const isActive = o.id === active
        return (
          <button
            key={o.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(o.id)}
            className={`px-4 py-2 rounded text-[13px] transition-colors disabled:cursor-default ${
              isActive
                ? 'bg-charcoal-2 text-charcoal-18 font-semibold'
                : 'text-charcoal-12 hover:text-charcoal-15'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
