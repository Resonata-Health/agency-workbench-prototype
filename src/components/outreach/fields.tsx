'use client'

import { useEffect, useRef } from 'react'

const editableBase =
  'bg-transparent outline-none focus:outline-none border border-dashed border-charcoal-6 focus:border-blue-10 rounded-[4px] px-1.5 py-1 transition-colors'

interface TextProps {
  value: string
  onChange: (v: string) => void
  className?: string
  placeholder?: string
  disabled?: boolean
  ariaLabel?: string
  /** Size the field to its content (used for CTA button labels). */
  autoWidth?: boolean
}

/** Single-line editable region (dashed outline = editable). */
export function EditText({ value, onChange, className = '', placeholder, disabled, ariaLabel, autoWidth }: TextProps) {
  return (
    <input
      type="text"
      aria-label={ariaLabel}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      size={autoWidth ? Math.max(value.length + 1, 8) : undefined}
      onChange={e => onChange(e.target.value)}
      className={`${editableBase} disabled:border-transparent disabled:cursor-default ${
        autoWidth ? 'w-auto inline-block' : 'w-full'
      } ${className}`}
    />
  )
}

/** Multi-line auto-growing editable region. */
export function EditArea({ value, onChange, className = '', placeholder, disabled, ariaLabel }: TextProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])
  return (
    <textarea
      ref={ref}
      aria-label={ariaLabel}
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      rows={1}
      onChange={e => onChange(e.target.value)}
      className={`${editableBase} w-full resize-none overflow-hidden leading-relaxed disabled:border-transparent disabled:cursor-default ${className}`}
    />
  )
}

/** Read-only value inherited from the offer. Lock icon on hover. */
export function Locked({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      title="Set on the offer · edit in Setup"
      className={`group relative inline-flex items-center gap-1 cursor-default ${className}`}
    >
      {children}
      <svg
        width="11" height="11" viewBox="0 0 24 24" fill="none"
        className="opacity-0 group-hover:opacity-60 transition-opacity shrink-0"
        aria-hidden
      >
        <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
      </svg>
    </span>
  )
}
