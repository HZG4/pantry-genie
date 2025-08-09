// Utility functions for authentication cleanup
export function clearAuthData() {
  if (typeof window !== 'undefined') {
    // Clear all Supabase auth data
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.includes('supabase') || key.includes('sb-')) {
        localStorage.removeItem(key)
      }
    })
    
    // Clear session storage
    sessionStorage.clear()
    
    console.log('Auth data cleared')
  }
}

export function refreshAuthSession() {
  if (typeof window !== 'undefined') {
    // Force a page reload to refresh the auth session
    window.location.reload()
  }
}

// Debug function to check auth state
export function debugAuthState() {
  if (typeof window !== 'undefined') {
    console.log('LocalStorage keys:', Object.keys(localStorage))
    console.log('SessionStorage keys:', Object.keys(sessionStorage))
  }
}
