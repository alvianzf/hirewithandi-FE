import { Droppable } from '@hello-pangea/dnd'
import JobCard from './JobCard'
import { Plus } from 'lucide-react'

export default function Column({ columnId, label, color, jobs, onCardClick, onAddToColumn }) {
  return (
    <div className="kanban-column flex w-72 flex-shrink-0 flex-col rounded-2xl bg-slate-800/40 md:w-64 lg:w-72">
      {/* Column Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2.5">
          <div
            className="h-2.5 w-2.5 rounded-full shadow-sm"
            style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}40` }}
          />
          <h2 className="text-sm font-semibold text-slate-200">{label}</h2>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-slate-700/80 px-1.5 text-[11px] font-medium text-slate-400">
            {jobs.length}
          </span>
        </div>
        <button
          onClick={() => onAddToColumn(columnId)}
          className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-700 hover:text-slate-300"
          title={`Add to ${label}`}
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
              snapshot.isDraggingOver ? 'bg-violet-500/5 rounded-xl' : ''
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
                <p className="text-xs text-slate-500">No jobs here</p>
                <button
                  onClick={() => onAddToColumn(columnId)}
                  className="mt-2 text-xs text-violet-400 transition-colors hover:text-violet-300"
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
