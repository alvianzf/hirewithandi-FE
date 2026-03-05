import { useState, useEffect } from 'react'
import { X, Trash2, ExternalLink, Clock, ChevronDown, ChevronUp, Calendar } from 'lucide-react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { formatRelativeTime } from '../../utils/helpers'
import { COLUMNS, COLUMN_MAP, WORK_TYPES } from '../../utils/constants'
import { useJobs } from '../../context/JobContext'
import { useI18n } from '../../context/I18nContext'
import Swal from 'sweetalert2'
import CustomSelect from '../CustomSelect'

export default function JobModal({ isOpen, onClose, editingJob, defaultStatus = 'wishlist', isDisabled }) {
  const { addJob, editJob, deleteJob } = useJobs()
  const { t, colLabel } = useI18n()
  const isEditing = !!editingJob
  const [showHistory, setShowHistory] = useState(false)

  const [form, setForm] = useState({
    company: '',
    position: '',
    url: '',
    salary: '',
    notes: '',
    status: 'wishlist',
    dateApplied: new Date().toLocaleDateString('en-CA'), // 'YYYY-MM-DD' local time
    workType: 'remote',
    location: '',
    finalOffer: '',
    benefits: '',
    nonMonetaryBenefits: '',
    jobFitPercentage: '',
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
        dateApplied: editingJob.dateApplied ? new Date(editingJob.dateApplied).toLocaleDateString('en-CA') : '',
        workType: (editingJob.workType || 'remote').toLowerCase(),
        location: editingJob.location || '',
        finalOffer: editingJob.finalOffer || '',
        benefits: editingJob.benefits || '',
        nonMonetaryBenefits: editingJob.nonMonetaryBenefits || '',
        jobFitPercentage: editingJob.jobFitPercentage || '',
      })
    } else {
      setForm({
        company: '',
        position: '',
        url: '',
        salary: '',
        notes: '',
        status: defaultStatus || 'wishlist',
        dateApplied: new Date().toLocaleDateString('en-CA'),
        workType: 'remote',
        location: '',
        finalOffer: '',
        benefits: '',
        nonMonetaryBenefits: '',
        jobFitPercentage: '',
      })
    }
  }, [editingJob, isOpen, defaultStatus])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleJobFitChange = (value) => {
    // allow only digits, up to 3 chars
    if (/^\d{0,3}$/.test(value)) {
      handleChange('jobFitPercentage', value)
    }
  }

  const handleJobFitBlur = () => {
    const parsed = parseInt(form.jobFitPercentage, 10)
    if (isNaN(parsed)) {
      handleChange('jobFitPercentage', '')
    } else {
      handleChange('jobFitPercentage', String(Math.min(100, Math.max(0, parsed))))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.company.trim()) return

    const jobFit = form.jobFitPercentage !== '' ? parseInt(form.jobFitPercentage, 10) : ''

    if (isEditing) {
      editJob(editingJob.id, {
        ...form,
        jobFitPercentage: isNaN(jobFit) ? '' : jobFit,
        dateApplied: form.dateApplied ? new Date(form.dateApplied).toISOString() : null,
      })
    } else {
      addJob({
        ...form,
        jobFitPercentage: isNaN(jobFit) ? '' : jobFit,
        dateApplied: form.dateApplied ? new Date(form.dateApplied).toISOString() : null,
      })
    }
    onClose()
  }

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: t('deleteConfirm'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: 'rgba(255, 255, 255, 0.08)',
      confirmButtonText: t('yes') || 'Yes',
      cancelButtonText: t('cancel') || 'Cancel',
      background: '#171717',
      color: '#fff',
      customClass: {
        popup: 'rounded-3xl border border-white/[0.08] shadow-2xl',
        cancelButton: 'text-neutral-300 border border-white/[0.08] hover:bg-neutral-800',
      }
    });

    if (result.isConfirmed) {
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
            {isEditing && !isDisabled && (
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
          {isDisabled && (
            <div className="flex items-center gap-3 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 px-5 py-4 text-yellow-500/90 shadow-lg shadow-yellow-400/5 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/20 text-yellow-400 flex-shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-widest leading-none mb-1">Read-Only Mode</p>
                <p className="text-[11px] font-medium text-yellow-400/70 leading-tight">Your account is disabled. You can view details but cannot save changes.</p>
              </div>
            </div>
          )}
          {/* Position */}
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-300">{t('position')} *</label>
            <input
              type="text"
              value={form.position}
              onChange={e => handleChange('position', e.target.value)}
              placeholder={t('positionPlaceholder')}
              className={inputClass}
              required
              autoFocus
              disabled={isDisabled}
            />
          </div>

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
              disabled={isDisabled}
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
                disabled={isDisabled}
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
                disabled={isDisabled}
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
                  onClick={() => !isDisabled && handleChange('workType', wt.id)}
                  disabled={isDisabled}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    form.workType === wt.id
                      ? 'border-yellow-400/50 bg-yellow-400/10 text-yellow-400'
                      : 'border-white/[0.08] bg-white/[0.02] text-neutral-400 hover:border-white/[0.15] hover:text-neutral-300'
                  } ${isDisabled ? 'cursor-not-allowed opacity-80' : ''}`}
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
                disabled={isDisabled}
              />
            </div>
          )}

          {/* Status + Date + JFP */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">{t('status')}</label>
              <div className="flex items-center gap-3">
                <div
                  className="h-3 w-3 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: COLUMN_MAP[form.status]?.color }}
                />
                <CustomSelect
                  value={form.status}
                  onChange={e => handleChange('status', e.target.value)}
                  options={COLUMNS.map(col => ({ value: col.id, label: colLabel(col.id) }))}
                  disabled={isDisabled}
                  className="flex-1"
                  style={{
                    backgroundColor: `${COLUMN_MAP[form.status]?.color}18`,
                    color: COLUMN_MAP[form.status]?.color,
                    borderColor: `${COLUMN_MAP[form.status]?.color}30`,
                  }}
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-300">{t('dateApplied')}</label>
              <div className="relative">
                <DatePicker
                  selected={form.dateApplied ? new Date(form.dateApplied) : null}
                  onChange={date => {
                    if (date) {
                      handleChange('dateApplied', date.toLocaleDateString('en-CA')) // YYYY-MM-DD
                    } else {
                      handleChange('dateApplied', '')
                    }
                  }}
                  dateFormat="MMM d, yyyy"
                  className={`${inputClass} !pl-10 !py-3.5 ${isDisabled ? 'cursor-not-allowed opacity-80' : ''}`}
                  calendarClassName="dark-theme-calendar"
                  popperPlacement="bottom-start"
                  disabled={isDisabled}
                />
                <Calendar className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-300">{t('jobFitPercentage')}</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.jobFitPercentage}
                  onChange={e => handleJobFitChange(e.target.value)}
                  onBlur={handleJobFitBlur}
                  placeholder="0-100"
                  className={`${inputClass} pr-10`}
                  disabled={isDisabled}
                />
                <span className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold ${
                  form.jobFitPercentage !== '' && parseInt(form.jobFitPercentage, 10) < 80 ? 'text-red-400' : form.jobFitPercentage !== '' && parseInt(form.jobFitPercentage, 10) >= 80 ? 'text-green-400' : 'text-neutral-500'
                }`}>%</span>
              </div>
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
                  disabled={isDisabled}
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
                  disabled={isDisabled}
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
                  disabled={isDisabled}
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
              disabled={isDisabled}
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

          {/* Activity History Accordion */}
          {isEditing && editingJob?.history && editingJob.history.length > 0 && (
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
              <button
                type="button"
                onClick={() => setShowHistory(!showHistory)}
                className="flex w-full items-center justify-between px-5 py-3.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/[0.04]"
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-neutral-400" />
                  Activity History
                </div>
                {showHistory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              
              {showHistory && (
                <div className="border-t border-white/[0.08] p-5 space-y-4">
                  {[...(editingJob.history || [])].sort((a, b) => new Date(b.enteredAt) - new Date(a.enteredAt)).map((hist, index, array) => (
                    <div key={hist.id || index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full mt-1.5" style={{ backgroundColor: COLUMN_MAP[hist.status]?.color || '#6c757d' }} />
                        {index !== array.length - 1 && (
                          <div className="w-[1px] h-full bg-white/[0.08] my-1" />
                        )}
                      </div>
                      <div className="pb-2">
                        <p className="text-sm font-medium text-white">
                          Moved to <span style={{ color: COLUMN_MAP[hist.status]?.color }}>{colLabel(hist.status)}</span>
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {new Date(hist.enteredAt).toLocaleString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/[0.08] px-5 py-3.5 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800"
            >
              {isDisabled ? 'Dismiss' : t('cancel')}
            </button>
            {!isDisabled && (
              <button
                type="submit"
                className="flex-1 rounded-xl bg-yellow-400 px-5 py-3.5 text-sm font-bold text-black shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-300 hover:shadow-yellow-400/40"
              >
                {isEditing ? t('saveChanges') : t('addApplication')}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
