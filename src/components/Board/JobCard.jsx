import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { Calendar, Clock, ExternalLink, MapPin, Globe, Building2, ArrowLeftRight, ChevronDown, Target } from 'lucide-react'
import { calculateActiveDays, daysSince, formatDateShort, daysLabel, formatSalary, formatRelativeTime } from '../../utils/helpers'
import { COLUMNS, COLUMN_MAP, FINAL_STATUSES } from '../../utils/constants'
import { useI18n } from '../../context/I18nContext'
import { useJobs } from '../../context/JobContext'

const WORK_TYPE_ICONS = {
  remote: '🌍',
  onsite: '🏢',
  hybrid: '🔄',
}

const JobCard = React.memo(function JobCard({ job, index, onClick }) {
  const { t, colLabel } = useI18n()
  const { editJob } = useJobs()
  const isFinalState = FINAL_STATUSES.includes(job.status)
  const daysApplied = calculateActiveDays(job)
  const daysInCol = isFinalState ? 0 : daysSince(job.statusChangedAt)
  const colMeta = COLUMN_MAP[job.status]

  const handleStatusChange = (e) => {
    e.stopPropagation()
    const newStatus = e.target.value
    if (newStatus !== job.status) {
      editJob(job.id, { status: newStatus })
    }
  }

  return (
    <Draggable draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(job)}
          style={{
            ...provided.draggableProps.style,
            transform: snapshot.isDragging 
              ? `${provided.draggableProps.style?.transform || ''} rotate(2deg) scale(1.05)` 
              : provided.draggableProps.style?.transform,
          }}
          className={`group cursor-pointer rounded-2xl border border-white/[0.08] bg-neutral-900/80 p-6 transition-[border-color,background-color] duration-200 hover:border-white/[0.15] hover:bg-neutral-800 ${
            snapshot.isDragging 
              ? 'z-[9999] shadow-2xl shadow-yellow-400/20 ring-2 ring-yellow-400/30 bg-neutral-800 border-white/20' 
              : 'shadow-lg'
          }`}
        >
          {/* Status color strip */}
          <div
            className="mb-3 h-1 w-12 rounded-full"
            style={{ backgroundColor: colMeta?.color || '#FFD700' }}
          />

          {/* Position & Company - SWAPPED as requested */}
          <div className="mb-4 text-left">
            <h3 className="text-[17px] font-bold text-white leading-tight">{job.position || 'Unknown Role'}</h3>
            {job.company && (
              <p className="mt-1 text-sm font-medium text-[var(--color-primary-yellow)] leading-snug">{job.company}</p>
            )}
            {job.notes && (
              <p className="mt-2 text-[11px] text-neutral-500 leading-relaxed line-clamp-2">{job.notes}</p>
            )}
          </div>

          {/* Salary + Work Type row */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            {job.salary && (
              <span className="text-[13px] font-semibold text-green-400 bg-green-400/10 px-2.5 py-1 rounded-lg flex-shrink-0">{formatSalary(job.salary)}</span>
            )}
            {job.workType && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-400">
                {job.workType === 'remote' && <Globe className="h-3.5 w-3.5 text-cyan-400" />}
                {job.workType === 'onsite' && <Building2 className="h-3.5 w-3.5 text-orange-400" />}
                {job.workType === 'hybrid' && <ArrowLeftRight className="h-3.5 w-3.5 text-purple-400" />}
                <span className="capitalize">{t(job.workType)}</span>
              </span>
            )}
            {job.location && (job.workType === 'onsite' || job.workType === 'hybrid') && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                📍 {job.location}
              </span>
            )}
          </div>

          {/* Offer info for offered status */}
          {job.status === 'offered' && job.finalOffer && (
            <div className="mb-5 rounded-xl border border-green-500/20 bg-green-500/[0.05] p-4 text-left">
              <p className="text-xs font-bold text-green-400">💰 {t('finalOffer')}: {formatSalary(job.finalOffer)}</p>
            </div>
          )}

          {/* JFP badge */}
          {job.jobFitPercentage != null && job.jobFitPercentage !== '' && (
            <div className={`mb-4 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold ${
              job.jobFitPercentage < 80
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-green-500/10 text-green-400 border border-green-500/20'
            }`}>
              <Target className="h-3.5 w-3.5" />
              JFP: {job.jobFitPercentage}%
            </div>
          )}

          {/* Meta badges */}
          <div className="flex flex-wrap items-center gap-2.5 border-t border-white/[0.06] pt-5">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-800/50 px-3 py-1.5 text-xs font-medium text-neutral-300">
              <Calendar className="h-3.5 w-3.5 text-neutral-500" />
              Applied {formatDateShort(job.dateApplied)}
            </span>

            <span className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-800/50 px-3 py-1.5 text-xs font-medium text-neutral-300">
              <Clock className="h-3.5 w-3.5 text-neutral-500" />
              {formatRelativeTime(job.dateApplied)}
            </span>

            {daysInCol > 0 && (
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold ${
                  daysInCol >= 14
                    ? 'bg-red-500/15 text-red-400'
                    : daysInCol >= 7
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-neutral-800/50 text-neutral-300'
                }`}
              >
                <MapPin className="h-3.5 w-3.5" />
                {daysLabel(daysInCol)} {t('daysHere', { days: '' }).trim()}
              </span>
            )}
          </div>

          {/* Quick status switcher — visible on hover */}
          <div
            className={`mt-4 transition-all duration-200 ${snapshot.isDragging ? 'opacity-0' : 'group-hover:opacity-100 opacity-0'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <select
                value={job.status}
                onChange={handleStatusChange}
                className="w-full appearance-none rounded-xl border-0 py-2.5 pl-4 pr-10 text-[13px] font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-colors"
                style={{
                  backgroundColor: `${colMeta?.color}15`,
                  color: colMeta?.color,
                }}
              >
                {COLUMNS.map(c => (
                  <option key={c.id} value={c.id}>{colLabel(c.id)}</option>
                ))}
              </select>
              <ArrowLeftRight
                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
                style={{ color: colMeta?.color }}
              />
            </div>
          </div>

        </div>
      )}
    </Draggable>
  )
})

export default JobCard;
