import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { admissionLeadSchema } from '@/lib/admission-schema'
import {
  academyProfile,
  admissionStatuses,
  banners as fallbackBanners,
  branches,
  courses,
  galleryHighlights,
  testimonials as fallbackTestimonials,
} from '@/lib/site-data'
import { getLiveSiteContent } from '@/lib/live-site-content'
import { getSupabasePublicConfig, hasSupabasePublicEnv, hasSupabaseServiceEnv } from '@/lib/supabase/env'
import { createServiceSupabaseClient } from '@/lib/supabase/service'

const attendanceStatuses = ['present', 'absent', 'late']

function getRoute(params) {
  const path = params?.path || []
  return `/${path.join('/')}`.replace(/\/$/, '') || '/'
}

function json(payload, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

function isSchemaMissingError(error) {
  return Boolean(
    error && (error.code === 'PGRST205' || error.code === '42P01' || /Could not find the table/i.test(error.message || '')),
  )
}

function cleanPayload(payload) {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined))
}

function toNullableString(value) {
  const stringValue = typeof value === 'string' ? value.trim() : value
  return stringValue === '' ? null : stringValue
}

function toNullableNumber(value) {
  if (value === '' || value === null || value === undefined) return null
  const number = Number(value)
  return Number.isNaN(number) ? null : number
}

function toBoolean(value, fallback = true) {
  if (typeof value === 'boolean') return value
  if (value === 'true') return true
  if (value === 'false') return false
  return fallback
}

async function getSchemaStatus() {
  if (!hasSupabaseServiceEnv()) {
    return {
      schemaReady: false,
      schemaMessage: 'SUPABASE_SERVICE_ROLE_KEY is not configured yet.',
    }
  }

  const supabase = createServiceSupabaseClient()
  const requiredTables = ['branches', 'courses', 'users', 'students', 'admission_leads', 'attendance']
  const results = await Promise.all(requiredTables.map((table) => supabase.from(table).select('id').limit(1)))

  const missingTables = requiredTables.filter((table, index) => isSchemaMissingError(results[index]?.error))

  if (!missingTables.length) {
    return {
      schemaReady: true,
      schemaMessage: 'Required Supabase tables detected successfully.',
    }
  }

  const unknownError = results.find((result) => result.error && !isSchemaMissingError(result.error))?.error

  if (unknownError) {
    return {
      schemaReady: false,
      schemaMessage: unknownError.message || 'Unable to verify Supabase schema status.',
    }
  }

  return {
    schemaReady: false,
    schemaMessage: `Missing Supabase tables: ${missingTables.join(', ')}. Run supabase/schema.sql and supabase/seed.sql in the Supabase SQL Editor.`,
  }
}

function createRequestSupabaseClient(request) {
  if (!hasSupabasePublicEnv()) {
    return null
  }

  const { url, anonKey } = getSupabasePublicConfig()

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll() {},
    },
  })
}

async function getAuthContext(request) {
  const requestSupabase = createRequestSupabaseClient(request)

  if (!requestSupabase) {
    return { user: null, userRow: null, error: 'Supabase auth is not configured.' }
  }

  const {
    data: { user },
    error,
  } = await requestSupabase.auth.getUser()

  if (error || !user) {
    return { user: null, userRow: null, error: error?.message || 'Unauthorized' }
  }

  const service = createServiceSupabaseClient()
  const { data: userRow } = await service
    .from('users')
    .select('id, full_name, email, role, auth_user_id')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  return { user, userRow, error: null }
}

async function requireAdmin(request) {
  const context = await getAuthContext(request)

  if (!context.user || context.userRow?.role !== 'admin') {
    return { ok: false, response: json({ error: 'Admin access required.' }, 403) }
  }

  return { ok: true, context }
}

async function resolveUserIdByEmail(service, email) {
  if (!email) return null
  const { data } = await service.from('users').select('id').eq('email', email).maybeSingle()
  return data?.id || null
}

