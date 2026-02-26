import { createContext, useContext, useState, useCallback } from 'react'

const translations = {
  en: {
    // Header
    appName: 'HiredWithAndi',
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
    rejected_company: 'Rejected by Company',
    rejected_applicant: 'Rejected by Applicant',

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

    // JFP
    jobFitPercentage: 'Job Fit %',
    jfpPlaceholder: '0-100',
  },
  id: {
    // Header
    appName: 'HiredWithAndi',
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
    rejected_company: 'Ditolak Perusahaan',
    rejected_applicant: 'Ditolak Pelamar',

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
    language: 'Indonesia Indonesia',

    // JFP
    jobFitPercentage: 'Job Fit %',
    jfpPlaceholder: '0-100',
  },
  id_corp: {
    // Header
    appName: 'HiredWithAndi',
    jobsTracked: '{count} pipeline terjaga',
    addJob: 'Tambah',
    dashboard: 'Dasbor',
    board: 'Board',
    gantt: 'Gantt Chart',
    table: 'Tabel',

    // Columns
    wishlist: 'Wishlist (KPI)',
    applied: 'Terkirim (SLA start)',
    hr_interview: 'HR Screening',
    technical_interview: 'Tech Assessment',
    additional_interview: 'Final Alignment',
    offered: 'Offering (Win)',
    rejected_company: 'Not Culture Fit',
    rejected_applicant: 'Declined (Budget Issue)',

    // Job Card
    daysHere: '{days} aging',
    today: 'Hari ini',
    day: '1 hari',
    days: '{count} hari',
    viewPosting: 'Cek JD',

    // Modal
    newApplication: 'Input Pipeline Baru',
    editApplication: 'Edit Data Pipeline',
    company: 'Company',
    companyPlaceholder: 'contoh: Gojek',
    position: 'Role',
    positionPlaceholder: 'contoh: VP of Engineering',
    jobUrl: 'Link Loker',
    salaryRange: 'Ekspektasi THP',
    salaryPlaceholder: 'contoh: Rp 50jt - 60jt',
    status: 'Status Saat Ini',
    dateApplied: 'Tanggal Submit',
    notes: 'MoM / Catatan',
    notesPlaceholder: 'Highlight dari screening...',
    openJobPosting: 'Buka JD aslinya',
    cancel: 'Cancel',
    saveChanges: 'Update Data',
    addApplication: 'Simpan ke Pipeline',
    deleteConfirm: 'Yakin mau drop pipeline ini?',

    // Work Type
    workType: 'Setup Kerja',
    remote: 'WFA',
    onsite: 'WFO',
    hybrid: 'Hybrid (Agile)',
    location: 'Base Location',
    locationPlaceholder: 'contoh: SCBD, Jakarta',

    // Offer Details
    offerDetails: 'Term Sheet Details',
    finalOffer: 'Final THP',
    finalOfferPlaceholder: 'contoh: Rp 45.000.000/bulan',
    benefits: 'Monetary Perks',
    benefitsPlaceholder: 'contoh: Asuransi mandiri, allowance...',
    nonMonetaryBenefits: 'Non-Monetary Perks',
    nonMonetaryPlaceholder: 'contoh: WFA full, gym access...',

    // Table
    filter: 'Filter',
    all: 'Semua',
    daysSinceApplied: 'Aging Sejak',
    inStage: 'Di Stage',
    actions: 'Action Item',

    // Timeline
    noApplicationsYet: 'Pipeline kosongan',
    addFirstJob: 'Input satu pipeline buat mancing data',
    daysAgo: '{days} yg lalu',
    daysInStage: '{days} aging di stage',

    // Empty states
    noJobsHere: 'Belum ada pipeline masuk',
    addOne: '+ Add Data',

    // Language
    language: 'Indo Jaksel',

    // JFP
    jobFitPercentage: 'Alignment %',
    jfpPlaceholder: '0-100',
  },
  sg: {
    // Header
    appName: 'HiredWithAndi',
    jobsTracked: '{count} job{s} tracked lah',
    addJob: 'Add Job',
    dashboard: 'Dashboard',
    board: 'Board',
    gantt: 'Gantt',
    table: 'Table',

    // Columns
    wishlist: 'Wishlist Only',
    applied: 'Applied Already',
    hr_interview: 'HR Talk',
    technical_interview: 'Tech Test',
    additional_interview: 'Wait Long Long',
    offered: 'Got Offer!',
    rejected_company: 'They Don\'t Want',
    rejected_applicant: 'I Don\'t Want',

    // Job Card
    daysHere: '{days} here sia',
    today: 'Today',
    day: '1 day',
    days: '{count} days',
    viewPosting: 'See posting',

    // Modal
    newApplication: 'Apply New One',
    editApplication: 'Change Application',
    company: 'Company',
    companyPlaceholder: 'e.g. Grab',
    position: 'Position',
    positionPlaceholder: 'e.g. Software Engineer',
    jobUrl: 'Job URL',
    salaryRange: 'Salary Range',
    salaryPlaceholder: 'e.g. $6k - $8k',
    status: 'Status',
    dateApplied: 'Date Applied',
    notes: 'Notes',
    notesPlaceholder: 'Any notes also can...',
    openJobPosting: 'Open posting lah',
    cancel: 'Cancel',
    saveChanges: 'Save Changes',
    addApplication: 'Add Application',
    deleteConfirm: 'Sure want to delete?',

    // Work Type
    workType: 'Work Type',
    remote: 'Remote',
    onsite: 'Office',
    hybrid: 'Hybrid',
    location: 'Location',
    locationPlaceholder: 'e.g. Singapore',

    // Offer Details
    offerDetails: 'Offer Details Walao',
    finalOffer: 'Final Offer',
    finalOfferPlaceholder: 'e.g. $8,000/month',
    benefits: 'Benefits',
    benefitsPlaceholder: 'e.g. Insurance, AWS...',
    nonMonetaryBenefits: 'Other Perks',
    nonMonetaryPlaceholder: 'e.g. WFH, Flexi hours...',

    // Table
    filter: 'Filter',
    all: 'All',
    daysSinceApplied: 'Days Since',
    inStage: 'In Stage',
    actions: 'Actions',

    // Timeline
    noApplicationsYet: 'No applications yet lor',
    addFirstJob: 'Add first job to see timeline',
    daysAgo: '{days} ago',
    daysInStage: '{days} in stage',

    // Empty states
    noJobsHere: 'Nothing here leh',
    addOne: '+ Add one lah',

    // Language
    language: 'Singlish',

    // JFP
    jobFitPercentage: 'Can On Not %',
    jfpPlaceholder: '0-100',
  },
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(() => {
    try {
      return localStorage.getItem('HiredWithAndi_locale') || 'en'
    } catch {
      return 'en'
    }
  })

  const toggleLocale = useCallback(() => {
    setLocale(prev => {
      const next = prev === 'en' ? 'id' : prev === 'id' ? 'id_corp' : prev === 'id_corp' ? 'sg' : 'en'
      try { localStorage.setItem('HiredWithAndi_locale', next) } catch {}
      return next
    })
  }, [])

  const changeLocale = useCallback((newLocale) => {
    setLocale(newLocale)
    try { localStorage.setItem('HiredWithAndi_locale', newLocale) } catch {}
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
    <I18nContext.Provider value={{ locale, toggleLocale, changeLocale, t, colLabel }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) throw new Error('useI18n must be used within an I18nProvider')
  return context
}
