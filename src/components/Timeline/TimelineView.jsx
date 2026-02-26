import { useState, useRef, useCallback } from 'react'
import { useJobs } from '../../context/JobContext'
import { COLUMNS, COLUMN_MAP } from '../../utils/constants'
import { formatDate, daysSince } from '../../utils/helpers'
import { useI18n } from '../../context/I18nContext'
import { Calendar } from 'lucide-react'

const WORK_TYPE_ICONS = { remote: '🌍', onsite: '🏢', hybrid: '🔄' }

export default function GanttView({ onCardClick }) {
  const { allJobs } = useJobs()
  const { t, colLabel } = useI18n()
  const [hoveredJob, setHoveredJob] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const containerRef = useRef(null)

  if (allJobs.length === 0) {
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

  // Calculate date range
  const now = new Date()
  const dates = allJobs.map(j => new Date(j.dateApplied || j.dateAdded))
  const minDate = new Date(Math.min(...dates))
  const maxDate = new Date(Math.max(now.getTime(), Math.max(...dates) + 7 * 24 * 60 * 60 * 1000))

  // Extend min back a few days and max forward
  minDate.setDate(minDate.getDate() - 3)
  maxDate.setDate(maxDate.getDate() + 5)

  const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24))
  const dayWidth = 40 // pixels per day
  const chartWidth = totalDays * dayWidth

  const getXPosition = (date) => {
    const d = new Date(date)
    const diff = (d - minDate) / (1000 * 60 * 60 * 24)
    return diff * dayWidth
  }

  // Sort jobs by dateApplied
  const sortedJobs = [...allJobs].sort((a, b) =>
    new Date(a.dateApplied || a.dateAdded) - new Date(b.dateApplied || b.dateAdded)
  )

  const rowHeight = 44
  const headerHeight = 60

  // Generate week markers
  const weekMarkers = []
  const currentDate = new Date(minDate)
  currentDate.setDate(currentDate.getDate() - currentDate.getDay()) // Start at Sunday
  while (currentDate <= maxDate) {
    weekMarkers.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 7)
  }

  // Generate month markers
  const monthMarkers = []
  const monthDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1)
  while (monthDate <= maxDate) {
    monthMarkers.push(new Date(monthDate))
    monthDate.setMonth(monthDate.getMonth() + 1)
  }

  // Today line
  const todayX = getXPosition(now)

  const handleMouseEnter = (job, event) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setTooltipPos({
        x: event.clientX - rect.left + 10,
        y: event.clientY - rect.top - 10,
      })
    }
    setHoveredJob(job)
  }

  const handleMouseMove = (event) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      setTooltipPos({
        x: event.clientX - rect.left + 10,
        y: event.clientY - rect.top - 10,
      })
    }
  }

  return (
    <div className="view-transition flex flex-1 flex-col overflow-hidden">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 border-b border-white/[0.06] px-8 py-3.5 md:px-12">
        {COLUMNS.map(col => (
          <div key={col.id} className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: col.color }} />
            <span className="text-[11px] text-neutral-400">{colLabel(col.id)}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div
        className="flex flex-1 overflow-auto"
        ref={containerRef}
        onWheel={(e) => {
          if (!containerRef.current) return
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault()
            containerRef.current.scrollLeft += e.deltaY
          }
        }}
      >
        {/* Left labels */}
        <div className="sticky left-0 z-10 flex-shrink-0 border-r border-white/[0.06] bg-neutral-900/60 backdrop-blur-md">
          {/* Header spacer */}
          <div className="h-[60px] border-b border-white/[0.06] px-4 flex items-end pb-2">
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">{t('company')}</span>
          </div>
          {/* Job labels */}
          {sortedJobs.map((job, i) => (
            <div
              key={job.id}
              className="flex items-center gap-3 border-b border-white/[0.03] px-4 cursor-pointer hover:bg-white/[0.03] transition-colors"
              style={{ height: rowHeight }}
              onClick={() => onCardClick(job)}
            >
              <div
                className="h-2 w-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLUMN_MAP[job.status]?.color }}
              />
              <div className="min-w-0 max-w-[180px]">
                <p className="truncate text-xs font-medium text-white">{job.company}</p>
                {job.position && (
                  <p className="truncate text-[10px] text-neutral-500">{job.position}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chart area */}
        <div className="flex-1 relative" style={{ minWidth: chartWidth }}>
          {/* Time header */}
          <div className="sticky top-0 z-10 h-[60px] border-b border-white/[0.06] bg-neutral-900/60 backdrop-blur-md" style={{ width: chartWidth }}>
            {/* Month labels */}
            {monthMarkers.map((date, i) => {
              const x = getXPosition(date)
              return (
                <div
                  key={i}
                  className="absolute top-1 text-[11px] font-semibold text-neutral-400"
                  style={{ left: x + 4 }}
                >
                  {date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              )
            })}
            {/* Week date labels */}
            {weekMarkers.map((date, i) => {
              const x = getXPosition(date)
              return (
                <div
                  key={i}
                  className="absolute bottom-2 text-[10px] text-neutral-600"
                  style={{ left: x + 2 }}
                >
                  {date.getDate()}/{date.getMonth() + 1}
                </div>
              )
            })}
          </div>

          {/* Grid and bars */}
          <div className="relative" style={{ width: chartWidth, height: sortedJobs.length * rowHeight }}>
            {/* Week grid lines */}
            {weekMarkers.map((date, i) => {
              const x = getXPosition(date)
              return (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-l border-white/[0.03]"
                  style={{ left: x }}
                />
              )
            })}

            {/* Today line */}
            <div
              className="absolute top-0 bottom-0 z-5 border-l-2 border-yellow-400/40"
              style={{ left: todayX }}
            >
              <div className="absolute -top-0 -left-3 rounded-b-md bg-yellow-400 px-1 py-0.5 text-[9px] font-bold text-black">
                {t('today')}
              </div>
            </div>

            {/* Row backgrounds */}
            {sortedJobs.map((_, i) => (
              <div
                key={i}
                className={`absolute left-0 right-0 border-b border-white/[0.03] ${i % 2 === 0 ? '' : 'bg-white/[0.01]'}`}
                style={{ top: i * rowHeight, height: rowHeight }}
              />
            ))}

            {/* Gantt bars */}
            {sortedJobs.map((job, i) => {
              const col = COLUMN_MAP[job.status]
              const startX = getXPosition(job.dateApplied || job.dateAdded)
              const endX = getXPosition(now)
              const barWidth = Math.max(endX - startX, dayWidth * 0.5)
              const daysTotal = daysSince(job.dateApplied)

              return (
                <div
                  key={job.id}
                  className="absolute cursor-pointer group"
                  style={{
                    left: startX,
                    top: i * rowHeight + 8,
                    width: barWidth,
                    height: rowHeight - 16,
                  }}
                  onClick={() => onCardClick(job)}
                  onMouseEnter={(e) => handleMouseEnter(job, e)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoveredJob(null)}
                >
                  {/* Bar background */}
                  <div
                    className="absolute inset-0 rounded-lg opacity-80 transition-all group-hover:opacity-100 group-hover:ring-2 group-hover:ring-white/20"
                    style={{
                      background: `linear-gradient(90deg, ${col?.color}50, ${col?.color}25)`,
                      borderLeft: `3px solid ${col?.color}`,
                    }}
                  />
                  {/* Bar label */}
                  <div className="relative flex items-center h-full px-2.5 overflow-hidden">
                    <span className="truncate text-[11px] font-medium text-white/80">
                      {job.company} {daysTotal > 0 ? `• ${daysTotal}d` : ''}
                    </span>
                  </div>

                  {/* History segments (color bands for different statuses) */}
                  {job.history && job.history.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 flex rounded-b-lg overflow-hidden">
                      {job.history.map((h, hi) => {
                        const hCol = COLUMN_MAP[h.status]
                        const hStart = new Date(h.enteredAt)
                        const hEnd = h.leftAt ? new Date(h.leftAt) : now
                        const hDuration = (hEnd - hStart) / (1000 * 60 * 60 * 24)
                        const totalDuration = (now - new Date(job.dateApplied || job.dateAdded)) / (1000 * 60 * 60 * 24)
                        const widthPercent = totalDuration > 0 ? (hDuration / totalDuration) * 100 : 100

                        return (
                          <div
                            key={hi}
                            style={{
                              width: `${widthPercent}%`,
                              backgroundColor: hCol?.color || '#666',
                            }}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Tooltip */}
          {hoveredJob && (
            <div
              className="pointer-events-none absolute z-50 w-80 rounded-2xl border border-white/[0.1] bg-neutral-900/80 backdrop-blur-xl p-5 shadow-2xl shadow-black/60"
              style={{
                left: Math.min(tooltipPos.x, chartWidth - 300),
                top: tooltipPos.y,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: COLUMN_MAP[hoveredJob.status]?.color }}
                />
                <span className="text-xs font-semibold" style={{ color: COLUMN_MAP[hoveredJob.status]?.color }}>
                  {colLabel(hoveredJob.status)}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">{hoveredJob.company}</h3>
              {hoveredJob.position && <p className="text-xs text-neutral-400">{hoveredJob.position}</p>}
              {hoveredJob.salary && <p className="mt-1 text-xs font-medium text-green-400">{hoveredJob.salary}</p>}
              <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-neutral-400">
                <span>📅 {formatDate(hoveredJob.dateApplied)}</span>
                <span>⏱️ {daysSince(hoveredJob.dateApplied)} {t('days', { count: '' }).trim()}</span>
                {hoveredJob.workType && <span>{WORK_TYPE_ICONS[hoveredJob.workType]} {t(hoveredJob.workType)}</span>}
                {hoveredJob.location && <span>📍 {hoveredJob.location}</span>}
              </div>
              {hoveredJob.status === 'offered' && hoveredJob.finalOffer && (
                <p className="mt-2 text-xs font-semibold text-green-400">💰 {hoveredJob.finalOffer}</p>
              )}
              {hoveredJob.notes && (
                <p className="mt-2 line-clamp-2 text-[11px] text-neutral-500">{hoveredJob.notes}</p>
              )}
              {/* History summary */}
              {hoveredJob.history && hoveredJob.history.length > 1 && (
                <div className="mt-3 border-t border-white/[0.06] pt-2">
                  <p className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Journey</p>
                  <div className="flex flex-wrap gap-1">
                    {hoveredJob.history.map((h, i) => (
                      <span
                        key={i}
                        className="rounded px-1.5 py-0.5 text-[10px] font-medium"
                        style={{
                          backgroundColor: `${COLUMN_MAP[h.status]?.color}15`,
                          color: COLUMN_MAP[h.status]?.color,
                        }}
                      >
                        {colLabel(h.status)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