async function handleAdmissionSubmission(request) {
  const body = await request.json()
  const result = admissionLeadSchema.safeParse({
    ...body,
    preferred_class_timing: body.preferred_class_timing || 'To be discussed after inquiry',
  })

  if (!result.success) {
    return json(
      {
        error: 'Please review the form fields and try again.',
        details: result.error.flatten(),
      },
      400,
    )
  }

  if (!hasSupabaseServiceEnv()) {
    return json(
      {
        error:
          'Admission form is ready, but live saving is blocked until SUPABASE_SERVICE_ROLE_KEY is added to the environment.',
      },
      503,
    )
  }

  const supabase = createServiceSupabaseClient()
  const payload = {
    full_name: result.data.full_name,
    parent_name: result.data.parent_name,
    age: result.data.age,
    phone_number: result.data.phone_number,
    email: result.data.email,
    interested_course: result.data.interested_course,
    preferred_branch: result.data.preferred_branch,
    preferred_class_timing: result.data.preferred_class_timing || 'To be discussed after inquiry',
    prior_music_experience: result.data.prior_music_experience,
    message: result.data.message,
    status: 'new_lead',
    source: 'website',
  }

  const { data, error } = await supabase.from('admission_leads').insert(payload).select('id, status').single()

  if (error) {
    if (isSchemaMissingError(error)) {
      return json(
        {
          error:
            'Supabase tables are not created yet. Please run supabase/schema.sql and supabase/seed.sql in the Supabase SQL Editor, then retry the admission form.',
        },
        503,
      )
    }

    return json(
      {
        error: error.message || 'Unable to save your admission inquiry right now.',
      },
      500,
    )
  }

  return json({
    message: 'Your inquiry has been submitted successfully. Beat Drops will contact you soon.',
    lead: data,
  })
}

async function handleAdminBootstrap() {
  const service = createServiceSupabaseClient()

  const [leadResponse, studentResponse, galleryResponse, bannerResponse, testimonialResponse, attendanceResponse] = await Promise.all([
    service.from('admission_leads').select('*').order('created_at', { ascending: false }),
    service.from('students').select('*, branches(name), courses(title)').order('created_at', { ascending: false }),
    service.from('gallery_images').select('*').order('sort_order', { ascending: true }),
    service.from('banners').select('*').order('sort_order', { ascending: true }),
    service.from('testimonials').select('*').order('created_at', { ascending: false }),
    service.from('attendance').select('*, students(full_name)').order('attendance_date', { ascending: false }).limit(100),
  ])

  const students = (studentResponse.data || []).map((student) => ({
    ...student,
    branch_name: student.branches?.name || '',
    course_title: student.courses?.title || '',
  }))

  const attendance = (attendanceResponse.data || []).map((item) => ({
    ...item,
    student_name: item.students?.full_name || '',
  }))

  const attendanceToday = attendance.filter((item) => item.attendance_date === new Date().toISOString().slice(0, 10)).length

  return {
    summary: {
      totalLeads: leadResponse.data?.length || 0,
      activeStudents: students.filter((student) => student.is_active).length,
      attendanceToday,
      byBranch: (branches || []).map((branch) => ({
        name: branch.name,
        count: students.filter((student) => student.branch_name === branch.name).length,
      })),
      byCourse: (courses || []).map((course) => ({
        title: course.title,
        count: students.filter((student) => student.course_title === course.title).length,
      })),
    },
    branches,
    courses,
    leads: leadResponse.data || [],
    students,
    galleryImages: galleryResponse.data || [],
    banners: bannerResponse.data || [],
    testimonials: testimonialResponse.data || [],
    attendance,
    attendanceStatuses,
    leadStatuses: admissionStatuses,
  }
}

async function createOrUpdateStudent(service, payload, studentId = null) {
  const userId = await resolveUserIdByEmail(service, toNullableString(payload.email))
  const studentPayload = cleanPayload({
    lead_id: toNullableString(payload.lead_id),
    user_id: userId,
    full_name: toNullableString(payload.full_name),
    parent_name: toNullableString(payload.parent_name),
    age: toNullableNumber(payload.age),
    phone_number: toNullableString(payload.phone_number),
    email: toNullableString(payload.email),
    course_id: toNullableString(payload.course_id),
    branch_id: toNullableString(payload.branch_id),
    class_timing: toNullableString(payload.class_timing),
    admission_status: toNullableString(payload.admission_status) || 'admitted',
    is_active: toBoolean(payload.is_active, true),
    notes: toNullableString(payload.notes),
  })

  const query = studentId
    ? service.from('students').update(studentPayload).eq('id', studentId)
    : service.from('students').insert(studentPayload)

  const { data, error } = await query.select('id, full_name').single()

  if (error) {
    throw new Error(error.message)
  }

  if (studentPayload.lead_id) {
    await service.from('admission_leads').update({ status: 'admitted' }).eq('id', studentPayload.lead_id)
  }

  return data
}

