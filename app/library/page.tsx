'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Recipe } from '../types/recipe'
import { useAuth } from '../hooks/use-auth'
import { recipeService } from '../lib/database'
import { useToast } from '../components/ui/toast'

export default function LibraryPage() {
  const { user, getUserAvatar } = useAuth()
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch user's recipes from database
  useEffect(() => {
    const fetchRecipes = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        console.log('Fetching recipes for user:', user.id)
        const userRecipes = await recipeService.getUserRecipes(user.id)
        console.log('Fetched recipes:', userRecipes)
        setRecipes(userRecipes)
      } catch (err: any) {
        console.error('Error fetching recipes:', err)
        if (err.message === 'User not authenticated') {
          setError('Please log in to view your recipes.')
        } else {
          setError('Failed to load recipes. Please try again.')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [user])

  // Search functionality
  const handleSearch = async (query: string) => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      
      if (query.trim()) {
        const searchResults = await recipeService.searchRecipes(user.id, query)
        setRecipes(searchResults)
      } else {
        // If search is empty, fetch all recipes
        const allRecipes = await recipeService.getUserRecipes(user.id)
        setRecipes(allRecipes)
      }
    } catch (err) {
      console.error('Error searching recipes:', err)
      setError('Failed to search recipes. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, user])

  const handleRecipeClick = (recipe: Recipe) => {
    // Navigate to recipe detail page
    window.location.href = `/recipe/${recipe.id}`
  }

  const handleDeleteRecipe = async (recipeId: string) => {
    if (!user) return

    try {
      await recipeService.deleteRecipe(recipeId)
      setRecipes(recipes.filter(recipe => recipe.id !== recipeId))
      showToast({
        type: 'success',
        title: 'Recipe Deleted',
        message: 'Recipe has been removed from your library.',
        duration: 3000
      })
    } catch (err) {
      console.error('Error deleting recipe:', err)
      showToast({
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete recipe. Please try again.',
        duration: 5000
      })
    }
  }

  // Generate a placeholder image URL based on recipe ID
  const getRecipeImageUrl = (recipeId: string) => {
    // Use a hash of the recipe ID to get consistent images
    const hash = recipeId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0)
    const imageIndex = Math.abs(hash) % 6 + 1
    
    const imageUrls = [
      '1563379926898-05f4575a45d8', // Spicy food
      '1621996346565-e3dbc353d2e5', // Pasta
      '1546069902-ba9599a7e63c',    // Healthy food
      '1544025162-0be1a038a1b8',    // Vegetables
      '1499636136210-6026e6c0e231', // Dessert
      '1504674900204-0697e668a1c7'  // General cooking
    ]
    
    return `https://images.unsplash.com/photo-${imageUrls[imageIndex - 1]}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#fcf9f8] group/design-root overflow-x-hidden"
    >
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f3ebe7] px-10 py-3">
          <div className="flex items-center gap-4 text-[#1b120d]">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h2 className="text-[#1b120d] text-xl font-black leading-tight tracking-[-0.015em]">
                <span className="text-[#ee6c2b]">Pantry</span>{' '}
                <span className="text-[#22c55e]">Genie</span>
              </h2>
            </Link>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/">Home</Link>
              <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/generate">Generate Recipes</Link>
            </div>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{
                backgroundImage: `url("${getUserAvatar()}")`
              }}
            ></div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Page Title */}
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#1b120d] tracking-light text-[32px] font-bold leading-tight min-w-72">My Recipes</p>
            </div>

            {/* Error State */}
            {error && !loading && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-xl font-semibold mb-4 text-[#1b120d]">Failed to load recipes</h3>
                <p className="text-[#9a664c] mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-[#ee6c2b] hover:bg-[#d55a1f] text-white px-6 py-3 rounded-lg transition-colors inline-block"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Search Bar */}
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div
                    className="text-[#9a664c] flex border-none bg-[#f3ebe7] items-center justify-center pl-4 rounded-l-xl border-r-0"
                    data-icon="MagnifyingGlass"
                    data-size="24px"
                    data-weight="regular"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path
                        d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Search recipes"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={loading}
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#1b120d] focus:outline-0 focus:ring-0 border-none bg-[#f3ebe7] focus:border-none h-full placeholder:text-[#9a664c] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal disabled:opacity-50"
                  />
                </div>
              </label>
            </div>

            {/* Recipes Section */}
            {!error && (
              <>
                {loading ? (
                  <div className="px-4 py-8 text-center">
                    <div className="animate-pulse">
                      <div className="text-6xl mb-4 opacity-50">📚</div>
                      <h3 className="text-xl font-semibold mb-4 text-[#1b120d] opacity-50">Loading recipes...</h3>
                    </div>
                  </div>
                ) : recipes.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold mb-4 text-[#1b120d]">No recipes found</h3>
                    <p className="text-[#9a664c] mb-6">
                      {searchQuery ? 'Try adjusting your search terms.' : 'Start by generating some recipes!'}
                    </p>
                    {!searchQuery && (
                      <Link
                        href="/generate"
                        className="bg-[#ee6c2b] hover:bg-[#d55a1f] text-white px-6 py-3 rounded-lg transition-colors inline-block"
                      >
                        Generate Your First Recipe
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
                    {recipes.map((recipe) => (
                      <div 
                        key={recipe.id} 
                        className="flex flex-col gap-3 pb-3 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleRecipeClick(recipe)}
                      >
                        <div
                          className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                          style={{
                            backgroundImage: recipe.imageUrl 
                              ? `url("${recipe.imageUrl}")`
                              : `url("${getRecipeImageUrl(recipe.id)}")`
                          }}
                        ></div>
                        <div>
                          <p className="text-[#1b120d] text-base font-medium leading-normal">{recipe.title}</p>
                          <p className="text-[#9a664c] text-sm font-normal leading-normal">{recipe.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
