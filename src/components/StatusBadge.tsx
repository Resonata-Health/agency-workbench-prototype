import type { OfferStatus } from '@/data/mockCareOffers'

const map: Record<OfferStatus | 'new', { label: string; className: string }> = {
  active:        { label: 'Active',          className: 'bg-green-2 text-green-14 border border-green-4' },
  inMlrReview:   { label: 'In MLR Review',   className: 'bg-gold-2 text-gold-14 border border-gold-5' },
  inDesign:      { label: 'Draft',           className: 'bg-charcoal-2 text-charcoal-14 border border-charcoal-5' },
  inactive:      { label: 'Inactive',        className: 'bg-charcoal-2 text-charcoal-14 border border-charcoal-5' },
  deactivated:   { label: 'Deactivated',     className: 'bg-charcoal-white text-charcoal-18 border border-charcoal-18' },
  rejectedByMlr: { label: 'Rejected by MLR', className: 'bg-red-1 text-red-14 border border-red-5' },
  new:           { label: 'NEW',             className: 'bg-gold-10 text-charcoal-18 border border-gold-10' }
}

export function StatusBadge({ status }: { status: OfferStatus | 'new' }) {
  const v = map[status]
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide ${v.className}`}
    >
      {v.label}
    </span>
  )
}
