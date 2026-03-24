'use client'

import { createBrowserClient } from '@supabase/ssr'
import { getSupabasePublicConfig, hasSupabasePublicEnv } from '@/lib/supabase/env'

let browserClient

export function createBrowserSupabaseClient() {
  if (!hasSupabasePublicEnv()) {
    return null
  }

  if (!browserClient) {
    const { url, anonKey } = getSupabasePublicConfig()
    browserClient = createBrowserClient(url, anonKey)
  }

  return browserClient
}
