'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { InputField } from '../components/input-field'
import { Progress } from '../components/ui/progress'
import { supabase } from '../lib/supabase'
import { useToast } from '../components/ui/toast'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

export default function LoginPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [urlError, setUrlError] = useState<string | null>(null)

  // Check for error messages in URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const error = urlParams.get('error')
      if (error) {
        setUrlError(decodeURIComponent(error))
        // Clear the error from URL
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete('error')
        window.history.replaceState({}, '', newUrl.toString())
      }
    }
  }, [])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setProgress(0)

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 15
      })
    }, 100)

    try {
      // Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })
      
      if (error) {
        throw error
      }
      
      setProgress(100)
      
      // If login successful, try to create profile if it doesn't exist
      if (data.user) {
        try {
          // Check if profile already exists
          const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', data.user.id)
            .single()

          // If no profile exists, create one
          if (!existingProfile) {
            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert({
                id: data.user.id,
                name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })

            if (profileError) {
              console.error('Profile creation error on login:', profileError)
              // Don't fail the login, just log the error
            } else {
              console.log('Profile created successfully on login')
            }
          }
        } catch (profileError) {
          console.error('Profile handling error on login:', profileError)
          // Don't fail the login, just log the error
        }
      }
      
      // Get the redirect path from localStorage
      const redirectPath = typeof window !== 'undefined' 
        ? localStorage.getItem('redirectAfterLogin') || '/'
        : '/'
      
      // Clear the stored redirect path
      if (typeof window !== 'undefined') {
        localStorage.removeItem('redirectAfterLogin')
      }
      
      // Redirect to the intended page
      router.push(redirectPath)
      
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ password: 'Invalid email or password. Please try again.' })
      showToast({
        type: 'error',
        title: 'Login Failed',
        message: 'Invalid email or password. Please try again.',
        duration: 5000
      })
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#fcf9f8] group/design-root overflow-x-hidden"
      style={{
        fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'
      } as React.CSSProperties}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center items-center">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] max-w-[960px]">
            <div className="bg-white rounded-2xl shadow-lg p-6 mx-auto max-w-[450px]">
              <h2 className="text-[#1b120d] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
                Welcome back
              </h2>
              
              {/* URL Error Display */}
              {urlError && (
                <div className="flex flex-col items-center gap-2 px-4 py-2">
                  <div className="w-96 max-w-[600px] p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm text-center">
                      {urlError}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex flex-col items-center gap-4 px-4 py-3">
                <InputField
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  value={formData.email}
                  onChange={(value) => updateField('email', value)}
                  error={errors.email}
                  required
                />
              </div>

              <div className="flex flex-col items-center gap-4 px-4 py-3">
                <InputField
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  value={formData.password}
                  onChange={(value) => updateField('password', value)}
                  error={errors.password}
                  required
                />
              </div>

              {/* Progress Bar */}
              {isLoading && (
                <div className="flex flex-col items-center gap-2 px-4 py-2">
                  <Progress 
                    value={progress} 
                    className="w-96 h-2 bg-[#f3ebe7]"
                  />
                  <p className="text-[#9a664c] text-sm">
                    Signing you in... {progress}%
                  </p>
                </div>
              )}

              <div className="flex flex-col items-center gap-4 px-4 py-3">
                <button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="flex w-96 max-w-[600px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#ee6c2b] text-[#fcf9f8] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d55a1f] transition-colors"
                >
                  <span className="truncate">
                    {isLoading ? 'Signing In...' : 'Log In'}
                  </span>
                </button>
                
                <div className="flex items-center w-96 max-w-[600px]">
                  <div className="flex-1 h-px bg-[#e7d7cf]"></div>
                  <span className="px-4 text-[#9a664c] text-sm">or</span>
                  <div className="flex-1 h-px bg-[#e7d7cf]"></div>
                </div>
                
                <button
                  onClick={() => {
                    const redirectPath = typeof window !== 'undefined' 
                      ? localStorage.getItem('redirectAfterLogin') || '/'
                      : '/'
                    
                    supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(redirectPath)}`
                      }
                    })
                  }}
                  disabled={isLoading}
                  className="flex w-96 max-w-[600px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl h-10 px-4 bg-white text-[#1b120d] text-sm font-medium leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors border border-[#e7d7cf]"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="truncate">Continue with Google</span>
                </button>
              </div>

              <div className="flex flex-col items-center gap-2 px-4 py-2">
                <Link 
                  href="/forgot-password" 
                  className="text-[#ee6c2b] text-sm hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>

              <p className="text-[#9a664c] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
                Don't have an account?{' '}
                <Link href="/signup" className="text-[#ee6c2b] hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
