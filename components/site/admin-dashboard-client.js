'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ImagePlus, Loader2, Megaphone, Music4, RefreshCcw, Star, UserRoundCheck, Users } from 'lucide-react'
import { DashboardShell, InfoCard, MetricTile } from '@/components/site/dashboard-cards'

const leadStatuses = ['new_lead', 'contacted', 'trial_scheduled', 'admitted', 'inactive']
const attendanceStatuses = ['present', 'absent', 'late']

const emptyStudentForm = {
  id: '',
  lead_id: '',
  full_name: '',
  parent_name: '',
  age: '',
  phone_number: '',
  email: '',
  course_id: '',
  branch_id: '',
  class_timing: '',
  admission_status: 'admitted',
  is_active: true,
  notes: '',
}

const emptyGalleryForm = {
  id: '',
  title: '',
  image_url: '',
  branch_id: '',
  sort_order: 0,
  is_active: true,
}

const emptyBannerForm = {
  id: '',
  title: '',
  subtitle: '',
  image_url: '',
  cta_label: '',
  cta_link: '',
  sort_order: 0,
  is_active: true,
}

const emptyTestimonialForm = {
  id: '',
  name: '',
  role: '',
  quote: '',
  rating: 5,
  is_active: true,
}

const emptyAttendanceForm = {
  id: '',
  student_id: '',
  attendance_date: new Date().toISOString().slice(0, 10),
  status: 'present',
  notes: '',
}

const tabs = [
  { key: 'leads', label: 'Leads', icon: Users },
  { key: 'students', label: 'Students', icon: UserRoundCheck },
  { key: 'attendance', label: 'Attendance', icon: CalendarDays },
  { key: 'gallery', label: 'Gallery', icon: ImagePlus },
  { key: 'banners', label: 'Banners', icon: Megaphone },
  { key: 'testimonials', label: 'Testimonials', icon: Star },
]

