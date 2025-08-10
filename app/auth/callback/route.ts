import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')

  // Handle OAuth errors
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    // Redirect to login with error message
    return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent(errorDescription || 'Authentication failed')}`)
  }

  if (code) {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      }
    )

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Session exchange error:', error)
        return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent('Failed to complete authentication')}`)
      }

      // If user was created, try to create a profile
      if (data.user && data.session) {
        try {
          console.log('OAuth user created:', data.user.id)
          
          // Check if user profile already exists
          const { data: existingProfile, error: checkError } = await supabase
            .from('user_profiles')
            .select('id')
            .eq('id', data.user.id)
            .single()

          if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking existing profile:', checkError)
          }

          // If no profile exists, create one
          if (!existingProfile) {
            console.log('Creating profile for OAuth user')
            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert({
                id: data.user.id,
                name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
                avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })

            if (profileError) {
              console.error('Profile creation error details:', {
                message: profileError.message,
                details: profileError.details,
                hint: profileError.hint,
                code: profileError.code
              })
              // Don't fail the auth, just log the error
            } else {
              console.log('Profile created successfully for OAuth user')
            }
          } else {
            console.log('Profile already exists for OAuth user')
          }
        } catch (profileError) {
          console.error('Profile handling error:', profileError)
          // Don't fail the auth, just log the error
        }
      }
    } catch (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=${encodeURIComponent('Authentication failed')}`)
    }
  }

  // Get the redirect path from query params or default to home
  const redirectPath = requestUrl.searchParams.get('redirectTo') || '/'
  
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`)
}
