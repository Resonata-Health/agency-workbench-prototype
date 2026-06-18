'use client'

import { Fragment } from 'react'
import { TopNav } from '@/components/TopNav'
import { CONTAINER } from '@/components/container'
import { usePermissions } from '@/app/providers'
import { CAPABILITIES, ROLES } from '@/data/permissions'

const GROUPS = ['Setup', 'Matches', 'Outreach', 'Admin'] as const

export default function AdminPermissionsView() {
  const { matrix, setMatrixCell, resetMatrix, can } = usePermissions()

  const allowed = can('manage_permissions')

  return (
    <div className="min-h-screen bg-charcoal-1">
      <TopNav />

      <main className={`${CONTAINER} py-8`}>
        <div className="flex items-end justify-between mb-6 gap-4">
          <div>
            <h1 className="text-[26px] font-semibold text-charcoal-18 leading-tight">
              Permissions
            </h1>
            <p className="text-[14px] text-charcoal-14 mt-1">
              Define what each role can do. Toggle a cell, then switch persona in the top nav to see the effect.
            </p>
          </div>
          <button
            type="button"
            onClick={resetMatrix}
            disabled={!allowed}
            className="border border-charcoal-5 hover:bg-charcoal-1 text-[13px] text-charcoal-15 rounded-md px-4 py-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset to defaults
          </button>
        </div>

        {!allowed && (
          <div className="bg-gold-1 border border-gold-5 rounded-md p-3 mb-4 text-[13px] text-charcoal-15">
            You&apos;re viewing this page without the <code className="text-[12px] bg-charcoal-1 px-1 py-0.5 rounded">manage_permissions</code> capability.
            Cells are read-only — switch to a persona that has it (e.g. Sponsor) to edit.
          </div>
        )}

        <div className="bg-charcoal-white border border-charcoal-4 rounded-lg overflow-hidden shadow-card">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-charcoal-1">
                <th className="text-left text-[12px] font-semibold text-charcoal-12 uppercase border-b-2 border-charcoal-4 px-4 py-3 w-[320px]">
                  Capability
                </th>
                {ROLES.map(r => (
                  <th
                    key={r.id}
                    className="text-center text-[12px] font-semibold text-charcoal-12 border-b-2 border-charcoal-4 px-4 py-3"
                    title={r.description}
                  >
                    {r.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {GROUPS.map(group => {
                const caps = CAPABILITIES.filter(c => c.group === group)
                if (caps.length === 0) return null
                return (
                  <Fragment key={group}>
                    <tr>
                      <td
                        colSpan={1 + ROLES.length}
                        className="bg-blue-1 text-blue-14 text-[11px] uppercase font-semibold tracking-wide px-4 py-1.5"
                      >
                        {group}
                      </td>
                    </tr>
                    {caps.map(cap => (
                      <tr key={cap.id} className="border-b border-charcoal-2 hover:bg-charcoal-1">
                        <td className="px-4 py-3 align-top text-[13px] text-charcoal-15">
                          <div className="font-medium">{cap.label}</div>
                          {cap.description && (
                            <div className="text-[11px] text-charcoal-12 mt-0.5">{cap.description}</div>
                          )}
                          <div className="text-[10px] text-charcoal-10 mt-1 font-mono">{cap.id}</div>
                        </td>
                        {ROLES.map(role => (
                          <td key={role.id} className="px-4 py-3 text-center align-top">
                            <input
                              type="checkbox"
                              aria-label={`${role.label} – ${cap.label}`}
                              checked={Boolean(matrix[role.id]?.[cap.id])}
                              onChange={e => setMatrixCell(role.id, cap.id, e.target.checked)}
                              disabled={!allowed}
                              className="size-4 rounded-[2.5px] border border-charcoal-12 accent-blue-10 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        <p className="text-[12px] text-charcoal-12 mt-3">
          Changes persist in your browser only. Use Reset to restore defaults.
        </p>
      </main>
    </div>
  )
}
