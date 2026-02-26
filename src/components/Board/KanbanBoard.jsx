import { DragDropContext } from '@hello-pangea/dnd'
import { useJobs } from '../../context/JobContext'
import { COLUMNS } from '../../utils/constants'
import Column from './Column'

export default function KanbanBoard({ onCardClick, onAddToColumn }) {
  const { state, moveJob } = useJobs()

  const handleDragEnd = (result) => {
    const { draggableId, source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    moveJob(
      draggableId,
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-scroll flex flex-1 gap-4 overflow-x-auto px-6 py-6 lg:px-8">
        {COLUMNS.map(col => {
          const jobIds = state.columns[col.id] || []
          const jobs = jobIds.map(id => state.jobs[id]).filter(Boolean)
          return (
            <Column
              key={col.id}
              columnId={col.id}
              label={col.label}
              color={col.color}
              jobs={jobs}
              onCardClick={onCardClick}
              onAddToColumn={onAddToColumn}
            />
          )
        })}
      </div>
    </DragDropContext>
  )
}
