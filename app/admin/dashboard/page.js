import Link from 'next/link'
import AdminDashboardClient from '@/components/site/admin-dashboard-client'
import { DashboardShell, InfoCard } from '@/components/site/dashboard-cards'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { academyProfile } from '@/lib/site-data'

function isSchemaMissingError(error) {
  return Boolean(
    error && (error.code === 'PGRST205' || error.code === '42P01' || /Could not find the table/i.test(error.message || '')),
  )
}

async function loadAdminAccess() {
  const supabase = createServerSupabaseClient()

  if (!supabase) {
    return { state: 'missing-public-config' }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { state: 'signed-out' }
  }

  const { data: userRow, error: userRowError } = await supabase
    .from('users')
    .select('id, role, full_name, email')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (isSchemaMissingError(userRowError)) {
    return { state: 'schema-missing' }
  }

  if (userRow?.role !== 'admin') {
    return { state: 'forbidden', userEmail: user.email }
  }

  return {
    state: 'ready',
    userRow,
  }
}

async function App() {
  const access = await loadAdminAccess()

  if (access.state === 'missing-public-config') {
    return (
      <DashboardShell title="Admin Dashboard" subtitle="Supabase public environment variables are required for secure login.">
        <InfoCard title="Missing configuration">
          <p className="text-sm text-stone-300">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.</p>
        </InfoCard>
      </DashboardShell>
    )
  }

  if (access.state === 'signed-out') {
    return (
      <DashboardShell title="Admin Dashboard" subtitle="Admins can review leads, activate students, manage attendance, and control media here.">
        <InfoCard title="Login required">
          <p className="text-sm text-stone-300">Please sign in with the admin Google account first.</p>
          <Link href="/login" className="mt-4 inline-flex rounded-full bg-amber-200 px-4 py-2 text-sm font-semibold text-stone-950">Go to login</Link>
        </InfoCard>
      </DashboardShell>
    )
  }

  if (access.state === 'forbidden') {
    return (
      <DashboardShell title="Admin Dashboard" subtitle="This route is restricted to admin users only.">
        <InfoCard title="Access denied">
          <p className="text-sm text-stone-300">The signed-in account does not yet have the admin role in the users table.</p>
          <p className="mt-2 text-xs text-stone-400">Expected admin email: {academyProfile.adminEmail}</p>
        </InfoCard>
      </DashboardShell>
    )
  }

  if (access.state === 'schema-missing') {
    return (
      <DashboardShell title="Admin Dashboard" subtitle="Supabase authentication is connected, but the required tables are still missing.">
        <InfoCard title="Run the SQL setup first">
          <p className="text-sm text-stone-300">Please run <code>supabase/schema.sql</code> and <code>supabase/seed.sql</code> in Supabase SQL Editor, then log in again with {academyProfile.adminEmail}.</p>
        </InfoCard>
      </DashboardShell>
    )
  }

  return <AdminDashboardClient adminName={access.userRow?.full_name || 'Admin'} />
}

export default App
