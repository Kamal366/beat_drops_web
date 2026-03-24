import Link from 'next/link'
import { CalendarClock, GraduationCap, MapPin, Mic2, Music2, Phone, ShieldCheck, Sparkles, Users2 } from 'lucide-react'
import {
  academyProfile,
  banners,
  branches,
  courses,
  galleryHighlights,
  quickBenefits,
  summaryStats,
  testimonials,
} from '@/lib/site-data'

export function PageHero({ eyebrow, title, description }) {
  return (
    <section className="container pt-10 md:pt-16">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-fuchsia-500/10 backdrop-blur-xl md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base text-slate-300 md:text-lg">{description}</p>
      </div>
    </section>
  )
}

export function HeroSection() {
  return (
    <section className="container pb-6 pt-10 md:pb-10 md:pt-16">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
            <Sparkles className="h-4 w-4" />
            Premium music learning for every age
          </div>
          <div className="space-y-4">
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-white sm:text-5xl xl:text-6xl">
              Beat Drops Music Class — premium training, joyful energy, and smarter admissions.
            </h1>
            <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
              A vibrant, mobile-first website for advertisements and admissions, plus a secure student/admin system designed for a growing academy in Bhubaneswar.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/admission" className="inline-flex items-center justify-center rounded-full bg-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/30 hover:bg-fuchsia-400">
              Start Admission Inquiry
            </Link>
            <Link href="/courses" className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Explore Courses
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summaryStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/20 via-slate-900 to-cyan-400/10 p-6 shadow-2xl shadow-cyan-500/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(34,211,238,0.18),transparent_28%)]" />
          <div className="relative space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <FeatureCard icon={Music2} title="Performance-focused" text="Voice, rhythm, and stage confidence in one learning journey." />
              <FeatureCard icon={Users2} title="For kids to adults" text="Flexible learning formats for hobby learners and serious students." />
              <FeatureCard icon={MapPin} title="2 Bhubaneswar branches" text="Reach families across the city with stronger local discovery." />
              <FeatureCard icon={ShieldCheck} title="Secure private area" text="Google login for students and role-aware admin access." />
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">Academy value stack</p>
              <div className="mt-4 space-y-3">
                {quickBenefits.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-white/5 p-3 text-sm text-slate-300">
                    <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-fuchsia-400" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AboutStory({ expanded = false }) {
  return (
    <section className="container py-6 md:py-10">
      <SectionHeading
        eyebrow="About"
        title="Music education that feels premium, disciplined, and deeply encouraging."
        description="Beat Drops is positioned for learners who want more than casual classes — it offers consistency, artistry, and a clear growth journey."
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-slate-300">
          <p className="text-lg leading-8">
            The academy experience is built around strong fundamentals, guided performance readiness, and a welcoming environment where learners can develop with confidence.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InsightCard title="Structured learning" text="Clear progression paths for vocals, rhythm, and instruments." />
            <InsightCard title="Flexible batches" text="Designed for school students, college learners, and working adults." />
            <InsightCard title="Teacher-led attention" text="Focused feedback for technique, expression, and confidence." />
            <InsightCard title="Community energy" text="An environment that feels serious, warm, and performance-ready." />
          </div>
        </div>

        <div className="grid gap-4">
          <HighlightPanel icon={GraduationCap} title="Built for admissions and retention" text="The website is designed to attract new families, collect inquiries, and organize lead follow-up clearly." />
          <HighlightPanel icon={CalendarClock} title="Class timing friendly" text="Batch preferences and branch selection are captured right from the admission inquiry flow." />
          {expanded ? <HighlightPanel icon={Mic2} title="Performance culture" text="From voice development to public confidence, the academy identity is crafted around expressive growth." /> : null}
        </div>
      </div>
    </section>
  )
}

