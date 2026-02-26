import { useState } from 'react'
import { Briefcase, LayoutGrid, GanttChart, Table2, Plus, X, Menu, Globe, BarChart3 } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

export default function Header({ activeView, setActiveView, onAddJob, totalJobs }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t, locale, toggleLocale } = useI18n()

  const views = [
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3 },
    { id: 'board', label: t('board'), icon: LayoutGrid },
    { id: 'gantt', label: t('gantt'), icon: GanttChart },
    { id: 'table', label: t('table'), icon: Table2 },
  ]

  const jobsText = t('jobsTracked', { count: totalJobs, s: totalJobs !== 1 ? 's' : '' })

  return (
    <header className="flex-shrink-0 border-b border-white/[0.08] bg-black/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/20">
            <Briefcase className="h-4.5 w-4.5 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight text-white">
              Hire<span className="text-yellow-400">With</span>Andi
            </h1>
            <p className="hidden text-xs text-neutral-500 md:block">
              {jobsText}
            </p>
          </div>
        </div>

        {/* Desktop view switcher */}
        <div className="hidden items-center gap-1 rounded-xl bg-neutral-900 p-1 md:flex">
          {views.map(v => {
            const Icon = v.icon
            const isActive = activeView === v.id
            return (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-800 text-yellow-400 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {v.label}
              </button>
            )
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Language toggle */}
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
            title={t('language')}
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{locale === 'en' ? 'EN' : 'ID'}</span>
          </button>

          <button
            onClick={onAddJob}
            className="flex items-center gap-1.5 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-bold text-black shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-300 hover:shadow-yellow-400/40 active:scale-[0.97]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('addJob')}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile view switcher */}
      {mobileMenuOpen && (
        <div className="flex items-center gap-1 border-t border-white/[0.08] px-4 py-2 md:hidden">
          {views.map(v => {
            const Icon = v.icon
            const isActive = activeView === v.id
            return (
              <button
                key={v.id}
                onClick={() => {
                  setActiveView(v.id)
                  setMobileMenuOpen(false)
                }}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-neutral-800 text-yellow-400'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {v.label}
              </button>
            )
          })}
        </div>
      )}
    </header>
  )
}
