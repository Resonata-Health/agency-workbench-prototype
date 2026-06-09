'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { TopNav } from '@/components/TopNav'
import { WorkbenchTabs } from '@/components/WorkbenchTabs'
import { findOffer, setupFieldsFor, type SponsorName } from '@/data/mockCareOffers'
import { getOfferStatus, setOfferStatus } from '@/data/offerStatusOverrides'
import { addRejectionMessage, getRejectionMessages } from '@/data/rejectionMessages'
import { CONTAINER } from '@/components/container'
import { usePermissions } from '@/app/providers'
import {
  seedDrafts,
  blankDrafts,
  inheritedFor,
  defaultTemplate,
  artifactHint,
  type Artifact,
  type OutreachDrafts,
  type EmailDraft,
  type DetailsDraft
} from '@/data/outreachContent'
import { Segmented } from '@/components/outreach/Segmented'
import { TemplatesBar } from '@/components/outreach/TemplatesBar'
import { EmailEditor } from '@/components/outreach/EmailEditor'
import { DetailsEditor } from '@/components/outreach/DetailsEditor'
import { PhonePreview } from '@/components/outreach/PhonePreview'
import { SelectedPatientsPullTab } from '@/components/outreach/SelectedPatientsPullTab'
import { ConfirmDialog } from '@/components/outreach/ConfirmDialog'
import { RejectDialog } from '@/components/outreach/RejectDialog'
import { MessagesDialog } from '@/components/outreach/MessagesDialog'

type DialogKind =
  | { kind: 'discard' }
  | { kind: 'submit' }
  | { kind: 'activate' }
  | { kind: 'replaceTemplate'; artifact: Artifact; template: string }
  | { kind: 'saveTemplate' }
  | { kind: 'approve' }
  | { kind: 'reject' }
  | { kind: 'viewMessages' }
  | null

