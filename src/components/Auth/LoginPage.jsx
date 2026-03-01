import { useState } from 'react'
import { Briefcase, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUserProfile } from '../../context/UserProfileContext'
import { useI18n } from '../../context/I18nContext'

export default function LoginPage() {
  const { login, checkEmail, setupPassword } = useAuth()
  const { updateProfile, profile } = useUserProfile()
  const { t } = useI18n()
  
  const [step, setStep] = useState(1) // 1 = email, 2 = password
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hasExistingPassword, setHasExistingPassword] = useState(true)
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleNext = async (e) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsLoading(true)
    setError('')
    
    // Check if the email exists and if it has a password
    const result = await checkEmail(email)
    setIsLoading(false)

    if (result && result.exists) {
      setHasExistingPassword(result.hasPassword)
      setStep(2)
    } else {
      // If user doesn't exist, we can show an error or a message
      setError('Account not found. Please contact your organization administrator.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return

    setIsLoading(true)
    setError('')
    
    let success = false;
    
    if (hasExistingPassword) {
      success = await login(email, password)
    } else {
      success = await setupPassword(email, password)
    }
    
    setIsLoading(false)
    if (!success) {
      setError('Authentication failed. Please try again.')
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
          <img src="/lwa-logo.png" alt="LWA" className="mb-6 h-20 w-20 object-contain drop-shadow-[0_0_15px_rgba(210,255,0,0.2)]" />
          <h1 className="mb-2 text-3xl font-bold tracking-tight">
            Welcome to <br />
            Hired<span className="text-yellow-400">With</span>Andi
          </h1>
          <p className="text-sm text-neutral-400">
            {t('signInDescription') || 'Track your job applications and land your dream role.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center text-sm text-red-500 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={step === 1 ? handleNext : handleSubmit} className="space-y-4">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-2">
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
                autoFocus
              />
            </div>
          )}
          
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-neutral-400">{email}</span>
                <button 
                  type="button" 
                  onClick={() => setStep(1)}
                  className="text-yellow-400 hover:text-yellow-300 transition-colors font-medium"
                >
                  Change
                </button>
              </div>

              <label htmlFor="password" className="mb-2 block text-sm font-medium text-neutral-300">
                {!hasExistingPassword ? 'Create a New Password' : (t('password') || 'Password')}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/[0.08] bg-black/50 pl-4 pr-12 py-3 text-sm text-white placeholder-neutral-500 transition-colors focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-yellow-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {!hasExistingPassword && (
                <p className="mt-2 text-xs text-neutral-400">
                  Your organization administrator has created an account for you. Please set a secure password to continue.
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3.5 text-sm font-bold text-black shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-300 hover:shadow-yellow-400/40 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading 
              ? 'Loading...' 
              : step === 1 
                ? 'Continue' 
                : !hasExistingPassword 
                  ? 'Create Password' 
                  : (t('signIn') || 'Sign In')}
            {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </form>
      </div>
    </div>
  )
}
