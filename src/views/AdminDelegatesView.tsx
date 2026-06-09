'use client'

import { useState } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import {
  DISPLAY_COLUMNS,
  DISPLAY_ROLES,
  FOOTNOTES,
  type DisplayCell
} from '@/data/permissionsDisplay'

interface Delegate {
  id: string
  name: string
  email: string
  roleId: string
  invitedAt: string
  status: 'Active' | 'Invited'
}

const SEED_DELEGATES: Delegate[] = [
  { id: 'd1', name: 'Dr. Rosalind Mendez', email: 'rosalind_mendez@curex.com', roleId: 'mlr',           invitedAt: 'Aug 12, 2025', status: 'Active' },
  { id: 'd2', name: 'Priya Shah',          email: 'priya_shah@curex.com',       roleId: 'sponsor_admin', invitedAt: 'Jul 4, 2025',  status: 'Active' },
  { id: 'd3', name: 'Marcus Lee',          email: 'marcus.lee@brightreach.com', roleId: 'agency',        invitedAt: 'Sep 1, 2025',  status: 'Active' },
  { id: 'd4', name: 'Dr. Aiden Rao',       email: 'aiden_rao@curex.com',        roleId: 'clinical',      invitedAt: 'Sep 18, 2025', status: 'Invited' }
]

