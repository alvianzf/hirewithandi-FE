import { createContext, useContext, useState } from 'react'

const UserProfileContext = createContext(null)

const PROFILE_KEY = 'hwa_profile'

const DEFAULT_PROFILE = {
  name: '',
  email: '',
  bio: '',
  role: '',
  organization: '',
  location: '',
  linkedIn: '',
  avatarUrl: null,
}

function loadProfile() {
  try {
    const data = localStorage.getItem(PROFILE_KEY)
    if (data) return { ...DEFAULT_PROFILE, ...JSON.parse(data) }
  } catch (e) {
    console.error('Failed to load profile:', e)
  }
  return { ...DEFAULT_PROFILE }
}

function saveProfile(profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch (e) {
    console.error('Failed to save profile:', e)
  }
}

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => loadProfile())

  const updateProfile = (fields) => {
    const updated = { ...profile, ...fields }
    setProfile(updated)
    saveProfile(updated)
  }

  const updateAvatar = (dataUrl) => {
    const updated = { ...profile, avatarUrl: dataUrl }
    setProfile(updated)
    saveProfile(updated)
  }

  const removeAvatar = () => {
    const updated = { ...profile, avatarUrl: null }
    setProfile(updated)
    saveProfile(updated)
  }

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, updateAvatar, removeAvatar }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext)
  if (!ctx) throw new Error('useUserProfile must be used within a UserProfileProvider')
  return ctx
}