export default function OutreachView() {
  const router = useRouter()
  const params = useSearchParams()
  const offer = useMemo(() => findOffer(params.get('offer')), [params])
  const fields = useMemo(() => setupFieldsFor(offer), [offer])
  const selectedCount = Math.max(0, Number(params.get('selected')) || 0)
  const meta = useMemo(
    () => ({ ...inheritedFor(offer), recipientCount: selectedCount }),
    [offer, selectedCount]
  )

  const [sponsor, setSponsor] = useState<SponsorName>(offer.sponsor as SponsorName)

  const viewParam = params.get('view')
  // Sponsor Card was removed from the agency flow — fall back to email if a stale URL lands here.
  const active: Artifact = viewParam === 'details' ? 'details' : 'email'

  const [drafts, setDrafts] = useState<OutreachDrafts>(() => seedDrafts(offer))
  const [dirty, setDirty] = useState(false)
  const [savedAt, setSavedAt] = useState<Date | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [dialog, setDialog] = useState<DialogKind>(null)
  const [busy, setBusy] = useState(false)

  const { can, persona } = usePermissions()
  const canEdit    = can('edit_outreach')
  const canSubmit  = can('submit_outreach')
  const canApprove = can('approve_outreach')
  const canReject  = can('reject_outreach')
  const readOnly = !canEdit
  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Live offer status (drives Approve/Reject visibility and the rejected-banner).
  const currentStatus = getOfferStatus(offer.id) ?? offer.status
  const inMlrReview   = currentStatus === 'inMlrReview'
  const wasRejected   = currentStatus === 'rejectedByMlr'
  const messages = getRejectionMessages(offer.id)

  // Sponsor-led clinical trials skip MLR review — they activate directly from outreach.
  const isClinicalTrial = offer.offerKind === 'clinical_trial'
  const sponsorClinicalTrial = persona === 'sponsor' && isClinicalTrial

  // Debounced autosave simulation
  useEffect(() => {
    if (!dirty || readOnly) return
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    autosaveTimer.current = setTimeout(() => setSavedAt(new Date()), 2000)
    return () => {
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current)
    }
  }, [drafts, dirty, readOnly])

  // Warn on unsaved navigation
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty && !readOnly) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', h)
    return () => window.removeEventListener('beforeunload', h)
  }, [dirty, readOnly])

  const setView = (a: Artifact) => {
    // Preserve all existing params (offer, selected, …) and only swap the view.
    const qs = new URLSearchParams(params.toString())
    qs.set('view', a)
    router.replace(`/outreach?${qs.toString()}`)
  }

  function patchActive<T>(patch: Partial<T>) {
    setDrafts(d => ({ ...d, [active]: { ...d[active], ...patch } }))
    setDirty(true)
  }

  const applyTemplate = (artifact: Artifact, template: string) => {
    const seeded = seedDrafts(offer)
    setDrafts(d => ({ ...d, [artifact]: { ...seeded[artifact], templateId: template } }))
    setDirty(true)
  }

  const newFromBlank = (artifact: Artifact) => {
    const blank = blankDrafts(offer)
    setDrafts(d => ({ ...d, [artifact]: blank[artifact] }))
    setDirty(true)
  }

  const onDiscard = () => {
    setDrafts(seedDrafts(offer))
    setDirty(false)
    setSavedAt(null)
    setDialog(null)
  }

  const onSubmit = () => {
    setBusy(true)
    setTimeout(() => {
      setOfferStatus(offer.id, 'inMlrReview')
      setBusy(false)
      setDialog(null)
      router.push('/')
    }, 1100)
  }

  const onActivate = () => {
    setBusy(true)
    setTimeout(() => {
      setOfferStatus(offer.id, 'active')
      setBusy(false)
      setDialog(null)
      router.push('/sponsor')
    }, 900)
  }

  const onApprove = () => {
    setBusy(true)
    setTimeout(() => {
      setOfferStatus(offer.id, 'active')
      setBusy(false)
      setDialog(null)
      router.push('/mlr')
    }, 900)
  }

  const onReject = (reason: string) => {
    setBusy(true)
    setTimeout(() => {
      addRejectionMessage(offer.id, reason)
      setOfferStatus(offer.id, 'rejectedByMlr')
      setBusy(false)
      setDialog(null)
      router.push('/mlr')
    }, 900)
  }

  const drugName = meta.drugName
  const savedLabel = savedAt
    ? 'Saved · just now'
    : dirty
      ? 'Unsaved changes'
      : 'All changes saved'

  return (
    <div className="min-h-screen bg-charcoal-1 flex flex-col">
      <TopNav activeSponsor={sponsor} onSponsorChange={setSponsor} />

      {/* Offer subheader */}
      <div className="bg-charcoal-white border-b border-charcoal-4">
        <div className={`${CONTAINER} h-[45px] flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <span className="text-[13px] font-semibold text-blue-12">{drugName}</span>
            <span className="text-[13px] text-charcoal-12">{fields.displayTitle}</span>
          </div>
          <span className="text-[12px] text-charcoal-11">{offer.updatedLabel}</span>
        </div>
      </div>

      <WorkbenchTabs active="Outreach" />

      <main className={`flex-1 ${CONTAINER} pt-4 pb-[72px]`}>
        <div className="flex flex-col h-full">
          {wasRejected && (
            <div className="mb-3 rounded-md border border-red-5 bg-red-1 px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-start gap-2">
                <span className="text-red-13 text-[14px] leading-none mt-0.5">⚠</span>
                <div>
                  <div className="text-[13px] font-semibold text-red-14">
                    This outreach was rejected by MLR
                  </div>
                  <div className="text-[12px] text-charcoal-14 mt-0.5">
                    Review the feedback, revise the content, and resubmit when ready.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDialog({ kind: 'viewMessages' })}
                className="shrink-0 px-3 py-1.5 rounded-md border border-red-7 text-[12px] font-medium text-red-13 hover:bg-red-2"
              >
                View MLR feedback
                {messages.length > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-10 text-charcoal-white text-[10px] font-semibold">
                    {messages.length}
                  </span>
                )}
              </button>
            </div>
          )}

          {/* Switcher + autosave indicator */}
          <div className="flex items-center justify-between mb-2">
            <Segmented active={active} onChange={setView} disabled={false} />
            <span className="text-[12px] text-charcoal-11">
              {readOnly ? 'Read-only · view permission only' : savedLabel}
            </span>
          </div>
          {artifactHint[active] && (
            <p className="text-[12px] text-charcoal-12 mb-3">{artifactHint[active]}</p>
          )}

          {/* Editor + phone preview */}
          <div className="flex-1 grid grid-cols-[1fr_320px] gap-4 min-h-[560px]">
            <div className="bg-charcoal-white border border-charcoal-4 rounded-lg overflow-hidden flex flex-col">
              <TemplatesBar
                artifact={active}
                current={drafts[active].templateId || defaultTemplate[active]}
                disabled={readOnly}
                onPick={t => setDialog({ kind: 'replaceTemplate', artifact: active, template: t })}
                onBlank={() => newFromBlank(active)}
                onSaveAsTemplate={() => setDialog({ kind: 'saveTemplate' })}
              />
              <div className="flex-1 overflow-hidden flex flex-col">
                {active === 'email' && (
                  <EmailEditor
                    draft={drafts.email}
                    meta={meta}
                    readOnly={readOnly}
                    showRecipients={currentStatus === 'active'}
                    update={(p: Partial<EmailDraft>) => patchActive<EmailDraft>(p)}
                    onOpenRecipients={() => setDrawerOpen(true)}
                  />
                )}
                {active === 'details' && (
                  <DetailsEditor
                    draft={drafts.details}
                    meta={meta}
                    readOnly={readOnly}
                    update={(p: Partial<DetailsDraft>) => patchActive<DetailsDraft>(p)}
                  />
                )}
              </div>
            </div>

            <div className="bg-charcoal-2 border border-charcoal-4 rounded-lg p-4 overflow-hidden">
              <PhonePreview artifact={active} drafts={drafts} meta={meta} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-charcoal-white border-t border-charcoal-4 py-3">
        <div className={`${CONTAINER} flex justify-end items-center gap-2.5`}>
          {canEdit && (
            <button
              type="button"
              onClick={() => setDialog({ kind: 'discard' })}
              className="px-4 py-2 rounded-md border border-charcoal-5 text-[13px] text-charcoal-15 hover:bg-charcoal-1"
            >
              Discard
            </button>
          )}
          {canSubmit && (
            <button
              type="button"
              onClick={() => setDialog({ kind: sponsorClinicalTrial ? 'activate' : 'submit' })}
              className="px-5 py-2 rounded-md bg-green-12 hover:bg-green-13 text-charcoal-white text-[13px] font-medium"
            >
              {sponsorClinicalTrial ? 'Activate Offer' : 'Submit for Sponsor Approval →'}
            </button>
          )}
          {canReject && inMlrReview && (
            <button
              type="button"
              onClick={() => setDialog({ kind: 'reject' })}
              className="px-4 py-2 rounded-md border border-red-7 text-[13px] text-red-13 hover:bg-red-1"
            >
              Reject
            </button>
          )}
          {canApprove && inMlrReview && (
            <button
              type="button"
              onClick={() => setDialog({ kind: 'approve' })}
              className="px-5 py-2 rounded-md bg-green-12 hover:bg-green-13 text-charcoal-white text-[13px] font-medium"
            >
              Approve ✓
            </button>
          )}
          {!canEdit && !canSubmit && !(canApprove && inMlrReview) && !(canReject && inMlrReview) && (
            <span className="text-[12px] text-charcoal-12">
              {wasRejected
                ? 'This was rejected. Resubmission rights are with the agency.'
                : 'No actions available for your role on this screen.'}
            </span>
          )}
        </div>
      </div>

      <SelectedPatientsPullTab
        open={drawerOpen}
        onToggle={() => setDrawerOpen(o => !o)}
        patientCount={meta.recipientCount}
        costLabel="$4.2k"
      />

      {dialog?.kind === 'discard' && (
        <ConfirmDialog
          title="Discard all unsaved changes?"
          body="This reverts the Email, Sponsor Card, and Details page back to their last saved state. This cannot be undone."
          confirmLabel="Discard changes"
          destructive
          onConfirm={onDiscard}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog?.kind === 'submit' && (
        <ConfirmDialog
          title="Submit for Sponsor Approval"
          body="This will submit your changes for review and approval by Sponsor's MLR team. You will not be able to make any edit until these changes are approved. Do you want to proceed?"
          confirmLabel="Yes, proceed"
          busy={busy}
          onConfirm={onSubmit}
          onCancel={() => (busy ? null : setDialog(null))}
        />
      )}
      {dialog?.kind === 'activate' && (
        <ConfirmDialog
          title="Activate this offer?"
          body="This will mark the offer Active and patient outreach can begin. As a sponsor-led clinical trial, no MLR review is required."
          confirmLabel="Yes, activate"
          busy={busy}
          onConfirm={onActivate}
          onCancel={() => (busy ? null : setDialog(null))}
        />
      )}
      {dialog?.kind === 'replaceTemplate' && (
        <ConfirmDialog
          title="Replace current draft with template?"
          body={`This replaces the ${dialog.artifact} draft with “${dialog.template}”. Your current edits to this artifact cannot be recovered.`}
          confirmLabel="Replace draft"
          destructive
          onConfirm={() => {
            applyTemplate(dialog.artifact, dialog.template)
            setDialog(null)
          }}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog?.kind === 'saveTemplate' && (
        <ConfirmDialog
          title="Save current as template"
          body="In production this opens a small form to name the template and choose its scope (private to the agency, or shared with the sponsor). Out of scope for this prototype."
          confirmLabel="Got it"
          onConfirm={() => setDialog(null)}
          onCancel={() => setDialog(null)}
        />
      )}
      {dialog?.kind === 'approve' && (
        <ConfirmDialog
          title="Approve this content"
          body="By approving this content, you are acknowledging that you have reviewed the content, Form 2253 has been submitted and patient outreach can begin."
          confirmLabel="Yes, approve"
          busy={busy}
          onConfirm={onApprove}
          onCancel={() => (busy ? null : setDialog(null))}
        />
      )}
      {dialog?.kind === 'reject' && (
        <RejectDialog
          busy={busy}
          onConfirm={onReject}
          onCancel={() => (busy ? null : setDialog(null))}
        />
      )}
      {dialog?.kind === 'viewMessages' && (
        <MessagesDialog
          messages={messages}
          onClose={() => setDialog(null)}
        />
      )}
    </div>
  )
}
