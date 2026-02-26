import { useRef, useCallback } from 'react'
import { DragDropContext } from '@hello-pangea/dnd'
import { useJobs } from '../../context/JobContext'
import { COLUMNS } from '../../utils/constants'
import { useI18n } from '../../context/I18nContext'
import Column from './Column'

export default function KanbanBoard({ onCardClick, onAddToColumn }) {
  const { state, moveJob } = useJobs()
  const { colLabel } = useI18n()
  const scrollRef = useRef(null)

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

  // Convert vertical mouse wheel to horizontal scroll
  const handleWheel = useCallback((e) => {
    if (!scrollRef.current) return

    const columnScroll = e.target.closest('.column-scroll')
    if (columnScroll) {
      // Inside a column — never redirect to horizontal scroll
      return
    }

    // Outside any column — redirect vertical wheel to horizontal board scroll
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault()
      scrollRef.current.scrollLeft += e.deltaY
    }
  }, [])

  // Scroll to a specific column
  const scrollToColumn = (colId) => {
    const el = scrollRef.current?.querySelector(`[data-column-id="${colId}"]`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' })
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {/* Quick column navigation */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-8 py-2.5 lg:px-10 overflow-x-auto">
        {COLUMNS.map(col => {
          const count = (state.columns[col.id] || []).length
          return (
            <button
              key={col.id}
              onClick={() => scrollToColumn(col.id)}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white flex-shrink-0"
            >
              <div className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: col.color }} />
              {colLabel(col.id)}
              <span className="text-[10px] text-neutral-600">{count}</span>
            </button>
          )
        })}
      </div>

      <div
        ref={scrollRef}
        onWheel={handleWheel}
        className="kanban-scroll flex flex-1 gap-4 overflow-x-auto px-8 py-8 lg:px-10"
      >
        {COLUMNS.map(col => {
          const jobIds = state.columns[col.id] || []
          const jobs = jobIds.map(id => state.jobs[id]).filter(Boolean)
          return (
            <div key={col.id} data-column-id={col.id}>
              <Column
                columnId={col.id}
                label={col.label}
                color={col.color}
                jobs={jobs}
                onCardClick={onCardClick}
                onAddToColumn={onAddToColumn}
              />
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
