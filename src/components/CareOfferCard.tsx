import type { KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import type { CareOffer } from '@/data/mockCareOffers'
import { StatusBadge } from '@/components/StatusBadge'

export function CareOfferCard({
  offer,
  linkTo = 'setup'
}: {
  offer: CareOffer
  linkTo?: 'setup' | 'outreach'
}) {
  const router = useRouter()

  const accentColor =
    offer.status === 'active'        ? 'border-l-green-10'   :
    offer.status === 'inMlrReview'   ? 'border-l-gold-10'    :
    offer.status === 'inDesign'      ? 'border-l-charcoal-7' :
    offer.status === 'inactive'      ? 'border-l-charcoal-7' :
    offer.status === 'rejectedByMlr' ? 'border-l-red-10'     :
                                       'border-l-charcoal-18'

  const handleOpen = () => {
    router.push(`/${linkTo}?offer=${offer.id}`)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleOpen()
    }
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKeyDown}
      className={`bg-charcoal-white border border-charcoal-2 border-l-4 ${accentColor} rounded-lg px-5 py-4 shadow-card hover:shadow-pop transition-shadow cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-10 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-1`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold text-charcoal-18">{offer.title}</h3>

          <div className="mt-1 flex items-center flex-wrap gap-x-2 gap-y-1 text-[13px] text-charcoal-14">
            <span className="text-blue-10 font-medium">{offer.internalId}</span>
            <span className="text-charcoal-7">·</span>
            <span>{offer.sponsorShort}</span>
          </div>

          <p className="mt-2 text-[13px] leading-snug text-charcoal-15 max-w-3xl">
            {offer.description}
          </p>

          {offer.offerKind === 'clinical_trial' ? (
            <div className="mt-2 flex items-center flex-wrap gap-x-2 gap-y-1 text-[12px] text-charcoal-14">
              {offer.phase && <span>{offer.phase}</span>}
              {offer.sites !== undefined && (
                <>
                  {offer.phase && <span className="text-charcoal-7">·</span>}
                  <span>{offer.sites} sites</span>
                </>
              )}
              {offer.enrollmentComplete && (
                <>
                  <span className="text-charcoal-7">·</span>
                  <span>Enrollment complete</span>
                </>
              )}
              <span className="text-charcoal-7">·</span>
              <span>{offer.updatedLabel}</span>
            </div>
          ) : (
            <div className="mt-2 flex items-center flex-wrap gap-x-2 gap-y-1 text-[12px] text-charcoal-14">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-green-4 text-green-14 bg-charcoal-white text-[11px] font-medium">
                Approved Treatment
              </span>
              <span className="text-charcoal-7">·</span>
              <span className="text-violet-10 font-medium">Advertising Offer</span>
              <span className="text-charcoal-7">·</span>
              <span className="font-medium text-charcoal-15">{offer.matchesToDate.toLocaleString()} matches to date</span>
              <span className="text-charcoal-7">·</span>
              <span>{offer.updatedLabel}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {offer.isNew && <StatusBadge status="new" />}
          <StatusBadge status={offer.status} />
        </div>
      </div>
    </article>
  )
}