async function handleAdminEntity(request, route) {
  const adminCheck = await requireAdmin(request)

  if (!adminCheck.ok) {
    return adminCheck.response
  }

  const service = createServiceSupabaseClient()
  const body = request.method === 'GET' || request.method === 'DELETE' ? {} : await request.json()
  const segments = route.split('/').filter(Boolean)
  const entity = segments[1]
  const entityId = segments[2]

  try {
    if (entity === 'bootstrap' && request.method === 'GET') {
      return json(await handleAdminBootstrap())
    }

    if (entity === 'leads') {
      if (request.method === 'PATCH' && entityId) {
        const { data, error } = await service
          .from('admission_leads')
          .update(cleanPayload({
            status: toNullableString(body.status),
            message: toNullableString(body.message),
            prior_music_experience: toNullableString(body.prior_music_experience),
          }))
          .eq('id', entityId)
          .select('id, status')
          .single()

        if (error) throw new Error(error.message)
        return json({ message: 'Lead updated successfully.', lead: data })
      }

      if (request.method === 'DELETE' && entityId) {
        const { error } = await service.from('admission_leads').delete().eq('id', entityId)
        if (error) throw new Error(error.message)
        return json({ message: 'Lead deleted successfully.' })
      }
    }

    if (entity === 'students') {
      if (request.method === 'POST') {
        const student = await createOrUpdateStudent(service, body)
        return json({ message: 'Student created successfully.', student })
      }

      if (request.method === 'PATCH' && entityId) {
        const student = await createOrUpdateStudent(service, body, entityId)
        return json({ message: 'Student updated successfully.', student })
      }

      if (request.method === 'DELETE' && entityId) {
        const { error } = await service.from('students').delete().eq('id', entityId)
        if (error) throw new Error(error.message)
        return json({ message: 'Student deleted successfully.' })
      }
    }

    if (entity === 'gallery') {
      const payload = cleanPayload({
        title: toNullableString(body.title),
        image_url: toNullableString(body.image_url),
        image_path: toNullableString(body.image_path) || toNullableString(body.image_url) || 'external',
        branch_id: toNullableString(body.branch_id),
        sort_order: toNullableNumber(body.sort_order) || 0,
        is_active: toBoolean(body.is_active, true),
        created_by: adminCheck.context.userRow?.id || null,
      })

      if (request.method === 'POST') {
        const { data, error } = await service.from('gallery_images').insert(payload).select('id, title').single()
        if (error) throw new Error(error.message)
        return json({ message: 'Gallery image saved successfully.', item: data })
      }

      if (request.method === 'PATCH' && entityId) {
        const { data, error } = await service.from('gallery_images').update(payload).eq('id', entityId).select('id, title').single()
        if (error) throw new Error(error.message)
        return json({ message: 'Gallery image updated successfully.', item: data })
      }

      if (request.method === 'DELETE' && entityId) {
        const { error } = await service.from('gallery_images').delete().eq('id', entityId)
        if (error) throw new Error(error.message)
        return json({ message: 'Gallery image deleted successfully.' })
      }
    }

    if (entity === 'banners') {
      const payload = cleanPayload({
        title: toNullableString(body.title),
        subtitle: toNullableString(body.subtitle),
        image_url: toNullableString(body.image_url),
        image_path: toNullableString(body.image_path) || toNullableString(body.image_url),
        cta_label: toNullableString(body.cta_label),
        cta_link: toNullableString(body.cta_link),
        sort_order: toNullableNumber(body.sort_order) || 0,
        is_active: toBoolean(body.is_active, true),
      })

      if (request.method === 'POST') {
        const { data, error } = await service.from('banners').insert(payload).select('id, title').single()
        if (error) throw new Error(error.message)
        return json({ message: 'Banner created successfully.', item: data })
      }

      if (request.method === 'PATCH' && entityId) {
        const { data, error } = await service.from('banners').update(payload).eq('id', entityId).select('id, title').single()
        if (error) throw new Error(error.message)
        return json({ message: 'Banner updated successfully.', item: data })
      }

      if (request.method === 'DELETE' && entityId) {
        const { error } = await service.from('banners').delete().eq('id', entityId)
        if (error) throw new Error(error.message)
        return json({ message: 'Banner deleted successfully.' })
      }
    }

    if (entity === 'testimonials') {
      const payload = cleanPayload({
        name: toNullableString(body.name),
        role: toNullableString(body.role),
        quote: toNullableString(body.quote),
        rating: toNullableNumber(body.rating) || 5,
        is_active: toBoolean(body.is_active, true),
      })

      if (request.method === 'POST') {
        const { data, error } = await service.from('testimonials').insert(payload).select('id, name').single()
        if (error) throw new Error(error.message)
        return json({ message: 'Testimonial created successfully.', item: data })
      }

      if (request.method === 'PATCH' && entityId) {
        const { data, error } = await service.from('testimonials').update(payload).eq('id', entityId).select('id, name').single()
        if (error) throw new Error(error.message)
        return json({ message: 'Testimonial updated successfully.', item: data })
      }

      if (request.method === 'DELETE' && entityId) {
        const { error } = await service.from('testimonials').delete().eq('id', entityId)
        if (error) throw new Error(error.message)
        return json({ message: 'Testimonial deleted successfully.' })
      }
    }

    if (entity === 'attendance') {
      const payload = cleanPayload({
        student_id: toNullableString(body.student_id),
        attendance_date: toNullableString(body.attendance_date),
        status: toNullableString(body.status) || 'present',
        notes: toNullableString(body.notes),
        marked_by: adminCheck.context.userRow?.id || null,
      })

      if (request.method === 'POST') {
        const { data, error } = await service
          .from('attendance')
          .upsert(payload, { onConflict: 'student_id,attendance_date' })
          .select('id, student_id, attendance_date, status')
          .single()
        if (error) throw new Error(error.message)
        return json({ message: 'Attendance saved successfully.', item: data })
      }

      if (request.method === 'PATCH' && entityId) {
        const { data, error } = await service.from('attendance').update(payload).eq('id', entityId).select('id, student_id, attendance_date, status').single()
        if (error) throw new Error(error.message)
        return json({ message: 'Attendance updated successfully.', item: data })
      }

      if (request.method === 'DELETE' && entityId) {
        const { error } = await service.from('attendance').delete().eq('id', entityId)
        if (error) throw new Error(error.message)
        return json({ message: 'Attendance deleted successfully.' })
      }
    }
  } catch (error) {
    return json({ error: error.message || 'Admin action failed.' }, 500)
  }

  return json({ error: `Unsupported admin route ${route}` }, 404)
}

