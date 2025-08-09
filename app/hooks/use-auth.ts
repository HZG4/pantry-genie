'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, getCurrentUser } from '../lib/supabase'
import type { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial user
    const initializeAuth = async () => {
      try {
        setLoading(true)
        
        // Wait a bit for the session to be ready
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const user = await getCurrentUser()
        setUser(user)
      } catch (error) {
        console.error('Error initializing auth:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Only initialize on client side
    if (typeof window !== 'undefined') {
      initializeAuth()
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          console.log('Auth state change:', event, session?.user?.email)
          setUser(session?.user ?? null)
        } catch (error) {
          console.error('Error in auth state change:', error)
          setUser(null)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const requireAuth = (callback?: () => void) => {
    if (!user) {
      // Store the intended destination in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirectAfterLogin', window.location.pathname)
      }
      router.push('/login')
      return false
    }
    
    if (callback) {
      callback()
    }
    return true
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Get user's profile picture from Google OAuth or use placeholder
  const getUserAvatar = () => {
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url
    }
    if (user?.user_metadata?.picture) {
      return user.user_metadata.picture
    }
    // Fallback to placeholder
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuAV9TKwSwIjOKctAV3h1fx8E-ZDwPRfjMUGEO4a1CQIcJX5NUupRnFE3ANUqopg-E-vYdnjxmwFS2sPVd8uT73u2SYrZ9lz5aM1CakUrW9YVaQLbUc5GpND5IAEbc_SKP3D3WBCheB9NTHkdHZg_-0lBKxkz8n-P-QCxlpOVCWLIIEE23wLdGKZnTOsyZmv1zXYEdbIN-1nkOnnJahS4v4Yb93jLblAzSwTR3pwGVa9uCJNYV1F-IvC0fB5EAE7Kg70EhoywJ7qN00k"
  }

  return {
    user,
    loading,
    requireAuth,
    signOut,
    getUserAvatar,
    isAuthenticated: !!user
  }
}
