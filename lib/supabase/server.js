import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { getSupabasePublicConfig, hasSupabasePublicEnv } from '@/lib/supabase/env'

export function createServerSupabaseClient() {
  if (!hasSupabasePublicEnv()) {
    return null
  }

  const cookieStore = cookies()
  const { url, anonKey } = getSupabasePublicConfig()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch (error) {
          return error
        }
      },
    },
  })
}
