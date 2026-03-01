import { createContext, useContext, useState, useEffect } from 'react'
import { INITIAL_STATE } from '../utils/constants'
import api from '../utils/api'
import { toast } from 'sonner'

const JobContext = createContext(null)

export function JobProvider({ children }) {
  const [state, setState] = useState(INITIAL_STATE)
  const [loading, setLoading] = useState(true)

  const fetchJobs = async () => {
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
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const addJob = async (jobData) => {
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
    } catch (e) {
      console.error('Failed to add job', e)
      toast.error('Failed to add job')
    }
  }

  const editJob = async (id, updates) => {
    try {
      if (updates.status) {
        await api.patch(`/jobs/${id}/status`, { status: updates.status })
      }
      
      const detailsUpdates = { ...updates }
      delete detailsUpdates.status
      if (Object.keys(detailsUpdates).length > 0) {
        await api.patch(`/jobs/${id}`, detailsUpdates)
      }
      
      // Update UI optimistically or refetch
      await fetchJobs()
      toast.success('Job updated')
    } catch (e) {
      console.error('Failed to edit job', e)
      toast.error('Failed to update job')
    }
  }

  const deleteJob = async (id) => {
    try {
      await api.delete(`/jobs/${id}`)
      setState(prevState => {
        const job = prevState.jobs[id]
        if (!job) return prevState
        const col = job.status
        const newJobs = { ...prevState.jobs }
        delete newJobs[id]
        return {
          ...prevState,
          jobs: newJobs,
          columns: { ...prevState.columns, [col]: prevState.columns[col].filter(jid => jid !== id) }
        }
      })
      toast.success('Job deleted')
    } catch (e) {
      console.error('Failed to delete job', e)
      toast.error('Failed to delete job')
    }
  }

  const moveJob = async (jobId, sourceCol, destCol, sourceIndex, destIndex) => {
    try {
      setState(prevState => {
        const newState = { ...prevState }
        if (sourceCol === destCol) {
          const colJobs = [...newState.columns[sourceCol]]
          colJobs.splice(sourceIndex, 1)
          colJobs.splice(destIndex, 0, jobId)
          newState.columns[sourceCol] = colJobs
        } else {
          const srcJobs = [...newState.columns[sourceCol]]
          srcJobs.splice(sourceIndex, 1)
          const destJobs = [...newState.columns[destCol]]
          destJobs.splice(destIndex, 0, jobId)
          newState.columns[sourceCol] = srcJobs
          newState.columns[destCol] = destJobs
          newState.jobs[jobId].status = destCol
        }
        return newState
      })
      await api.patch(`/jobs/${jobId}/status`, { status: destCol, boardPosition: destIndex })
      await fetchJobs()
    } catch (e) {
      console.error('Failed to move job', e)
      toast.error('Failed to move job')
      await fetchJobs() // Revert
    }
  }

  const allJobs = Object.values(state.jobs)
  const totalJobs = allJobs.length

  return (
    <JobContext.Provider value={{ state, allJobs, totalJobs, addJob, editJob, deleteJob, moveJob, fetchJobs, loading }}>
      {children}
    </JobContext.Provider>
  )
}

export function useJobs() {
  const context = useContext(JobContext)
  if (!context) throw new Error('useJobs must be used within a JobProvider')
  return context
}
