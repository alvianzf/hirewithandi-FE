import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { INITIAL_STATE } from '../utils/constants'
import api from '../utils/api'
import { toast } from 'sonner'
import { useAuth } from './AuthContext'

const JobContext = createContext(null)

export function JobProvider({ children }) {
  const { user, isDisabled } = useAuth()
  const [state, setState] = useState(INITIAL_STATE)
  const [loading, setLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(false)

  const fetchJobs = useCallback(async (isInitial = false) => {
    if (!user) {
      setLoading(false)
      setIsInitialLoading(false)
      return
    }
    
    if (isInitial) setIsInitialLoading(true)
    setLoading(true)
    try {
      const res = await api.get('/jobs')
      const jobsFromApi = res.data.data
      
      const newJobs = {}
      const newColumns = { ...INITIAL_STATE.columns }
      for (const col of INITIAL_STATE.columnOrder) {
        newColumns[col] = []
      }

      jobsFromApi.forEach(job => {
        newJobs[job.id] = job
        const col = job.status || 'wishlist'
        if (!newColumns[col]) newColumns[col] = []
        newColumns[col].push(job.id)
      })

      setState({
        jobs: newJobs,
        columnOrder: INITIAL_STATE.columnOrder,
        columns: newColumns
      })
    } catch (e) {
      console.error('Failed to fetch jobs', e)
    } finally {
      setLoading(false)
      setIsInitialLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchJobs(true)
    } else {
      setState(INITIAL_STATE)
      setLoading(false)
      setIsInitialLoading(false)
    }
  }, [user, fetchJobs])

  const addJob = async (jobData) => {
    if (isDisabled) { toast.error('Account disabled — cannot add jobs'); return }
    try {
      const res = await api.post('/jobs', jobData)
      const newJob = res.data.data
      
      setState(prevState => {
        const col = newJob.status
        return {
          ...prevState,
          jobs: { ...prevState.jobs, [newJob.id]: newJob },
          columns: { ...prevState.columns, [col]: [newJob.id, ...prevState.columns[col]] }
        }
      })
      toast.success('Job added successfully')
      // Refresh in background if needed
      fetchJobs()
    } catch (e) {
      console.error('Failed to add job', e)
      toast.error('Failed to add job')
    }
  }

  const editJob = async (id, updates) => {
    if (isDisabled) { toast.error('Account disabled — cannot edit jobs'); return }
    try {
      if (updates.status) {
        // Optimistic update for status change
        setState(prevState => {
          const oldJob = prevState.jobs[id]
          if (!oldJob || oldJob.status === updates.status) return prevState
          
          const oldCol = oldJob.status
          const newCol = updates.status
          
          const newColumns = { ...prevState.columns }
          newColumns[oldCol] = (newColumns[oldCol] || []).filter(jid => jid !== id)
          newColumns[newCol] = [id, ...(newColumns[newCol] || [])]
          
          const newJobs = {
            ...prevState.jobs,
            [id]: { ...oldJob, ...updates }
          }
          
          return { ...prevState, columns: newColumns, jobs: newJobs }
        })
        await api.patch(`/jobs/${id}/status`, { status: updates.status })
      }
      
      const detailsUpdates = { ...updates }
      delete detailsUpdates.status
      if (Object.keys(detailsUpdates).length > 0) {
        await api.patch(`/jobs/${id}`, detailsUpdates)
      }
      
      // Background refresh to ensure consistency
      fetchJobs()
      toast.success('Job updated')
    } catch (e) {
      console.error('Failed to edit job', e)
      toast.error('Failed to update job')
      fetchJobs() // Revert on failure
    }
  }

  const deleteJob = async (id) => {
    if (isDisabled) { toast.error('Account disabled — cannot delete jobs'); return }
    try {
      await api.delete(`/jobs/${id}`)
      setState(prevState => {
        const job = prevState.jobs[id]
        if (!job) return prevState
        const col = job.status
        const newJobs = { ...prevState.jobs }
        delete newJobs[id]
        const newColumns = { ...prevState.columns }
        newColumns[col] = (newColumns[col] || []).filter(jid => jid !== id)
        return {
          ...prevState,
          jobs: newJobs,
          columns: newColumns
        }
      })
      toast.success('Job deleted')
    } catch (e) {
      console.error('Failed to delete job', e)
      toast.error('Failed to delete job')
      fetchJobs()
    }
  }

  const moveJob = async (jobId, sourceCol, destCol, sourceIndex, destIndex) => {
    if (isDisabled) { toast.error('Account disabled — cannot move jobs'); return }
    try {
      setState(prevState => {
        const sourceIds = Array.from(prevState.columns[sourceCol] || [])
        const destIds = sourceCol === destCol ? sourceIds : Array.from(prevState.columns[destCol] || [])
        
        sourceIds.splice(sourceIndex, 1)
        destIds.splice(destIndex, 0, jobId)
        
        const newColumns = {
          ...prevState.columns,
          [sourceCol]: sourceIds,
          [destCol]: destIds
        }
        
        const newJobs = {
          ...prevState.jobs,
          [jobId]: { ...prevState.jobs[jobId], status: destCol }
        }
        
        return {
          ...prevState,
          columns: newColumns,
          jobs: newJobs
        }
      })
      await api.patch(`/jobs/${jobId}/status`, { status: destCol, boardPosition: destIndex })
      //fetchJobs() // Optional if optimistic is good
    } catch (e) {
      console.error('Failed to move job', e)
      toast.error('Failed to move job')
      fetchJobs() // Revert
    }
  }

  const allJobs = Object.values(state.jobs)
  const totalJobs = allJobs.length

  return (
    <JobContext.Provider value={{ state, allJobs, totalJobs, addJob, editJob, deleteJob, moveJob, fetchJobs, loading, isInitialLoading }}>
      {children}
    </JobContext.Provider>
  )
}

export function useJobs() {
  const context = useContext(JobContext)
  if (!context) throw new Error('useJobs must be used within a JobProvider')
  return context
}
