import Link from 'next/link'
import { DashboardShell, InfoCard, MetricTile } from '@/components/site/dashboard-cards'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createServiceSupabaseClient } from '@/lib/supabase/service'
import { hasSupabaseServiceEnv } from '@/lib/supabase/env'

async function loadAdminDashboard() {
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

  const { data: userRow } = await supabase
    .from('users')
    .select('id, role, full_name, email')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (userRow?.role !== 'admin') {
    return { state: 'forbidden', userEmail: user.email }
  }

  if (!hasSupabaseServiceEnv()) {
    return { state: 'missing-service-key', userRow }
  }

  const service = createServiceSupabaseClient()

  const [leadResponse, studentResponse, branchResponse, courseResponse] = await Promise.all([
    service.from('admission_leads').select('*', { count: 'exact', head: true }),
    service.from('students').select('*', { count: 'exact', head: true }).eq('is_active', true),
    service.from('branches').select('name'),
    service.from('courses').select('title'),
  ])

  const { data: recentLeads } = await service
    .from('admission_leads')
    .select('id, full_name, interested_course, preferred_branch, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    state: 'ready',
    userRow,
    stats: {
      totalLeads: leadResponse.count || 0,
      activeStudents: studentResponse.count || 0,
      branches: branchResponse.data?.length || 0,
      courses: courseResponse.data?.length || 0,
    },
    recentLeads: recentLeads || [],
  }
}

async function App() {
  const dashboard = await loadAdminDashboard()

  if (dashboard.state === 'missing-public-config') {
    return (
      <DashboardShell title="Admin Dashboard" subtitle="Supabase public environment variables are required for secure login.">
        <InfoCard title="Missing configuration">
          <p className="text-sm text-slate-300">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.</p>
        </InfoCard>
      </DashboardShell>
    )
  }

  if (dashboard.state === 'signed-out') {
    return (
      <DashboardShell title="Admin Dashboard" subtitle="Admins can review leads, activate students, and manage gallery media here.">
        <InfoCard title="Login required">
          <p className="text-sm text-slate-300">Please sign in with the admin Google account first.</p>
          <Link href="/login" className="mt-4 inline-flex rounded-full bg-fuchsia-500 px-4 py-2 text-sm font-semibold text-white">Go to login</Link>
        </InfoCard>
      </DashboardShell>
    )
  }

  if (dashboard.state === 'forbidden') {
    return (
      <DashboardShell title="Admin Dashboard" subtitle="This route is restricted to admin users only.">
        <InfoCard title="Access denied">
          <p className="text-sm text-slate-300">The signed-in account does not yet have the admin role in the users table.</p>
          <p className="mt-2 text-xs text-slate-400">Expected admin email: {dashboard.userEmail}</p>
        </InfoCard>
      </DashboardShell>
    )
  }

  if (dashboard.state === 'missing-service-key') {
    return (
      <DashboardShell title="Admin Dashboard" subtitle="Admin role is recognized, but live management actions need the service role key.">
        <InfoCard title="One remaining blocker">
          <p className="text-sm text-slate-300">Add SUPABASE_SERVICE_ROLE_KEY to unlock lead conversion, media uploads, and dashboard summaries.</p>
        </InfoCard>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title={`Welcome back, ${dashboard.userRow?.full_name || 'Admin'}`} subtitle="Live overview of Beat Drops admissions and active students.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Total leads" value={String(dashboard.stats.totalLeads)} />
        <MetricTile label="Active students" value={String(dashboard.stats.activeStudents)} />
        <MetricTile label="Branches" value={String(dashboard.stats.branches)} />
        <MetricTile label="Courses" value={String(dashboard.stats.courses)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <InfoCard title="Recent admission leads">
          <div className="space-y-3">
            {dashboard.recentLeads.length ? (
              dashboard.recentLeads.map((lead) => (
                <div key={lead.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-white">{lead.full_name}</p>
                    <span className="rounded-full border border-cyan-400/30 px-2.5 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">{lead.status}</span>
                  </div>
                  <p className="mt-2">{lead.interested_course} • {lead.preferred_branch}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No admission leads yet.</p>
            )}
          </div>
        </InfoCard>

        <InfoCard title="What is ready next">
          <ul className="space-y-3 text-sm text-slate-300">
            <li>• Lead status updates: new_lead, contacted, trial_scheduled, admitted, inactive</li>
            <li>• Convert lead to active student</li>
            <li>• Manage gallery photos, banners, and testimonials</li>
            <li>• Branch and course filtering for fast review</li>
          </ul>
        </InfoCard>
      </div>
    </DashboardShell>
  )
}

export default App
