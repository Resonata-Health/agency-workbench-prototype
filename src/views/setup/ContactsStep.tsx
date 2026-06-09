'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CONTAINER } from '@/components/container'
import type { CareOffer } from '@/data/mockCareOffers'
import { CONTACTS, DEFAULT_SITES, type SetupSite } from '@/data/mockSetupContacts'

export function ContactsStep({ offer }: { offer: CareOffer }) {
  const router = useRouter()
  const [contactId, setContactId] = useState(CONTACTS[0].id)
  const [sites, setSites] = useState<SetupSite[]>(DEFAULT_SITES)

  const contact = CONTACTS.find(c => c.id === contactId) ?? CONTACTS[0]

  const updateSite = (id: string, patch: Partial<SetupSite>) =>
    setSites(prev => prev.map(s => (s.id === id ? { ...s, ...patch } : s)))
  const removeSite = (id: string) =>
    setSites(prev => prev.filter(s => s.id !== id))
  const addSite = () =>
    setSites(prev => [
      ...prev,
      {
        id: `s${Date.now()}`,
        siteName: '',
        location: '',
        enroller: '',
        availability: 'Not Yet Available',
        selected: false
      }
    ])

  const goPrev = () => router.push(`/setup?offer=${offer.id}&step=criteria`)
  const completeSetup = () => router.push(`/matches?offer=${offer.id}`)

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
          <h2 className="text-[20px] font-semibold text-charcoal-18">Manage Contacts</h2>
          <span className="text-[12px] text-charcoal-11">{offer.updatedLabel}</span>
        </div>

        {/* Offer Contact */}
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

        {/* Enrollment Sites */}
        <section className="mt-8">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-semibold text-charcoal-15">Enrollment Sites</h3>
            <span className="bg-charcoal-2 text-charcoal-14 text-[10px] uppercase font-semibold px-2 py-0.5 rounded">
              Optional
            </span>
          </div>
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
                  <th className="px-3 py-2 border-b border-charcoal-4">Site Name</th>
                  <th className="px-3 py-2 border-b border-charcoal-4">Location</th>
                  <th className="px-3 py-2 border-b border-charcoal-4">Enroller</th>
                  <th className="px-3 py-2 border-b border-charcoal-4">Availability</th>
                  <th className="px-3 py-2 border-b border-charcoal-4">Action</th>
                </tr>
              </thead>
              <tbody>
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
                    <td className="px-3 py-2">
                      <input
                        value={s.siteName}
                        onChange={e => updateSite(s.id, { siteName: e.target.value })}
                        className="w-full bg-charcoal-white border border-charcoal-5 rounded-md px-2 py-1 text-[13px] text-charcoal-18 focus:outline-none focus:border-blue-10"
                      />
                    </td>
                    <td className="px-3 py-2 text-[13px] text-charcoal-15">{s.location || '—'}</td>
                    <td className="px-3 py-2">
                      <input
                        value={s.enroller}
                        onChange={e => updateSite(s.id, { enroller: e.target.value })}
                        className="w-full bg-charcoal-white border border-charcoal-5 rounded-md px-2 py-1 text-[13px] text-charcoal-18 focus:outline-none focus:border-blue-10"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                          s.availability === 'Available'
                            ? 'bg-green-2 text-green-14 border border-green-5'
                            : 'bg-gold-2 text-gold-14 border border-gold-5'
                        }`}
                      >
                        {s.availability}
                      </span>
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
            onClick={addSite}
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
          Complete Setup
        </button>
      </div>
    </>
  )
}
