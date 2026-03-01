import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../utils/api'
import { toast } from 'sonner'
import { useAuth } from './AuthContext'

const UserProfileContext = createContext(null)

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

export function UserProfileProvider({ children }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState(DEFAULT_PROFILE)
  const [loading, setLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(false)

  const fetchProfile = useCallback(async (isInitial = false) => {
    if (!user) {
      setLoading(false)
      setIsInitialLoading(false)
      return
    }

    if (isInitial) setIsInitialLoading(true)
    setLoading(true)
    try {
      const res = await api.get('/profile')
      if (res.data.data) {
        setProfile(res.data.data)
      }
    } catch (e) {
      console.error('Failed to fetch profile', e)
    } finally {
      setLoading(false)
      setIsInitialLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchProfile(true)
    } else {
      setProfile(DEFAULT_PROFILE)
      setLoading(false)
      setIsInitialLoading(false)
    }
  }, [user, fetchProfile])

  const updateProfile = async (formDataOrFields) => {
    try {
      const isFormData = formDataOrFields instanceof FormData;
      const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {};
      
      const res = await api.patch('/profile', formDataOrFields, config);
      setProfile(prev => ({ ...prev, ...res.data.data }));
      toast.success('Profile updated successfully');
      return true;
    } catch (e) {
      console.error('Failed to update profile', e);
      toast.error(e.response?.data?.error?.message || 'Failed to update profile');
      return false;
    }
  }

  const removeAvatar = async () => {
    try {
      // Explicitly send null to clear avatar on backend
      const res = await api.patch('/profile', { avatarUrl: null });
      setProfile(prev => ({ ...prev, avatarUrl: null }));
      toast.success('Avatar removed');
    } catch (e) {
      console.error('Failed to remove avatar', e);
      toast.error('Failed to remove photo');
    }
  }

  return (
    <UserProfileContext.Provider value={{ profile, loading, isInitialLoading, updateProfile, removeAvatar, refreshProfile: fetchProfile }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext)
  if (!ctx) throw new Error('useUserProfile must be used within a UserProfileProvider')
  return ctx
}
