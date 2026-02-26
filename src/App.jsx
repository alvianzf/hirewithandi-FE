import { useState } from 'react'
import { JobProvider, useJobs } from './context/JobContext'
import Header from './components/Layout/Header'
import KanbanBoard from './components/Board/KanbanBoard'
import TimelineView from './components/Timeline/TimelineView'
import TableView from './components/Table/TableView'
import JobModal from './components/Modal/JobModal'

function AppContent() {
  const { totalJobs } = useJobs()
  const [activeView, setActiveView] = useState('board')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [defaultStatus, setDefaultStatus] = useState('wishlist')

  const handleAddJob = () => {
    setEditingJob(null)
    setDefaultStatus('wishlist')
    setModalOpen(true)
  }

  const handleAddToColumn = (columnId) => {
    setEditingJob(null)
    setDefaultStatus(columnId)
    setModalOpen(true)
  }

  const handleCardClick = (job) => {
    setEditingJob(job)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingJob(null)
  }

  return (
    <div className="flex h-full flex-col">
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onAddJob={handleAddJob}
        totalJobs={totalJobs}
      />

      {activeView === 'board' && (
        <KanbanBoard onCardClick={handleCardClick} onAddToColumn={handleAddToColumn} />
      )}
      {activeView === 'timeline' && (
        <TimelineView onCardClick={handleCardClick} />
      )}
      {activeView === 'table' && (
        <TableView onCardClick={handleCardClick} />
      )}

      <JobModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        editingJob={editingJob}
        defaultStatus={defaultStatus}
      />
    </div>
  )
}

export default function App() {
  return (
    <JobProvider>
      <AppContent />
    </JobProvider>
  )
}
