import { createContext, useContext, useState, useCallback } from 'react'

const translations = {
  en: {
    // Header
    appName: 'HireWithAndi',
    jobsTracked: '{count} job{s} tracked',
    addJob: 'Add Job',
    dashboard: 'Dashboard',
    board: 'Board',
    gantt: 'Gantt',
    table: 'Table',

    // Columns
    wishlist: 'Wishlist',
    applied: 'Applied',
    hr_interview: 'HR Interview',
    technical_interview: 'Technical Interview',
    additional_interview: 'Additional Interview',
    offered: 'Offered',
    rejected: 'Rejected',

    // Job Card
    daysHere: '{days} here',
    today: 'Today',
    day: '1 day',
    days: '{count} days',
    viewPosting: 'View posting',

    // Modal
    newApplication: 'New Application',
    editApplication: 'Edit Application',
    company: 'Company',
    companyPlaceholder: 'e.g. Google',
    position: 'Position',
    positionPlaceholder: 'e.g. Frontend Engineer',
    jobUrl: 'Job URL',
    salaryRange: 'Salary Range',
    salaryPlaceholder: 'e.g. $80k - $120k',
    status: 'Status',
    dateApplied: 'Date Applied',
    notes: 'Notes',
    notesPlaceholder: 'Add any notes about this application...',
    openJobPosting: 'Open job posting',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    addApplication: 'Add Application',
    deleteConfirm: 'Are you sure you want to delete this job?',

    // Work Type
    workType: 'Work Type',
    remote: 'Remote',
    onsite: 'On-site',
    hybrid: 'Hybrid',
    location: 'Location',
    locationPlaceholder: 'e.g. Jakarta, Indonesia',

    // Offer Details
    offerDetails: 'Offer Details',
    finalOffer: 'Final Offer',
    finalOfferPlaceholder: 'e.g. $130,000/year',
    benefits: 'Benefits',
    benefitsPlaceholder: 'e.g. Health insurance, 401k, PTO...',
    nonMonetaryBenefits: 'Non-Monetary Benefits',
    nonMonetaryPlaceholder: 'e.g. Remote work, flexible hours, learning budget...',

    // Table
    filter: 'Filter',
    all: 'All',
    daysSinceApplied: 'Days Since',
    inStage: 'In Stage',
    actions: 'Actions',

    // Timeline
    noApplicationsYet: 'No applications yet',
    addFirstJob: 'Add your first job to see the timeline',
    daysAgo: '{days} ago',
    daysInStage: '{days} in stage',

    // Empty states
    noJobsHere: 'No jobs here',
    addOne: '+ Add one',

    // Language
    language: 'Language',
  },
  id: {
    // Header
    appName: 'HireWithAndi',
    jobsTracked: '{count} lamaran dilacak',
    addJob: 'Tambah',
    dashboard: 'Dasbor',
    board: 'Papan',
    gantt: 'Gantt',
    table: 'Tabel',

    // Columns
    wishlist: 'Wishlist',
    applied: 'Dilamar',
    hr_interview: 'Interview HR',
    technical_interview: 'Interview Teknis',
    additional_interview: 'Interview Tambahan',
    offered: 'Ditawari',
    rejected: 'Ditolak',

    // Job Card
    daysHere: '{days} di sini',
    today: 'Hari ini',
    day: '1 hari',
    days: '{count} hari',
    viewPosting: 'Lihat lowongan',

    // Modal
    newApplication: 'Lamaran Baru',
    editApplication: 'Edit Lamaran',
    company: 'Perusahaan',
    companyPlaceholder: 'contoh: Google',
    position: 'Posisi',
    positionPlaceholder: 'contoh: Frontend Engineer',
    jobUrl: 'URL Lowongan',
    salaryRange: 'Kisaran Gaji',
    salaryPlaceholder: 'contoh: Rp 15jt - 25jt',
    status: 'Status',
    dateApplied: 'Tanggal Melamar',
    notes: 'Catatan',
    notesPlaceholder: 'Tambahkan catatan tentang lamaran ini...',
    openJobPosting: 'Buka lowongan',
    cancel: 'Batal',
    saveChanges: 'Simpan',
    addApplication: 'Tambah Lamaran',
    deleteConfirm: 'Yakin ingin menghapus lamaran ini?',

    // Work Type
    workType: 'Tipe Kerja',
    remote: 'Remote',
    onsite: 'On-site',
    hybrid: 'Hybrid',
    location: 'Lokasi',
    locationPlaceholder: 'contoh: Jakarta, Indonesia',

    // Offer Details
    offerDetails: 'Detail Penawaran',
    finalOffer: 'Penawaran Final',
    finalOfferPlaceholder: 'contoh: Rp 25.000.000/bulan',
    benefits: 'Benefit',
    benefitsPlaceholder: 'contoh: BPJS, asuransi kesehatan, cuti...',
    nonMonetaryBenefits: 'Benefit Non-Moneter',
    nonMonetaryPlaceholder: 'contoh: WFH, jam fleksibel, budget belajar...',

    // Table
    filter: 'Filter',
    all: 'Semua',
    daysSinceApplied: 'Hari Sejak',
    inStage: 'Di Tahap',
    actions: 'Aksi',

    // Timeline
    noApplicationsYet: 'Belum ada lamaran',
    addFirstJob: 'Tambahkan lamaran pertama untuk melihat linimasa',
    daysAgo: '{days} lalu',
    daysInStage: '{days} di tahap',

    // Empty states
    noJobsHere: 'Belum ada lamaran',
    addOne: '+ Tambah',

    // Language
    language: 'Bahasa',
  },
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    try {
      return localStorage.getItem('hirewithandi_locale') || 'en'
    } catch {
      return 'en'
    }
  })

  const toggleLocale = useCallback(() => {
    setLocale(prev => {
      const next = prev === 'en' ? 'id' : 'en'
      try { localStorage.setItem('hirewithandi_locale', next) } catch {}
      return next
    })
  }, [])

  const t = useCallback((key, params = {}) => {
    let str = translations[locale]?.[key] || translations.en[key] || key
    Object.entries(params).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, v)
    })
    return str
  }, [locale])

  // Helper for column labels
  const colLabel = useCallback((colId) => {
    return translations[locale]?.[colId] || translations.en[colId] || colId
  }, [locale])

  return (
    <I18nContext.Provider value={{ locale, toggleLocale, t, colLabel }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within an I18nProvider')
  return context
}
