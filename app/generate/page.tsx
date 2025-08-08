'use client'

import { useState, useEffect } from 'react'
import { RecipeCard } from '../components/recipe-card'
import { AIService } from '../lib/ai-service'
import type { Recipe, RecipeGenerationRequest } from '../types/recipe'
import Link from 'next/link'
import Image from 'next/image'
import { Progress } from '../components/ui/progress'

export default function GeneratePage() {
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(true)
  const [progress, setProgress] = useState(0)
  
  // Form state
  const [ingredients, setIngredients] = useState('')
  const [dietaryConstraints, setDietaryConstraints] = useState('')
  const [cuisinePreference, setCuisinePreference] = useState('')
  const [servings, setServings] = useState('')
  const [cookTime, setCookTime] = useState('')

  useEffect(() => {
    // Check if ingredients were passed via URL
    const urlParams = new URLSearchParams(window.location.search)
    const ingredientsParam = urlParams.get('ingredients')
    if (ingredientsParam) {
      setIngredients(ingredientsParam)
    }
  }, [])

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) return

    setShowForm(false)
    setIsGenerating(true)
    setError(null)
    setProgress(0)
    
    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 80) {
          clearInterval(progressInterval)
          return 80
        }
        return prev + 2
      })
    }, 100)
    
    try {
      const request: RecipeGenerationRequest = {
        ingredients: ingredients.split(',').map(i => i.trim()).filter(i => i),
        dietaryConstraints: dietaryConstraints ? [dietaryConstraints] : undefined,
        cuisinePreference: cuisinePreference || undefined,
        servings: servings ? parseInt(servings) : undefined,
        maxCookTime: cookTime ? parseInt(cookTime) : undefined
      }

      const response = await AIService.generateRecipe(request)
      setGeneratedRecipe(response.recipe)
    } catch (err) {
      setError('Failed to generate recipe. Please try again.')
      console.error('Recipe generation error:', err)
    } finally {
      setIsGenerating(false)
      setProgress(0)
    }
  }



  const handleEditRecipe = () => {
    // TODO: Implement edit functionality
    alert('Edit functionality coming soon!')
  }

  const handleSaveRecipe = () => {
    // TODO: Implement save functionality with Supabase
    alert('Save functionality will be implemented with user authentication!')
  }

  const handleGenerateNew = () => {
    setShowForm(true)
    setGeneratedRecipe(null)
    setError(null)
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#fcf9f8] group/design-root overflow-x-hidden"
      style={{
        '--select-button-svg': 'url(\'data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(154,102,76)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e\')'
      } as React.CSSProperties}
    >
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
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAV9TKwSwIjOKctAV3h1fx8E-ZDwPRfjMUGEO4a1CQIcJX5NUupRnFE3ANUqopg-E-vYdnjxmwFS2sPVd8uT73u2SYrZ9lz5aM1CakUrW9YVaQLbUc5GpND5IAEbc_SKP3D3WBCheB9NTHkdHZg_-0lBKxkz8n-P-QCxlpOVCWLIIEE23wLdGKZnTOsyZmv1zXYEdbIN-1nkOnnJahS4v4Yb93jLblAzSwTR3pwGVa9uCJNYV1F-IvC0fB5EAE7Kg70EhoywJ7qN00k")'
              }}
            ></div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Show Form */}
            {showForm && (
              <>
                <div className="flex flex-wrap justify-between gap-3 p-4">
                  <div className="flex min-w-72 flex-col gap-3">
                    <p className="text-[#1b120d] tracking-light text-[32px] font-bold leading-tight">Generate Your Recipe</p>
                    <p className="text-[#9a664c] text-sm font-normal leading-normal">Enter the ingredients you have, and let AI create a unique recipe for you.</p>
                  </div>
                </div>

                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <textarea
                      placeholder="List your ingredients here..."
                      value={ingredients}
                      onChange={(e) => setIngredients(e.target.value)}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1b120d] focus:outline-0 focus:ring-0 border border-[#e7d7cf] bg-[#fcf9f8] focus:border-[#e7d7cf] min-h-36 placeholder:text-[#9a664c] p-[15px] text-base font-normal leading-normal"
                    ></textarea>
                  </label>
                </div>

                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <select
                      value={dietaryConstraints}
                      onChange={(e) => setDietaryConstraints(e.target.value)}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1b120d] focus:outline-0 focus:ring-0 border border-[#e7d7cf] bg-[#fcf9f8] focus:border-[#e7d7cf] h-14 bg-[image:--select-button-svg] placeholder:text-[#9a664c] p-[15px] text-base font-normal leading-normal"
                    >
                      <option value="">Dietary Constraints (Optional)</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="gluten-free">Gluten-Free</option>
                      <option value="dairy-free">Dairy-Free</option>
                      <option value="low-carb">Low-Carb</option>
                      <option value="keto">Keto</option>
                    </select>
                  </label>
                </div>

                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <select
                      value={cuisinePreference}
                      onChange={(e) => setCuisinePreference(e.target.value)}
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1b120d] focus:outline-0 focus:ring-0 border border-[#e7d7cf] bg-[#fcf9f8] focus:border-[#e7d7cf] h-14 bg-[image:--select-button-svg] placeholder:text-[#9a664c] p-[15px] text-base font-normal leading-normal"
                    >
                      <option value="">Cuisine Preference (Optional)</option>
                      <option value="italian">Italian</option>
                      <option value="mexican">Mexican</option>
                      <option value="chinese">Chinese</option>
                      <option value="indian">Indian</option>
                      <option value="japanese">Japanese</option>
                      <option value="thai">Thai</option>
                      <option value="mediterranean">Mediterranean</option>
                      <option value="french">French</option>
                      <option value="american">American</option>
                      <option value="greek">Greek</option>
                    </select>
                  </label>
                </div>

                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <input
                      placeholder="Number of Servings (Optional)"
                      value={servings}
                      onChange={(e) => setServings(e.target.value)}
                      type="number"
                      min="1"
                      max="12"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1b120d] focus:outline-0 focus:ring-0 border border-[#e7d7cf] bg-[#fcf9f8] focus:border-[#e7d7cf] h-14 placeholder:text-[#9a664c] p-[15px] text-base font-normal leading-normal"
                    />
                  </label>
                </div>

                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label className="flex flex-col min-w-40 flex-1">
                    <input
                      placeholder="Cook Time (Optional)"
                      value={cookTime}
                      onChange={(e) => setCookTime(e.target.value)}
                      type="number"
                      min="15"
                      max="180"
                      step="15"
                      className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1b120d] focus:outline-0 focus:ring-0 border border-[#e7d7cf] bg-[#fcf9f8] focus:border-[#e7d7cf] h-14 placeholder:text-[#9a664c] p-[15px] text-base font-normal leading-normal"
                    />
                  </label>
                </div>

                <div className="flex px-4 py-3 justify-end">
                  <button
                    onClick={handleGenerateRecipe}
                    disabled={!ingredients.trim()}
                    className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#ee6c2b] text-[#fcf9f8] text-sm font-bold leading-normal tracking-[0.015em] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="truncate">Generate Recipe</span>
                  </button>
                </div>
              </>
            )}

            {/* Show Loading */}
            {isGenerating && (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#ee6c2b] mx-auto mb-6"></div>
                <h3 className="text-2xl font-semibold mb-4 text-[#1b120d]">Cooking up your recipe...</h3>
                <p className="text-[#9a664c] text-lg mb-6">Our AI chef is working its magic!</p>
                
                {/* Progress Bar */}
                <div className="max-w-md mx-auto mb-4">
                  <Progress 
                    value={progress} 
                    className="h-3 bg-[#f3ebe7]"
                  />
                  <p className="text-[#9a664c] text-sm mt-2">
                    Generating recipe... {progress}%
                  </p>
                </div>
                
                <div className="text-sm text-[#9a664c]">
                  This usually takes about 10-15 seconds
                </div>
              </div>
            )}

            {/* Show Generated Recipe */}
            {generatedRecipe && !isGenerating && (
              <div>
                <div className="flex flex-wrap justify-between gap-3 p-4">
                  <p className="text-[#1b120d] tracking-light text-[32px] font-bold leading-tight min-w-72">AI-Generated Recipe: {generatedRecipe.title}</p>
                </div>
                
                {/* Recipe Image */}
                <div className="flex w-full grow bg-[#fcf9f8] @container p-4">
                  <div className="w-full gap-1 overflow-hidden bg-[#fcf9f8] @[480px]:gap-2 aspect-[3/2] rounded-xl flex">
                    <div
                      className="w-full bg-center bg-no-repeat bg-cover aspect-auto rounded-none flex-1"
                      style={{
                        backgroundImage: `url("https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")`
                      }}
                    ></div>
                  </div>
                </div>

                {/* Ingredients */}
                <h3 className="text-[#1b120d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Ingredients</h3>
                <ul className="text-[#1b120d] text-base font-normal leading-normal pb-3 pt-1 px-4 space-y-1">
                  {generatedRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>• {ingredient.amount} {ingredient.unit} {ingredient.name}</li>
                  ))}
                </ul>

                {/* Instructions */}
                <h3 className="text-[#1b120d] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Instructions</h3>
                <ol className="text-[#1b120d] text-base font-normal leading-normal pb-3 pt-1 px-4 space-y-2">
                  {generatedRecipe.instructions.map((instruction, index) => (
                    <li key={index}>{index + 1}. {instruction}</li>
                  ))}
                </ol>

                {/* Action Buttons */}
                <div className="flex justify-stretch">
                  <div className="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-start">
                    <button
                      onClick={handleSaveRecipe}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#ee6c2b] text-[#fcf9f8] text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      <span className="truncate">Save Recipe</span>
                    </button>
                    <button
                      onClick={() => {
                        // TODO: Implement share functionality
                        alert('Share functionality coming soon!')
                      }}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f3ebe7] text-[#1b120d] text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      <span className="truncate">Share</span>
                    </button>
                    <button
                      onClick={handleGenerateNew}
                      className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#f3ebe7] text-[#1b120d] text-sm font-bold leading-normal tracking-[0.015em]"
                    >
                      <span className="truncate">Generate New Recipe</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Show Error State */}
            {error && !isGenerating && !showForm && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-xl font-semibold mb-4 text-[#1b120d]">Oops! Something went wrong</h3>
                <p className="text-[#9a664c] mb-6">{error}</p>
                <button
                  onClick={handleGenerateNew}
                  className="bg-[#ee6c2b] hover:bg-[#d55a1f] text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
