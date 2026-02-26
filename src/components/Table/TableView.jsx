import { useState } from 'react'
import { useJobs } from '../../context/JobContext'
import { COLUMNS, COLUMN_MAP } from '../../utils/constants'
import { formatDate, daysSince, daysLabel } from '../../utils/helpers'
import { ArrowUpDown, Calendar, Clock, MapPin, ChevronDown, Table2 } from 'lucide-react'

export default function TableView({ onCardClick }) {
  const { allJobs, editJob } = useJobs()
  const [sortField, setSortField] = useState('dateApplied')
  const [sortDir, setSortDir] = useState('desc')
  const [filterStatus, setFilterStatus] = useState('all')

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  let filtered = filterStatus === 'all'
    ? allJobs
    : allJobs.filter(j => j.status === filterStatus)

  const sorted = [...filtered].sort((a, b) => {
    let valA, valB
    switch (sortField) {
      case 'company': valA = a.company.toLowerCase(); valB = b.company.toLowerCase(); break
      case 'position': valA = (a.position || '').toLowerCase(); valB = (b.position || '').toLowerCase(); break
      case 'status': valA = a.status; valB = b.status; break
      case 'dateApplied': valA = new Date(a.dateApplied || 0); valB = new Date(b.dateApplied || 0); break
      case 'daysApplied': valA = daysSince(a.dateApplied); valB = daysSince(b.dateApplied); break
      case 'daysInCol': valA = daysSince(a.statusChangedAt); valB = daysSince(b.statusChangedAt); break
      default: valA = 0; valB = 0;
    }
    if (valA < valB) return sortDir === 'asc' ? -1 : 1
    if (valA > valB) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const handleStatusChange = (job, newStatus) => {
    editJob(job.id, { status: newStatus })
  }

  const SortHeader = ({ field, children, className = '' }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`flex items-center gap-1 text-left text-xs font-semibold uppercase tracking-wider text-slate-400 transition-colors hover:text-white ${className}`}
    >
      {children}
      <ArrowUpDown className={`h-3 w-3 ${sortField === field ? 'text-violet-400' : 'text-slate-600'}`} />
    </button>
  )

  if (allJobs.length === 0) {
    return (
      <div className="view-transition flex flex-1 items-center justify-center">
        <div className="text-center">
          <Table2 className="mx-auto h-12 w-12 text-slate-600" />
          <p className="mt-3 text-sm text-slate-500">No applications yet</p>
          <p className="mt-1 text-xs text-slate-600">Add your first job to see the table</p>
        </div>
      </div>
    )
  }

  return (
    <div className="view-transition flex-1 overflow-y-auto px-4 py-4 md:px-6">
      {/* Filter bar */}
      <div className="mb-4 flex items-center gap-3">
        <span className="text-xs font-medium text-slate-400">Filter:</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setFilterStatus('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-300'
            }`}
          >
            All ({allJobs.length})
          </button>
          {COLUMNS.map(col => {
            const count = allJobs.filter(j => j.status === col.id).length
            if (count === 0) return null
            return (
              <button
                key={col.id}
                onClick={() => setFilterStatus(col.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                  filterStatus === col.id
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
                style={filterStatus === col.id ? { backgroundColor: `${col.color}30`, color: col.color } : {}}
              >
                {col.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-700/50 md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-800/60">
              <th className="px-4 py-3"><SortHeader field="company">Company</SortHeader></th>
              <th className="px-4 py-3"><SortHeader field="position">Position</SortHeader></th>
              <th className="px-4 py-3"><SortHeader field="status">Status</SortHeader></th>
              <th className="px-4 py-3"><SortHeader field="dateApplied">Applied</SortHeader></th>
              <th className="px-4 py-3"><SortHeader field="daysApplied">Days Since</SortHeader></th>
              <th className="px-4 py-3"><SortHeader field="daysInCol">In Stage</SortHeader></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(job => {
              const col = COLUMN_MAP[job.status]
              const applied = daysSince(job.dateApplied)
              const inCol = daysSince(job.statusChangedAt)
              return (
                <tr
                  key={job.id}
                  onClick={() => onCardClick(job)}
                  className="cursor-pointer border-b border-slate-700/30 transition-colors hover:bg-slate-800/60"
                >
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-white">{job.company}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-300">{job.position || '—'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative" onClick={e => e.stopPropagation()}>
                      <select
                        value={job.status}
                        onChange={e => handleStatusChange(job, e.target.value)}
                        className="appearance-none rounded-full border-0 py-1 pl-3 pr-7 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500"
                        style={{
                          backgroundColor: `${col?.color}20`,
                          color: col?.color,
                        }}
                      >
                        {COLUMNS.map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="h-3 w-3" />
                      {formatDate(job.dateApplied)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      {daysLabel(applied)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`flex items-center gap-1 text-xs font-medium ${
                        inCol >= 14 ? 'text-red-400' : inCol >= 7 ? 'text-amber-400' : 'text-slate-400'
                      }`}
                    >
                      <MapPin className="h-3 w-3" />
                      {daysLabel(inCol)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="space-y-3 md:hidden">
        {sorted.map(job => {
          const col = COLUMN_MAP[job.status]
          const applied = daysSince(job.dateApplied)
          const inCol = daysSince(job.statusChangedAt)
          return (
            <div
              key={job.id}
              onClick={() => onCardClick(job)}
              className="cursor-pointer rounded-xl border border-slate-700/50 bg-slate-800/60 p-4 transition-all hover:border-slate-600"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">{job.company}</h3>
                  {job.position && <p className="text-xs text-slate-400">{job.position}</p>}
                </div>
                <span
                  className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ backgroundColor: `${col?.color}20`, color: col?.color }}
                >
                  {col?.label}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(job.dateApplied)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {daysLabel(applied)} since applied
                </span>
                {inCol > 0 && (
                  <span
                    className={`flex items-center gap-1 font-medium ${
                      inCol >= 14 ? 'text-red-400' : inCol >= 7 ? 'text-amber-400' : ''
                    }`}
                  >
                    <MapPin className="h-3 w-3" />
                    {daysLabel(inCol)} in stage
                  </span>
                )}
              </div>
              {job.salary && <p className="mt-2 text-xs font-medium text-emerald-400">{job.salary}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
