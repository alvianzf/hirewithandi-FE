import { useState, useRef } from 'react'
import { useUserProfile } from '../../context/UserProfileContext'
import { useI18n } from '../../context/I18nContext'
import { Camera, Trash2, User, MapPin, Link as LinkIcon, Briefcase } from 'lucide-react'

export default function ProfilePage() {
  const { profile, updateProfile, updateAvatar, removeAvatar } = useUserProfile()
  const { t } = useI18n()
  
  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    bio: profile.bio || '',
    role: profile.role || '',
    organization: profile.organization || '',
    location: profile.location || '',
    linkedIn: profile.linkedIn || '',
  })
  const [saveSuccess, setSaveSuccess] = useState(false)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateProfile(formData)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Simple validation: Ensure it's an image and < 2MB
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit. Please choose a smaller image.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      updateAvatar(reader.result)
    }
    reader.readAsDataURL(file)
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
                <img src={profile.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
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
              Stored locally in your browser.
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
                  className="rounded-xl bg-yellow-400 px-6 py-2.5 text-sm font-bold text-black shadow-lg shadow-yellow-400/20 transition-all hover:bg-yellow-300 hover:shadow-yellow-400/40 active:scale-[0.98]"
                >
                  {t('saveProfile') || 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
