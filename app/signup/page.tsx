'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { InputField } from '../components/input-field'
import { Progress } from '../components/ui/progress'
import { supabase } from '../lib/supabase'
import { useToast } from '../components/ui/toast'

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

export default function SignupPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async () => {
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
        return prev + 10
      })
    }, 100)

    try {
      // Supabase authentication
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
          }
        }
      })
      
      if (error) {
        throw error
      }
      
      setProgress(100)
      
             // Note: Profile will be created after email confirmation
       // For now, just log that user was created
       if (data.user) {
         console.log('User created successfully:', data.user.id)
         console.log('Please check your email to confirm your account before creating profile')
       }
      
      // Show success message and redirect to login
      showToast({
        type: 'success',
        title: 'Account Created!',
        message: 'Please check your email for verification.',
        duration: 4000
      })
      router.push('/login')
      
    } catch (error: unknown) {
      console.error('Signup error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      if (errorMessage?.includes('email')) {
        setErrors({ email: 'This email is already registered. Please try logging in instead.' })
        showToast({
          type: 'error',
          title: 'Email Already Exists',
          message: 'This email is already registered. Please try logging in instead.',
          duration: 5000
        })
      } else {
        setErrors({ password: 'Failed to create account. Please try again.' })
        showToast({
          type: 'error',
          title: 'Signup Failed',
          message: 'Failed to create account. Please try again.',
          duration: 5000
        })
      }
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
        <div className="px-4 sm:px-6 md:px-8 lg:px-20 xl:px-40 flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col w-full sm:w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mx-auto max-w-[450px] w-full">
              <h2 className="text-[#1b120d] tracking-light text-xl sm:text-2xl md:text-[28px] font-bold leading-tight px-2 sm:px-4 text-center pb-3 pt-3 sm:pt-5">
                Create your account
              </h2>
              
              <div className="flex flex-col items-center gap-3 sm:gap-4 px-2 sm:px-4 py-3">
                <InputField
                  label="Name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(value) => updateField('name', value)}
                  error={errors.name}
                  required
                />
              </div>

              <div className="flex flex-col items-center gap-3 sm:gap-4 px-2 sm:px-4 py-3">
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

              <div className="flex flex-col items-center gap-3 sm:gap-4 px-2 sm:px-4 py-3">
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

              <div className="flex flex-col items-center gap-3 sm:gap-4 px-2 sm:px-4 py-3">
                <InputField
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(value) => updateField('confirmPassword', value)}
                  error={errors.confirmPassword}
                  required
                />
              </div>

              {/* Progress Bar */}
              {isLoading && (
                <div className="flex flex-col items-center gap-2 px-2 sm:px-4 py-2">
                  <Progress 
                    value={progress} 
                    className="w-full sm:w-96 h-2 bg-[#f3ebe7]"
                  />
                  <p className="text-[#9a664c] text-sm">
                    Creating your account... {progress}%
                  </p>
                </div>
              )}

              <div className="flex flex-col items-center gap-3 sm:gap-4 px-2 sm:px-4 py-3">
                <button
                  onClick={handleSignUp}
                  disabled={isLoading}
                  className="flex w-full sm:w-96 max-w-[600px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#ee6c2b] text-[#fcf9f8] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d55a1f] transition-colors"
                >
                  <span className="truncate">
                    {isLoading ? 'Creating Account...' : 'Sign Up'}
                  </span>
                </button>
                
                <div className="flex items-center w-full sm:w-96 max-w-[600px]">
                  <div className="flex-1 h-px bg-[#e7d7cf]"></div>
                  <span className="px-4 text-[#9a664c] text-sm">or</span>
                  <div className="flex-1 h-px bg-[#e7d7cf]"></div>
                </div>
                
                <button
                  onClick={async () => {
                    // Clear any existing auth data first
                    await supabase.auth.signOut()
                    
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
                  className="flex w-full sm:w-96 max-w-[600px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl h-10 px-4 bg-white text-[#1b120d] text-sm font-medium leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors border border-[#e7d7cf]"
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

              <p className="text-[#9a664c] text-sm font-normal leading-normal pb-3 pt-1 px-2 sm:px-4 text-center">
                Already have an account?{' '}
                <Link href="/login" className="text-[#ee6c2b] hover:underline">
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
