import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface AuthContextType {
  user: SupabaseUser | null
  loading: boolean
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Generate a proper UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state')
    
    // Check for existing session in localStorage
    const checkExistingSession = () => {
      try {
        const sessionData = localStorage.getItem('mockSession')
        if (sessionData) {
          const session = JSON.parse(sessionData)
          
          // Validate that user ID is a proper UUID format
          const userId = session.user?.id
          if (!userId || typeof userId !== 'string' || userId.length < 32 || !userId.includes('-')) {
            console.log('Invalid user ID format, clearing session:', userId)
            localStorage.removeItem('mockSession')
            return false
          }
          
          console.log('Found existing session:', session.user.email)
          setUser(session.user)
          setLoading(false)
          return true
        }
      } catch (error) {
        console.error('Error loading existing session:', error)
        localStorage.removeItem('mockSession')
      }
      return false
    }

    // Initialize auth without Supabase
    const initializeAuth = async () => {
      // Check localStorage first
      if (checkExistingSession()) {
        return
      }

      setUser(null)
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    console.log('AuthProvider: Mock signup for:', email)
    setLoading(true)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create mock user with proper UUID
      const mockUser: SupabaseUser = {
        id: generateUUID(),
        email,
        user_metadata: { name },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        role: 'authenticated',
        confirmation_sent_at: new Date().toISOString()
      }

      const mockSession = {
        user: mockUser,
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer'
      }

      // Save to localStorage
      localStorage.setItem('mockSession', JSON.stringify(mockSession))
      setUser(mockUser)
      setLoading(false)
      
      console.log('Mock signup successful:', email)
      return { error: null }
    } catch (err) {
      console.error('Signup exception:', err)
      setLoading(false)
      return { error: err }
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Mock signin for:', email)
    setLoading(true)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create mock user with proper UUID
      const mockUser: SupabaseUser = {
        id: generateUUID(),
        email,
        user_metadata: { name: 'Climate Learner' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        last_sign_in_at: new Date().toISOString(),
        role: 'authenticated',
        confirmation_sent_at: new Date().toISOString()
      }

      const mockSession = {
        user: mockUser,
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer'
      }

      // Save to localStorage
      localStorage.setItem('mockSession', JSON.stringify(mockSession))
      setUser(mockUser)
      setLoading(false)
      
      console.log('Mock signin successful:', email)
      return { error: null }
    } catch (err) {
      console.error('Signin exception:', err)
      setLoading(false)
      return { error: err }
    }
  }

  const signOut = async () => {
    console.log('AuthProvider: Mock signout')
    try {
      localStorage.removeItem('mockSession')
      setUser(null)
      console.log('Mock signout successful')
    } catch (err) {
      console.error('Signout error:', err)
    }
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut
  }

  console.log('AuthProvider render - User:', user?.email, 'Loading:', loading)

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}