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
      <DashboardShell title="Admin Dashboard" subtitle="Secure access is temporarily unavailable.">
        <InfoCard title="Please try again shortly">
          <p className="text-sm text-stone-300">Admin sign-in is not available at the moment.</p>
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
          <p className="text-sm text-stone-300">The signed-in account does not have permission to access the admin dashboard.</p>
          <p className="mt-2 text-xs text-stone-400">Authorized account: {academyProfile.adminEmail}</p>
        </InfoCard>
      </DashboardShell>
    )
  }

  if (access.state === 'schema-missing') {
    return (
      <DashboardShell title="Admin Dashboard" subtitle="Administrative records are temporarily unavailable.">
        <InfoCard title="Please try again shortly">
          <p className="text-sm text-stone-300">Dashboard data is not available at the moment. Please retry with {academyProfile.adminEmail} later.</p>
        </InfoCard>
      </DashboardShell>
    )
  }

  return <AdminDashboardClient adminName={access.userRow?.full_name || 'Admin'} />
}

export default App