export function CourseGrid({ expanded = false }) {
  const visibleCourses = expanded ? courses : courses.slice(0, 4)
  return (
    <section className="container py-6 md:py-10">
      <SectionHeading
        eyebrow="Courses"
        title="Programs designed for consistent practice, technique, and stage confidence."
        description="Offerings are curated to serve complete beginners, growing hobby learners, and serious music students."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleCourses.map((course) => (
          <div key={course.slug} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-white">{course.title}</h3>
              <span className="rounded-full border border-cyan-400/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-cyan-200">{course.mode}</span>
            </div>
            <p className="mt-3 text-sm text-slate-300">{course.description}</p>
            <div className="mt-5 grid gap-2 text-sm text-slate-400">
              <div className="rounded-2xl bg-slate-950/60 p-3">Age group: <span className="text-white">{course.ages}</span></div>
              <div className="rounded-2xl bg-slate-950/60 p-3">Schedule: <span className="text-white">{course.duration}</span></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {course.highlights.map((item) => (
                <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!expanded ? (
        <div className="mt-6">
          <Link href="/courses" className="inline-flex rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
            View all programs
          </Link>
        </div>
      ) : null}
    </section>
  )
}

export function BranchGrid({ expanded = false }) {
  return (
    <section className="container py-6 md:py-10">
      <SectionHeading
        eyebrow="Branches"
        title="Two branches, one Beat Drops experience."
        description="Help families choose the most convenient branch while keeping the same academy feel across Bhubaneswar."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {branches.map((branch) => (
          <div key={branch.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold text-white">{branch.name}</h3>
                <p className="mt-1 text-sm text-cyan-200">{branch.vibe}</p>
              </div>
              <span className="rounded-full border border-fuchsia-400/30 px-3 py-1 text-xs uppercase tracking-[0.2em] text-fuchsia-200">{branch.hours}</span>
            </div>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>{branch.address}</p>
              <p>{branch.phone}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={branch.mapUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-200">
                Open map
              </a>
              {expanded ? (
                <a href={academyProfile.whatsapp} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
                  Enquire on WhatsApp
                </a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function GalleryPreview({ expanded = false }) {
  const items = expanded ? galleryHighlights : galleryHighlights.slice(0, 3)
  return (
    <section className="container py-6 md:py-10">
      <SectionHeading
        eyebrow="Gallery"
        title="A visual system ready for photos, celebration, and promotional assets."
        description="Even before real media is connected, the gallery and banner architecture is built for premium presentation and future admin uploads."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <div key={item.title} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
            <div className={`h-52 bg-gradient-to-br ${index % 2 === 0 ? 'from-fuchsia-500/70 via-purple-500/40 to-cyan-400/50' : 'from-cyan-400/60 via-slate-900 to-fuchsia-500/60'} p-6`}>
              <div className="flex h-full items-end rounded-[1.5rem] border border-white/20 bg-slate-950/20 p-4 backdrop-blur-sm">
                <p className="text-lg font-semibold text-white">{item.title}</p>
              </div>
            </div>
            <div className="p-5 text-sm text-slate-300">{item.caption}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PromoBanners() {
  return (
    <section className="container py-6 md:py-10">
      <SectionHeading
        eyebrow="Promotions"
        title="Ad-ready banners for campaigns, seasonal batches, and announcements."
        description="These banner cards mirror the structure the admin dashboard will manage through Supabase storage."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {banners.map((banner, index) => (
          <div key={banner.title} className={`rounded-[2rem] border border-white/10 p-6 ${index === 1 ? 'bg-gradient-to-br from-cyan-400/25 to-slate-900' : 'bg-gradient-to-br from-fuchsia-500/20 to-slate-900'}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-200">Campaign slot</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{banner.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{banner.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function StudentLove() {
  return (
    <section className="container py-6 md:py-10">
      <SectionHeading
        eyebrow="Testimonials"
        title="A premium section ready for real student and parent stories."
        description="Until the admin-managed testimonial CMS is connected, the website highlights the kind of outcomes the academy stands for."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {testimonials.map((item) => (
          <div key={item.name + item.role} className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-lg leading-8 text-slate-200">“{item.quote}”</p>
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-sm text-slate-400">{item.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function ContactPanel() {
  return (
    <section className="container py-6 md:py-10">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-fuchsia-500/20 to-slate-950 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">Contact</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Ready to join Beat Drops?</h2>
          <p className="mt-3 text-sm text-slate-300">Reach the academy instantly or send an admission inquiry and let the admin team respond with the right branch and batch options.</p>
          <div className="mt-6 grid gap-3 text-sm text-slate-200">
            <a href={`tel:${academyProfile.phone.replace(/\s+/g, '')}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">{academyProfile.phone}</a>
            <a href={`mailto:${academyProfile.email}`} className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">{academyProfile.email}</a>
            <a href={academyProfile.whatsapp} target="_blank" rel="noreferrer" className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 p-4 text-cyan-200 hover:bg-cyan-400/15">Chat on WhatsApp</a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <MiniContactCard icon={MapPin} title="Branches" text="Both Bhubaneswar branches are listed with direct Google Maps links." />
          <MiniContactCard icon={CalendarClock} title="Timings" text="Class preference capture is built into the inquiry form for easy admission follow-up." />
          <MiniContactCard icon={Users2} title="Student support" text="Private dashboard architecture is ready for admitted students after Google login." />
          <MiniContactCard icon={Phone} title="Admin operations" text="Lead management, gallery uploads, and testimonials will be controlled from the admin panel." />
        </div>
      </div>
    </section>
  )
}

export function AdmissionProcess() {
  const steps = [
    'Submit learner and parent details through the public inquiry form.',
    'Admin reviews the lead and updates status from new_lead to contacted or trial_scheduled.',
    'Once admitted, the learner can sign in with Google to access the student dashboard.',
  ]

  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">Admission flow</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">Simple for parents, organized for admins.</h2>
      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-4 rounded-2xl bg-slate-950/60 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-fuchsia-500 text-sm font-semibold text-white">{index + 1}</div>
            <p className="text-sm text-slate-300">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-6 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-slate-300 md:text-base">{description}</p>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4 backdrop-blur-sm">
      <Icon className="h-5 w-5 text-cyan-300" />
      <p className="mt-4 font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{text}</p>
    </div>
  )
}

function InsightCard({ title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/55 p-4">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-slate-400">{text}</p>
    </div>
  )
}

function HighlightPanel({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <Icon className="h-6 w-6 text-fuchsia-300" />
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-slate-300">{text}</p>
    </div>
  )
}

function MiniContactCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <Icon className="h-5 w-5 text-cyan-300" />
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{text}</p>
    </div>
  )
}
