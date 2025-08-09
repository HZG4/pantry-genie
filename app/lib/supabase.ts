import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create Supabase client with better SSR handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
})

// Helper function to get current user
export async function getCurrentUser() {
  try {
    // First check if we're in a browser environment
    if (typeof window === 'undefined') {
      return null
    }

    // Get session first, then user
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError) {
      console.error('Session error:', sessionError)
      return null
    }

    if (!session) {
      return null
    }

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.error('Error getting user:', error)
      return null
    }
    return user
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return null
  }
}

// Helper function to check if user is authenticated
export async function isAuthenticated() {
  try {
    const user = await getCurrentUser()
    return !!user
  } catch (error) {
    console.error('Error in isAuthenticated:', error)
    return false
  }
}

// Helper function to get session
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    return session
  } catch (error) {
    console.error('Error in getSession:', error)
    return null
  }
}
