import { useState, useRef } from 'react'
import { useUserProfile } from '../../context/UserProfileContext'
import { useI18n } from '../../context/I18nContext'
import { Camera, Trash2, User, MapPin, Link as LinkIcon, Briefcase, Lock, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import api from '../../utils/api'
import Swal from 'sweetalert2'

export default function ProfilePage() {
  const { profile, loading, updateProfile, updateAvatar, removeAvatar } = useUserProfile()
  const { t } = useI18n()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    role: '',
    organization: '',
    location: '',
    linkedIn: '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordStatus, setPasswordStatus] = useState({ type: '', message: '' })

  // Visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const fileInputRef = useRef(null)

  // Sync form with profile data once it loads
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        bio: profile.bio || '',
        role: profile.role || '',
        organization: profile.organization || '',
        location: profile.location || '',
        linkedIn: profile.linkedIn || '',
      })
    }
  }, [profile])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    const success = await updateProfile(formData)
    setIsSaving(false)
    if (success) {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'Passwords do not match' })
      return
    }
    if (newPassword.length < 6) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 6 characters' })
      return
    }

    try {
      setPasswordStatus({ type: 'loading', message: 'Processing password change...' })
      await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      })
      setPasswordStatus({ type: 'success', message: 'Password updated successfully!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setPasswordStatus({ type: '', message: '' }), 3000)
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Failed to change password. Please check your current password.'
      setPasswordStatus({ type: 'error', message: msg })
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simple validation: Ensure it's an image and < 2MB
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select an image file.',
        confirmButtonColor: '#eab308',
        background: '#171717',
        color: '#fff',
        customClass: { popup: 'rounded-2xl border border-white/[0.08]' }
      });
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'File size exceeds 2MB limit. Please choose a smaller image.',
        confirmButtonColor: '#eab308',
        background: '#171717',
        color: '#fff',
        customClass: { popup: 'rounded-2xl border border-white/[0.08]' }
      });
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      updateAvatar(reader.result)
    }
    reader.readAsDataURL(file)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-black">
        <div className="text-[var(--color-primary-yellow)] animate-pulse font-bold text-xl tracking-widest uppercase">
          Loading Profile...
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto bg-black p-4 sm:p-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-2xl font-bold text-white sm:text-3xl">
          {t('profile') || 'User Profile'}
        </h1>

        <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
          {/* Avatar Section */}
          <div className="flex flex-col items-center rounded-2xl border border-white/[0.08] bg-neutral-900/50 p-6 backdrop-blur-sm self-start">
            <div className="relative mb-6 h-32 w-32 shrink-0 rounded-full border-4 border-neutral-800 bg-neutral-800 overflow-hidden">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl.startsWith('/') ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}${profile.avatarUrl}` : profile.avatarUrl} 
                  alt="Avatar" 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-neutral-600">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : <User size={48} />}
                </div>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            <div className="flex w-full flex-col gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 rounded-xl bg-neutral-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
              >
                <Camera className="h-4 w-4" />
                {t('uploadPhoto') || 'Upload Photo'}
              </button>
              {profile.avatarUrl && (
                <button
                  onClick={removeAvatar}
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('removePhoto') || 'Remove'}
                </button>
              )}
            </div>
            <p className="mt-4 text-center text-xs text-neutral-500">
              Recommended: Square image, &lt; 2MB.<br />
              Securely stored in Cloudinary via HWA API.
            </p>
          </div>

          {/* Form Section */}
          <div className="rounded-2xl border border-white/[0.08] bg-neutral-900/50 p-6 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    {t('name') || 'Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-white/[0.08] bg-black/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 transition-colors focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    {t('email') || 'Email'} <span className="text-xs text-neutral-500">(from login)</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full rounded-xl border border-white/[0.08] bg-black/20 px-4 py-2.5 text-sm text-white opacity-60 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    {t('role') || 'Current Role / Title'}
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <input
                      name="role"
                      type="text"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="e.g. Senior Frontend Engineer"
                      className="w-full rounded-xl border border-white/[0.08] bg-black/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 transition-colors focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    {t('organization') || 'Organization'}
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <input
                      name="organization"
                      type="text"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="e.g. Acme Corp"
                      className="w-full rounded-xl border border-white/[0.08] bg-black/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 transition-colors focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    {t('location') || 'Location'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <input
                      name="location"
                      type="text"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Jakarta, Indonesia"
                      className="w-full rounded-xl border border-white/[0.08] bg-black/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 transition-colors focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-neutral-300">
                    {t('linkedIn') || 'LinkedIn URL'}
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                    <input
                      name="linkedIn"
                      type="url"
                      value={formData.linkedIn}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full rounded-xl border border-white/[0.08] bg-black/50 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-500 transition-colors focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  {t('bio') || 'Bio'}
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="A short description about your career goals..."
                  className="w-full resize-none rounded-xl border border-white/[0.08] bg-black/50 p-4 text-sm text-white placeholder-neutral-500 transition-colors focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className={`text-sm text-green-400 transition-opacity duration-300 ${saveSuccess ? 'opacity-100' : 'opacity-0'}`}>
                  {t('profileSaved') || 'Profile saved successfully!'}
                </span>
                
                <button
                  type="submit"
                  disabled={isSaving}
                  className="rounded-xl bg-yellow-400 px-6 py-2.5 text-sm font-bold text-black shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-300 hover:shadow-yellow-400/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (t('saving') || 'Saving...') : (t('saveProfile') || 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security / Password Section */}
        <div className="mt-8 rounded-2xl border border-white/[0.08] bg-neutral-900/50 p-6 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-500">
              <Lock size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Security Settings</h2>
              <p className="text-xs text-neutral-500">Manage your password and account security</p>
            </div>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-2xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-white/[0.08] bg-black/50 py-2.5 pl-10 pr-10 text-sm text-white placeholder-neutral-500 transition-colors focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-yellow-400 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full rounded-xl border border-white/[0.08] bg-black/50 py-2.5 pl-10 pr-10 text-sm text-white placeholder-neutral-500 transition-colors focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-yellow-400 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-300">
                  Confirm New Password
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full rounded-xl border border-white/[0.08] bg-black/50 py-2.5 pl-10 pr-10 text-sm text-white placeholder-neutral-500 transition-colors focus:border-yellow-400/50 focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-yellow-400 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {passwordStatus.message && (
              <div className={`p-4 rounded-xl text-sm font-medium border ${
                passwordStatus.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                passwordStatus.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                'bg-blue-500/10 border-blue-500/20 text-blue-500'
              }`}>
                {passwordStatus.message}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={passwordStatus.type === 'loading'}
                className="rounded-xl bg-neutral-800 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-neutral-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {passwordStatus.type === 'loading' ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
