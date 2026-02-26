import { useState } from 'react'
import { useJobs } from '../../context/JobContext'
import { COLUMNS, COLUMN_MAP } from '../../utils/constants'
import { formatDate, daysSince, daysLabel } from '../../utils/helpers'
import { ArrowUpDown, Calendar, Clock, MapPin, Table2 } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

const WORK_TYPE_ICONS = { remote: '🌍', onsite: '🏢', hybrid: '🔄' }

export default function TableView({ onCardClick }) {
  const { allJobs, editJob } = useJobs()
  const { t, colLabel } = useI18n()
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
      className={`flex items-center gap-1 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 transition-colors hover:text-white ${className}`}
    >
      {children}
      <ArrowUpDown className={`h-3 w-3 ${sortField === field ? 'text-yellow-400' : 'text-neutral-700'}`} />
    </button>
  )

  if (allJobs.length === 0) {
    return (
      <div className="view-transition flex flex-1 items-center justify-center">
        <div className="text-center">
          <Table2 className="mx-auto h-12 w-12 text-neutral-700" />
          <p className="mt-3 text-sm text-neutral-500">{t('noApplicationsYet')}</p>
          <p className="mt-1 text-xs text-neutral-600">{t('addFirstJob')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="view-transition flex-1 overflow-y-auto px-8 py-6 md:px-12">
      {/* Filter bar */}
      <div className="mb-6 flex items-center gap-4 flex-wrap">
        <span className="text-xs font-medium text-neutral-500">{t('filter')}:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-neutral-800 text-yellow-400'
                : 'text-neutral-500 hover:bg-neutral-900 hover:text-neutral-300'
            }`}
          >
            {t('all')} ({allJobs.length})
          </button>
          {COLUMNS.map(col => {
            const count = allJobs.filter(j => j.status === col.id).length
            if (count === 0) return null
            return (
              <button
                key={col.id}
                onClick={() => setFilterStatus(col.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  filterStatus === col.id
                    ? 'text-white'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
                style={filterStatus === col.id ? { backgroundColor: `${col.color}20`, color: col.color } : {}}
              >
                {colLabel(col.id)} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-white/[0.06] md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.02]">
              <th className="px-8 py-5"><SortHeader field="company">{t('company')}</SortHeader></th>
              <th className="px-8 py-5"><SortHeader field="position">{t('position')}</SortHeader></th>
              <th className="px-8 py-5"><SortHeader field="status">{t('status')}</SortHeader></th>
              <th className="px-8 py-5">{t('workType')}</th>
              <th className="px-8 py-5"><SortHeader field="dateApplied">{t('dateApplied')}</SortHeader></th>
              <th className="px-8 py-5"><SortHeader field="daysApplied">{t('daysSinceApplied')}</SortHeader></th>
              <th className="px-8 py-5"><SortHeader field="daysInCol">{t('inStage')}</SortHeader></th>
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
                  className="cursor-pointer border-b border-white/[0.04] transition-colors hover:bg-white/[0.04]"
                >
                  <td className="px-8 py-5">
                    <span className="text-[15px] font-bold text-white">{job.company}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-neutral-300">{job.position || '—'}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="relative" onClick={e => e.stopPropagation()}>
                      <select
                        value={job.status}
                        onChange={e => handleStatusChange(job, e.target.value)}
                        className="appearance-none rounded-full border-0 py-1.5 pl-4 pr-8 text-[13px] font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        style={{
                          backgroundColor: `${col?.color}15`,
                          color: col?.color,
                        }}
                      >
                        {COLUMNS.map(c => (
                          <option key={c.id} value={c.id}>{colLabel(c.id)}</option>
                        ))}
                      </select>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-[13px] font-medium text-neutral-400">
                      {job.workType ? `${WORK_TYPE_ICONS[job.workType]} ${t(job.workType)}` : '—'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-2 text-[13px] font-medium text-neutral-400">
                      <Calendar className="h-4 w-4 text-neutral-500" />
                      {formatDate(job.dateApplied)}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="flex items-center gap-2 text-[13px] font-medium text-neutral-400">
                      <Clock className="h-4 w-4 text-neutral-500" />
                      {daysLabel(applied)}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`flex items-center gap-2 text-[13px] font-bold ${
                        inCol >= 14 ? 'text-red-400' : inCol >= 7 ? 'text-amber-400' : 'text-neutral-400'
                      }`}
                    >
                      <MapPin className="h-4 w-4" />
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
      <div className="space-y-4 md:hidden">
        {sorted.map(job => {
          const col = COLUMN_MAP[job.status]
          const applied = daysSince(job.dateApplied)
          const inCol = daysSince(job.statusChangedAt)
          return (
            <div
              key={job.id}
              onClick={() => onCardClick(job)}
              className="cursor-pointer rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all hover:border-white/[0.12]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">{job.company}</h3>
                  {job.position && <p className="text-xs text-neutral-400">{job.position}</p>}
                </div>
                <span
                  className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ backgroundColor: `${col?.color}15`, color: col?.color }}
                >
                  {colLabel(job.status)}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-neutral-500">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(job.dateApplied)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {daysLabel(applied)}
                </span>
                {job.workType && (
                  <span>{WORK_TYPE_ICONS[job.workType]} {t(job.workType)}</span>
                )}
                {inCol > 0 && (
                  <span className={`flex items-center gap-1 font-medium ${
                    inCol >= 14 ? 'text-red-400' : inCol >= 7 ? 'text-amber-400' : ''
                  }`}>
                    <MapPin className="h-3 w-3" />
                    {daysLabel(inCol)}
                  </span>
                )}
              </div>
              {job.salary && <p className="mt-2 text-xs font-medium text-green-400">{job.salary}</p>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
