import { createContext, useContext, useReducer } from 'react'
import { STORAGE_KEY, INITIAL_STATE } from '../utils/constants'
import { generateId } from '../utils/helpers'

const JobContext = createContext(null)

function loadState() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data)
      for (const col of INITIAL_STATE.columnOrder) {
        if (!parsed.columns[col]) parsed.columns[col] = []
      }
      return parsed
    }
  } catch (e) {
    console.error('Failed to load state:', e)
  }
  return INITIAL_STATE
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('Failed to save state:', e)
  }
}

function jobReducer(state, action) {
  let newState
  switch (action.type) {
    case 'ADD_JOB': {
      const id = generateId()
      const now = new Date().toISOString()
      const job = {
        id,
        company: action.payload.company || '',
        position: action.payload.position || '',
        url: action.payload.url || '',
        salary: action.payload.salary || '',
        notes: action.payload.notes || '',
        workType: action.payload.workType || 'remote',
        location: action.payload.location || '',
        finalOffer: action.payload.finalOffer || '',
        benefits: action.payload.benefits || '',
        nonMonetaryBenefits: action.payload.nonMonetaryBenefits || '',
        dateApplied: action.payload.dateApplied || now,
        dateAdded: now,
        status: action.payload.status || 'wishlist',
        statusChangedAt: now,
        history: [{ status: action.payload.status || 'wishlist', enteredAt: now, leftAt: null }],
      }
      const col = job.status
      newState = {
        ...state,
        jobs: { ...state.jobs, [id]: job },
        columns: { ...state.columns, [col]: [id, ...state.columns[col]] },
      }
      break
    }
    case 'EDIT_JOB': {
      const { id, ...updates } = action.payload
      const existingJob = state.jobs[id]
      if (!existingJob) return state

      const updatedJob = { ...existingJob, ...updates }

      if (updates.status && updates.status !== existingJob.status) {
        const now = new Date().toISOString()
        const history = existingJob.history.map(h =>
          h.leftAt === null ? { ...h, leftAt: now } : h
        )
        history.push({ status: updates.status, enteredAt: now, leftAt: null })
        updatedJob.history = history
        updatedJob.statusChangedAt = now

        const oldCol = existingJob.status
        const newCol = updates.status
        const oldColJobs = state.columns[oldCol].filter(jid => jid !== id)
        const newColJobs = [id, ...state.columns[newCol]]

        newState = {
          ...state,
          jobs: { ...state.jobs, [id]: updatedJob },
          columns: { ...state.columns, [oldCol]: oldColJobs, [newCol]: newColJobs },
        }
      } else {
        newState = {
          ...state,
          jobs: { ...state.jobs, [id]: updatedJob },
        }
      }
      break
    }
    case 'DELETE_JOB': {
      const { id } = action.payload
      const job = state.jobs[id]
      if (!job) return state
      const { [id]: removed, ...remainingJobs } = state.jobs
      const col = job.status
      newState = {
        ...state,
        jobs: remainingJobs,
        columns: { ...state.columns, [col]: state.columns[col].filter(jid => jid !== id) },
      }
      break
    }
    case 'MOVE_JOB': {
      const { jobId, sourceCol, destCol, sourceIndex, destIndex } = action.payload
      const now = new Date().toISOString()

      if (sourceCol === destCol) {
        const colJobs = [...state.columns[sourceCol]]
        colJobs.splice(sourceIndex, 1)
        colJobs.splice(destIndex, 0, jobId)
        newState = {
          ...state,
          columns: { ...state.columns, [sourceCol]: colJobs },
        }
      } else {
        const srcJobs = [...state.columns[sourceCol]]
        srcJobs.splice(sourceIndex, 1)
        const destJobs = [...state.columns[destCol]]
        destJobs.splice(destIndex, 0, jobId)

        const existingJob = state.jobs[jobId]
        const history = existingJob.history.map(h =>
          h.leftAt === null ? { ...h, leftAt: now } : h
        )
        history.push({ status: destCol, enteredAt: now, leftAt: null })

        newState = {
          ...state,
          jobs: {
            ...state.jobs,
            [jobId]: { ...existingJob, status: destCol, statusChangedAt: now, history },
          },
          columns: { ...state.columns, [sourceCol]: srcJobs, [destCol]: destJobs },
        }
      }
      break
    }
    default:
      return state
  }

  saveState(newState)
  return newState
}

export function JobProvider({ children }) {
  const [state, dispatch] = useReducer(jobReducer, null, loadState)

  const addJob = (jobData) => dispatch({ type: 'ADD_JOB', payload: jobData })
  const editJob = (id, updates) => dispatch({ type: 'EDIT_JOB', payload: { id, ...updates } })
  const deleteJob = (id) => dispatch({ type: 'DELETE_JOB', payload: { id } })
  const moveJob = (jobId, sourceCol, destCol, sourceIndex, destIndex) =>
    dispatch({ type: 'MOVE_JOB', payload: { jobId, sourceCol, destCol, sourceIndex, destIndex } })

  const allJobs = Object.values(state.jobs)
  const totalJobs = allJobs.length

  return (
    <JobContext.Provider value={{ state, allJobs, totalJobs, addJob, editJob, deleteJob, moveJob }}>
      {children}
    </JobContext.Provider>
  )
}

export function useJobs() {
  const context = useContext(JobContext)
  if (!context) throw new Error('useJobs must be used within a JobProvider')
  return context
}
