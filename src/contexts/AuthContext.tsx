import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

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

    // Get initial session
    const initializeAuth = async () => {
      // First check localStorage
      if (checkExistingSession()) {
        return
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('Initial session:', session, 'Error:', error)
        
        if (session?.user) {
          setUser(session.user)
          // Save session to localStorage
          localStorage.setItem('mockSession', JSON.stringify(session))
          console.log('User found in session:', session.user.email)
        } else {
          setUser(null)
          console.log('No user in session')
        }
      } catch (error) {
        console.error('Error getting initial session:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email)
        
        try {
          if (session?.user) {
            setUser(session.user)
            // Save session to localStorage
            localStorage.setItem('mockSession', JSON.stringify(session))
            console.log('User signed in:', session.user.email)
          } else {
            setUser(null)
            // Remove session from localStorage
            localStorage.removeItem('mockSession')
            console.log('User signed out')
          }
        } catch (error) {
          console.error('Error handling auth state change:', error)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => {
      console.log('AuthProvider: Cleaning up auth listener')
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, name: string) => {
    console.log('AuthProvider: Attempting signup for:', email)
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      })
      
      if (error) {
        console.error('Signup error:', error)
        setLoading(false)
        return { error }
      }
      
      console.log('Signup successful:', data?.user?.email)
      // Don't set loading to false here, let the auth state change handle it
      return { error: null }
    } catch (err) {
      console.error('Signup exception:', err)
      setLoading(false)
      return { error: err }
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Attempting signin for:', email)
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Signin error:', error)
        setLoading(false)
        return { error }
      }
      
      console.log('Signin successful:', data?.user?.email)
      // Don't set loading to false here, let the auth state change handle it
      return { error: null }
    } catch (err) {
      console.error('Signin exception:', err)
      setLoading(false)
      return { error: err }
    }
  }

  const signOut = async () => {
    console.log('AuthProvider: Attempting signout')
    try {
      await supabase.auth.signOut()
      console.log('Signout successful')
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