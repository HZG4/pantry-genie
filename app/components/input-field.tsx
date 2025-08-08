'use client'

import { cn } from '../lib/utils'

interface InputFieldProps {
  label: string
  placeholder: string
  type?: 'text' | 'email' | 'password'
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
}

export function InputField({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  required = false
}: InputFieldProps) {
  return (
    <label className="flex flex-col w-96 max-w-[600px]">
      <p className="text-[#1b120d] text-base font-medium leading-normal pb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </p>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "form-input flex w-96 min-w-0 resize-none overflow-hidden rounded-xl text-[#1b120d] focus:outline-0 focus:ring-0 border bg-[#fcf9f8] h-14 placeholder:text-[#9a664c] p-[15px] text-base font-normal leading-normal text-left transition-colors",
          error 
            ? "border-red-300 focus:border-red-500" 
            : "border-[#e7d7cf] focus:border-[#e7d7cf]"
        )}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </label>
  )
}
