import { useState } from 'react'
import { Briefcase, LayoutGrid, GanttChart, Table2, Plus, X, Menu, Globe, BarChart3, ChevronDown, LogOut, User } from 'lucide-react'
import { useI18n } from '../../context/I18nContext'
import { useAuth } from '../../context/AuthContext'
import { useUserProfile } from '../../context/UserProfileContext'

export default function Header({ activeView, setActiveView, onAddJob, totalJobs, isDisabled }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileLangOpen, setMobileLangOpen] = useState(false)
  const { t, locale, toggleLocale, changeLocale } = useI18n()
  const { logout } = useAuth()
  const { profile } = useUserProfile()

  const languages = [
    { id: 'en', label: '🇬🇧 English' },
    { id: 'id', label: '🇮🇩 Indonesia' },
    { id: 'id_corp', label: '👔 Jaksel' },
    { id: 'sg', label: '🇸🇬 Singlish' },
  ]

  const views = [
    { id: 'dashboard', label: t('dashboard'), icon: BarChart3 },
    { id: 'board', label: t('board'), icon: LayoutGrid },
    { id: 'gantt', label: t('gantt'), icon: GanttChart },
    { id: 'table', label: t('table'), icon: Table2 },
  ]

  const jobsText = t('jobsTracked', { count: totalJobs, s: totalJobs !== 1 ? 's' : '' })

  return (
    <header className="flex-shrink-0 border-b border-white/[0.08] bg-black/90 backdrop-blur-md">
      <div className="relative flex items-center justify-between px-4 py-4 sm:px-8 md:px-12 lg:px-16">
        {/* Logo */}
        <div className="flex items-center gap-3 sm:gap-4 relative z-10">
          <img src="/lwa-logo.png" alt="LWA" className="h-9 w-9 sm:h-11 sm:w-11 object-contain drop-shadow-md" />
          <div>
            <h1 className="text-lg font-bold leading-tight tracking-tight text-white">
              Hired<span className="text-yellow-400">With</span>Andi
            </h1>
            <p className="hidden text-xs text-neutral-500 md:block">
              {jobsText}
            </p>
          </div>
        </div>

        {/* Desktop view switcher - Centered on large screens, hidden on smaller ones */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-2xl bg-neutral-900 p-2">
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
        <div className="flex items-center gap-2 sm:gap-4 relative z-10">
          
          {/* Mobile view switcher drop-down (shows up to lg) */}
          <div className="hidden sm:block lg:hidden">
             <select
              value={activeView}
              onChange={e => setActiveView(e.target.value)}
              className="appearance-none rounded-xl bg-neutral-800/80 pl-4 pr-10 py-3 text-sm font-medium text-neutral-200 cursor-pointer border border-white/[0.08] transition-colors hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
             >
               {views.map(v => (
                 <option key={v.id} value={v.id}>{v.label}</option>
               ))}
             </select>
          </div>

          <div className="relative hidden sm:block">
            <select
              value={locale}
              onChange={e => changeLocale(e.target.value)}
              className="appearance-none rounded-xl bg-neutral-800/80 px-4 py-3 text-xl font-medium cursor-pointer border border-white/[0.08] transition-colors hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
            >
              <option value="en">🇬🇧</option>
              <option value="id">🇮🇩</option>
              <option value="id_corp">👔</option>
              <option value="sg">🇸🇬</option>
            </select>
          </div>

          {!isDisabled && (
            <button
              onClick={onAddJob}
              className="flex items-center gap-2 rounded-xl bg-yellow-400 px-3 py-2.5 sm:px-6 sm:py-3 text-sm font-bold text-black shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-300 hover:shadow-yellow-400/40 active:scale-[0.97]"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t('addJob')}</span>
            </button>
          )}

          {/* Organization + Avatar button */}
          <div className="hidden sm:flex items-center gap-3 border-l border-white/[0.08] pl-4">
            {profile?.organization && (
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Organization</p>
                <p className="text-sm font-semibold text-white truncate max-w-[140px]">{profile.organization}</p>
              </div>
            )}
            <button
              onClick={() => setActiveView('profile')}
              className={`flex h-[42px] w-[42px] sm:h-11 sm:w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] transition-all hover:border-yellow-400/50 ${activeView === 'profile' ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-black' : ''}`}
              title={t('profile')}
            >
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl.startsWith('/') ? `${(import.meta.env.VITE_API_URL || '').replace(/\/api\/?$/, '')}${profile.avatarUrl}` : profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-sm font-bold text-neutral-400">
                  {profile?.name ? profile.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                </div>
              )}
            </button>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="hidden sm:flex h-[42px] w-[42px] sm:h-11 sm:w-auto shrink-0 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-0 sm:px-4 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
            title={t('logout')}
          >
            <LogOut className="h-4 w-4 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">{t('logout')}</span>
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
                <span className="hidden xs:inline">{v.label}</span>
              </button>
            )
          })}
        </div>
      )}
      
      {/* Mobile Extra Menu (Language & Logout) */}
      {mobileMenuOpen && (
        <div className="flex flex-col gap-3 border-t border-white/[0.08] px-8 py-4 sm:hidden">
          {profile?.organization && (
            <div className="rounded-xl border border-white/[0.06] bg-neutral-900/60 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Organization</p>
              <p className="mt-0.5 text-sm font-semibold text-white">{profile.organization}</p>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-neutral-400 px-1">{t('language')}</span>
            <div className="relative w-full">
              <button
                onClick={() => setMobileLangOpen(!mobileLangOpen)}
                className="flex w-full items-center justify-between rounded-xl bg-neutral-800/80 px-4 py-3.5 text-base font-medium text-neutral-200 border border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-yellow-400/50"
              >
                <span>{languages.find(l => l.id === locale)?.label}</span>
                <ChevronDown className={`h-5 w-5 text-neutral-400 transition-transform ${mobileLangOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {mobileLangOpen && (
                <div className="mt-2 w-full overflow-hidden rounded-xl border border-white/[0.08] bg-neutral-900/95 backdrop-blur-md shadow-xl">
                  {languages.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        changeLocale(lang.id)
                        setMobileLangOpen(false)
                      }}
                      className={`flex w-full items-center justify-between px-5 py-4 text-base transition-colors hover:bg-neutral-800 ${
                        locale === lang.id ? 'bg-neutral-800/50 text-yellow-400 font-medium' : 'text-neutral-300'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {locale === lang.id && <div className="h-2.5 w-2.5 rounded-full bg-yellow-400"></div>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
          >
            <LogOut className="h-4 w-4" />
            {t('logout')}
          </button>
        </div>
      )}
    </header>
  )
}
