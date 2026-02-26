import { Draggable } from '@hello-pangea/dnd'
import { Calendar, Clock, ExternalLink, MapPin, Globe, Building2, ArrowLeftRight } from 'lucide-react'
import { daysSince, formatDateShort, daysLabel } from '../../utils/helpers'
import { COLUMN_MAP } from '../../utils/constants'
import { useI18n } from '../../context/I18nContext'

const WORK_TYPE_ICONS = {
  remote: '🌍',
  onsite: '🏢',
  hybrid: '🔄',
}

export default function JobCard({ job, index, onClick }) {
  const { t } = useI18n()
  const daysApplied = daysSince(job.dateApplied)
  const daysInCol = daysSince(job.statusChangedAt)
  const colMeta = COLUMN_MAP[job.status]

  return (
    <Draggable draggableId={job.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => onClick(job)}
          className={`group cursor-pointer rounded-xl border border-white/[0.06] bg-neutral-900/80 p-3.5 transition-all hover:border-white/[0.12] ${
            snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl shadow-yellow-400/10 ring-2 ring-yellow-400/30' : ''
          }`}
        >
          {/* Status color strip */}
          <div
            className="mb-2.5 h-1 w-10 rounded-full"
            style={{ backgroundColor: colMeta?.color || '#FFD700' }}
          />

          {/* Company & Position */}
          <h3 className="text-sm font-semibold text-white leading-snug">{job.company}</h3>
          {job.position && (
            <p className="mt-0.5 text-xs text-neutral-400 leading-snug">{job.position}</p>
          )}

          {/* Salary + Work Type row */}
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {job.salary && (
              <span className="text-xs font-medium text-green-400">{job.salary}</span>
            )}
            {job.workType && (
              <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
                {WORK_TYPE_ICONS[job.workType]} {t(job.workType)}
              </span>
            )}
            {job.location && (job.workType === 'onsite' || job.workType === 'hybrid') && (
              <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500">
                📍 {job.location}
              </span>
            )}
          </div>

          {/* Offer info for offered status */}
          {job.status === 'offered' && job.finalOffer && (
            <div className="mt-2 rounded-lg border border-green-500/20 bg-green-500/[0.05] px-2.5 py-1.5">
              <p className="text-[11px] font-semibold text-green-400">💰 {job.finalOffer}</p>
            </div>
          )}

          {/* Meta badges */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] text-neutral-300">
              <Calendar className="h-3 w-3 text-neutral-500" />
              {formatDateShort(job.dateApplied)}
            </span>

            <span className="inline-flex items-center gap-1 rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] text-neutral-300">
              <Clock className="h-3 w-3 text-neutral-500" />
              {daysLabel(daysApplied)}
            </span>

            {daysInCol > 0 && (
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                  daysInCol >= 14
                    ? 'bg-red-500/10 text-red-400'
                    : daysInCol >= 7
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-white/[0.04] text-neutral-300'
                }`}
              >
                <MapPin className="h-3 w-3" />
                {daysLabel(daysInCol)} {t('daysHere', { days: '' }).trim()}
              </span>
            )}
          </div>

          {/* URL indicator */}
          {job.url && (
            <div className="mt-2 flex items-center gap-1 text-[11px] text-yellow-400 opacity-0 transition-opacity group-hover:opacity-100">
              <ExternalLink className="h-3 w-3" />
              <span>{t('viewPosting')}</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
