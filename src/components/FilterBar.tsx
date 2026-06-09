interface Props {
  statusFilter: string
  onStatusChange: (v: string) => void
}

const OPTIONS = ['All', 'Active', 'In MLR Review', 'In Design', 'Inactive', 'Deactivated']

export function FilterBar({ statusFilter, onStatusChange }: Props) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-charcoal-12 flex-wrap mb-4">
      <span>Show:</span>
      {OPTIONS.map(f => (
        <button
          key={f}
          onClick={() => onStatusChange(f)}
          className={`px-3 py-1 rounded-full border text-[12px] ${
            f === statusFilter
              ? 'border-blue-10 text-blue-12 bg-blue-1 font-medium'
              : 'border-charcoal-5 text-charcoal-14 hover:bg-charcoal-1'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
