import { useState } from 'react'
import { Briefcase, LayoutGrid, GanttChart, Table2, Plus, X, Menu, Globe, BarChart3, ChevronDown } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'

export default function Header({ activeView, setActiveView, onAddJob, totalJobs }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t, locale, toggleLocale, changeLocale } = useI18n()

  const views = [
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3 },
    { id: 'board', label: t('board'), icon: LayoutGrid },
    { id: 'gantt', label: t('gantt'), icon: GanttChart },
    { id: 'table', label: t('table'), icon: Table2 },
  ]

  const jobsText = t('jobsTracked', { count: totalJobs, s: totalJobs !== 1 ? 's' : '' })

  return (
    <header className="flex-shrink-0 border-b border-white/[0.08] bg-black/90 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 py-4 sm:px-8 md:px-12 lg:px-16">
        {/* Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/20">
            <Briefcase className="h-4.5 w-4.5 text-black" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight text-white">
              Hired<span className="text-yellow-400">With</span>Andi
            </h1>
            <p className="hidden text-xs text-neutral-500 md:block">
              {jobsText}
            </p>
          </div>
        </div>

        {/* Desktop view switcher */}
        <div className="hidden items-center gap-2 rounded-2xl bg-neutral-900 p-2 md:flex">
          {views.map(v => {
            const Icon = v.icon
            const isActive = activeView === v.id
            return (
              <button
                key={v.id}
                onClick={() => setActiveView(v.id)}
                className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all ${
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
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative hidden sm:block">
            <select
              value={locale}
              onChange={e => changeLocale(e.target.value)}
              className="appearance-none rounded-xl bg-neutral-800/80 pl-4 pr-10 py-3 text-sm font-medium text-neutral-200 cursor-pointer border border-white/[0.08] transition-colors hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
            >
              <option value="en">🇸🇬 English</option>
              <option value="id">🇮🇩 Indonesia</option>
              <option value="id_corp">👔 Jaksel</option>
              <option value="sg">🇸🇬 Singlish</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
          </div>
          {/* Mobile: compact flag-only toggle */}
          <button
            onClick={toggleLocale}
            className="flex items-center justify-center rounded-xl bg-neutral-800/80 border border-white/[0.08] px-3 py-2.5 text-lg transition-colors hover:bg-neutral-700 sm:hidden"
            title={t('language')}
          >
            {locale === 'en' ? '🇸🇬' : locale === 'id' ? '🇮🇩' : locale === 'id_corp' ? '👔' : '🇸🇬 Sing'}
          </button>

          <button
            onClick={onAddJob}
            className="flex items-center gap-2 rounded-xl bg-yellow-400 px-3 py-2.5 sm:px-6 sm:py-3 text-sm font-bold text-black shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-300 hover:shadow-yellow-400/40 active:scale-[0.97]"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('addJob')}</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-xl p-3 text-neutral-400 hover:bg-neutral-800 hover:text-white md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile view switcher */}
      {mobileMenuOpen && (
        <div className="flex items-center gap-3 border-t border-white/[0.08] px-8 py-4 md:hidden">
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
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
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
