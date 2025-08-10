import type { Recipe, RecipeGenerationRequest } from '../types/recipe'

// Google Gemini API configuration
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY

// Fallback recipe templates for when AI is unavailable
const RECIPE_TEMPLATES = {
  pasta: {
    title: 'Quick Pasta Delight',
    description: 'A simple and delicious pasta dish using your available ingredients.',
    ingredients: [
      { name: 'pasta', amount: 1, unit: 'lb' },
      { name: 'olive oil', amount: 2, unit: 'tbsp' },
      { name: 'garlic', amount: 3, unit: 'cloves' },
      { name: 'salt', amount: 1, unit: 'tsp' },
      { name: 'black pepper', amount: 1/2, unit: 'tsp' }
    ],
    instructions: [
      'Bring a large pot of salted water to boil',
      'Cook pasta according to package instructions',
      'Heat olive oil in a large skillet over medium heat',
      'Add minced garlic and cook until fragrant',
      'Drain pasta and toss with garlic oil',
      'Season with salt and pepper to taste'
    ],
    prepTime: 5,
    cookTime: 15,
    servings: 4,
    difficulty: 'easy',
    cuisine: 'italian',
    dietaryTags: ['vegetarian']
  },
  stir_fry: {
    title: 'Quick Stir-Fry',
    description: 'A fast and healthy stir-fry using your ingredients.',
    ingredients: [
      { name: 'vegetables', amount: 3, unit: 'cups' },
      { name: 'soy sauce', amount: 2, unit: 'tbsp' },
      { name: 'garlic', amount: 2, unit: 'cloves' },
      { name: 'ginger', amount: 1, unit: 'tbsp' },
      { name: 'oil', amount: 1, unit: 'tbsp' }
    ],
    instructions: [
      'Heat oil in a wok or large skillet over high heat',
      'Add minced garlic and ginger, stir for 30 seconds',
      'Add vegetables and stir-fry for 3-5 minutes',
      'Add soy sauce and continue cooking for 1 minute',
      'Serve hot with rice or noodles'
    ],
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    difficulty: 'easy',
    cuisine: 'asian',
    dietaryTags: ['vegetarian', 'vegan']
  },
  salad: {
    title: 'Fresh Garden Salad',
    description: 'A refreshing salad using your fresh ingredients.',
    ingredients: [
      { name: 'mixed greens', amount: 4, unit: 'cups' },
      { name: 'tomatoes', amount: 2, unit: 'medium' },
      { name: 'cucumber', amount: 1, unit: 'medium' },
      { name: 'olive oil', amount: 2, unit: 'tbsp' },
      { name: 'lemon juice', amount: 1, unit: 'tbsp' }
    ],
    instructions: [
      'Wash and prepare all vegetables',
      'Chop tomatoes and cucumber into bite-sized pieces',
      'Combine all ingredients in a large bowl',
      'Drizzle with olive oil and lemon juice',
      'Toss gently and serve immediately'
    ],
    prepTime: 15,
    cookTime: 0,
    servings: 4,
    difficulty: 'easy',
    cuisine: 'mediterranean',
    dietaryTags: ['vegetarian', 'vegan', 'gluten-free']
  }
}

// Generate a recipe using AI or fallback templates
export async function generateRecipe(request: RecipeGenerationRequest): Promise<Recipe> {
  try {
    // Try AI generation first
    if (GEMINI_API_KEY) {
      console.log('Attempting AI recipe generation...')
      const aiRecipe = await generateRecipeWithAI(request)
      if (aiRecipe) {
        console.log('AI recipe generated successfully')
        
        // Add a fallback image for the recipe
        const fallbackUrl = getFallbackImage(aiRecipe.title)
        aiRecipe.imageUrl = fallbackUrl
        console.log('Using fallback image for AI recipe:', fallbackUrl)
        
        return aiRecipe
      }
    } else {
      console.log('No Gemini API key found, using fallback templates')
    }
  } catch (error) {
    console.warn('AI generation failed, using fallback:', error)
  }

  // Fallback to template-based generation
  console.log('Generating recipe from template...')
  return generateRecipeFromTemplate(request)
}

// Helper function to determine difficulty based on cooking time
function getDifficulty(cookingTime: number): 'easy' | 'medium' | 'hard' {
  if (cookingTime <= 20) return 'easy'
  if (cookingTime <= 45) return 'medium'
  return 'hard'
}

