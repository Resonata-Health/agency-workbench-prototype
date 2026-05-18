'use client'

import { useState } from 'react'
import type { Artifact } from '@/data/outreachContent'
import { templateOptions } from '@/data/outreachContent'

interface Props {
  artifact: Artifact
  current: string
  disabled?: boolean
  onPick: (template: string) => void
  onBlank: () => void
  onSaveAsTemplate: () => void
}

export function TemplatesBar({ artifact, current, disabled, onPick, onBlank, onSaveAsTemplate }: Props) {
  const [open, setOpen] = useState(false)
  const opts = templateOptions[artifact]

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-charcoal-1 border-b border-charcoal-4">
      <span className="text-[12px] text-charcoal-12">Template:</span>

      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen(o => !o)}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-charcoal-white border border-charcoal-5 rounded-md text-[12px] font-semibold text-charcoal-18 hover:border-charcoal-7 disabled:cursor-default"
        >
          <span className="w-[7px] h-[7px] rounded-full bg-green-12" />
          {current}
          <span className="text-charcoal-11">▾</span>
        </button>

        {open && !disabled && (
          <div className="absolute left-0 mt-1 w-72 bg-charcoal-white border border-charcoal-5 rounded-md shadow-pop py-1 z-20">
            {opts.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => { setOpen(false); onPick(t) }}
                className={`w-full text-left px-3 py-2 text-[12px] hover:bg-charcoal-1 ${
                  t === current ? 'text-blue-10 font-medium' : 'text-charcoal-15'
                }`}
              >
                {t}
                {t === current && <span className="ml-2">✓</span>}
              </button>
            ))}
            <div className="my-1 border-t border-charcoal-3" />
            <button
              type="button"
              onClick={() => { setOpen(false); onBlank() }}
              className="w-full text-left px-3 py-2 text-[12px] text-charcoal-15 hover:bg-charcoal-1"
            >
              + New from blank
            </button>
            <button
              type="button"
              onClick={() => { setOpen(false); onSaveAsTemplate() }}
              className="w-full text-left px-3 py-2 text-[12px] text-charcoal-15 hover:bg-charcoal-1"
            >
              + Save current as template
            </button>
          </div>
        )}
      </div>

      <span className="text-[11px] text-charcoal-11">
        {opts.length - 1} more · default pre-selected
      </span>
    </div>
  )
}
