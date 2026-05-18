'use client'

import type { ReactNode } from 'react'

/** Visual rich-text toolbar. Controls are spec-only (not wired) for this prototype. */
export function RtToolbar({ extra }: { extra?: ReactNode }) {
  const marks = ['B', 'I', 'U', 'S']
  const blocks = ['H1', 'H2', '¶', '•', '1.', '❝', '🔗', '{ }']

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 border-b border-charcoal-4 bg-charcoal-1">
      {marks.map(m => (
        <button
          key={m}
          type="button"
          className="w-7 h-7 rounded border border-charcoal-5 bg-charcoal-white text-[12px] text-charcoal-14 hover:bg-charcoal-2"
          style={{
            fontWeight: m === 'B' ? 700 : 500,
            fontStyle: m === 'I' ? 'italic' : 'normal',
            textDecoration: m === 'U' ? 'underline' : m === 'S' ? 'line-through' : 'none'
          }}
        >
          {m}
        </button>
      ))}
      <span className="w-px h-4 bg-charcoal-5 mx-1" />
      {blocks.map(b => (
        <button
          key={b}
          type="button"
          className="h-7 px-2 rounded border border-charcoal-5 bg-charcoal-white text-[11px] text-charcoal-14 hover:bg-charcoal-2"
        >
          {b}
        </button>
      ))}
      <span className="w-px h-4 bg-charcoal-5 mx-1" />
      <button
        type="button"
        className="h-7 px-2 rounded border border-charcoal-5 bg-charcoal-white text-[11px] text-charcoal-14 hover:bg-charcoal-2"
      >
        Insert ▾
      </button>
      {extra && <div className="ml-auto flex items-center gap-1.5">{extra}</div>}
    </div>
  )
}
