'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from './hooks/use-auth'

export default function Home() {
  const [ingredients, setIngredients] = useState('')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, requireAuth, getUserAvatar } = useAuth()

  const handleGenerateRecipe = () => {
    if (ingredients.trim()) {
      requireAuth(() => {
        // Navigate to recipe generation with ingredients
        window.location.href = `/generate?ingredients=${encodeURIComponent(ingredients)}`
      })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerateRecipe()
    }
  }

  const handleProtectedNavigation = (path: string) => {
    requireAuth(() => {
      window.location.href = path
    })
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-[#fcf9f8] group/design-root overflow-x-hidden" style={{fontFamily: '"Space Grotesk", "Noto Sans", sans-serif'}}>
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f3ebe7] px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-2 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-[#1b120d]">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h2 className="text-[#1b120d] text-sm sm:text-base md:text-lg lg:text-xl font-black leading-tight tracking-[-0.015em]">
                <span className="text-[#ee6c2b]">Pantry</span>{' '}
                <span className="text-[#22c55e]">Genie</span>
              </h2>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg bg-[#f3ebe7] text-[#1b120d] hover:bg-[#e7d7cf] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-end gap-4 md:gap-6 lg:gap-8">
            <div className="flex items-center gap-4 md:gap-6 lg:gap-9">
              <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/">Home</Link>
              <button 
                onClick={() => handleProtectedNavigation('/library')}
                className="text-[#1b120d] text-sm font-medium leading-normal hover:opacity-80 transition-opacity"
              >
                My Recipes
              </button>
            </div>
            <button
              onClick={() => handleProtectedNavigation('/generate')}
              className="flex min-w-[72px] md:min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-8 md:h-10 px-2 md:px-3 lg:px-4 bg-[#ee6c2b] text-[#fcf9f8] text-xs md:text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#d55a1f] transition-colors"
            >
              <span className="truncate">Get Started</span>
            </button>
            {user && (
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-6 md:size-8 lg:size-10"
                style={{
                  backgroundImage: `url("${getUserAvatar()}")`
                }}
              ></div>
            )}
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-[#f3ebe7] px-3 py-4">
            <div className="flex flex-col gap-3">
              <Link 
                href="/" 
                className="text-[#1b120d] text-sm font-medium py-2 hover:bg-[#f3ebe7] rounded-lg px-3 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <button 
                onClick={() => {
                  handleProtectedNavigation('/library')
                  setIsMobileMenuOpen(false)
                }}
                className="text-left text-[#1b120d] text-sm font-medium py-2 hover:bg-[#f3ebe7] rounded-lg px-3 transition-colors"
              >
                My Recipes
              </button>
              <button
                onClick={() => {
                  handleProtectedNavigation('/generate')
                  setIsMobileMenuOpen(false)
                }}
                className="text-left text-[#1b120d] text-sm font-medium py-2 hover:bg-[#f3ebe7] rounded-lg px-3 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="px-2 sm:px-3 md:px-4 lg:px-6 xl:px-8 2xl:px-20 flex flex-1 justify-center py-3 sm:py-4 md:py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-3 md:p-4">
                {/* Hero Section */}
                <div
                  className="flex min-h-[240px] sm:min-h-[280px] md:min-h-[320px] lg:min-h-[400px] xl:min-h-[480px] flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8 @[480px]:gap-6 @[480px]:rounded-xl items-center justify-center p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`
                  }}
                >
                  <div className="flex flex-col gap-1 sm:gap-2 text-center px-1 sm:px-2 md:px-4">
                    <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black leading-tight tracking-[-0.033em] @[480px]:text-3xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                      Unlock Culinary Creativity with AI
                    </h1>
                    <h2 className="text-white text-xs sm:text-sm md:text-base font-normal leading-normal @[480px]:text-sm @[480px]:font-normal @[480px]:leading-normal px-1 sm:px-2 md:px-4">
                      Transform your ingredients into delicious recipes with our AI-powered generator. Simply enter your ingredients and discover endless possibilities.
                    </h2>
                  </div>
                  
                  {/* Search Input */}
                  <div className="w-full max-w-[480px] px-1 sm:px-2 md:px-4">
                    <div className="flex flex-col sm:flex-row w-full gap-2 sm:gap-0">
                      <div className="flex flex-1 items-stretch rounded-xl h-10 sm:h-12 md:h-14 lg:h-16">
                        <div className="text-[#9a664c] flex border border-[#e7d7cf] bg-[#fcf9f8] items-center justify-center pl-2 sm:pl-3 md:pl-[15px] rounded-l-xl border-r-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" className="sm:w-4 sm:h-4 md:w-[18px] md:h-[18px] lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 256 256">
                            <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                          </svg>
                        </div>
                        <input
                          placeholder="Enter your ingredients (e.g., chicken, broccoli, rice)"
                          className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1b120d] focus:outline-0 focus:ring-0 border border-[#e7d7cf] bg-[#fcf9f8] focus:border-[#e7d7cf] h-full placeholder:text-[#9a664c] px-2 sm:px-3 md:px-[15px] rounded-r-none border-r-0 pr-2 rounded-l-none border-l-0 pl-2 text-xs sm:text-sm md:text-base font-normal leading-normal @[480px]:text-sm @[480px]:font-normal @[480px]:leading-normal"
                          value={ingredients}
                          onChange={(e) => setIngredients(e.target.value)}
                          onKeyPress={handleKeyPress}
                        />
                      </div>
                      <button
                        onClick={handleGenerateRecipe}
                        className="flex w-full sm:w-auto min-w-[100px] sm:min-w-[120px] md:min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 sm:h-12 md:h-14 lg:h-16 px-2 sm:px-3 md:px-4 lg:px-5 bg-[#ee6c2b] text-[#fcf9f8] text-xs sm:text-sm md:text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-sm @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-[#d55a1f] transition-colors"
                      >
                        <span className="truncate">Generate Recipes</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="px-1 sm:px-2 md:px-4 py-4 sm:py-6 md:py-8 mt-3 sm:mt-4 md:mt-6">
              <h2 className="text-[#1b120d] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[28px] font-bold leading-tight tracking-[-0.015em] mb-3 sm:mb-4 md:mb-6 lg:mb-8 text-center">Why Choose Pantry Genie?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-4 sm:mb-6 md:mb-8 lg:mb-12">
                <div className="text-center p-2 sm:p-3 md:p-4 lg:p-6 bg-white rounded-xl shadow-sm">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-[#ee6c2b] rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-[#1b120d] text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 sm:mb-2 md:mb-3">AI-Powered Creativity</h3>
                  <p className="text-[#9a664c] text-xs sm:text-sm leading-relaxed">Our advanced AI analyzes your ingredients and creates unique, delicious recipes tailored to your taste preferences and dietary needs.</p>
                </div>
                <div className="text-center p-2 sm:p-3 md:p-4 lg:p-6 bg-white rounded-xl shadow-sm">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-[#22c55e] rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-[#1b120d] text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 sm:mb-2 md:mb-3">Personal Recipe Library</h3>
                  <p className="text-[#9a664c] text-xs sm:text-sm leading-relaxed">Save your favorite recipes, organize them by cuisine, and access them anytime. Build your personal collection of culinary masterpieces.</p>
                </div>
                <div className="text-center p-2 sm:p-3 md:p-4 lg:p-6 bg-white rounded-xl shadow-sm sm:col-span-2 lg:col-span-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 bg-[#9a664c] rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-[#1b120d] text-sm sm:text-base md:text-lg lg:text-xl font-bold mb-1 sm:mb-2 md:mb-3">Instant Inspiration</h3>
                  <p className="text-[#9a664c] text-xs sm:text-sm leading-relaxed">No more staring at empty pantries! Get instant recipe suggestions that make the most of what you have, reducing food waste and saving money.</p>
                </div>
              </div>
            </div>

            {/* How It Works Section */}
            <div className="px-1 sm:px-2 md:px-4 py-3 sm:py-4 md:py-6 lg:py-8 bg-white rounded-xl mx-1 sm:mx-2 md:mx-4 mb-3 sm:mb-4 md:mb-6 lg:mb-8">
              <h2 className="text-[#1b120d] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[28px] font-bold leading-tight tracking-[-0.015em] mb-3 sm:mb-4 md:mb-6 lg:mb-8 text-center">How It Works</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                <div className="text-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-[#ee6c2b] text-white rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 md:mb-3 lg:mb-4 font-bold text-xs sm:text-sm md:text-base lg:text-lg">1</div>
                  <h3 className="text-[#1b120d] text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Enter Ingredients</h3>
                  <p className="text-[#9a664c] text-xs sm:text-sm">List what you have in your kitchen - from fresh produce to pantry staples.</p>
                </div>
                <div className="text-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-[#22c55e] text-white rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 md:mb-3 lg:mb-4 font-bold text-xs sm:text-sm md:text-base lg:text-lg">2</div>
                  <h3 className="text-[#1b120d] text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-1 sm:mb-2">AI Magic</h3>
                  <p className="text-[#9a664c] text-xs sm:text-sm">Our AI creates personalized recipes with detailed instructions and cooking times.</p>
                </div>
                <div className="text-center">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-[#9a664c] text-white rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 md:mb-3 lg:mb-4 font-bold text-xs sm:text-sm md:text-base lg:text-lg">3</div>
                  <h3 className="text-[#1b120d] text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Cook & Enjoy</h3>
                  <p className="text-[#9a664c] text-xs sm:text-sm">Follow the step-by-step instructions and create delicious meals in your kitchen.</p>
                </div>
                <div className="text-center sm:col-span-2 lg:col-span-1">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-[#ee6c2b] text-white rounded-full flex items-center justify-center mx-auto mb-1 sm:mb-2 md:mb-3 lg:mb-4 font-bold text-xs sm:text-sm md:text-base lg:text-lg">4</div>
                  <h3 className="text-[#1b120d] text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Save & Share</h3>
                  <p className="text-[#9a664c] text-xs sm:text-sm">Save your favorite recipes to your personal library and share them with friends.</p>
                </div>
              </div>
            </div>

            {/* Example Recipes Section */}
            <div className="px-1 sm:px-2 md:px-4 py-3 sm:py-4 md:py-6 lg:py-8">
              <h2 className="text-[#1b120d] text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[28px] font-bold leading-tight tracking-[-0.015em] mb-2 sm:mb-3 md:mb-4 lg:mb-6 text-center">Discover Amazing Recipes</h2>
              <p className="text-[#9a664c] text-center mb-3 sm:mb-4 md:mb-6 lg:mb-8 max-w-2xl mx-auto text-xs sm:text-sm md:text-base px-1 sm:px-2">From quick weeknight dinners to impressive weekend feasts, our AI creates recipes that are both delicious and practical. Here are some examples of what you can create:</p>
              <div className="flex overflow-x-auto [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-stretch p-1 sm:p-2 md:p-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                  <div className="flex h-full flex-1 flex-col gap-1 sm:gap-2 md:gap-3 lg:gap-4 rounded-lg min-w-48 sm:min-w-56 md:min-w-64 lg:min-w-72 bg-white p-1 sm:p-2 md:p-3 lg:p-4 shadow-sm">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                      style={{
                        backgroundImage: `url("https://images.unsplash.com/photo-1563379926898-ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`
                      }}
                    ></div>
                    <div>
                      <p className="text-[#1b120d] text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Spicy Thai Basil Stir-Fry</p>
                      <p className="text-[#9a664c] text-xs sm:text-sm font-normal leading-relaxed mb-1 sm:mb-2 md:mb-3">A vibrant stir-fry with aromatic basil, fresh vegetables, and a perfect balance of sweet and spicy flavors.</p>
                      <div className="flex gap-1 sm:gap-2">
                        <span className="px-1 sm:px-2 py-1 bg-[#f3ebe7] text-[#9a664c] rounded-full text-xs">Quick</span>
                        <span className="px-1 sm:px-2 py-1 bg-[#f3ebe7] text-[#9a664c] rounded-full text-xs">Vegetarian</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex h-full flex-1 flex-col gap-1 sm:gap-2 md:gap-3 lg:gap-4 rounded-lg min-w-48 sm:min-w-56 md:min-w-64 lg:min-w-72 bg-white p-1 sm:p-2 md:p-3 lg:p-4 shadow-sm">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                      style={{
                        backgroundImage: `url("https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`
                      }}
                    ></div>
                    <div>
                      <p className="text-[#1b120d] text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Mediterranean Grilled Salmon</p>
                      <p className="text-[#9a664c] text-xs sm:text-sm font-normal leading-relaxed mb-1 sm:mb-2 md:mb-3">Perfectly grilled salmon with herbs, lemon, and seasonal vegetables - a healthy and elegant dinner option.</p>
                      <div className="flex gap-1 sm:gap-2">
                        <span className="px-1 sm:px-2 py-1 bg-[#f3ebe7] text-[#9a664c] rounded-full text-xs">Healthy</span>
                        <span className="px-1 sm:px-2 py-1 bg-[#f3ebe7] text-[#9a664c] rounded-full text-xs">Gluten-Free</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex h-full flex-1 flex-col gap-1 sm:gap-2 md:gap-3 lg:gap-4 rounded-lg min-w-48 sm:min-w-56 md:min-w-64 lg:min-w-72 bg-white p-1 sm:p-2 md:p-3 lg:p-4 shadow-sm">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl flex flex-col"
                      style={{
                        backgroundImage: `url("https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`
                      }}
                    ></div>
                    <div>
                      <p className="text-[#1b120d] text-xs sm:text-sm md:text-base lg:text-lg font-semibold mb-1 sm:mb-2">Artisan Margherita Pizza</p>
                      <p className="text-[#9a664c] text-xs sm:text-sm font-normal leading-relaxed mb-1 sm:mb-2 md:mb-3">A classic pizza with fresh mozzarella, basil, and homemade tomato sauce on a crispy, chewy crust.</p>
                      <div className="flex gap-1 sm:gap-2">
                        <span className="px-1 sm:px-2 py-1 bg-[#f3ebe7] text-[#9a664c] rounded-full text-xs">Italian</span>
                        <span className="px-1 sm:px-2 py-1 bg-[#f3ebe7] text-[#9a664c] rounded-full text-xs">Vegetarian</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="px-1 sm:px-2 md:px-4 py-4 sm:py-6 md:py-8 lg:py-12 bg-gradient-to-r from-[#ee6c2b] to-[#d55a1f] rounded-xl mx-1 sm:mx-2 md:mx-4 mb-3 sm:mb-4 md:mb-6 lg:mb-8 text-center">
              <h2 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[32px] font-bold leading-tight mb-2 sm:mb-3 md:mb-4">Ready to Transform Your Cooking?</h2>
              <p className="text-white text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-4 md:mb-6 lg:mb-8 max-w-2xl mx-auto px-1 sm:px-2">Join thousands of home chefs who are discovering new recipes and reducing food waste with Pantry Genie.</p>
              <button
                onClick={() => handleProtectedNavigation('/generate')}
                className="bg-white text-[#ee6c2b] px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4 rounded-xl font-bold text-xs sm:text-sm md:text-base lg:text-lg hover:bg-gray-100 transition-colors"
              >
                Start Creating Recipes Now
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-center">
          <div className="flex max-w-[960px] flex-1 flex-col">
            <footer className="flex flex-col gap-2 sm:gap-3 md:gap-4 lg:gap-6 px-1 sm:px-2 md:px-3 lg:px-5 py-4 sm:py-6 md:py-8 lg:py-10 text-center @container">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 @[480px]:flex-row @[480px]:justify-around">
                <a className="text-[#9a664c] text-xs sm:text-sm md:text-base font-normal leading-normal min-w-24 sm:min-w-28 md:min-w-32 lg:min-w-40" href="#">Privacy Policy</a>
                <a className="text-[#9a664c] text-xs sm:text-sm md:text-base font-normal leading-normal min-w-24 sm:min-w-28 md:min-w-32 lg:min-w-40" href="#">Terms of Service</a>
              </div>
              <p className="text-[#9a664c] text-xs sm:text-sm md:text-base font-normal leading-normal">© 2024 Pantry Genie. All rights reserved.</p>
            </footer>
          </div>
        </footer>
      </div>
    </div>
  )
}
