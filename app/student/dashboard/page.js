import Link from 'next/link'
import { DashboardShell, InfoCard, MetricTile } from '@/components/site/dashboard-cards'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { academyProfile } from '@/lib/site-data'

function isSchemaMissingError(error) {
  return Boolean(
    error && (error.code === 'PGRST205' || error.code === '42P01' || /Could not find the table/i.test(error.message || '')),
  )
}

async function loadStudentDashboard() {
  const supabase = createServerSupabaseClient()

  if (!supabase) {
    return { state: 'missing-config' }
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { state: 'signed-out' }
  }

  const { data: userRow, error: userRowError } = await supabase
    .from('users')
    .select('id, full_name, role, email, phone, is_active')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (isSchemaMissingError(userRowError)) {
    return { state: 'schema-missing' }
  }

  const { data: studentRow, error: studentRowError } = await supabase
    .from('students')
    .select('id, course_id, branch_id, class_timing, admission_status, is_active')
    .eq('email', user.email)
    .maybeSingle()

  if (isSchemaMissingError(studentRowError)) {
    return { state: 'schema-missing' }
  }

  let branch = null
  let course = null

  if (studentRow?.branch_id) {
    const { data } = await supabase.from('branches').select('name, address, phone').eq('id', studentRow.branch_id).maybeSingle()
    branch = data || null
  }

  if (studentRow?.course_id) {
    const { data } = await supabase.from('courses').select('title, mode').eq('id', studentRow.course_id).maybeSingle()
    course = data || null
  }

  return {
    state: 'ready',
    user,
    userRow,
    studentRow,
    branch,
    course,
  }
}

async function App() {
  const dashboard = await loadStudentDashboard()

  if (dashboard.state === 'missing-config') {
    return (
      <DashboardShell title="Student Dashboard" subtitle="Private access becomes fully live after the remaining Supabase credentials are added.">
        <InfoCard title="Missing secure setup">
          <p className="text-sm text-slate-300">Add SUPABASE_SERVICE_ROLE_KEY and enable Google Sign-In inside Supabase to activate private student records.</p>
        </InfoCard>
      </DashboardShell>
    )
  }

  if (dashboard.state === 'signed-out') {
    return (
      <DashboardShell title="Student Dashboard" subtitle="Students can access this page after Google login and admission approval.">
        <InfoCard title="Login required">
          <p className="text-sm text-slate-300">Please continue with Google Sign-In first.</p>
          <Link href="/login" className="mt-4 inline-flex rounded-full bg-fuchsia-500 px-4 py-2 text-sm font-semibold text-white">Go to login</Link>
        </InfoCard>
      </DashboardShell>
    )
  }

  if (dashboard.state === 'schema-missing') {
    return (
      <DashboardShell title="Student Dashboard" subtitle="Google login is configured, but the student tables are not created in Supabase yet.">
        <InfoCard title="Finish database setup">
          <p className="text-sm text-slate-300">Run <code>supabase/schema.sql</code> and <code>supabase/seed.sql</code> inside the Supabase SQL Editor, then log in again.</p>
        </InfoCard>
      </DashboardShell>
    )
  }

  const studentName = dashboard.userRow?.full_name || dashboard.user?.user_metadata?.full_name || dashboard.user?.email || 'Student'
  const admissionStatus = dashboard.studentRow?.admission_status || 'pending_profile_setup'
  const branchName = dashboard.branch?.name || 'Will be assigned after admission review'
  const courseName = dashboard.course?.title || 'To be assigned by academy'

  return (
    <DashboardShell title={`Welcome, ${studentName}`} subtitle="Your current admission and class details from Beat Drops Music Class.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Admission status" value={admissionStatus.replaceAll('_', ' ')} />
        <MetricTile label="Enrolled course" value={courseName} />
        <MetricTile label="Assigned branch" value={branchName} />
        <MetricTile label="Class timing" value={dashboard.studentRow?.class_timing || 'To be confirmed'} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <InfoCard title="Profile details">
          <dl className="space-y-3 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <dt>Email</dt>
              <dd className="text-right text-white">{dashboard.user?.email || dashboard.userRow?.email || 'Not available'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <dt>Role</dt>
              <dd className="text-right text-white">{dashboard.userRow?.role || 'student'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Phone</dt>
              <dd className="text-right text-white">{dashboard.userRow?.phone || 'Will be updated by academy'}</dd>
            </div>
          </dl>
        </InfoCard>

        <InfoCard title="Academy contact">
          <div className="space-y-3 text-sm text-slate-300">
            <p>Need to reschedule or ask about your batch? Use the details below.</p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">{academyProfile.name}</p>
              <p>{academyProfile.phone}</p>
              <p>{academyProfile.email}</p>
              <a className="mt-3 inline-flex rounded-full border border-cyan-400/50 px-4 py-2 text-cyan-300" href={academyProfile.whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
            </div>
          </div>
        </InfoCard>
      </div>
    </DashboardShell>
  )
}

export default App
