'use client'

import { useMemo, useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/browser'

export default function LogoutButton() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = useMemo(() => createBrowserSupabaseClient(), [])

  const handleLogout = async () => {
    if (!supabase || isSubmitting) return

    try {
      setIsSubmitting(true)
      await supabase.auth.signOut()
      window.location.href = '/login'
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSubmitting}
      className="btn-brand disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isSubmitting ? 'Logging out...' : 'Logout'}
    </button>
  )
}
