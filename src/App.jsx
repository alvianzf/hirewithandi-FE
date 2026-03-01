import { useState } from 'react'
import { JobProvider, useJobs } from './context/JobContext'
import { I18nProvider } from './context/I18nContext'
import Header from './components/Layout/Header'
import KanbanBoard from './components/Board/KanbanBoard'
import GanttView from './components/Timeline/TimelineView'
import TableView from './components/Table/TableView'
import DashboardView from './components/Dashboard/DashboardView'
import JobModal from './components/Modal/JobModal'
import { AuthProvider, useAuth } from './context/AuthContext'
import { UserProfileProvider } from './context/UserProfileContext'
import LoginPage from './components/Auth/LoginPage'
import ProfilePage from './components/UserProfile/ProfilePage'
import NotFoundView from './components/Layout/NotFoundView'
import { Toaster } from 'sonner'

function AppContent() {
  const { totalJobs, loading } = useJobs()
  const { user } = useAuth()
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

  if (!user) {
    return (
      <>
        <Toaster position="top-right" richColors theme="dark" />
        <LoginPage />
      </>
    )
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950/90 backdrop-blur-sm">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm font-semibold tracking-widest uppercase text-neutral-400 animate-pulse">Loading your data…</p>
      </div>
    )
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
      {activeView === 'profile' && (
        <ProfilePage />
      )}
      {!['dashboard', 'board', 'gantt', 'table', 'profile'].includes(activeView) && (
        <NotFoundView />
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
      <Toaster position="top-right" richColors theme="dark" />
      <AuthProvider>
        <UserProfileProvider>
          <JobProvider>
            <AppContent />
          </JobProvider>
        </UserProfileProvider>
      </AuthProvider>
    </I18nProvider>
  )
}
