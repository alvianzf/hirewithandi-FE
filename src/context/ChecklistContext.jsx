import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getMyChecklist, updateMyChecklist, completeMyChecklist } from '../services/checklist'
import { useAuth } from './AuthContext'
import { useUserProfile } from './UserProfileContext'
import { toast } from 'sonner'
import { CHECKLIST_DATA } from '../components/Checklist/Constants'

const ChecklistContext = createContext(null)

export function ChecklistProvider({ children }) {
  const { user } = useAuth()
  const { profile, loading: profileLoading, isInitialLoading } = useUserProfile()
  
  const [progressState, setProgressState] = useState({})
  const [isComplete, setIsComplete] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const isMember = profile?.role === 'MEMBER'

  const totalItems = CHECKLIST_DATA.reduce((acc, cat) => acc + cat.items.length, 0)
  let respondedItems = 0
  Object.values(progressState || {}).forEach(catState => {
    Object.values(catState || {}).forEach(status => {
      if (status === 'DONE' || status === 'IN_PROGRESS') {
        respondedItems++
      }
    })
  })
  const hasNotStarted = respondedItems < totalItems

  const isMandatory = isMember && !isComplete && hasNotStarted && !loading && !profileLoading && !isInitialLoading

  const fetchChecklist = useCallback(async () => {
    if (!isMember) return
    
    setLoading(true)
    try {
      const { state, isComplete: completeStatus } = await getMyChecklist()
      setProgressState(state || {})
      setIsComplete(completeStatus || false)
      
      const fetchedTotalItems = CHECKLIST_DATA.reduce((acc, cat) => acc + cat.items.length, 0)
      let fetchedResponded = 0
      Object.values(state || {}).forEach(catState => {
        Object.values(catState || {}).forEach(status => {
          if (status === 'DONE' || status === 'IN_PROGRESS') {
            fetchedResponded++
          }
        })
      })
      const fetchedHasNotStarted = fetchedResponded < fetchedTotalItems

      if (!completeStatus && fetchedHasNotStarted) {
        if (!sessionStorage.getItem('hwa_checklist_shown')) {
          setIsDrawerOpen(true)
          sessionStorage.setItem('hwa_checklist_shown', 'true')
        }
      }
    } catch (err) {
      console.error('Failed to fetch checklist', err)
    } finally {
      setLoading(false)
    }
  }, [isMember])

  useEffect(() => {
    if (user) {
      fetchChecklist()
    } else {
      // Reset state on logout
      setProgressState({})
      setIsComplete(false)
      setIsDrawerOpen(false)
      sessionStorage.removeItem('hwa_checklist_shown')
    }
  }, [user, fetchChecklist])

  // Automatically enforce drawer open if mandatory
  useEffect(() => {
    if (isMandatory && !sessionStorage.getItem('hwa_checklist_shown')) {
      setIsDrawerOpen(true)
      sessionStorage.setItem('hwa_checklist_shown', 'true')
    }
  }, [isMandatory])

  const saveProgress = async (newState) => {
    setProgressState(newState)
    try {
      await updateMyChecklist(newState)
    } catch (err) {
      console.error('Failed to save checklist progress', err)
    }
  }

  const completeBoardOnboarding = async (isAllDone) => {
    if (!isAllDone) return false
    try {
      await completeMyChecklist()
      setIsComplete(true)
      setIsDrawerOpen(false)
      toast.success('Onboarding Checklist Completed! Welcome to your dashboard.')
      return true
    } catch (err) {
      console.error('Failed to complete checklist', err)
      toast.error('Failed to complete checklist')
      return false
    }
  }

  const value = {
    progressState,
    isComplete,
    isDrawerOpen,
    setIsDrawerOpen,
    isMandatory,
    loading,
    saveProgress,
    completeBoardOnboarding,
    refreshChecklist: fetchChecklist
  }

  return (
    <ChecklistContext.Provider value={value}>
      {children}
    </ChecklistContext.Provider>
  )
}

export function useChecklist() {
  const ctx = useContext(ChecklistContext)
  if (!ctx) throw new Error('useChecklist must be used within a ChecklistProvider')
  return ctx
}
