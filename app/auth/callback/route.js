import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request) {
  const requestUrl = new URL(request.url)
  const nextPath = requestUrl.searchParams.get('next') || '/student/dashboard'
  const supabase = createServerSupabaseClient()
  const redirectBase = (process.env.NEXT_PUBLIC_BASE_URL || requestUrl.origin).replace(/\/$/, '')

  if (!supabase) {
    return NextResponse.redirect(new URL(`/login?reason=missing-config`, redirectBase))
  }

  const code = requestUrl.searchParams.get('code')

  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(nextPath, redirectBase))
}
