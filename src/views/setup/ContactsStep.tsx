'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CONTAINER } from '@/components/container'
import type { CareOffer } from '@/data/mockCareOffers'
import {
  CONTACTS,
  DEFAULT_SITES,
  SITES,
  SITE_CONTACTS,
  type SetupSite,
  type SiteRecord
} from '@/data/mockSetupContacts'
import { setOfferStatus } from '@/data/offerStatusOverrides'
import { getEmDirty, setEmDirty } from '@/data/emDirty'
import { ConfirmDialog } from '@/components/outreach/ConfirmDialog'

// Offer Contact section hidden for now (validations off with it). Kept in JSX behind this flag.
const SHOW_OFFER_CONTACT = false

export function ContactsStep({ offer }: { offer: CareOffer }) {
  const router = useRouter()
  const [contactId, setContactId] = useState(CONTACTS[0].id)
  const [sites, setSites] = useState<SetupSite[]>(DEFAULT_SITES)
  const [showOverwrite, setShowOverwrite] = useState(false)
  const [showAddSite, setShowAddSite] = useState(false)

  const contact = CONTACTS.find(c => c.id === contactId) ?? CONTACTS[0]
  const existingSiteIds = useMemo(() => new Set(sites.map(s => s.siteId)), [sites])

  const updateSite = (id: string, patch: Partial<SetupSite>) =>
    setSites(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)))
  const removeSite = (id: string) =>
    setSites(prev => prev.filter(s => s.id !== id))
  const addRows = (rows: SetupSite[]) => {
    setSites(prev => [...prev, ...rows])
    setShowAddSite(false)
  }

  const goPrev = () => router.push(`/setup?offer=${offer.id}&step=criteria`)
  const doComplete = () => {
    // "Complete Setup and Activate" — flips the offer to Active and lands on Matches.
    setEmDirty(offer.id, false)
    setOfferStatus(offer.id, 'active')
    router.push(`/matches?offer=${offer.id}`)
  }
  const completeSetup = () => {
    // Warn before activating if the eligibility matrix was edited this session.
    if (getEmDirty(offer.id)) { setShowOverwrite(true); return }
    doComplete()
  }

  return (
    <>
      <div className="bg-charcoal-white rounded-lg shadow-card p-6">
        <button
          type="button"
          onClick={goPrev}
          className="text-[13px] text-blue-12 hover:underline mb-3"
        >
          ← Back
        </button>

        <div className="flex items-baseline justify-between">
          <h2 className="text-[20px] font-semibold text-charcoal-18">Enrollment Sites</h2>
          <span className="text-[12px] text-charcoal-11">{offer.updatedLabel}</span>
        </div>

        {/* Offer Contact */}
        {SHOW_OFFER_CONTACT && (
        <section className="mt-6">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-semibold text-charcoal-15">Offer Contact</h3>
            <span className="bg-red-1 text-red-13 text-[10px] uppercase font-semibold px-2 py-0.5 rounded">
              Required
            </span>
          </div>
          <p className="text-[12px] text-charcoal-12 mt-1">
            Primary contact for questions about this offer
          </p>

          <div className="mt-4 grid grid-cols-[280px_1fr] gap-6">
            <div>
              <label className="text-[11px] font-medium text-charcoal-12">Select Contact</label>
              <select
                value={contactId}
                onChange={e => setContactId(e.target.value)}
                className="mt-1 w-full bg-charcoal-white border border-charcoal-6 rounded-md px-[11px] py-[7px] text-[13px] text-charcoal-18 focus:outline-none focus:border-blue-10"
              >
                {CONTACTS.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="bg-charcoal-1 border border-charcoal-4 rounded-md p-4">
              <div className="text-[14px] font-semibold text-charcoal-18">{contact.name}</div>
              <div className="text-[13px] text-charcoal-14 mt-0.5">{contact.department}</div>
              <div className="text-[13px] text-charcoal-15 mt-2">Phone: {contact.phone}</div>
              <div className="text-[13px] text-charcoal-15">Email: {contact.email}</div>
            </div>
          </div>
        </section>
        )}

        {/* Enrollment Sites */}
        <section className="mt-6">
          <p className="text-[12px] text-charcoal-12 mt-1">
            Sites are only required for location-based clinical trials. For centralized enrollment, leave this section blank.
          </p>

          <div className="mt-4 border border-charcoal-4 rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-charcoal-1">
                <tr className="text-left text-[11px] font-semibold text-charcoal-12 uppercase">
                  <th className="px-3 py-2 border-b border-charcoal-4 w-[44px] text-center">
                    <input type="checkbox" className="size-4 rounded-[2.5px] border border-charcoal-12 accent-blue-10" />
                  </th>
                  <th className="px-3 py-2 border-b border-charcoal-4">Site</th>
                  <th className="px-3 py-2 border-b border-charcoal-4">Location</th>
                  <th className="px-3 py-2 border-b border-charcoal-4">Enroller</th>
                  <th className="px-3 py-2 border-b border-charcoal-4">Email</th>
                  <th className="px-3 py-2 border-b border-charcoal-4">Phone</th>
                  <th className="px-3 py-2 border-b border-charcoal-4">Status</th>
                  <th className="px-3 py-2 border-b border-charcoal-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {sites.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-3 py-6 text-center text-[13px] text-charcoal-11">
                      No sites added yet.
                    </td>
                  </tr>
                )}
                {sites.map(s => (
                  <tr key={s.id} className="border-b border-charcoal-2">
                    <td className="px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={s.selected}
                        onChange={e => updateSite(s.id, { selected: e.target.checked })}
                        className="size-4 rounded-[2.5px] border border-charcoal-12 accent-blue-10"
                      />
                    </td>
                    <td className="px-3 py-2 text-[13px] text-charcoal-18">{s.siteName}</td>
                    <td className="px-3 py-2 text-[13px] text-charcoal-15">{s.location || '—'}</td>
                    <td className="px-3 py-2 text-[13px] text-charcoal-15">{s.enroller || '—'}</td>
                    <td className="px-3 py-2 text-[13px] text-blue-12">{s.email || '—'}</td>
                    <td className="px-3 py-2 text-[13px] text-charcoal-15">{s.phone || '—'}</td>
                    <td className="px-3 py-2">
                      <StatusPill status={s.status} />
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => removeSite(s.id)}
                        className="border border-charcoal-5 hover:bg-charcoal-1 text-[12px] text-charcoal-15 rounded-md px-3 py-1"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={() => setShowAddSite(true)}
            className="mt-3 border border-charcoal-5 hover:bg-charcoal-1 text-[13px] text-blue-12 rounded-md px-3 py-1.5"
          >
            + Add Site
          </button>
        </section>
      </div>

      <div className={`${CONTAINER} flex justify-between items-center pt-6`}>
        <button
          type="button"
          onClick={goPrev}
          className="px-4 py-2 rounded-md border border-charcoal-5 text-[13px] text-charcoal-15 hover:bg-charcoal-1"
        >
          Previous: Criteria
        </button>
        <button
          type="button"
          onClick={completeSetup}
          className="px-5 py-2 rounded-md bg-green-12 hover:bg-green-13 text-charcoal-white text-[13px] font-medium"
        >
          Complete Setup and Activate
        </button>
      </div>

      {showOverwrite && (
        <ConfirmDialog
          title="Overwrite the existing eligibility matrix?"
          body="You have made changes to the eligibility matrix for this care option. This will overwrite the previous matrix. Do you want to proceed?"
          confirmLabel="Yes, proceed"
          destructive
          onConfirm={doComplete}
          onCancel={() => setShowOverwrite(false)}
        />
      )}

      {showAddSite && (
        <AddSiteDialog
          existingSiteIds={existingSiteIds}
          onCancel={() => setShowAddSite(false)}
          onConfirm={addRows}
        />
      )}
    </>
  )
}

