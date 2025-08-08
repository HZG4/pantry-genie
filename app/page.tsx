'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const [ingredients, setIngredients] = useState('')

  const handleGenerateRecipe = () => {
    if (ingredients.trim()) {
      // Navigate to recipe generation with ingredients
      window.location.href = `/generate?ingredients=${encodeURIComponent(ingredients)}`
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerateRecipe()
    }
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#fcf9f8] group/design-root overflow-x-hidden" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f3ebe7] px-10 py-3">
          <div className="flex items-center gap-4 text-[#1b120d]">
            <h2 className="text-[#1b120d] text-lg font-bold leading-tight tracking-[-0.015em]">Pantry Genie</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/">Home</Link>
              <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/library">My Recipes</Link>
            </div>
            <Link
              href="/generate"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#ee6c2b] text-[#fcf9f8] text-sm font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Get Started</span>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                {/* Hero Section */}
                <div
                  className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`
                  }}
                >
                  <div className="flex flex-col gap-2 text-center">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                      Unlock Culinary Creativity with AI
                    </h1>
                    <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      Transform your ingredients into delicious recipes with our AI-powered generator. Simply enter your ingredients and discover endless possibilities.
                    </h2>
                  </div>
                  
                  {/* Search Input */}
                  <label className="flex flex-col min-w-40 h-14 w-full max-w-[480px] @[480px]:h-16">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                      <div className="text-[#9a664c] flex border border-[#e7d7cf] bg-[#fcf9f8] items-center justify-center pl-[15px] rounded-l-xl border-r-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                        </svg>
                      </div>
                      <input
                        placeholder="Enter your ingredients (e.g., chicken, broccoli, rice)"
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1b120d] focus:outline-0 focus:ring-0 border border-[#e7d7cf] bg-[#fcf9f8] focus:border-[#e7d7cf] h-full placeholder:text-[#9a664c] px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal"
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        onKeyPress={handleKeyPress}
                      />
                      <div className="flex items-center justify-center rounded-r-xl border-l-0 border border-[#e7d7cf] bg-[#fcf9f8] pr-[7px]">
                        <Link
                          href="/generate"
                          className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#ee6c2b] text-[#fcf9f8] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                        >
                          <span className="truncate">Generate Recipes</span>
                        </Link>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Example Recipes Section */}
            <h2 className="text-[#1b120d] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Example Recipes</h2>
            <div className="flex overflow-y-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex items-stretch p-4 gap-3">
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style={{
                      backgroundImage: `url("https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`
                    }}
                  ></div>
                  <div>
                    <p className="text-[#1b120d] text-base font-medium leading-normal">Creamy Tomato Pasta</p>
                    <p className="text-[#9a664c] text-sm font-normal leading-normal">A simple yet flavorful pasta dish with a rich tomato sauce.</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style={{
                      backgroundImage: `url("https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`
                    }}
                  ></div>
                  <div>
                    <p className="text-[#1b120d] text-base font-medium leading-normal">Grilled Salmon with Asparagus</p>
                    <p className="text-[#9a664c] text-sm font-normal leading-normal">Perfectly grilled salmon served with fresh asparagus and lemon.</p>
                  </div>
                </div>
                <div className="flex h-full flex-1 flex-col gap-4 rounded-lg min-w-60">
                  <div
                    className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                    style={{
                      backgroundImage: `url("https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`
                    }}
                  ></div>
                  <div>
                    <p className="text-[#1b120d] text-base font-medium leading-normal">Artisan Pizza with Basil</p>
                    <p className="text-[#9a664c] text-sm font-normal leading-normal">A homemade pizza with a crispy crust and fresh ingredients.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-center">
          <div className="flex max-w-[960px] flex-1 flex-col">
            <footer className="flex flex-col gap-6 px-5 py-10 text-center @container">
              <div className="flex flex-wrap items-center justify-center gap-6 @[480px]:flex-row @[480px]:justify-around">
                <a className="text-[#9a664c] text-base font-normal leading-normal min-w-40" href="#">Privacy Policy</a>
                <a className="text-[#9a664c] text-base font-normal leading-normal min-w-40" href="#">Terms of Service</a>
              </div>
              <p className="text-[#9a664c] text-base font-normal leading-normal">© 2024 Pantry Genie. All rights reserved.</p>
            </footer>
          </div>
        </footer>
      </div>
    </div>
  )
}
