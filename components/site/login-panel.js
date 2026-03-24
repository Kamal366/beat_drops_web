'use client'

import { useMemo, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

export default function LoginPanel() {
  const [error, setError] = useState('')
  const [loadingPath, setLoadingPath] = useState('')
  const supabase = useMemo(() => createBrowserSupabaseClient(), [])

  const signInWithGoogle = async (nextPath) => {
    if (!supabase) {
      setError('Supabase public credentials are missing. Please add the Supabase URL and publishable/anon key first.')
      return
    }

    setLoadingPath(nextPath)
    setError('')

    const { error: signInError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`,
      },
    })

    if (signInError) {
      setError(signInError.message)
      setLoadingPath('')
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <RoleCard
        title="Student access"
        description="For admitted learners who want to view their branch, timing, course, and academy contact details."
        actionLabel={loadingPath === '/student/dashboard' ? 'Redirecting...' : 'Continue as student'}
        onClick={() => signInWithGoogle('/student/dashboard')}
        disabled={Boolean(loadingPath)}
      />
      <RoleCard
        title="Admin access"
        description="For the academy admin who manages new leads, student records, gallery media, and banners."
        actionLabel={loadingPath === '/admin/dashboard' ? 'Redirecting...' : 'Continue as admin'}
        onClick={() => signInWithGoogle('/admin/dashboard')}
        disabled={Boolean(loadingPath)}
      />
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:col-span-2">
        <p className="text-sm text-slate-300">Google Sign-In will fully work after Google Auth is enabled inside Supabase and the callback URLs are configured for localhost, preview, and production.</p>
        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
      </div>
    </div>
  )
}

function RoleCard({ title, description, actionLabel, onClick, disabled }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300">{description}</p>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="mt-6 inline-flex rounded-full bg-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {actionLabel}
      </button>
    </div>
  )
}
