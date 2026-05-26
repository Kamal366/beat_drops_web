'use client'

import { useMemo, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
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
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <RoleCard
        title="Admin access"
        description="Only authorised academy staff can use the dashboard to review enquiries, manage students, and update media."
        actionLabel={loadingPath === '/admin/dashboard' ? 'Redirecting...' : 'Continue with Google'}
        onClick={() => signInWithGoogle('/admin/dashboard')}
        disabled={Boolean(loadingPath)}
      />

      <div className="surface-card p-6 md:p-8">
        <div className="inline-flex rounded-full bg-gold-100 p-3 text-maroon-700">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <h2 className="mt-5 font-display text-3xl font-medium text-ink-900">Private area notes</h2>
        <p className="mt-3 text-sm leading-7 text-ink-500">
          {studentLoginDisabled
            ? 'Student login is temporarily disabled. Administrator access remains available through secure Google sign-in.'
            : 'Secure Google Sign-In is available for authorized users.'}
        </p>
        {error ? <p className="mt-4 rounded-2xl bg-maroon-100 px-4 py-3 text-sm text-maroon-800">{error}</p> : null}
      </div>
    </div>
  )
}

function RoleCard({ title, description, actionLabel, onClick, disabled }) {
  return (
    <div className="surface-card p-6 md:p-8">
      <span className="eyebrow">Admin Sign-In</span>
      <h2 className="mt-4 font-display text-4xl font-medium tracking-[-0.03em] text-ink-900">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-ink-500">{description}</p>
      <button type="button" onClick={onClick} disabled={disabled} className="btn-brand mt-6 disabled:cursor-not-allowed disabled:opacity-70">
        {actionLabel}
      </button>
    </div>
  )
}