export default function AdminDelegatesView() {
  const [delegates, setDelegates] = useState<Delegate[]>(SEED_DELEGATES)
  const [email, setEmail]   = useState('')
  const [name, setName]     = useState('')
  const [roleId, setRoleId] = useState<string>(DISPLAY_ROLES[0].id)

  const canInvite = email.trim().length > 0 && name.trim().length > 0

  const onInvite = () => {
    if (!canInvite) return
    setDelegates(prev => [
      ...prev,
      {
        id: `d${prev.length + 1}`,
        name: name.trim(),
        email: email.trim(),
        roleId,
        invitedAt: 'Just now',
        status: 'Invited'
      }
    ])
    setName('')
    setEmail('')
  }

  const onRemove = (id: string) =>
    setDelegates(prev => prev.filter(d => d.id !== id))

  return (
    <AdminShell>
      <div className="max-w-[1100px]">
        <h1 className="text-[24px] font-semibold text-charcoal-18 leading-tight">Delegates</h1>
        <p className="text-[13px] text-charcoal-14 mt-1">
          Invite people from your team and partners to roles. Permissions for each role are set by Resonata and listed below for reference.
        </p>

        {/* Invite form */}
        <div className="mt-6 bg-charcoal-white border border-charcoal-4 rounded-lg p-5 shadow-card">
          <h2 className="text-[14px] font-semibold text-charcoal-15 mb-3">Invite a delegate</h2>
          <div className="grid grid-cols-[1fr_1fr_220px_auto] gap-3 items-end">
            <div>
              <label className="text-[11px] font-medium text-charcoal-12">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jane Doe"
                className="mt-1 w-full bg-charcoal-white border border-charcoal-6 rounded-md px-[11px] py-[7px] text-[13px] text-charcoal-18 focus:outline-none focus:border-blue-10"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-charcoal-12">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jane.doe@…"
                className="mt-1 w-full bg-charcoal-white border border-charcoal-6 rounded-md px-[11px] py-[7px] text-[13px] text-charcoal-18 focus:outline-none focus:border-blue-10"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-charcoal-12">Role</label>
              <select
                value={roleId}
                onChange={e => setRoleId(e.target.value)}
                className="mt-1 w-full bg-charcoal-white border border-charcoal-6 rounded-md px-[11px] py-[7px] text-[13px] text-charcoal-18 focus:outline-none focus:border-blue-10"
              >
                {DISPLAY_ROLES.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={onInvite}
              disabled={!canInvite}
              className="bg-green-12 hover:bg-green-13 disabled:opacity-50 disabled:cursor-not-allowed text-charcoal-white text-[13px] font-medium rounded-md px-5 py-[10px]"
            >
              Send invite
            </button>
          </div>
        </div>

        {/* Delegates list */}
        <div className="mt-6 bg-charcoal-white border border-charcoal-4 rounded-lg overflow-hidden shadow-card">
          <div className="bg-charcoal-1 border-b border-charcoal-4 px-4 py-3 flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-charcoal-15">
              People with access ({delegates.length})
            </h2>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left text-[11px] font-semibold text-charcoal-12 uppercase">
                <th className="px-4 py-2 border-b border-charcoal-4">Name</th>
                <th className="px-4 py-2 border-b border-charcoal-4">Email</th>
                <th className="px-4 py-2 border-b border-charcoal-4">Role</th>
                <th className="px-4 py-2 border-b border-charcoal-4">Invited</th>
                <th className="px-4 py-2 border-b border-charcoal-4">Status</th>
                <th className="px-4 py-2 border-b border-charcoal-4 w-[80px]" />
              </tr>
            </thead>
            <tbody>
              {delegates.map(d => {
                const roleLabel = DISPLAY_ROLES.find(r => r.id === d.roleId)?.label ?? d.roleId
                return (
                  <tr key={d.id} className="border-b border-charcoal-2 hover:bg-charcoal-1">
                    <td className="px-4 py-3 text-[13px] text-charcoal-18">{d.name}</td>
                    <td className="px-4 py-3 text-[13px] text-charcoal-15">{d.email}</td>
                    <td className="px-4 py-3 text-[13px] text-charcoal-15">{roleLabel}</td>
                    <td className="px-4 py-3 text-[12px] text-charcoal-12">{d.invitedAt}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          d.status === 'Active'
                            ? 'bg-green-2 text-green-14 border border-green-4'
                            : 'bg-gold-2 text-gold-14 border border-gold-5'
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onRemove(d.id)}
                        className="text-[12px] text-charcoal-12 hover:text-red-13"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Role permissions reference */}
        <div className="mt-10">
          <h2 className="text-[18px] font-semibold text-charcoal-18">Role permissions</h2>
          <p className="text-[13px] text-charcoal-14 mt-1">
            Read-only reference. Permissions are managed by Resonata and not editable in this release.
          </p>

          <div className="mt-4 bg-charcoal-white border border-charcoal-4 rounded-lg overflow-x-auto shadow-card">
            <table className="w-full border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-charcoal-1">
                  <th className="text-left text-[11px] font-semibold text-charcoal-12 uppercase border-b-2 border-charcoal-4 px-3 py-3 w-[200px] sticky left-0 bg-charcoal-1">
                    Role
                  </th>
                  {DISPLAY_COLUMNS.map(c => (
                    <th key={c} className="text-left text-[11px] font-semibold text-charcoal-12 uppercase border-b-2 border-charcoal-4 px-3 py-3 align-bottom min-w-[110px]">
                      <div className="leading-tight">{c}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DISPLAY_ROLES.map(row => (
                  <tr key={row.id} className="border-b border-charcoal-2">
                    <td className="px-3 py-3 text-[13px] font-medium text-charcoal-18 align-top sticky left-0 bg-charcoal-white">
                      {row.label}
                    </td>
                    {row.cells.map((cell, i) => (
                      <td key={i} className="px-3 py-3 align-top">
                        <CellPill cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {FOOTNOTES.length > 0 && (
            <div className="mt-2 text-[11px] text-charcoal-12 leading-relaxed">
              {FOOTNOTES.map((f, i) => <div key={i}>{f}</div>)}
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  )
}

function CellPill({ cell }: { cell: DisplayCell }) {
  if (cell.level === 'blank') {
    return <span className="text-[13px] text-charcoal-10">—</span>
  }

  if (cell.level === 'custom') {
    return (
      <span className="inline-block text-[12px] text-charcoal-15 leading-snug whitespace-pre-line">
        {cell.text}
      </span>
    )
  }

  const label =
    cell.level === 'yes' ? (cell.text ?? `Yes${cell.asterisk ? '*' : ''}`) :
    cell.level === 'view' ? (cell.text ?? 'View only') :
    /* no */ (cell.text ?? 'No')

  const cls =
    cell.level === 'yes'  ? 'bg-green-2 text-green-14 border border-green-5' :
    cell.level === 'view' ? 'bg-blue-1  text-blue-13  border border-blue-3'  :
                            'bg-charcoal-1 text-charcoal-12 border border-charcoal-4'

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${cls}`}>
      {label}
    </span>
  )
}
