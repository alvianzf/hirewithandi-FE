import { useState } from 'react'
import { JobProvider, useJobs } from './context/JobContext'
import { I18nProvider } from './context/I18nContext'
import Header from './components/Layout/Header'
import KanbanBoard from './components/Board/KanbanBoard'
import GanttView from './components/Timeline/TimelineView'
import TableView from './components/Table/TableView'
import DashboardView from './components/Dashboard/DashboardView'
import JobModal from './components/Modal/JobModal'

function AppContent() {
  const { totalJobs } = useJobs()
  const [activeView, setActiveView] = useState('dashboard')
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

      {activeView === 'dashboard' && (
        <DashboardView />
      )}
      {activeView === 'board' && (
        <KanbanBoard onCardClick={handleCardClick} onAddToColumn={handleAddToColumn} />
      )}
      {activeView === 'gantt' && (
        <GanttView onCardClick={handleCardClick} />
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
    <I18nProvider>
      <JobProvider>
        <AppContent />
      </JobProvider>
    </I18nProvider>
  )
}
