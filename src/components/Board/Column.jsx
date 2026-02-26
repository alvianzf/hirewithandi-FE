import { Droppable } from '@hello-pangea/dnd'
import JobCard from './JobCard'
import { Plus } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

export default function Column({ columnId, label, color, jobs, onCardClick, onAddToColumn }) {
  const { colLabel } = useI18n()

  return (
    <div className="kanban-column flex w-72 flex-shrink-0 flex-col rounded-2xl border border-white/[0.04] bg-white/[0.02] md:w-64 lg:w-72">
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="h-2.5 w-2.5 rounded-full shadow-sm"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
          />
          <h2 className="text-sm font-semibold text-neutral-200">{colLabel(columnId)}</h2>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/[0.06] px-1.5 text-[11px] font-medium text-neutral-400">
            {jobs.length}
          </span>
        </div>
        <button
          onClick={() => onAddToColumn(columnId)}
          className="rounded-lg p-1.5 text-neutral-600 transition-colors hover:bg-white/[0.06] hover:text-neutral-300"
          title={`Add to ${colLabel(columnId)}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 space-y-2 overflow-y-auto px-2 pb-2 pt-1 transition-colors ${
              snapshot.isDraggingOver ? 'bg-yellow-400/[0.03] rounded-xl' : ''
            }`}
            style={{ minHeight: 60 }}
          >
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} onClick={onCardClick} />
            ))}
            {provided.placeholder}

            {/* Empty state */}
            {jobs.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-xs text-neutral-600">No jobs here</p>
                <button
                  onClick={() => onAddToColumn(columnId)}
                  className="mt-2 text-xs text-yellow-400/60 transition-colors hover:text-yellow-400"
                >
                  + Add one
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}
