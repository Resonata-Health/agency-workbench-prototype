interface Props {
  statusFilter: string
  onStatusChange: (v: string) => void
}

export function FilterBar({ statusFilter, onStatusChange }: Props) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Select label="Status" value={statusFilter} onChange={onStatusChange} options={['All', 'Active', 'In MLR Review', 'In Design', 'Inactive', 'Deactivated']} />
      </div>
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 rounded-md border border-charcoal-5 bg-charcoal-white text-[13px] text-charcoal-15 hover:bg-charcoal-1">
          Filter
        </button>
        <button className="px-3 py-1.5 rounded-md border border-charcoal-5 bg-charcoal-white text-[13px] text-charcoal-15 hover:bg-charcoal-1">
          Export
        </button>
      </div>
    </div>
  )
}

function Select({
  label, value, onChange, options
}: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="inline-flex items-center gap-1.5 text-[13px] text-charcoal-15">
      <span className="text-charcoal-12">{label}:</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="bg-charcoal-white border border-charcoal-5 rounded-md px-2 py-1.5 pr-7 text-[13px] text-charcoal-18 focus:outline-none focus:border-blue-10"
      >
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </label>
  )
}
