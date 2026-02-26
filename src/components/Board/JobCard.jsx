import { Draggable } from '@hello-pangea/dnd'
import { Calendar, Clock, ExternalLink, MapPin } from 'lucide-react'
import { daysSince, formatDateShort, daysLabel } from '../../utils/helpers'
import { COLUMN_MAP } from '../../utils/constants'

export default function JobCard({ job, index, onClick }) {
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
          className={`group cursor-pointer rounded-xl border border-slate-700/50 bg-slate-800/80 p-3.5 transition-all hover:border-slate-600 hover:bg-slate-750 ${
            snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl shadow-black/40 ring-2 ring-violet-500/40' : ''
          }`}
        >
          {/* Status color strip */}
          <div
            className="mb-2.5 h-1 w-10 rounded-full"
            style={{ backgroundColor: colMeta?.color || '#8b5cf6' }}
          />

          {/* Company & Position */}
          <h3 className="text-sm font-semibold text-white leading-snug">{job.company}</h3>
          {job.position && (
            <p className="mt-0.5 text-xs text-slate-400 leading-snug">{job.position}</p>
          )}

          {/* Salary */}
          {job.salary && (
            <p className="mt-2 text-xs font-medium text-emerald-400">{job.salary}</p>
          )}

          {/* Meta badges */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {/* Date applied */}
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-700/60 px-2 py-0.5 text-[11px] text-slate-300">
              <Calendar className="h-3 w-3 text-slate-400" />
              {formatDateShort(job.dateApplied)}
            </span>

            {/* Days since applied */}
            <span className="inline-flex items-center gap-1 rounded-md bg-slate-700/60 px-2 py-0.5 text-[11px] text-slate-300">
              <Clock className="h-3 w-3 text-slate-400" />
              {daysLabel(daysApplied)}
            </span>

            {/* Days in column */}
            {daysInCol > 0 && (
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${
                  daysInCol >= 14
                    ? 'bg-red-500/15 text-red-400'
                    : daysInCol >= 7
                    ? 'bg-amber-500/15 text-amber-400'
                    : 'bg-slate-700/60 text-slate-300'
                }`}
              >
                <MapPin className="h-3 w-3" />
                {daysLabel(daysInCol)} here
              </span>
            )}
          </div>

          {/* URL indicator */}
          {job.url && (
            <div className="mt-2 flex items-center gap-1 text-[11px] text-violet-400 opacity-0 transition-opacity group-hover:opacity-100">
              <ExternalLink className="h-3 w-3" />
              <span>View posting</span>
            </div>
          )}
        </div>
      )}
    </Draggable>
  )
}
