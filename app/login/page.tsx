'use client'

import { useState } from 'react'
import Link from 'next/link'
import { InputField } from '../components/input-field'
import { Progress } from '../components/ui/progress'

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

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
      // TODO: Integrate Supabase auth here
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      setProgress(100)
      
      // Simulate success
      alert('Login successful! Welcome back.')
      
      // TODO: Redirect to dashboard or home page
      // router.push('/')
      
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please check your credentials and try again.')
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
        <div className="px-40 flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mx-auto max-w-[450px]">
              <h2 className="text-[#1b120d] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
                Welcome back
              </h2>
              
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
