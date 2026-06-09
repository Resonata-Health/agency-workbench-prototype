'use client'

import { useEffect, useRef, useState } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { getStoredLogo, setStoredLogo } from '@/data/logoStore'

export default function AdminBrandingView() {
  const fileInput = useRef<HTMLInputElement | null>(null)
  const [logo, setLogo] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)

  useEffect(() => {
    setLogo(getStoredLogo())
  }, [])

  const onPick = () => fileInput.current?.click()

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setLogo(reader.result as string)
      setDirty(true)
    }
    reader.readAsDataURL(file)
  }

  const onSave = () => {
    setStoredLogo(logo)
    setSavedAt(new Date())
    setDirty(false)
  }

  const onRemove = () => {
    setLogo(null)
    setStoredLogo(null)
    setSavedAt(new Date())
    setDirty(false)
  }

  return (
    <AdminShell>
      <div className="max-w-[760px]">
        <h1 className="text-[24px] font-semibold text-charcoal-18 leading-tight">Branding</h1>
        <p className="text-[13px] text-charcoal-14 mt-1">
          Upload your sponsor logo. Once saved, it appears next to the profile avatar in the top nav.
        </p>

        <div className="mt-6 bg-charcoal-white border border-charcoal-4 rounded-lg p-6 shadow-card">
          <h2 className="text-[14px] font-semibold text-charcoal-15 mb-4">Sponsor logo</h2>

          <div className="flex items-start gap-6">
            <div className="w-[160px] h-[160px] border border-dashed border-charcoal-6 rounded-md flex items-center justify-center bg-charcoal-1 overflow-hidden shrink-0">
              {logo ? (
                <img src={logo} alt="Sponsor logo" className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="text-[12px] text-charcoal-12 text-center px-3">
                  No logo uploaded
                </span>
              )}
            </div>

            <div className="flex-1">
              <p className="text-[13px] text-charcoal-15">
                Recommended: a square PNG or SVG with a transparent background, at least 128×128px.
                Keep visual weight light — the logo renders small (24px) in the top nav.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onPick}
                  className="bg-green-12 hover:bg-green-13 text-charcoal-white text-[13px] font-medium rounded-md px-4 py-2"
                >
                  {logo ? 'Replace logo…' : 'Choose file…'}
                </button>
                {logo && (
                  <button
                    type="button"
                    onClick={onRemove}
                    className="border border-charcoal-5 text-[13px] text-charcoal-15 hover:bg-charcoal-1 rounded-md px-4 py-2"
                  >
                    Remove
                  </button>
                )}
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={onFile}
                  className="hidden"
                />
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onSave}
                  disabled={!dirty}
                  className="bg-blue-10 hover:bg-blue-12 disabled:opacity-40 disabled:cursor-not-allowed text-charcoal-white text-[13px] font-medium rounded-md px-5 py-2"
                >
                  Save
                </button>
                {savedAt && !dirty && (
                  <span className="text-[12px] text-green-14">✓ Saved</span>
                )}
                {dirty && (
                  <span className="text-[12px] text-charcoal-12">Unsaved changes</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
