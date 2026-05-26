'use client'

import { useMemo, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

export default function LoginPanel() {
  const [error, setError] = useState('')
  const [loadingPath, setLoadingPath] = useState('')
  const [showAdminCode, setShowAdminCode] = useState(false)
  const [adminCode, setAdminCode] = useState('')
  const [adminCodeError, setAdminCodeError] = useState('')
  const [verifyingCode, setVerifyingCode] = useState(false)
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
        title="Admin only"
        description="Only authorised academy staff can use the dashboard to review enquiries, manage students, and update media."
        actionLabel={loadingPath === '/admin/dashboard' ? 'Redirecting...' : 'Continue with Google'}
        onClick={() => {
          setError('')
          setAdminCodeError('')
          setAdminCode('')
          setShowAdminCode(true)
        }}
        disabled={Boolean(loadingPath || verifyingCode)}
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

      {showAdminCode ? (
        <AdminCodeModal
          code={adminCode}
          loading={verifyingCode}
          error={adminCodeError}
          onChange={setAdminCode}
          onClose={() => {
            if (verifyingCode) return
            setShowAdminCode(false)
            setAdminCode('')
            setAdminCodeError('')
          }}
          onSubmit={async () => {
            setVerifyingCode(true)
            setError('')
            setAdminCodeError('')

            try {
              const response = await fetch('/api/admin/access-code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: adminCode }),
              })
              const result = await response.json()

              if (!response.ok) {
                throw new Error(result.error || 'Invalid admin access code.')
              }

              setShowAdminCode(false)
              setAdminCode('')
              setAdminCodeError('')
              await signInWithGoogle('/admin/dashboard')
            } catch (error) {
              setAdminCodeError(error.message || 'Unable to verify admin access code.')
            } finally {
              setVerifyingCode(false)
            }
          }}
        />
      ) : null}
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

function AdminCodeModal({ code, loading, error, onChange, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-ink-900/70 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Admin access code">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Close admin access code dialog" onClick={onClose} />
      <form
        className="surface-card relative w-full max-w-md p-6 md:p-7"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <span className="eyebrow">Admin Verification</span>
        <h2 className="mt-4 font-display text-3xl font-medium tracking-[-0.03em] text-ink-900">Enter access code</h2>
        <p className="mt-3 text-sm leading-7 text-ink-500">This code is required before Google admin sign-in.</p>

        <label className="mt-5 block">
          <span className="field-label">Access code</span>
          <input
            type="password"
            value={code}
            onChange={(event) => onChange(event.target.value.replace(/\D/g, ''))}
            className="field-input"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            placeholder="Enter admin code"
          />
        </label>
        {error ? <p className="mt-3 rounded-2xl bg-maroon-100 px-4 py-3 text-sm text-maroon-800">{error}</p> : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button type="submit" disabled={loading || !code.trim()} className="btn-brand disabled:cursor-not-allowed disabled:opacity-70">
            {loading ? 'Verifying...' : 'Continue'}
          </button>
          <button type="button" onClick={onClose} disabled={loading} className="btn-ghost disabled:cursor-not-allowed disabled:opacity-70">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
