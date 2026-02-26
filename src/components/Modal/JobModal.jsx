import { useState, useEffect } from 'react'
import { X, Trash2, ExternalLink } from 'lucide-react'
import { COLUMNS } from '../../utils/constants'
import { useJobs } from '../../context/JobContext'

export default function JobModal({ isOpen, onClose, editingJob, defaultStatus = 'wishlist' }) {
  const { addJob, editJob, deleteJob } = useJobs()
  const isEditing = !!editingJob

  const [form, setForm] = useState({
    company: '',
    position: '',
    url: '',
    salary: '',
    notes: '',
    status: 'wishlist',
    dateApplied: new Date().toISOString().slice(0, 10),
  })

  useEffect(() => {
    if (editingJob) {
      setForm({
        company: editingJob.company || '',
        position: editingJob.position || '',
        url: editingJob.url || '',
        salary: editingJob.salary || '',
        notes: editingJob.notes || '',
        status: editingJob.status || 'wishlist',
        dateApplied: editingJob.dateApplied ? editingJob.dateApplied.slice(0, 10) : '',
      })
    } else {
      setForm({
        company: '',
        position: '',
        url: '',
        salary: '',
        notes: '',
        status: defaultStatus || 'wishlist',
        dateApplied: new Date().toISOString().slice(0, 10),
      })
    }
  }, [editingJob, isOpen])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.company.trim()) return

    if (isEditing) {
      editJob(editingJob.id, {
        ...form,
        dateApplied: form.dateApplied ? new Date(form.dateApplied).toISOString() : null,
      })
    } else {
      addJob({
        ...form,
        dateApplied: form.dateApplied ? new Date(form.dateApplied).toISOString() : null,
      })
    }
    onClose()
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJob(editingJob.id)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="modal-content w-full max-w-lg rounded-t-2xl bg-slate-800 shadow-2xl sm:rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-700/50 px-5 py-4">
          <h2 className="text-lg font-bold text-white">
            {isEditing ? 'Edit Application' : 'New Application'}
          </h2>
          <div className="flex items-center gap-2">
            {isEditing && (
              <button
                onClick={handleDelete}
                className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto p-5">
          {/* Company */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Company *</label>
            <input
              type="text"
              value={form.company}
              onChange={e => handleChange('company', e.target.value)}
              placeholder="e.g. Google"
              className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              required
              autoFocus
            />
          </div>

          {/* Position */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Position</label>
            <input
              type="text"
              value={form.position}
              onChange={e => handleChange('position', e.target.value)}
              placeholder="e.g. Frontend Engineer"
              className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* URL + Salary row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Job URL</label>
              <input
                type="url"
                value={form.url}
                onChange={e => handleChange('url', e.target.value)}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Salary Range</label>
              <input
                type="text"
                value={form.salary}
                onChange={e => handleChange('salary', e.target.value)}
                placeholder="e.g. $80k - $120k"
                className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Status + Date row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Status</label>
              <select
                value={form.status}
                onChange={e => handleChange('status', e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                {COLUMNS.map(col => (
                  <option key={col.id} value={col.id}>{col.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Date Applied</label>
              <input
                type="date"
                value={form.dateApplied}
                onChange={e => handleChange('dateApplied', e.target.value)}
                className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => handleChange('notes', e.target.value)}
              placeholder="Add any notes about this application..."
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-400 transition-colors focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* URL preview */}
          {form.url && (
            <a
              href={form.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-slate-700/30 px-4 py-2.5 text-sm text-violet-400 transition-colors hover:bg-slate-700/50"
            >
              <ExternalLink className="h-4 w-4" />
              Open job posting
            </a>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:brightness-110"
            >
              {isEditing ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
