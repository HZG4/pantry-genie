'use client'

import Link from 'next/link'

export function Navigation() {
  return (
    <nav className="bg-white shadow-sm border-b border-[#f3ebe7]">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🧞‍♂️</span>
            <span className="text-xl font-bold text-[#1b120d]">Pantry Genie</span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-[#1b120d] hover:text-[#ee6c2b] transition-colors"
            >
              Generate Recipe
            </Link>
            <Link 
              href="/library" 
              className="text-[#1b120d] hover:text-[#ee6c2b] transition-colors"
            >
              My Library
            </Link>
            <button className="bg-[#ee6c2b] hover:bg-[#d55a1f] text-white px-4 py-2 rounded-lg transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
