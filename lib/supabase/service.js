import { createClient } from '@supabase/supabase-js'
import { getSupabaseUrl, hasSupabaseServiceEnv } from '@/lib/supabase/env'

let serviceClient

export function createServiceSupabaseClient() {
  if (!hasSupabaseServiceEnv()) {
    return null
  }

  if (!serviceClient) {
    serviceClient = createClient(getSupabaseUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  }

  return serviceClient
}