async function handleStudentDashboard(request) {
  const context = await getAuthContext(request)

  if (!context.user) {
    return json({ error: 'Unauthorized' }, 401)
  }

  const service = createServiceSupabaseClient()
  const email = context.user.email || context.userRow?.email
  const { data: student } = await service
    .from('students')
    .select('*, branches(name, address, phone), courses(title, mode)')
    .or(`user_id.eq.${context.userRow?.id || '00000000-0000-0000-0000-000000000000'},email.eq.${email}`)
    .maybeSingle()

  const { data: attendance } = student?.id
    ? await service.from('attendance').select('id, attendance_date, status, notes').eq('student_id', student.id).order('attendance_date', { ascending: false }).limit(40)
    : { data: [] }

  return json({
    profile: context.userRow,
    student: student || null,
    attendance: attendance || [],
  })
}

async function handleRoute(request, { params }) {
  const route = getRoute(params)

  if (request.method === 'OPTIONS') {
    return json({ ok: true })
  }

  if ((route === '/' || route === '/root') && request.method === 'GET') {
    return json({
      app: academyProfile.name,
      city: academyProfile.city,
      message: 'Beat Drops Music Class API is live.',
    })
  }

  if (route === '/health' && request.method === 'GET') {
    const schemaStatus = await getSchemaStatus()

    return json({
      ok: true,
      app: academyProfile.name,
      publicSupabaseConfigured: hasSupabasePublicEnv(),
      serviceSupabaseConfigured: hasSupabaseServiceEnv(),
      ...schemaStatus,
    })
  }

  if (route === '/site-content' && request.method === 'GET') {
    const liveContent = await getLiveSiteContent()

    return json({
      academyProfile,
      branches,
      courses,
      banners: liveContent.banners || fallbackBanners,
      galleryHighlights: liveContent.galleryItems || galleryHighlights,
      testimonials: liveContent.testimonials || fallbackTestimonials,
      admissionStatuses,
      attendanceStatuses,
    })
  }

  if (route === '/admission' && request.method === 'POST') {
    return handleAdmissionSubmission(request)
  }

  if (route.startsWith('/admin/')) {
    return handleAdminEntity(request, route)
  }

  if (route === '/student/dashboard' && request.method === 'GET') {
    return handleStudentDashboard(request)
  }

  return json({ error: `Route ${route} not found` }, 404)
}

export const GET = handleRoute
export const POST = handleRoute
export const PATCH = handleRoute
export const DELETE = handleRoute
export const OPTIONS = handleRoute
