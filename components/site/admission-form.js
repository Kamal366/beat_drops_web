'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { admissionLeadSchema } from '@/lib/admission-schema'
import { courses } from '@/lib/site-data'

const unsureOption = 'Not sure — recommend for me'

export default function AdmissionForm({ courseOptions = courses }) {
  const selectOptions = [...courseOptions.map((course) => course.title), unsureOption]
  const searchParams = useSearchParams()
  const [submitMessage, setSubmitMessage] = useState(null)
  const selectedCourse = searchParams.get('course') || ''
  const initialCourse = selectOptions.includes(selectedCourse) ? selectedCourse : ''

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(admissionLeadSchema),
    defaultValues: {
      full_name: '',
      age: '',
      phone_number: '',
      interested_course: initialCourse,
      message: '',
    },
  })

  useEffect(() => {
    reset({
      full_name: '',
      age: '',
      phone_number: '',
      interested_course: initialCourse,
      message: '',
    })
  }, [initialCourse, reset])

  const onSubmit = async (values) => {
    setSubmitMessage(null)

    const response = await fetch('/api/admission', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })

    const data = await response.json()

    if (!response.ok) {
      const fieldErrors = data.details?.fieldErrors || {}
      const firstFieldError = Object.values(fieldErrors).flat().find(Boolean)
      throw new Error(firstFieldError || data.error || 'Something went wrong while sending your inquiry.')
    }

    reset()
    setSubmitMessage({
      type: 'success',
      title: 'Enquiry submitted successfully',
      description: data.message || 'Thank you. Our admissions team will contact you soon.',
    })
  }

  return (
    <form
      className="surface-card p-6 md:p-8"
      onSubmit={handleSubmit(async (values) => {
        try {
          await onSubmit(values)
        } catch (error) {
          setSubmitMessage({
            type: 'error',
            title: 'Unable to submit enquiry',
            description: error.message || 'Please try again in a few minutes.',
          })
        }
      })}
      noValidate
    >
      <h3 className="font-display text-3xl font-medium tracking-[-0.03em] text-ink-900">Student Enquiry</h3>
      <p className="mt-3 text-sm leading-7 text-ink-500">Takes less than 30 seconds.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Full name *" error={errors.full_name?.message}>
          <input className="field-input" placeholder="e.g. Riya Sahoo" autoComplete="name" {...register('full_name')} />
        </Field>
        <Field label="Phone *" error={errors.phone_number?.message}>
          <input className="field-input" placeholder="+91 98 765 43210" autoComplete="tel" {...register('phone_number')} />
        </Field>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Course interested in *" error={errors.interested_course?.message}>
          <select className="field-input" {...register('interested_course')}>
            <option value="">Choose a course...</option>
            {selectOptions.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label={
            <>
              Student age <span className="field-hint">(optional)</span>
            </>
          }
          error={errors.age?.message}
        >
          <input className="field-input" placeholder="e.g. 12" type="number" min="4" max="80" {...register('age')} />
        </Field>
      </div>

      <div className="mt-4">
        <Field
          label={
            <>
              Message <span className="field-hint">(optional)</span>
            </>
          }
          error={errors.message?.message}
        >
          <textarea className="field-input min-h-[140px]" placeholder="Anything you'd like us to know - preferred timings, prior experience, etc." {...register('message')} />
        </Field>
      </div>

      {submitMessage ? (
        <div
          className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
            submitMessage.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
              : 'border-red-200 bg-red-50 text-red-900'
          }`}
          role={submitMessage.type === 'success' ? 'status' : 'alert'}
        >
          <p className="font-semibold">{submitMessage.title}</p>
          <p className="mt-1 leading-6">{submitMessage.description}</p>
        </div>
      ) : null}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-xs leading-6 text-ink-500">By submitting, you agree to be contacted by Beat Drops Academy.</span>
        <button type="submit" disabled={isSubmitting} className="btn-brand disabled:cursor-not-allowed disabled:opacity-70">
          {isSubmitting ? 'Submitting enquiry...' : 'Submit Enquiry'}
        </button>
      </div>
    </form>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-xs text-red-700">{error}</span> : null}
    </label>
  )
}
