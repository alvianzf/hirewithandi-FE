import { useState, useEffect } from 'react'
import { X, Trash2, ExternalLink } from 'lucide-react'
import { COLUMNS, COLUMN_MAP, WORK_TYPES } from '../../utils/constants'
import { useJobs } from '../../context/JobContext'
import { useI18n } from '../../context/I18nContext'

export default function JobModal({ isOpen, onClose, editingJob, defaultStatus = 'wishlist' }) {
  const { addJob, editJob, deleteJob } = useJobs()
  const { t, colLabel } = useI18n()
  const isEditing = !!editingJob

  const [form, setForm] = useState({
    company: '',
    position: '',
    url: '',
    salary: '',
    notes: '',
    status: 'wishlist',
    dateApplied: new Date().toISOString().slice(0, 10),
    workType: 'remote',
    location: '',
    finalOffer: '',
    benefits: '',
    nonMonetaryBenefits: '',
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
        workType: editingJob.workType || 'remote',
        location: editingJob.location || '',
        finalOffer: editingJob.finalOffer || '',
        benefits: editingJob.benefits || '',
        nonMonetaryBenefits: editingJob.nonMonetaryBenefits || '',
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
        workType: 'remote',
        location: '',
        finalOffer: '',
        benefits: '',
        nonMonetaryBenefits: '',
      })
    }
  }, [editingJob, isOpen, defaultStatus])

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
    if (window.confirm(t('deleteConfirm'))) {
      deleteJob(editingJob.id)
      onClose()
    }
  }

  if (!isOpen) return null

  const inputClass = 'w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-5 py-3.5 text-sm text-white placeholder-neutral-500 transition-colors focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50'

  return (
    <div className="modal-overlay fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        className="modal-content w-full max-w-xl rounded-t-3xl border border-white/[0.08] bg-neutral-900 shadow-2xl sm:rounded-3xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-8 py-6">
          <h2 className="text-lg font-bold text-white">
            {isEditing ? t('editApplication') : t('newApplication')}
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
              className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-6 overflow-y-auto p-8">
          {/* Company */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">{t('company')} *</label>
            <input
              type="text"
              value={form.company}
              onChange={e => handleChange('company', e.target.value)}
              placeholder={t('companyPlaceholder')}
              className={inputClass}
              required
              autoFocus
            />
          </div>

          {/* Position */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">{t('position')}</label>
            <input
              type="text"
              value={form.position}
              onChange={e => handleChange('position', e.target.value)}
              placeholder={t('positionPlaceholder')}
              className={inputClass}
            />
          </div>

          {/* URL + Salary */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">{t('jobUrl')}</label>
              <input
                type="url"
                value={form.url}
                onChange={e => handleChange('url', e.target.value)}
                placeholder="https://..."
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">{t('salaryRange')}</label>
              <input
                type="text"
                value={form.salary}
                onChange={e => handleChange('salary', e.target.value)}
                placeholder={t('salaryPlaceholder')}
                className={inputClass}
              />
            </div>
          </div>

          {/* Work Type */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">{t('workType')}</label>
            <div className="flex gap-3">
              {WORK_TYPES.map(wt => (
                <button
                  key={wt.id}
                  type="button"
                  onClick={() => handleChange('workType', wt.id)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    form.workType === wt.id
                      ? 'border-yellow-400/50 bg-yellow-400/10 text-yellow-400'
                      : 'border-white/[0.08] bg-white/[0.02] text-neutral-400 hover:border-white/[0.15] hover:text-neutral-300'
                  }`}
                >
                  <span>{wt.icon}</span>
                  {t(wt.id)}
                </button>
              ))}
            </div>
          </div>

          {/* Location (shown for on-site and hybrid) */}
          {(form.workType === 'onsite' || form.workType === 'hybrid') && (
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">{t('location')}</label>
              <input
                type="text"
                value={form.location}
                onChange={e => handleChange('location', e.target.value)}
                placeholder={t('locationPlaceholder')}
                className={inputClass}
              />
            </div>
          )}

          {/* Status + Date */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">{t('status')}</label>
              <div className="relative">
                <select
                  value={form.status}
                  onChange={e => handleChange('status', e.target.value)}
                  className="w-full appearance-none rounded-xl border-0 px-5 py-3.5 pr-10 text-sm font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-colors"
                  style={{
                    backgroundColor: `${COLUMN_MAP[form.status]?.color}18`,
                    color: COLUMN_MAP[form.status]?.color,
                  }}
                >
                  {COLUMNS.map(col => (
                    <option key={col.id} value={col.id}>{colLabel(col.id)}</option>
                  ))}
                </select>
                <div
                  className="pointer-events-none absolute left-4 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full"
                  style={{ backgroundColor: COLUMN_MAP[form.status]?.color }}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">{t('dateApplied')}</label>
              <input
                type="date"
                value={form.dateApplied}
                onChange={e => handleChange('dateApplied', e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Offer Details — shown when status is 'offered' */}
          {form.status === 'offered' && (
            <div className="space-y-5 rounded-2xl border border-green-500/20 bg-green-500/[0.03] p-6">
              <h3 className="text-sm font-bold text-green-400">{t('offerDetails')} 🎉</h3>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-300">{t('finalOffer')}</label>
                <input
                  type="text"
                  value={form.finalOffer}
                  onChange={e => handleChange('finalOffer', e.target.value)}
                  placeholder={t('finalOfferPlaceholder')}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-300">{t('benefits')}</label>
                <textarea
                  value={form.benefits}
                  onChange={e => handleChange('benefits', e.target.value)}
                  placeholder={t('benefitsPlaceholder')}
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-300">{t('nonMonetaryBenefits')}</label>
                <textarea
                  value={form.nonMonetaryBenefits}
                  onChange={e => handleChange('nonMonetaryBenefits', e.target.value)}
                  placeholder={t('nonMonetaryPlaceholder')}
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-300">{t('notes')}</label>
            <textarea
              value={form.notes}
              onChange={e => handleChange('notes', e.target.value)}
              placeholder={t('notesPlaceholder')}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* URL preview */}
          {form.url && (
            <a
              href={form.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-5 py-3 text-sm text-yellow-400 transition-colors hover:bg-white/[0.06]"
            >
              <ExternalLink className="h-4 w-4" />
              {t('openJobPosting')}
            </a>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/[0.08] px-5 py-3.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-yellow-400 px-5 py-3.5 text-sm font-bold text-black shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-300 hover:shadow-yellow-400/40"
            >
              {isEditing ? t('saveChanges') : t('addApplication')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
