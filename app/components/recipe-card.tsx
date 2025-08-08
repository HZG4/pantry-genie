import type { Recipe } from '../types/recipe'

interface RecipeCardProps {
  recipe: Recipe
  onSave?: () => void
  onEdit?: () => void
  isSaved?: boolean
}

export function RecipeCard({ recipe, onSave, onEdit, isSaved = false }: RecipeCardProps) {
  const totalTime = recipe.prepTime + recipe.cookTime

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#ee6c2b] to-[#d55a1f] p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
        {recipe.description && (
          <p className="text-orange-100">{recipe.description}</p>
        )}
        
        {/* Recipe Meta */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>{formatTime(totalTime)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>👥</span>
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🔥</span>
            <span className="capitalize">{recipe.difficulty}</span>
          </div>
          {recipe.cuisine && (
            <div className="flex items-center gap-1">
              <span>🌍</span>
              <span className="capitalize">{recipe.cuisine}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Dietary Tags */}
        {recipe.dietaryTags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-[#1b120d] mb-2">Dietary Tags</h3>
            <div className="flex flex-wrap gap-2">
              {recipe.dietaryTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Ingredients */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-[#1b120d]">Ingredients</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-[#ee6c2b] mt-1">•</span>
                <span className="text-[#1b120d]">
                  <span className="font-medium">{ingredient.amount} {ingredient.unit}</span>
                  <span className="ml-2">{ingredient.name}</span>
                  {ingredient.notes && (
                    <span className="text-[#9a664c] text-sm ml-2">({ingredient.notes})</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-[#1b120d]">Instructions</h3>
          <ol className="space-y-3">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#ee6c2b] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-[#1b120d] leading-relaxed">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Timing Details */}
        <div className="bg-[#fcf9f8] rounded-lg p-4 mb-6">
          <h4 className="font-medium mb-2 text-[#1b120d]">Timing</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#9a664c]">Prep time:</span>
              <span className="ml-2 font-medium text-[#1b120d]">{formatTime(recipe.prepTime)}</span>
            </div>
            <div>
              <span className="text-[#9a664c]">Cook time:</span>
              <span className="ml-2 font-medium text-[#1b120d]">{formatTime(recipe.cookTime)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaved}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                isSaved
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : 'bg-[#ee6c2b] hover:bg-[#d55a1f] text-white'
              }`}
            >
              {isSaved ? '✓ Saved' : '💾 Save Recipe'}
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 py-2 px-4 border border-[#e7d7cf] rounded-lg font-medium text-[#1b120d] hover:bg-[#fcf9f8] transition-colors"
            >
              ✏️ Edit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