// Generate recipe using Google Gemini AI
async function generateRecipeWithAI(request: RecipeGenerationRequest): Promise<Recipe | null> {
  try {
    console.log('Gemini API Key exists:', !!GEMINI_API_KEY)
    console.log('Gemini API Key length:', GEMINI_API_KEY?.length)
    console.log('Gemini API Key starts with:', GEMINI_API_KEY?.substring(0, 10) + '...')
    
    const prompt = createRecipePrompt(request)
    
    console.log('Making request to Gemini API...')
    console.log('URL (without key):', GEMINI_API_URL)
    
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY || ''
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1000,
          topP: 0.8,
          topK: 40
        }
      })
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Response error text:', errorText)
      throw new Error(`AI API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Response data keys:', Object.keys(data))
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    console.log('Generated text length:', generatedText.length)

    // Parse the AI response into a recipe
    return parseAIResponse(generatedText, request)
  } catch (error) {
    console.error('AI generation error:', error)
    return null
  }
}

// Create a prompt for recipe generation
function createRecipePrompt(request: RecipeGenerationRequest): string {
  const ingredients = request.ingredients.join(', ')
  const constraints = request.dietaryConstraints?.join(', ') || 'none'
  const cuisine = request.cuisinePreference || 'any'
  const servings = request.servings || 4
  const maxTime = request.maxCookTime || 60

  return `You are a professional chef and recipe creator. Create a delicious, practical recipe using the following ingredients: ${ingredients}.

Requirements:
- Dietary constraints: ${constraints}
- Cuisine preference: ${cuisine}
- Servings: ${servings} people
- Maximum cook time: ${maxTime} minutes
- Use only the provided ingredients plus common pantry staples (salt, pepper, oil, etc.)

Please create a recipe in this exact format:

Title: [Creative recipe name]
Description: [Brief, appetizing description]
Ingredients:
- [amount] [unit] [ingredient name]
- [amount] [unit] [ingredient name]
- [continue for all ingredients]

Instructions:
1. [First step]
2. [Second step]
3. [Continue with numbered steps]

Prep time: [X] minutes
Cook time: [Y] minutes
Difficulty: [easy/medium/hard]
Cuisine: [cuisine type]
Dietary tags: [tag1, tag2, tag3]

Make sure the recipe is practical, delicious, and uses the provided ingredients creatively.`
}

// Parse AI response into recipe format
function parseAIResponse(text: string, request: RecipeGenerationRequest): Recipe {
  const lines = text.split('\n').filter(line => line.trim())
  
  let title = 'AI Generated Recipe'
  let description = 'A delicious recipe created just for you!'
  let ingredients: any[] = []
  let instructions: string[] = []
  let prepTime = 15
  let cookTime = 30
  let difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  let cuisine = 'international'
  let dietaryTags: string[] = []

  let currentSection = ''
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase().trim()
    
    // Detect sections
    if (lowerLine.includes('title:')) {
      title = line.split(':')[1]?.trim() || title
    } else if (lowerLine.includes('description:')) {
      description = line.split(':')[1]?.trim() || description
    } else if (lowerLine.includes('ingredients:')) {
      currentSection = 'ingredients'
    } else if (lowerLine.includes('instructions:')) {
      currentSection = 'instructions'
    } else if (lowerLine.includes('prep time:')) {
      const timeMatch = line.match(/(\d+)/)
      prepTime = timeMatch ? parseInt(timeMatch[1]) : 15
    } else if (lowerLine.includes('cook time:')) {
      const timeMatch = line.match(/(\d+)/)
      cookTime = timeMatch ? parseInt(timeMatch[1]) : 30
    } else if (lowerLine.includes('difficulty:')) {
      const diffMatch = line.match(/(easy|medium|hard)/i)
      difficulty = (diffMatch?.[1]?.toLowerCase() as 'easy' | 'medium' | 'hard') || 'medium'
    } else if (lowerLine.includes('cuisine:')) {
      cuisine = line.split(':')[1]?.trim() || 'international'
    } else if (lowerLine.includes('dietary tags:')) {
      const tagsMatch = line.match(/\[(.*?)\]/)
      if (tagsMatch) {
        dietaryTags = tagsMatch[1].split(',').map(tag => tag.trim())
      }
    } else if (currentSection === 'ingredients' && line.startsWith('-')) {
      // Parse ingredient line: "- 2 cups rice" or "- 1 tbsp oil"
      const ingredientText = line.substring(1).trim()
      const match = ingredientText.match(/^(\d+(?:\.\d+)?)\s+(\w+)\s+(.+)$/)
      if (match) {
        ingredients.push({
          name: match[3].trim(),
          amount: parseFloat(match[1]),
          unit: match[2]
        })
      }
    } else if (currentSection === 'instructions' && /^\d+\./.test(line)) {
      // Parse instruction line: "1. First step" or "2. Second step"
      const instructionText = line.replace(/^\d+\.\s*/, '').trim()
      if (instructionText) {
        instructions.push(instructionText)
      }
    }
  }

  // Fallback if parsing didn't work well
  if (ingredients.length === 0) {
    ingredients = request.ingredients.map(ing => ({
      name: ing,
      amount: Math.floor(Math.random() * 3) + 1,
      unit: ['cup', 'tbsp', 'tsp', 'piece'][Math.floor(Math.random() * 4)]
    }))
  }

  if (instructions.length === 0) {
    instructions = [
      'Prepare all ingredients',
      'Follow cooking instructions',
      'Season to taste',
      'Serve hot and enjoy!'
    ]
  }

  return {
    id: `ai-${Date.now()}`,
    title,
    description,
    ingredients,
    instructions,
    prepTime,
    cookTime,
    servings: request.servings || 4,
    difficulty,
    cuisine,
    dietaryTags,
    createdAt: new Date(),
    updatedAt: new Date()
  }
}

// Generate recipe from templates
function generateRecipeFromTemplate(request: RecipeGenerationRequest): Recipe {
  const templates = Object.values(RECIPE_TEMPLATES)
  const template = templates[Math.floor(Math.random() * templates.length)]
  
  // Customize template based on request
  const customizedIngredients = template.ingredients.map(ing => ({
    ...ing,
    name: request.ingredients.includes(ing.name) ? ing.name : 
          request.ingredients[Math.floor(Math.random() * request.ingredients.length)] || ing.name
  }))

  const recipe: Recipe = {
    id: `template-${Date.now()}`,
    title: template.title,
    description: template.description,
    ingredients: customizedIngredients,
    instructions: template.instructions,
    prepTime: template.prepTime,
    cookTime: template.cookTime,
    servings: request.servings || template.servings,
    difficulty: template.difficulty as 'easy' | 'medium' | 'hard',
    cuisine: request.cuisinePreference || template.cuisine,
    dietaryTags: template.dietaryTags,
    imageUrl: getFallbackImage(template.title),
    createdAt: new Date(),
    updatedAt: new Date()
  }

  console.log('Template recipe image URL:', recipe.imageUrl)
  
  // Double-check we have an image URL
  if (!recipe.imageUrl) {
    recipe.imageUrl = FALLBACK_FOOD_IMAGES[0] // Use first fallback as default
    console.log('Forced default fallback image:', recipe.imageUrl)
  }
  
  return recipe
}

// No external API needed - using curated images only

// Curated food images - no external API needed
const FALLBACK_FOOD_IMAGES = [
  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Spicy food
  'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Pasta
  'https://images.unsplash.com/photo-1546069902-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Healthy food
  'https://images.unsplash.com/photo-1544025162-0be1a038a1b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Vegetables
  'https://images.unsplash.com/photo-1499636136210-6026e6c0e231?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Dessert
  'https://images.unsplash.com/photo-1504674900204-0697e668a1c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // General cooking
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Breakfast
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Pizza
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Sushi
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Burger
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Soup
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'  // Smoothie
]

// Get a fallback image based on recipe content
function getFallbackImage(recipeTitle: string): string {
  const title = recipeTitle.toLowerCase()
  
  if (title.includes('pasta') || title.includes('noodle') || title.includes('spaghetti')) {
    return FALLBACK_FOOD_IMAGES[1]
  } else if (title.includes('salad') || title.includes('vegetable') || title.includes('green')) {
    return FALLBACK_FOOD_IMAGES[3]
  } else if (title.includes('dessert') || title.includes('cake') || title.includes('cookie') || title.includes('sweet')) {
    return FALLBACK_FOOD_IMAGES[4]
  } else if (title.includes('spicy') || title.includes('chili') || title.includes('hot')) {
    return FALLBACK_FOOD_IMAGES[0]
  } else if (title.includes('healthy') || title.includes('bowl') || title.includes('grain')) {
    return FALLBACK_FOOD_IMAGES[2]
  } else if (title.includes('breakfast') || title.includes('egg') || title.includes('pancake')) {
    return FALLBACK_FOOD_IMAGES[6]
  } else if (title.includes('pizza') || title.includes('italian')) {
    return FALLBACK_FOOD_IMAGES[7]
  } else if (title.includes('sushi') || title.includes('japanese') || title.includes('asian')) {
    return FALLBACK_FOOD_IMAGES[8]
  } else if (title.includes('burger') || title.includes('sandwich') || title.includes('meat')) {
    return FALLBACK_FOOD_IMAGES[9]
  } else if (title.includes('soup') || title.includes('stew') || title.includes('broth')) {
    return FALLBACK_FOOD_IMAGES[10]
  } else if (title.includes('smoothie') || title.includes('drink') || title.includes('juice')) {
    return FALLBACK_FOOD_IMAGES[11]
  } else {
    // Return random fallback image for variety
    return FALLBACK_FOOD_IMAGES[Math.floor(Math.random() * FALLBACK_FOOD_IMAGES.length)]
  }
}

// Legacy mock service for backward compatibility
export class AIService {
  static async generateRecipe(request: RecipeGenerationRequest): Promise<Recipe> {
    return generateRecipe(request)
  }
}
