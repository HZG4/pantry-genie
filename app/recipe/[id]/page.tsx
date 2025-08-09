'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import type { Recipe } from '../../types/recipe'
import { useAuth } from '../../hooks/use-auth'
import { recipeService } from '../../lib/database'
import { useToast } from '../../components/ui/toast'

// Mock data for demonstration - will be replaced with Supabase data
const mockRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Spicy Chicken Stir-Fry',
    description: 'Quick and flavorful stir-fry with a spicy kick.',
    ingredients: [
      { name: 'chicken breast', amount: 1, unit: 'lb' },
      { name: 'soy sauce', amount: 2, unit: 'tbsp' },
      { name: 'garlic', amount: 3, unit: 'cloves' },
      { name: 'ginger', amount: 1, unit: 'tbsp' },
      { name: 'vegetables', amount: 2, unit: 'cups' }
    ],
    instructions: [
      'Cut chicken into bite-sized pieces',
      'Heat oil in a wok or large skillet',
      'Add chicken and cook until golden',
      'Add vegetables and stir-fry',
      'Season with soy sauce and serve'
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    difficulty: 'medium',
    cuisine: 'asian',
    dietaryTags: ['high-protein'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    title: 'Creamy Tomato Pasta',
    description: 'Rich and creamy pasta with a hint of sweetness.',
    ingredients: [
      { name: 'pasta', amount: 1, unit: 'lb' },
      { name: 'tomatoes', amount: 4, unit: 'medium' },
      { name: 'heavy cream', amount: 1, unit: 'cup' },
      { name: 'garlic', amount: 4, unit: 'cloves' },
      { name: 'basil', amount: 1/4, unit: 'cup' }
    ],
    instructions: [
      'Cook pasta according to package instructions',
      'Sauté garlic in olive oil',
      'Add tomatoes and cook until softened',
      'Stir in cream and simmer',
      'Toss with pasta and basil'
    ],
    prepTime: 10,
    cookTime: 25,
    servings: 4,
    difficulty: 'easy',
    cuisine: 'italian',
    dietaryTags: ['vegetarian'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    title: 'Lemon Herb Roasted Salmon',
    description: 'Flaky salmon with a zesty lemon and herb crust.',
    ingredients: [
      { name: 'salmon fillets', amount: 4, unit: 'pieces' },
      { name: 'lemon', amount: 2, unit: 'pieces' },
      { name: 'fresh herbs', amount: 1/4, unit: 'cup' },
      { name: 'olive oil', amount: 2, unit: 'tbsp' },
      { name: 'garlic', amount: 3, unit: 'cloves' }
    ],
    instructions: [
      'Preheat oven to 400°F',
      'Season salmon with herbs and lemon',
      'Place on baking sheet',
      'Roast for 12-15 minutes',
      'Serve with lemon wedges'
    ],
    prepTime: 10,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    cuisine: 'mediterranean',
    dietaryTags: ['high-protein', 'omega-3'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    title: 'Vegetarian Chili',
    description: 'Hearty and comforting chili packed with vegetables.',
    ingredients: [
      { name: 'kidney beans', amount: 2, unit: 'cans' },
      { name: 'bell peppers', amount: 2, unit: 'pieces' },
      { name: 'onion', amount: 1, unit: 'large' },
      { name: 'tomatoes', amount: 28, unit: 'oz can' },
      { name: 'chili powder', amount: 2, unit: 'tbsp' }
    ],
    instructions: [
      'Sauté onions and peppers',
      'Add beans and tomatoes',
      'Season with chili powder',
      'Simmer for 30 minutes',
      'Serve with toppings'
    ],
    prepTime: 15,
    cookTime: 30,
    servings: 6,
    difficulty: 'easy',
    cuisine: 'mexican',
    dietaryTags: ['vegetarian', 'high-fiber'],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    title: 'Chocolate Chip Cookies',
    description: 'Classic homemade cookies with a soft center and crispy edges.',
    ingredients: [
      { name: 'all-purpose flour', amount: 2.25, unit: 'cups' },
      { name: 'butter', amount: 1, unit: 'cup' },
      { name: 'brown sugar', amount: 0.75, unit: 'cup' },
      { name: 'white sugar', amount: 0.75, unit: 'cup' },
      { name: 'chocolate chips', amount: 2, unit: 'cups' }
    ],
    instructions: [
      'Cream butter and sugars',
      'Add eggs and vanilla',
      'Mix in dry ingredients',
      'Fold in chocolate chips',
      'Bake at 375°F for 10-12 minutes'
    ],
    prepTime: 15,
    cookTime: 12,
    servings: 24,
    difficulty: 'easy',
    cuisine: 'american',
    dietaryTags: ['dessert'],
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

export default function RecipeDetailPage() {
  const { getUserAvatar } = useAuth()
  const { showToast } = useToast()
  const params = useParams()
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecipe = async () => {
      setIsLoading(true)
      setError(null)

      try {
        if (!params.id) {
          setError('Recipe ID is required')
          return
        }

        const foundRecipe = await recipeService.getRecipeById(params.id as string)
        
        if (foundRecipe) {
          setRecipe(foundRecipe)
        } else {
          setError('Recipe not found')
        }
      } catch (err) {
        setError('Failed to load recipe')
        console.error('Recipe fetch error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecipe()
  }, [params.id])

  const handleEditRecipe = () => {
    // TODO: Navigate to edit page or open edit modal
    showToast({
      type: 'info',
      title: 'Coming Soon!',
      message: 'Edit functionality will be available in the next update.',
      duration: 3000
    })
  }

  const handleDeleteRecipe = async () => {
    if (!recipe) return

    if (confirm('Are you sure you want to delete this recipe?')) {
      try {
        await recipeService.deleteRecipe(recipe.id)
        showToast({
          type: 'success',
          title: 'Recipe Deleted',
          message: 'Recipe has been removed from your library.',
          duration: 3000
        })
        router.push('/library')
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
  }

  const handleShareRecipe = () => {
    // TODO: Implement share functionality
    if (navigator.share && recipe) {
      navigator.share({
        title: recipe.title,
        text: recipe.description || `Check out this recipe: ${recipe.title}`,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      showToast({
        type: 'success',
        title: 'Link Copied!',
        message: 'Recipe link has been copied to your clipboard.',
        duration: 3000
      })
    }
  }

  if (isLoading) {
    return (
      <div
        className="relative flex size-full min-h-screen flex-col bg-[#fcf9f8] group/design-root overflow-x-hidden"
        style={{
          '--select-button-svg': 'url(\'data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(154,102,76)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1,11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e\')'
        } as React.CSSProperties}
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
                <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/library">My Recipes</Link>
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
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#ee6c2b] mx-auto mb-6"></div>
                <h3 className="text-2xl font-semibold mb-4 text-[#1b120d]">Loading recipe...</h3>
                <p className="text-[#9a664c] text-lg">Please wait while we fetch your recipe.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !recipe) {
    return (
      <div
        className="relative flex size-full min-h-screen flex-col bg-[#fcf9f8] group/design-root overflow-x-hidden"
        style={{
          '--select-button-svg': 'url(\'data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(154,102,76)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1,11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e\')'
        } as React.CSSProperties}
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
                <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/library">My Recipes</Link>
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
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="text-6xl mb-4">❌</div>
                <h3 className="text-xl font-semibold mb-4 text-[#1b120d]">Recipe not found</h3>
                <p className="text-[#9a664c] mb-6">{error || 'The recipe you\'re looking for doesn\'t exist.'}</p>
                <Link
                  href="/library"
                  className="bg-[#ee6c2b] hover:bg-[#d55a1f] text-white px-6 py-3 rounded-lg transition-colors inline-block"
                >
                  Back to My Recipes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-[#fcf9f8] group/design-root overflow-x-hidden"
      style={{
        '--select-button-svg': 'url(\'data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(154,102,76)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1,11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e\')'
      } as React.CSSProperties}
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
              <Link className="text-[#1b120d] text-sm font-medium leading-normal" href="/library">My Recipes</Link>
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
            {/* Recipe Content */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Recipe Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-[#1b120d] mb-2">{recipe.title}</h1>
                  <p className="text-[#9a664c] text-lg">{recipe.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleEditRecipe}
                    className="bg-[#ee6c2b] hover:bg-[#d55a1f] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDeleteRecipe}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleShareRecipe}
                    className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Share
                  </button>
                </div>
              </div>

              {/* Recipe Image */}
              {recipe.imageUrl && (
                <div className="mb-8">
                  <div className="w-full h-64 bg-center bg-no-repeat bg-cover rounded-xl"
                    style={{
                      backgroundImage: `url("${recipe.imageUrl}")`
                    }}
                  ></div>
                </div>
              )}

              {/* Recipe Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-4 bg-[#f3ebe7] rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#ee6c2b]">{recipe.prepTime}</div>
                  <div className="text-sm text-[#9a664c]">Prep Time (min)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#ee6c2b]">{recipe.cookTime}</div>
                  <div className="text-sm text-[#9a664c]">Cook Time (min)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#ee6c2b]">{recipe.servings}</div>
                  <div className="text-sm text-[#9a664c]">Servings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#ee6c2b] capitalize">{recipe.difficulty}</div>
                  <div className="text-sm text-[#9a664c]">Difficulty</div>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#1b120d] mb-4">Ingredients</h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#ee6c2b] rounded-full"></span>
                      <span className="text-[#1b120d]">
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#1b120d] mb-4">Instructions</h2>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-[#ee6c2b] text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <span className="text-[#1b120d] leading-relaxed">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#f3ebe7] text-[#9a664c] rounded-full text-sm capitalize">
                  {recipe.cuisine}
                </span>
                {recipe.dietaryTags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-[#e7d7cf] text-[#1b120d] rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
