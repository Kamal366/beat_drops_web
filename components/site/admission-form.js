'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { admissionLeadSchema } from '@/lib/admission-schema'
import { branches, courses } from '@/lib/site-data'

const inputClassName =
  'w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/20'

export default function AdmissionForm({ courseOptions = courses }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(admissionLeadSchema),
    defaultValues: {
      full_name: '',
      parent_name: '',
      age: '',
      phone_number: '',
      email: '',
      interested_course: courseOptions[0]?.title || '',
      preferred_branch: branches[0]?.name || '',
      preferred_class_timing: 'To be discussed after inquiry',
      prior_music_experience: 'None',
      message: 'Looking for admission details and batch availability.',
    },
  })

  useEffect(() => {
    if (courseOptions[0]?.title) {
      setValue('interested_course', courseOptions[0].title)
    }
  }, [courseOptions, setValue])

  const onSubmit = async (values) => {
    const response = await fetch('/api/admission', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong while sending your inquiry.')
    }

    alert(data.message)
    reset()
  }

  return (
    <form
      className="rounded-[2rem] border border-white/10 bg-white/5 p-6"
      onSubmit={handleSubmit(async (values) => {
        try {
          await onSubmit(values)
        } catch (error) {
          alert(error.message)
        }
      })}
    >
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">Admission inquiry</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Tell Beat Drops about the learner.</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Student full name" error={errors.full_name?.message}>
          <input className={inputClassName} placeholder="Enter student name" {...register('full_name')} />
        </Field>
        <Field label="Parent name" error={errors.parent_name?.message}>
          <input className={inputClassName} placeholder="Enter parent name" {...register('parent_name')} />
        </Field>
        <Field label="Age" error={errors.age?.message}>
          <input className={inputClassName} placeholder="Age" type="number" {...register('age')} />
        </Field>
        <Field label="Phone number" error={errors.phone_number?.message}>
          <input className={inputClassName} placeholder="Primary contact number" {...register('phone_number')} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input className={inputClassName} placeholder="Email address" type="email" {...register('email')} />
        </Field>
        <Field label="Interested course" error={errors.interested_course?.message}>
          <select className={inputClassName} {...register('interested_course')}>
            {courseOptions.map((course) => (
              <option key={course.slug} value={course.title}>
                {course.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Preferred branch" error={errors.preferred_branch?.message}>
          <select className={inputClassName} {...register('preferred_branch')}>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
        </Field>
        <input type="hidden" {...register('preferred_class_timing')} />
      </div>

      <div className="mt-4 grid gap-4">
        <Field label="Prior music experience" error={errors.prior_music_experience?.message}>
          <textarea className={`${inputClassName} min-h-[110px]`} placeholder="Mention prior training or write none" {...register('prior_music_experience')} />
        </Field>
        <Field label="Message" error={errors.message?.message}>
          <textarea className={`${inputClassName} min-h-[140px]`} placeholder="Share any schedule, goal, or learning preference" {...register('message')} />
        </Field>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-amber-200 px-5 py-3 text-sm font-semibold text-stone-950 shadow-lg shadow-amber-200/20 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Submitting inquiry...' : 'Submit admission inquiry'}
      </button>

      <p className="mt-4 text-xs leading-6 text-slate-400">
        Share your details and the academy team will review your inquiry and get in touch.
      </p>
    </form>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block text-sm text-slate-300">
      <span className="mb-2 block font-medium text-white">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-xs text-rose-300">{error}</span> : null}
    </label>
  )
}
