import React, { useState, Suspense } from 'react'
import { JobProvider, useJobs } from './context/JobContext'
import { I18nProvider } from './context/I18nContext'
import Header from './components/Layout/Header'
import { AuthProvider, useAuth } from './context/AuthContext'
import { UserProfileProvider, useUserProfile } from './context/UserProfileContext'
import { Toaster } from 'sonner'
import NotFoundView from './components/Layout/NotFoundView'

// Lazy loaded views and pages to chunk bundle size
const DashboardView = React.lazy(() => import('./components/Dashboard/DashboardView'))
const KanbanBoard = React.lazy(() => import('./components/Board/KanbanBoard'))
const GanttView = React.lazy(() => import('./components/Timeline/TimelineView'))
const TableView = React.lazy(() => import('./components/Table/TableView'))
const ProfilePage = React.lazy(() => import('./components/UserProfile/ProfilePage'))
const JobModal = React.lazy(() => import('./components/Modal/JobModal'))
const LoginPage = React.lazy(() => import('./components/Auth/LoginPage'))
const LandingPage = React.lazy(() => import('./components/Landing/LandingPage'))

function AppContent() {
  const { totalJobs, isInitialLoading: jobsLoading } = useJobs()
  const { user, isDisabled } = useAuth()
  const { isInitialLoading: profileLoading } = useUserProfile()
  const [activeView, setActiveView] = useState('dashboard')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [defaultStatus, setDefaultStatus] = useState('wishlist')
  const [showLogin, setShowLogin] = useState(false)

  const handleAddJob = () => {
    if (isDisabled) return
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
    if (!showLogin) {
      return (
        <>
          <Toaster position="top-right" richColors theme="dark" />
          <Suspense fallback={<div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center bg-neutral-950/90 backdrop-blur-sm"><div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" /></div>}>
            <LandingPage onSignIn={() => setShowLogin(true)} />
          </Suspense>
        </>
      )
    }

    return (
      <>
        <Toaster position="top-right" richColors theme="dark" />
        <Suspense fallback={<div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center bg-neutral-950/90 backdrop-blur-sm"><div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" /></div>}>
          <LoginPage onBack={() => setShowLogin(false)} />
        </Suspense>
      </>
    )
  }

  if (jobsLoading || profileLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950/90 backdrop-blur-sm">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm font-semibold tracking-widest uppercase text-neutral-400 animate-pulse">Loading your data…</p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {isDisabled && (
        <div className="flex-shrink-0 bg-red-500/10 border-b border-red-500/20 px-4 py-3 text-center">
          <p className="text-sm font-medium text-red-400">
            ⚠️ Your account has been disabled. You can view your data but cannot make changes.
          </p>
        </div>
      )}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onAddJob={handleAddJob}
        totalJobs={totalJobs}
        isDisabled={isDisabled}
      />

      <Suspense fallback={
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        {activeView === 'dashboard' && <DashboardView />}
        {activeView === 'board' && <KanbanBoard onCardClick={handleCardClick} onAddToColumn={handleAddToColumn} />}
        {activeView === 'gantt' && <GanttView onCardClick={handleCardClick} />}
        {activeView === 'table' && <TableView onCardClick={handleCardClick} />}
        {activeView === 'profile' && <ProfilePage />}
        {!['dashboard', 'board', 'gantt', 'table', 'profile'].includes(activeView) && <NotFoundView />}
      </Suspense>

      <Suspense fallback={null}>
        <JobModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          editingJob={editingJob}
          defaultStatus={defaultStatus}
          isDisabled={isDisabled}
        />
      </Suspense>
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
