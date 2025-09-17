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
    
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('Initial session:', session, 'Error:', error)
        
        if (session?.user) {
          setUser(session.user)
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
            console.log('User signed in:', session.user.email)
          } else {
            setUser(null)
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
        return { error }
      }
      
      console.log('Signup successful:', data?.user?.email)
      return { error: null }
    } catch (err) {
      console.error('Signup exception:', err)
      return { error: err }
    }
  }

  const signIn = async (email: string, password: string) => {
    console.log('AuthProvider: Attempting signin for:', email)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('Signin error:', error)
        return { error }
      }
      
      console.log('Signin successful:', data?.user?.email)
      return { error: null }
    } catch (err) {
      console.error('Signin exception:', err)
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