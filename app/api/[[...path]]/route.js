import { NextResponse } from 'next/server'
import { admissionLeadSchema } from '@/lib/admission-schema'
import {
  academyProfile,
  admissionStatuses,
  banners,
  branches,
  courses,
  galleryHighlights,
  testimonials,
} from '@/lib/site-data'
import { hasSupabasePublicEnv, hasSupabaseServiceEnv } from '@/lib/supabase/env'
import { createServiceSupabaseClient } from '@/lib/supabase/service'

function getRoute(params) {
  const path = params?.path || []
  return `/${path.join('/')}`.replace(/\/$/, '') || '/'
}

function json(payload, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

async function handleAdmissionSubmission(request) {
  const body = await request.json()
  const result = admissionLeadSchema.safeParse(body)

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
    preferred_class_timing: result.data.preferred_class_timing,
    prior_music_experience: result.data.prior_music_experience,
    message: result.data.message,
    status: 'new_lead',
    source: 'website',
  }

  const { data, error } = await supabase.from('admission_leads').insert(payload).select('id, status').single()

  if (error) {
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
    return json({
      ok: true,
      app: academyProfile.name,
      publicSupabaseConfigured: hasSupabasePublicEnv(),
      serviceSupabaseConfigured: hasSupabaseServiceEnv(),
    })
  }

  if (route === '/site-content' && request.method === 'GET') {
    return json({
      academyProfile,
      branches,
      courses,
      banners,
      galleryHighlights,
      testimonials,
      admissionStatuses,
    })
  }

  if (route === '/admission' && request.method === 'POST') {
    return handleAdmissionSubmission(request)
  }

  return json({ error: `Route ${route} not found` }, 404)
}

export const GET = handleRoute
export const POST = handleRoute
export const OPTIONS = handleRoute