/* ---------- Status pill ---------- */

function StatusPill({ status }: { status: string }) {
  const approved = status.toLowerCase() === 'approved'
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
        approved
          ? 'bg-green-2 text-green-14 border border-green-5'
          : 'bg-charcoal-2 text-charcoal-14 border border-charcoal-5'
      }`}
    >
      {status}
    </span>
  )
}

/* ---------- Add Site dialog ---------- */

function AddSiteDialog({
  existingSiteIds,
  onCancel,
  onConfirm
}: {
  existingSiteIds: Set<string>
  onCancel: () => void
  onConfirm: (rows: SetupSite[]) => void
}) {
  const [query, setQuery] = useState('')
  const [site, setSite] = useState<SiteRecord | null>(null)
  const [picked, setPicked] = useState<Set<string>>(new Set())

  // Manual contact entry (status is Approved by default; edit comes later).
  const [first, setFirst] = useState('')
  const [last, setLast] = useState('')
  const [email, setEmail] = useState('')
  const [emailEdited, setEmailEdited] = useState(false)
  const [phone, setPhone] = useState('')

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return SITES.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.id.includes(q) ||
      s.city.toLowerCase().includes(q) ||
      (s.synonyms?.toLowerCase().includes(q) ?? false)
    ).slice(0, 6)
  }, [query])

  const alreadyAdded = !!site && existingSiteIds.has(site.id)
  const orgContacts = useMemo(
    () => (site ? SITE_CONTACTS.filter(c => c.org === site.name) : []),
    [site]
  )

  // Derived manual email until the user edits it.
  const derivedEmail =
    site && first.trim() && last.trim()
      ? `${first.trim().toLowerCase()}.${last.trim().toLowerCase()}@${site.domain}`
      : ''
  const manualEmail = emailEdited ? email : derivedEmail
  const manualValid = !!site && first.trim().length > 0 && last.trim().length > 0

  const togglePick = (id: string) =>
    setPicked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const chooseSite = (s: SiteRecord) => {
    setSite(s)
    setQuery('')
    setPicked(new Set())
  }
  const clearSite = () => {
    setSite(null)
    setPicked(new Set())
    setFirst(''); setLast(''); setEmail(''); setEmailEdited(false); setPhone('')
  }

  const canAdd = !!site && !alreadyAdded && (picked.size > 0 || manualValid)

  const handleAdd = () => {
    if (!site || alreadyAdded) return
    const location = `${site.city}, ${site.state}`
    const rows: SetupSite[] = []
    orgContacts.filter(c => picked.has(c.id)).forEach(c => {
      rows.push({
        id: `row-${site.id}-${c.id}-${rows.length}`,
        siteId: site.id,
        siteName: site.name,
        location,
        enroller: `${c.firstName} ${c.lastName}`,
        email: c.email,
        phone: c.phone,
        status: c.status,
        selected: true
      })
    })
    if (manualValid) {
      rows.push({
        id: `row-${site.id}-manual-${rows.length}`,
        siteId: site.id,
        siteName: site.name,
        location,
        enroller: `${first.trim()} ${last.trim()}`,
        email: manualEmail,
        phone: phone.trim(),
        status: 'Approved',
        selected: true
      })
    }
    if (rows.length) onConfirm(rows)
  }

  const fieldCls =
    'w-full bg-charcoal-white border border-charcoal-5 rounded-md px-2.5 py-1.5 text-[13px] text-charcoal-18 focus:outline-none focus:border-blue-10'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-black/40 px-4">
      <div className="w-full max-w-[560px] bg-charcoal-white rounded-lg shadow-pop p-6 max-h-[88vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[16px] font-semibold text-charcoal-18">Add Enrollment Site</h3>
          <button type="button" onClick={onCancel} className="text-charcoal-12 hover:text-charcoal-15 text-[18px] leading-none" aria-label="Close">×</button>
        </div>

        {/* Step 1 — site search */}
        <label className="block text-[11px] font-medium uppercase tracking-wide text-charcoal-12 mt-4 mb-1.5">Site</label>
        {!site ? (
          <div>
            <input
              type="text"
              value={query}
              autoFocus
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by site name, ID, or city"
              className={fieldCls}
            />
            {matches.length > 0 && (
              <div className="mt-1 w-full bg-charcoal-white border border-charcoal-4 rounded-md overflow-y-auto max-h-[220px]">
                {matches.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => chooseSite(s)}
                    className="block w-full text-left px-3 py-2 hover:bg-blue-1"
                  >
                    <div className="text-[13px] text-charcoal-18">{s.name}</div>
                    <div className="text-[11.5px] text-charcoal-11">{s.city}, {s.state} · {s.zip} · ID {s.id}</div>
                  </button>
                ))}
              </div>
            )}
            {query.trim() && matches.length === 0 && (
              <div className="mt-1 text-[12px] text-charcoal-11">No matching sites. Add the contact manually below after picking a site.</div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3 border border-charcoal-4 rounded-md px-3 py-2">
            <div>
              <div className="text-[13px] font-medium text-charcoal-18">{site.name}</div>
              <div className="text-[11.5px] text-charcoal-11">{site.city}, {site.state} · {site.zip} · ID {site.id}</div>
            </div>
            <button type="button" onClick={clearSite} className="text-[12px] text-blue-12 hover:underline shrink-0">Change</button>
          </div>
        )}

        {alreadyAdded && (
          <div className="mt-2 text-[12px] text-red-13">Site already added</div>
        )}

        {/* Step 2 — contacts for the org */}
        {site && !alreadyAdded && (
          <>
            <div className="mt-5">
              <div className="text-[11px] font-medium uppercase tracking-wide text-charcoal-12 mb-1.5">
                Contacts at this site
              </div>
              {orgContacts.length === 0 ? (
                <div className="text-[12px] text-charcoal-11">No contacts on file. Add one below.</div>
              ) : (
                <div className="border border-charcoal-4 rounded-md divide-y divide-charcoal-3 max-h-[200px] overflow-y-auto">
                  {orgContacts.map(c => (
                    <label key={c.id} className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-charcoal-1">
                      <input
                        type="checkbox"
                        checked={picked.has(c.id)}
                        onChange={() => togglePick(c.id)}
                        className="size-4 rounded-[2.5px] border border-charcoal-12 accent-blue-10"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-[13px] text-charcoal-18">{c.firstName} {c.lastName}</div>
                        <div className="text-[11.5px] text-charcoal-11 truncate">{c.email} · {c.phone}</div>
                      </div>
                      <StatusPill status={c.status} />
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Manual entry */}
            <div className="mt-5">
              <div className="text-[11px] font-medium uppercase tracking-wide text-charcoal-12 mb-1.5">
                Or add a new contact
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <input value={first} onChange={e => setFirst(e.target.value)} placeholder="First name" className={fieldCls} />
                <input value={last} onChange={e => setLast(e.target.value)} placeholder="Last name" className={fieldCls} />
                <input
                  value={manualEmail}
                  onChange={e => { setEmail(e.target.value); setEmailEdited(true) }}
                  placeholder="Email"
                  className={fieldCls}
                />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone" className={fieldCls} />
              </div>
              <div className="mt-2 flex items-center gap-2 text-[12px] text-charcoal-12">
                Status: <StatusPill status="Approved" />
              </div>
            </div>
          </>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border border-charcoal-5 text-[13px] text-charcoal-15 hover:bg-charcoal-1">Cancel</button>
          <button
            type="button"
            disabled={!canAdd}
            onClick={handleAdd}
            className="px-4 py-2 rounded-md bg-green-12 hover:bg-green-13 text-charcoal-white text-[13px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add to Sites
          </button>
        </div>
      </div>
    </div>
  )
}
