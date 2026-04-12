'use client'

import { useMemo, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

export default function LoginPanel() {
  const [error, setError] = useState('')
  const [loadingPath, setLoadingPath] = useState('')
  const supabase = useMemo(() => createBrowserSupabaseClient(), [])
  const studentLoginDisabled = true

  const signInWithGoogle = async (nextPath) => {
    if (!supabase) {
      setError('Login is temporarily unavailable. Please try again shortly.')
      return
    }

    try {
      setLoadingPath(nextPath)
      setError('')

      const redirectBase = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '')

      if (!redirectBase) {
        throw new Error('Login is temporarily unavailable. Please try again shortly.')
      }

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${redirectBase}/auth/callback?next=${encodeURIComponent(nextPath)}`,
        },
      })

      if (signInError) {
        setError(signInError.message)
        setLoadingPath('')
      }
    } catch (error) {
      setError(error.message || 'Unable to start Google Sign-In right now.')
      setLoadingPath('')
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <RoleCard
        title="Admin access"
        description="For the academy admin who manages new leads, student records, gallery media, and banners."
        actionLabel={loadingPath === '/admin/dashboard' ? 'Redirecting...' : 'Continue as admin'}
        onClick={() => signInWithGoogle('/admin/dashboard')}
        disabled={Boolean(loadingPath)}
      />
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 lg:col-span-2">
        <p className="text-sm text-slate-300">
          {studentLoginDisabled
            ? 'Student login is temporarily disabled. Administrator access is available through secure Google Sign-In.'
            : 'Secure Google Sign-In is available for authorized users.'}
        </p>
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
