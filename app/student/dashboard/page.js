import Link from 'next/link'
import { DashboardShell, InfoCard, MetricTile } from '@/components/site/dashboard-cards'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { createServiceSupabaseClient } from '@/lib/supabase/service'
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

  const service = createServiceSupabaseClient()
  const email = user.email || userRow?.email
  const { data: studentRow, error: studentRowError } = await service
    .from('students')
    .select('*, branches(name, address, phone), courses(title, mode)')
    .or(`user_id.eq.${userRow?.id || '00000000-0000-0000-0000-000000000000'},email.eq.${email}`)
    .maybeSingle()

  if (isSchemaMissingError(studentRowError)) {
    return { state: 'schema-missing' }
  }

  const { data: attendanceRows } = studentRow?.id
    ? await service.from('attendance').select('id, attendance_date, status, notes').eq('student_id', studentRow.id).order('attendance_date', { ascending: false }).limit(30)
    : { data: [] }

  return {
    state: 'ready',
    user,
    userRow,
    studentRow,
    branch: studentRow?.branches || null,
    course: studentRow?.courses || null,
    attendanceRows: attendanceRows || [],
  }
}

async function App() {
  const dashboard = await loadStudentDashboard()

  if (dashboard.state === 'missing-config') {
    return (
      <DashboardShell title="Student Dashboard" subtitle="Private access becomes fully live after the remaining Supabase credentials are added.">
        <InfoCard title="Missing secure setup">
          <p className="text-sm text-stone-300">Add SUPABASE_SERVICE_ROLE_KEY and enable Google Sign-In inside Supabase to activate private student records.</p>
        </InfoCard>
      </DashboardShell>
    )
  }

  if (dashboard.state === 'signed-out') {
    return (
      <DashboardShell title="Student Dashboard" subtitle="Students can access this page after Google login and admission approval.">
        <InfoCard title="Login required">
          <p className="text-sm text-stone-300">Please continue with Google Sign-In first.</p>
          <Link href="/login" className="mt-4 inline-flex rounded-full bg-amber-200 px-4 py-2 text-sm font-semibold text-stone-950">Go to login</Link>
        </InfoCard>
      </DashboardShell>
    )
  }

  if (dashboard.state === 'schema-missing') {
    return (
      <DashboardShell title="Student Dashboard" subtitle="Google login is configured, but the student tables are not created in Supabase yet.">
        <InfoCard title="Finish database setup">
          <p className="text-sm text-stone-300">Run <code>supabase/schema.sql</code> and <code>supabase/seed.sql</code> inside the Supabase SQL Editor, then log in again.</p>
        </InfoCard>
      </DashboardShell>
    )
  }

  const studentName = dashboard.userRow?.full_name || dashboard.user?.user_metadata?.full_name || dashboard.user?.email || 'Student'
  const admissionStatus = dashboard.studentRow?.admission_status || 'pending_profile_setup'
  const branchName = dashboard.branch?.name || 'Will be assigned after admission review'
  const courseName = dashboard.course?.title || 'To be assigned by academy'
  const attendance = dashboard.attendanceRows || []
  const presentCount = attendance.filter((item) => item.status === 'present').length

  return (
    <DashboardShell title={`Welcome, ${studentName}`} subtitle="Your current course, branch, and attendance from Beat Drops Music Class.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Admission status" value={admissionStatus.replaceAll('_', ' ')} />
        <MetricTile label="Enrolled course" value={courseName} />
        <MetricTile label="Assigned branch" value={branchName} />
        <MetricTile label="Present classes" value={String(presentCount)} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <InfoCard title="Profile details">
          <dl className="space-y-3 text-sm text-stone-300">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <dt>Email</dt>
              <dd className="text-right text-white">{dashboard.user?.email || dashboard.userRow?.email || 'Not available'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <dt>Role</dt>
              <dd className="text-right text-white">{dashboard.userRow?.role || 'student'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <dt>Phone</dt>
              <dd className="text-right text-white">{dashboard.userRow?.phone || dashboard.studentRow?.phone_number || 'Will be updated by academy'}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt>Class timing</dt>
              <dd className="text-right text-white">{dashboard.studentRow?.class_timing || 'To be confirmed'}</dd>
            </div>
          </dl>
        </InfoCard>

        <InfoCard title="Academy contact">
          <div className="space-y-3 text-sm text-stone-300">
            <p>Need to reschedule or ask about your batch? Use the details below.</p>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="font-semibold text-white">{academyProfile.name}</p>
              <p>{academyProfile.phone}</p>
              <p>{academyProfile.email}</p>
              <a className="mt-3 inline-flex rounded-full border border-amber-200/50 px-4 py-2 text-amber-100" href={academyProfile.whatsapp} target="_blank" rel="noreferrer">Chat on WhatsApp</a>
            </div>
          </div>
        </InfoCard>
      </div>

      <InfoCard title="Attendance record">
        <div className="space-y-3">
          {attendance.length ? (
            attendance.map((item) => (
              <div key={item.id} className="flex flex-wrap items-start justify-between gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-stone-300">
                <div>
                  <p className="font-semibold text-white">{item.attendance_date}</p>
                  <p className="mt-1 capitalize">{item.status}</p>
                </div>
                <p className="max-w-xl text-stone-400">{item.notes || 'No note added.'}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-stone-400">Attendance will appear here once the admin starts marking classes.</p>
          )}
        </div>
      </InfoCard>
    </DashboardShell>
  )
}

export default App
