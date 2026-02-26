import { Droppable } from '@hello-pangea/dnd'
import JobCard from './JobCard'
import { Plus } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

export default function Column({ columnId, label, color, jobs, onCardClick, onAddToColumn }) {
  const { colLabel } = useI18n()

  return (
    <div className="kanban-column flex w-[320px] flex-shrink-0 flex-col rounded-3xl border border-white/[0.08] bg-neutral-900/20 backdrop-blur-md shadow-xl md:w-[300px] lg:w-[320px]" style={{ maxHeight: 'calc(100vh - 180px)' }}>
      {/* Column Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="h-3 w-3 rounded-full shadow-sm"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
          />
          <h2 className="text-sm font-semibold text-neutral-200">{colLabel(columnId)}</h2>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-white/[0.06] px-1.5 text-[11px] font-medium text-neutral-400">
            {jobs.length}
          </span>
        </div>
        <button
          onClick={() => onAddToColumn(columnId)}
          className="rounded-lg p-2 text-neutral-600 transition-colors hover:bg-white/[0.06] hover:text-neutral-300"
          title={`Add to ${colLabel(columnId)}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Droppable Area */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`column-scroll flex-1 space-y-4 overflow-y-auto px-5 pb-5 pt-3 transition-colors ${
              snapshot.isDraggingOver ? 'bg-yellow-400/[0.03] rounded-2xl' : ''
            }`}
            style={{ minHeight: 80 }}
          >
            {jobs.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} onClick={onCardClick} />
            ))}
            {provided.placeholder}

            {/* Empty state */}
            {jobs.length === 0 && !snapshot.isDraggingOver && (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <p className="text-sm font-medium text-neutral-500">No jobs here</p>
                <button
                  onClick={() => onAddToColumn(columnId)}
                  className="mt-3 rounded-xl bg-white/[0.04] px-5 py-2.5 text-xs font-bold text-neutral-300 transition-colors hover:bg-white/[0.1] hover:text-white"
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
