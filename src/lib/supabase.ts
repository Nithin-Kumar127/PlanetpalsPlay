import { createClient } from '@supabase/supabase-js'

// For demo purposes, we'll use a mock setup since Supabase isn't configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key'

// Create a mock client for demo purposes
const createMockSupabaseClient = () => {
  // Load existing users from localStorage
  const loadUsers = () => {
    try {
      const stored = localStorage.getItem('mockUsers')
      return stored ? new Map(JSON.parse(stored)) : new Map()
    } catch {
      return new Map()
    }
  }
  
  // Save users to localStorage
  const saveUsers = (users) => {
    try {
      localStorage.setItem('mockUsers', JSON.stringify([...users]))
    } catch (e) {
      console.error('Failed to save users to localStorage:', e)
    }
  }
  
  const mockUsers = loadUsers()
  let currentUser = null
  const listeners = new Set()

  return {
    auth: {
      getSession: async () => {
        console.log('Getting session, current user:', currentUser)
        return { 
          data: { 
            session: currentUser ? { 
              user: currentUser,
              access_token: 'mock-token',
              refresh_token: 'mock-refresh'
            } : null 
          },
          error: null
        }
      },
      
      signUp: async ({ email, password, options }) => {
        console.log('Attempting signup for:', email)
        
        if (mockUsers.has(email)) {
          console.log('User already exists')
          return { 
            data: { user: null, session: null },
            error: { message: 'User already registered' } 
          }
        }
        
        const user = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          user_metadata: options?.data || {},
          created_at: new Date().toISOString(),
          email_confirmed_at: new Date().toISOString()
        }
        
        mockUsers.set(email, { ...user, password })
        saveUsers(mockUsers)
        currentUser = user
        
        console.log('Signup successful for:', email)
        
        // Notify listeners after a short delay
        setTimeout(() => {
          listeners.forEach(callback => {
            try {
              callback('SIGNED_IN', { 
                user,
                session: {
                  user,
                  access_token: 'mock-token',
                  refresh_token: 'mock-refresh'
                }
              })
            } catch (e) {
              console.error('Error in auth listener:', e)
            }
          })
        }, 50)
        
        return { 
          data: { 
            user,
            session: {
              user,
              access_token: 'mock-token',
              refresh_token: 'mock-refresh'
            }
          }, 
          error: null 
        }
      },
      
      signInWithPassword: async ({ email, password }) => {
        console.log('Attempting signin for:', email)
        
        const userData = mockUsers.get(email)
        if (!userData || userData.password !== password) {
          console.log('Invalid credentials for:', email)
          return { 
            data: { user: null, session: null },
            error: { message: 'Invalid login credentials' } 
          }
        }
        
        const { password: _, ...user } = userData
        currentUser = user
        
        console.log('Signin successful for:', email)
        
        // Notify listeners after a short delay
        setTimeout(() => {
          listeners.forEach(callback => {
            try {
              callback('SIGNED_IN', { 
                user,
                session: {
                  user,
                  access_token: 'mock-token',
                  refresh_token: 'mock-refresh'
                }
              })
            } catch (e) {
              console.error('Error in auth listener:', e)
            }
          })
        }, 50)
        
        return { 
          data: { 
            user,
            session: {
              user,
              access_token: 'mock-token',
              refresh_token: 'mock-refresh'
            }
          }, 
          error: null 
        }
      },
      
      signOut: async () => {
        console.log('Signing out user:', currentUser?.email)
        currentUser = null
        
        // Notify listeners after a short delay
        setTimeout(() => {
          listeners.forEach(callback => {
            try {
              callback('SIGNED_OUT', { user: null, session: null })
            } catch (e) {
              console.error('Error in auth listener:', e)
            }
          })
        }, 50)
        
        return { error: null }
      },
      
      onAuthStateChange: (callback) => {
        console.log('Adding auth state change listener')
        listeners.add(callback)
        return {
          data: {
            subscription: {
              unsubscribe: () => {
                console.log('Removing auth state change listener')
                listeners.delete(callback)
              }
            }
          }
        }
      }
    }
  }
}

export const supabase = createMockSupabaseClient()

export type User = {
  id: string
  email: string
  name?: string
  created_at: string
}