export default function AdminDashboardClient({ adminName }) {
  const [activeTab, setActiveTab] = useState('leads')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState({ error: '', success: '' })
  const [leadFilters, setLeadFilters] = useState({ status: 'all', branch: 'all', course: 'all' })
  const [studentForm, setStudentForm] = useState(emptyStudentForm)
  const [galleryForm, setGalleryForm] = useState(emptyGalleryForm)
  const [bannerForm, setBannerForm] = useState(emptyBannerForm)
  const [testimonialForm, setTestimonialForm] = useState(emptyTestimonialForm)
  const [attendanceForm, setAttendanceForm] = useState(emptyAttendanceForm)

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/bootstrap', { cache: 'no-store' })
      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Unable to load dashboard data.')
      }

      setData(payload)
    } catch (error) {
      setFeedback({ error: error.message, success: '' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const filteredLeads = useMemo(() => {
    const allLeads = data?.leads || []
    return allLeads.filter((lead) => {
      const statusPass = leadFilters.status === 'all' || lead.status === leadFilters.status
      const branchPass = leadFilters.branch === 'all' || lead.preferred_branch === leadFilters.branch
      const coursePass = leadFilters.course === 'all' || lead.interested_course === leadFilters.course
      return statusPass && branchPass && coursePass
    })
  }, [data?.leads, leadFilters])

  const submitJson = async (url, method, payload) => {
    setSaving(true)
    setFeedback({ error: '', success: '' })

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Request failed.')
      }

      await loadDashboard()
      setFeedback({ error: '', success: result.message || 'Saved successfully.' })
      return result
    } catch (error) {
      setFeedback({ error: error.message, success: '' })
      throw error
    } finally {
      setSaving(false)
    }
  }

  const handleLeadStatusUpdate = async (leadId, status) => {
    await submitJson(`/api/admin/leads/${leadId}`, 'PATCH', { status })
  }

  const handleLeadDelete = async (leadId) => {
    if (!window.confirm('Delete this lead?')) return
    await submitJson(`/api/admin/leads/${leadId}`, 'DELETE', {})
  }

  const startConvertLead = (lead) => {
    setActiveTab('students')
    setStudentForm({
      ...emptyStudentForm,
      lead_id: lead.id,
      full_name: lead.full_name || '',
      parent_name: lead.parent_name || '',
      age: lead.age || '',
      phone_number: lead.phone_number || '',
      email: lead.email || '',
      class_timing: 'To be assigned',
      admission_status: 'admitted',
      is_active: true,
    })
  }

  const saveStudent = async (event) => {
    event.preventDefault()
    const isEditing = Boolean(studentForm.id)
    await submitJson(isEditing ? `/api/admin/students/${studentForm.id}` : '/api/admin/students', isEditing ? 'PATCH' : 'POST', studentForm)
    setStudentForm(emptyStudentForm)
  }

  const editStudent = (student) => {
    setActiveTab('students')
    setStudentForm({
      id: student.id,
      lead_id: student.lead_id || '',
      full_name: student.full_name || '',
      parent_name: student.parent_name || '',
      age: student.age || '',
      phone_number: student.phone_number || '',
      email: student.email || '',
      course_id: student.course_id || '',
      branch_id: student.branch_id || '',
      class_timing: student.class_timing || '',
      admission_status: student.admission_status || 'admitted',
      is_active: Boolean(student.is_active),
      notes: student.notes || '',
    })
  }

  const removeStudent = async (studentId) => {
    if (!window.confirm('Delete this student record?')) return
    await submitJson(`/api/admin/students/${studentId}`, 'DELETE', {})
  }

  const saveGallery = async (event) => {
    event.preventDefault()
    const isEditing = Boolean(galleryForm.id)
    await submitJson(isEditing ? `/api/admin/gallery/${galleryForm.id}` : '/api/admin/gallery', isEditing ? 'PATCH' : 'POST', galleryForm)
    setGalleryForm(emptyGalleryForm)
  }

  const saveBanner = async (event) => {
    event.preventDefault()
    const isEditing = Boolean(bannerForm.id)
    await submitJson(isEditing ? `/api/admin/banners/${bannerForm.id}` : '/api/admin/banners', isEditing ? 'PATCH' : 'POST', bannerForm)
    setBannerForm(emptyBannerForm)
  }

  const saveTestimonial = async (event) => {
    event.preventDefault()
    const isEditing = Boolean(testimonialForm.id)
    await submitJson(
      isEditing ? `/api/admin/testimonials/${testimonialForm.id}` : '/api/admin/testimonials',
      isEditing ? 'PATCH' : 'POST',
      testimonialForm,
    )
    setTestimonialForm(emptyTestimonialForm)
  }

  const saveAttendance = async (event) => {
    event.preventDefault()
    const isEditing = Boolean(attendanceForm.id)
    await submitJson(
      isEditing ? `/api/admin/attendance/${attendanceForm.id}` : '/api/admin/attendance',
      isEditing ? 'PATCH' : 'POST',
      attendanceForm,
    )
    setAttendanceForm({ ...emptyAttendanceForm, attendance_date: new Date().toISOString().slice(0, 10) })
  }

  const removeEntity = async (entity, id) => {
    if (!window.confirm('Delete this item?')) return
    await submitJson(`/api/admin/${entity}/${id}`, 'DELETE', {})
  }

  if (loading) {
    return (
      <DashboardShell title={`Welcome back, ${adminName || 'Admin'}`} subtitle="Loading live academy operations…">
        <div className="flex min-h-[320px] items-center justify-center rounded-[2rem] border border-white/10 bg-white/5">
          <Loader2 className="h-6 w-6 animate-spin text-amber-200" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell title={`Welcome back, ${adminName || 'Admin'}`} subtitle="Manage leads, students, media, testimonials, and attendance from one premium operations console.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Total leads" value={String(data?.summary?.totalLeads || 0)} />
        <MetricTile label="Active students" value={String(data?.summary?.activeStudents || 0)} />
        <MetricTile label="Gallery items" value={String(data?.galleryImages?.length || 0)} />
        <MetricTile label="Attendance today" value={String(data?.summary?.attendanceToday || 0)} />
      </div>

      <InfoCard title="Quick filters & sections">
        <div className="flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                  active ? 'bg-amber-200 text-stone-950' : 'border border-white/10 bg-white/5 text-stone-200 hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
          <button type="button" onClick={loadDashboard} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-stone-200 hover:bg-white/10">
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
        {feedback.error ? <p className="mt-4 text-sm text-rose-300">{feedback.error}</p> : null}
        {feedback.success ? <p className="mt-4 text-sm text-emerald-300">{feedback.success}</p> : null}
      </InfoCard>

      {activeTab === 'leads' ? (
        <InfoCard title="Admission leads">
          <div className="mb-4 grid gap-3 md:grid-cols-3">
            <SelectField label="Status" value={leadFilters.status} onChange={(value) => setLeadFilters((prev) => ({ ...prev, status: value }))} options={['all', ...leadStatuses]} />
            <SelectField label="Branch" value={leadFilters.branch} onChange={(value) => setLeadFilters((prev) => ({ ...prev, branch: value }))} options={['all', ...(data?.branches || []).map((branch) => branch.name)]} />
            <SelectField label="Course" value={leadFilters.course} onChange={(value) => setLeadFilters((prev) => ({ ...prev, course: value }))} options={['all', ...(data?.courses || []).map((course) => course.title)]} />
          </div>

          <div className="space-y-3">
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-white">{lead.full_name}</p>
                    <p className="text-sm text-stone-300">{lead.interested_course} • {lead.preferred_branch}</p>
                    <p className="mt-1 text-sm text-stone-400">{lead.phone_number} • {lead.email}</p>
                    <p className="mt-2 text-sm text-stone-400">{lead.message || 'No message added.'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <select
                      className="rounded-full border border-white/10 bg-stone-950/60 px-3 py-2 text-sm text-white"
                      value={lead.status}
                      onChange={(event) => handleLeadStatusUpdate(lead.id, event.target.value)}
                    >
                      {leadStatuses.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <button type="button" onClick={() => startConvertLead(lead)} className="rounded-full bg-amber-200 px-4 py-2 text-sm font-semibold text-stone-950">
                      Convert to student
                    </button>
                    <button type="button" onClick={() => handleLeadDelete(lead.id)} className="rounded-full border border-rose-400/30 px-4 py-2 text-sm text-rose-200">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {!filteredLeads.length ? <p className="text-sm text-stone-400">No leads match the current filters.</p> : null}
          </div>
        </InfoCard>
      ) : null}

      {activeTab === 'students' ? (
        <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <InfoCard title={studentForm.id ? 'Edit student' : 'Create / convert student'}>
            <form className="space-y-3" onSubmit={saveStudent}>
              <div className="grid gap-3 md:grid-cols-2">
                <InputField label="Full name" value={studentForm.full_name} onChange={(value) => setStudentForm((prev) => ({ ...prev, full_name: value }))} />
                <InputField label="Parent name" value={studentForm.parent_name} onChange={(value) => setStudentForm((prev) => ({ ...prev, parent_name: value }))} />
                <InputField label="Age" type="number" value={studentForm.age} onChange={(value) => setStudentForm((prev) => ({ ...prev, age: value }))} />
                <InputField label="Phone" value={studentForm.phone_number} onChange={(value) => setStudentForm((prev) => ({ ...prev, phone_number: value }))} />
                <InputField label="Email" type="email" value={studentForm.email} onChange={(value) => setStudentForm((prev) => ({ ...prev, email: value }))} />
                <InputField label="Class timing" value={studentForm.class_timing} onChange={(value) => setStudentForm((prev) => ({ ...prev, class_timing: value }))} />
                <SelectField label="Course" value={studentForm.course_id} onChange={(value) => setStudentForm((prev) => ({ ...prev, course_id: value }))} options={['', ...(data?.courses || []).map((course) => `${course.id}|${course.title}`)]} valueMap />
                <SelectField label="Branch" value={studentForm.branch_id} onChange={(value) => setStudentForm((prev) => ({ ...prev, branch_id: value }))} options={['', ...(data?.branches || []).map((branch) => `${branch.id}|${branch.name}`)]} valueMap />
                <SelectField label="Admission status" value={studentForm.admission_status} onChange={(value) => setStudentForm((prev) => ({ ...prev, admission_status: value }))} options={['admitted', 'hold', 'inactive']} />
                <SelectField label="Active" value={String(studentForm.is_active)} onChange={(value) => setStudentForm((prev) => ({ ...prev, is_active: value === 'true' }))} options={['true', 'false']} />
              </div>
              <TextAreaField label="Notes" value={studentForm.notes} onChange={(value) => setStudentForm((prev) => ({ ...prev, notes: value }))} />
              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={saving} className="rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-stone-950">
                  {saving ? 'Saving…' : studentForm.id ? 'Update student' : 'Create student'}
                </button>
                <button type="button" onClick={() => setStudentForm(emptyStudentForm)} className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone-200">
                  Reset form
                </button>
              </div>
            </form>
          </InfoCard>

          <InfoCard title="Active student records">
            <div className="space-y-3">
              {(data?.students || []).map((student) => (
                <div key={student.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{student.full_name}</p>
                      <p className="text-sm text-stone-300">{student.course_title || 'Course pending'} • {student.branch_name || 'Branch pending'}</p>
                      <p className="mt-1 text-sm text-stone-400">{student.email || 'No email'} • {student.phone_number || 'No phone'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => editStudent(student)} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white">Edit</button>
                      <button type="button" onClick={() => removeStudent(student.id)} className="rounded-full border border-rose-400/30 px-4 py-2 text-sm text-rose-200">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {!data?.students?.length ? <p className="text-sm text-stone-400">No students created yet.</p> : null}
            </div>
          </InfoCard>
        </div>
      ) : null}

      {activeTab === 'attendance' ? (
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <InfoCard title="Mark attendance">
            <form className="space-y-3" onSubmit={saveAttendance}>
              <SelectField label="Student" value={attendanceForm.student_id} onChange={(value) => setAttendanceForm((prev) => ({ ...prev, student_id: value }))} options={['', ...(data?.students || []).map((student) => `${student.id}|${student.full_name}`)]} valueMap />
              <div className="grid gap-3 md:grid-cols-2">
                <InputField label="Attendance date" type="date" value={attendanceForm.attendance_date} onChange={(value) => setAttendanceForm((prev) => ({ ...prev, attendance_date: value }))} />
                <SelectField label="Status" value={attendanceForm.status} onChange={(value) => setAttendanceForm((prev) => ({ ...prev, status: value }))} options={attendanceStatuses} />
              </div>
              <TextAreaField label="Notes" value={attendanceForm.notes} onChange={(value) => setAttendanceForm((prev) => ({ ...prev, notes: value }))} />
              <div className="flex flex-wrap gap-3">
                <button type="submit" disabled={saving} className="rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-stone-950">{attendanceForm.id ? 'Update attendance' : 'Save attendance'}</button>
                <button type="button" onClick={() => setAttendanceForm({ ...emptyAttendanceForm, attendance_date: new Date().toISOString().slice(0, 10) })} className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone-200">Reset</button>
              </div>
            </form>
          </InfoCard>
          <InfoCard title="Recent attendance">
            <div className="space-y-3">
              {(data?.attendance || []).map((item) => (
                <div key={item.id} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{item.student_name || 'Student'}</p>
                      <p className="text-sm text-stone-300">{item.attendance_date} • {item.status}</p>
                      <p className="mt-1 text-sm text-stone-400">{item.notes || 'No note'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setAttendanceForm({ id: item.id, student_id: item.student_id, attendance_date: item.attendance_date, status: item.status, notes: item.notes || '' })} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white">Edit</button>
                      <button type="button" onClick={() => removeEntity('attendance', item.id)} className="rounded-full border border-rose-400/30 px-4 py-2 text-sm text-rose-200">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {!data?.attendance?.length ? <p className="text-sm text-stone-400">No attendance records yet.</p> : null}
            </div>
          </InfoCard>
        </div>
      ) : null}

      {activeTab === 'gallery' ? (
        <CrudSplitSection
          title="Gallery manager"
          form={
            <form className="space-y-3" onSubmit={saveGallery}>
              <InputField label="Title" value={galleryForm.title} onChange={(value) => setGalleryForm((prev) => ({ ...prev, title: value }))} />
              <InputField label="Image URL" value={galleryForm.image_url} onChange={(value) => setGalleryForm((prev) => ({ ...prev, image_url: value }))} />
              <div className="grid gap-3 md:grid-cols-3">
                <SelectField label="Branch" value={galleryForm.branch_id} onChange={(value) => setGalleryForm((prev) => ({ ...prev, branch_id: value }))} options={['', ...(data?.branches || []).map((branch) => `${branch.id}|${branch.name}`)]} valueMap />
                <InputField label="Sort order" type="number" value={galleryForm.sort_order} onChange={(value) => setGalleryForm((prev) => ({ ...prev, sort_order: value }))} />
                <SelectField label="Active" value={String(galleryForm.is_active)} onChange={(value) => setGalleryForm((prev) => ({ ...prev, is_active: value === 'true' }))} options={['true', 'false']} />
              </div>
              <ActionRow saving={saving} primaryLabel={galleryForm.id ? 'Update gallery' : 'Add gallery image'} onReset={() => setGalleryForm(emptyGalleryForm)} />
            </form>
          }
          list={(data?.galleryImages || []).map((item) => (
            <CrudCard key={item.id} title={item.title || 'Gallery item'} subtitle={item.image_url || 'No image URL'} onEdit={() => setGalleryForm({ id: item.id, title: item.title || '', image_url: item.image_url || '', branch_id: item.branch_id || '', sort_order: item.sort_order || 0, is_active: Boolean(item.is_active) })} onDelete={() => removeEntity('gallery', item.id)} />
          ))}
          emptyMessage="No gallery images yet."
        />
      ) : null}

      {activeTab === 'banners' ? (
        <CrudSplitSection
          title="Banner manager"
          form={
            <form className="space-y-3" onSubmit={saveBanner}>
              <InputField label="Title" value={bannerForm.title} onChange={(value) => setBannerForm((prev) => ({ ...prev, title: value }))} />
              <InputField label="Subtitle" value={bannerForm.subtitle} onChange={(value) => setBannerForm((prev) => ({ ...prev, subtitle: value }))} />
              <InputField label="Image URL" value={bannerForm.image_url} onChange={(value) => setBannerForm((prev) => ({ ...prev, image_url: value }))} />
              <div className="grid gap-3 md:grid-cols-3">
                <InputField label="CTA label" value={bannerForm.cta_label} onChange={(value) => setBannerForm((prev) => ({ ...prev, cta_label: value }))} />
                <InputField label="CTA link" value={bannerForm.cta_link} onChange={(value) => setBannerForm((prev) => ({ ...prev, cta_link: value }))} />
                <InputField label="Sort order" type="number" value={bannerForm.sort_order} onChange={(value) => setBannerForm((prev) => ({ ...prev, sort_order: value }))} />
              </div>
              <SelectField label="Active" value={String(bannerForm.is_active)} onChange={(value) => setBannerForm((prev) => ({ ...prev, is_active: value === 'true' }))} options={['true', 'false']} />
              <ActionRow saving={saving} primaryLabel={bannerForm.id ? 'Update banner' : 'Add banner'} onReset={() => setBannerForm(emptyBannerForm)} />
            </form>
          }
          list={(data?.banners || []).map((item) => (
            <CrudCard key={item.id} title={item.title} subtitle={item.subtitle || 'No subtitle'} onEdit={() => setBannerForm({ id: item.id, title: item.title || '', subtitle: item.subtitle || '', image_url: item.image_url || '', cta_label: item.cta_label || '', cta_link: item.cta_link || '', sort_order: item.sort_order || 0, is_active: Boolean(item.is_active) })} onDelete={() => removeEntity('banners', item.id)} />
          ))}
          emptyMessage="No banners yet."
        />
      ) : null}

      {activeTab === 'testimonials' ? (
        <CrudSplitSection
          title="Testimonial manager"
          form={
            <form className="space-y-3" onSubmit={saveTestimonial}>
              <div className="grid gap-3 md:grid-cols-2">
                <InputField label="Name" value={testimonialForm.name} onChange={(value) => setTestimonialForm((prev) => ({ ...prev, name: value }))} />
                <InputField label="Role" value={testimonialForm.role} onChange={(value) => setTestimonialForm((prev) => ({ ...prev, role: value }))} />
              </div>
              <TextAreaField label="Quote" value={testimonialForm.quote} onChange={(value) => setTestimonialForm((prev) => ({ ...prev, quote: value }))} />
              <div className="grid gap-3 md:grid-cols-2">
                <InputField label="Rating" type="number" value={testimonialForm.rating} onChange={(value) => setTestimonialForm((prev) => ({ ...prev, rating: value }))} />
                <SelectField label="Active" value={String(testimonialForm.is_active)} onChange={(value) => setTestimonialForm((prev) => ({ ...prev, is_active: value === 'true' }))} options={['true', 'false']} />
              </div>
              <ActionRow saving={saving} primaryLabel={testimonialForm.id ? 'Update testimonial' : 'Add testimonial'} onReset={() => setTestimonialForm(emptyTestimonialForm)} />
            </form>
          }
          list={(data?.testimonials || []).map((item) => (
            <CrudCard key={item.id} title={item.name} subtitle={item.quote} onEdit={() => setTestimonialForm({ id: item.id, name: item.name || '', role: item.role || '', quote: item.quote || '', rating: item.rating || 5, is_active: Boolean(item.is_active) })} onDelete={() => removeEntity('testimonials', item.id)} />
          ))}
          emptyMessage="No testimonials yet."
        />
      ) : null}
    </DashboardShell>
  )
}

function CrudSplitSection({ title, form, list, emptyMessage }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <InfoCard title={title}>{form}</InfoCard>
      <InfoCard title="Existing items">
        <div className="space-y-3">{list.length ? list : <p className="text-sm text-stone-400">{emptyMessage}</p>}</div>
      </InfoCard>
    </div>
  )
}

function CrudCard({ title, subtitle, onEdit, onDelete }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm text-stone-400">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onEdit} className="rounded-full bg-white/10 px-4 py-2 text-sm text-white">Edit</button>
          <button type="button" onClick={onDelete} className="rounded-full border border-rose-400/30 px-4 py-2 text-sm text-rose-200">Delete</button>
        </div>
      </div>
    </div>
  )
}

function ActionRow({ saving, primaryLabel, onReset }) {
  return (
    <div className="flex flex-wrap gap-3">
      <button type="submit" disabled={saving} className="rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-stone-950">
        {saving ? 'Saving…' : primaryLabel}
      </button>
      <button type="button" onClick={onReset} className="rounded-full border border-white/10 px-5 py-3 text-sm text-stone-200">
        Reset
      </button>
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block text-sm text-stone-300">
      <span className="mb-2 block text-white">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-stone-950/60 px-4 py-3 text-white outline-none focus:border-amber-200" />
    </label>
  )
}

function TextAreaField({ label, value, onChange }) {
  return (
    <label className="block text-sm text-stone-300">
      <span className="mb-2 block text-white">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-stone-950/60 px-4 py-3 text-white outline-none focus:border-amber-200" />
    </label>
  )
}

function SelectField({ label, value, onChange, options, valueMap = false }) {
  return (
    <label className="block text-sm text-stone-300">
      <span className="mb-2 block text-white">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-stone-950/60 px-4 py-3 text-white outline-none focus:border-amber-200">
        {options.map((option) => {
          const [optionValue, optionLabel] = valueMap ? String(option).split('|') : [option, option]
          return (
            <option key={optionValue || optionLabel} value={optionValue}>
              {optionLabel || 'Select'}
            </option>
          )
        })}
      </select>
    </label>
  )
}
