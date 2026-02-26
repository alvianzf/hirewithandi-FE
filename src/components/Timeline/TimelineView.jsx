import { useJobs } from '../../context/JobContext'
import { COLUMN_MAP } from '../../utils/constants'
import { formatDate, daysSince, daysLabel, getMonthYear } from '../../utils/helpers'
import { Calendar, Clock, MapPin, Briefcase } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

const WORK_TYPE_ICONS = { remote: '🌍', onsite: '🏢', hybrid: '🔄' }

export default function TimelineView({ onCardClick }) {
  const { allJobs } = useJobs()
  const { t, colLabel } = useI18n()

  const sorted = [...allJobs].sort((a, b) =>
    new Date(b.dateApplied || 0) - new Date(a.dateApplied || 0)
  )

  const groups = {}
  sorted.forEach(job => {
    const key = getMonthYear(job.dateApplied)
    if (!groups[key]) groups[key] = []
    groups[key].push(job)
  })

  if (sorted.length === 0) {
    return (
      <div className="view-transition flex flex-1 items-center justify-center">
        <div className="text-center">
          <Calendar className="mx-auto h-12 w-12 text-neutral-700" />
          <p className="mt-3 text-sm text-neutral-500">{t('noApplicationsYet')}</p>
          <p className="mt-1 text-xs text-neutral-600">{t('addFirstJob')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="view-transition flex-1 overflow-y-auto px-4 py-6 md:px-8">
      <div className="mx-auto max-w-2xl">
        {Object.entries(groups).map(([monthYear, jobs]) => (
          <div key={monthYear} className="mb-8">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-neutral-500">
              {monthYear}
            </h3>

            <div className="relative border-l-2 border-white/[0.06] pl-6">
              {jobs.map((job) => {
                const col = COLUMN_MAP[job.status]
                const applied = daysSince(job.dateApplied)
                const inCol = daysSince(job.statusChangedAt)

                return (
                  <div
                    key={job.id}
                    onClick={() => onCardClick(job)}
                    className="group relative mb-4 cursor-pointer rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
                  >
                    {/* Timeline dot */}
                    <div
                      className="absolute -left-[31px] top-5 h-3.5 w-3.5 rounded-full border-2 border-black shadow-sm"
                      style={{ backgroundColor: col?.color || '#FFD700' }}
                    />

                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-semibold text-white">{job.company}</h4>
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                            style={{
                              backgroundColor: `${col?.color}15`,
                              color: col?.color || '#FFD700',
                            }}
                          >
                            {colLabel(job.status)}
                          </span>
                          {job.workType && (
                            <span className="text-[11px] text-neutral-500">
                              {WORK_TYPE_ICONS[job.workType]} {t(job.workType)}
                            </span>
                          )}
                        </div>
                        {job.position && (
                          <p className="mt-0.5 text-xs text-neutral-400 flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {job.position}
                          </p>
                        )}
                        {job.salary && (
                          <p className="mt-1 text-xs font-medium text-green-400">{job.salary}</p>
                        )}
                        {job.status === 'offered' && job.finalOffer && (
                          <p className="mt-1 text-xs font-semibold text-green-400">💰 {t('finalOffer')}: {job.finalOffer}</p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-1 text-[11px] text-neutral-500 flex-shrink-0">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(job.dateApplied)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {daysLabel(applied)} {t('daysAgo', { days: '' }).trim()}
                        </span>
                        {inCol > 0 && (
                          <span
                            className={`flex items-center gap-1 font-medium ${
                              inCol >= 14 ? 'text-red-400' : inCol >= 7 ? 'text-amber-400' : 'text-neutral-500'
                            }`}
                          >
                            <MapPin className="h-3 w-3" />
                            {daysLabel(inCol)} {t('daysInStage', { days: '' }).trim()}
                          </span>
                        )}
                      </div>
                    </div>

                    {job.notes && (
                      <p className="mt-2 line-clamp-2 text-xs text-neutral-600">{job.notes}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
