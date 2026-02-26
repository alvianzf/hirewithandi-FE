import { useState } from 'react'
import { Briefcase, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUserProfile } from '../../context/UserProfileContext'
import { useI18n } from '../../context/I18nContext'

export default function LoginPage() {
  const { login } = useAuth()
  const { updateProfile, profile } = useUserProfile()
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    login({ name, email })
    
    // Initialize profile with name/email if it's empty
    if (!profile.name && !profile.email) {
      updateProfile({ name, email })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 left-1/2 h-[1000px] w-[1000px] -translate-x-1/2 rounded-full bg-yellow-400/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/[0.08] bg-neutral-900/50 p-8 backdrop-blur-xl sm:p-10">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-xl shadow-yellow-500/20">
            <Briefcase className="h-8 w-8 text-black" />
          </div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Welcome to <br />
            Hired<span className="text-yellow-400">With</span>Andi
          </h1>
          <p className="text-sm text-neutral-400">
            {t('signInDescription') || 'Track your job applications and land your dream role.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-300">
              {t('name') || 'Name'}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Andi Ahmad"
              className="w-full rounded-xl border border-white/[0.08] bg-black/50 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-300">
              {t('email') || 'Email'}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="andi@example.com"
              className="w-full rounded-xl border border-white/[0.08] bg-black/50 px-4 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
              required
            />
          </div>

          <button
            type="submit"
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3.5 text-sm font-bold text-black shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-300 hover:shadow-yellow-400/40 active:scale-[0.98]"
          >
            {t('signIn') || 'Continue'}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </div>
  )
}
