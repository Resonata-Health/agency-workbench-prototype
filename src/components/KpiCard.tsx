interface Props {
  label: string
  value: string | number
  caption?: string
  accent?: 'default' | 'blue' | 'green' | 'gold' | 'red'
}

const accentText: Record<NonNullable<Props['accent']>, string> = {
  default: 'text-charcoal-15',
  blue:    'text-blue-10',
  green:   'text-green-14',
  gold:    'text-gold-14',
  red:     'text-red-10'
}

export function KpiCard({ label, value, caption, accent = 'default' }: Props) {
  return (
    <div className="flex-1 bg-charcoal-white border border-charcoal-2 rounded-lg px-4 py-3 shadow-card">
      <div className={`text-[12px] font-medium uppercase tracking-wide ${accentText[accent]}`}>{label}</div>
      <div className="mt-1 text-[26px] font-semibold text-charcoal-18 leading-tight">{value}</div>
      {caption && <div className="text-[12px] text-charcoal-14 mt-0.5">{caption}</div>}
    </div>
  )
}
