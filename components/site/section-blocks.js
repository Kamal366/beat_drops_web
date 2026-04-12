import Link from 'next/link'
import { CalendarClock, GraduationCap, MapPin, Mic2, Music2, Phone, ShieldCheck, Users2 } from 'lucide-react'
import {
  academyProfile,
  banners,
  branches,
  courses,
  galleryHighlights,
  summaryStats,
  testimonials,
} from '@/lib/site-data'

export function PageHero({ eyebrow, title, description }) {
  return (
    <section className="container pt-10 md:pt-16">
      <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-6 shadow-2xl shadow-black/15 backdrop-blur-xl md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-100">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight text-white md:text-5xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base text-stone-300 md:text-lg">{description}</p>
      </div>
    </section>
  )
}

export function HeroSection() {
  return (
    <section className="container pb-6 pt-10 md:pb-10 md:pt-16">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div className="space-y-8 pt-2">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-100">Bhubaneswar Music Academy</p>
            <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-white sm:text-5xl xl:text-[4.4rem]">
              Learn music with structured classes, flexible batches, and patient guidance.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              Beat Drops offers vocals, instruments, and rhythm classes for children, teens, and adults across two Bhubaneswar branches.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/admission" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-300 to-orange-300 px-6 py-3 text-sm font-semibold text-[#2b1812] shadow-lg shadow-orange-950/20 hover:from-amber-200 hover:to-orange-200">
              Book an Enquiry
            </Link>
            <Link href="/courses" className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
              Explore Courses
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {summaryStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-stone-300">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.25rem] border border-white/10 bg-[linear-gradient(160deg,rgba(255,204,139,0.2),rgba(255,255,255,0.05))] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="grid gap-5">
            <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(255,211,149,0.35),transparent_30%),linear-gradient(180deg,rgba(69,39,30,0.55),rgba(28,18,16,0.75))] p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-100">Live 1:1 + Group Classes</p>
                  <h2 className="mt-3 max-w-sm text-3xl font-semibold leading-tight text-white">A calmer, more focused learning environment for every age group.</h2>
                </div>
                <div className="hidden rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white sm:block">Beat Drops</div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-stone-400">Class Type</p>
                  <p className="mt-3 text-xl font-semibold text-white">Vocals • Instruments • Rhythm</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-stone-400">Best For</p>
                  <p className="mt-3 text-xl font-semibold text-white">Kids, hobby learners, and serious students</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <FeatureCard icon={Music2} title="Performance-focused" text="Voice, rhythm, and stage confidence in one learning journey." />
              <FeatureCard icon={Users2} title="For kids to adults" text="Flexible learning formats for hobby learners and serious students." />
              <FeatureCard icon={MapPin} title="2 Bhubaneswar branches" text="Choose the branch most convenient for you." />
              <FeatureCard icon={ShieldCheck} title="Secure private area" text="Students and admins can access private dashboards after sign-in." />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function TrustStrip() {
  const trustItems = ['Focused teacher guidance', 'Flexible weekday and weekend batches', 'Student dashboard after admission', 'Simple enquiry and follow-up']

  return (
    <section className="container py-4 md:py-6">
      <div className="grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 backdrop-blur-sm md:grid-cols-4">
        {trustItems.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4 text-sm font-medium text-stone-200">
            {item}
          </div>
        ))}
      </div>
    </section>
  )
}

export function AboutStory({ expanded = false }) {
  return (
    <section className="container py-6 md:py-10">
      <SectionHeading
        eyebrow="About"
        title="A simple and supportive place to learn music regularly."
        description="Beat Drops focuses on steady practice, personal attention, and practical class scheduling for students and families."
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_0.95fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-7 text-stone-300 backdrop-blur-sm">
          <p className="max-w-2xl text-xl leading-9">
            Students learn through regular classes, guided practice, and teacher feedback that matches their age, level, and goals.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <InsightCard title="Structured learning" text="Clear progression paths for vocals, rhythm, and instruments." />
            <InsightCard title="Flexible batches" text="Designed for school students, college learners, and working adults." />
            <InsightCard title="Teacher-led attention" text="Focused feedback for technique, expression, and confidence." />
            <InsightCard title="Community energy" text="An environment that feels serious, warm, and performance-ready." />
          </div>
        </div>

        <div className="grid gap-4">
          <HighlightPanel icon={GraduationCap} title="Built for admissions and retention" text="The website is designed to attract new families, collect inquiries, and organize lead follow-up clearly." />
          <HighlightPanel icon={CalendarClock} title="Flexible scheduling" text="Branch selection is captured instantly, while timing can be assigned personally after the inquiry comes in." />
          {expanded ? <HighlightPanel icon={Mic2} title="Performance culture" text="From voice development to public confidence, the academy identity is crafted around expressive growth." /> : null}
        </div>
      </div>
    </section>
  )
}

export function CourseGrid({ expanded = false, items = courses }) {
  const visibleCourses = expanded ? items : items.slice(0, 4)
  return (
    <section className="container py-6 md:py-10">
      <SectionHeading
        eyebrow="Courses"
        title="Courses for beginners and continuing learners."
        description="Choose from vocals, instruments, and rhythm classes with one-to-one and group options."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleCourses.map((course) => (
          <div key={course.slug} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold text-white">{course.title}</h3>
              <span className="rounded-full border border-amber-200/20 px-3 py-1 text-xs uppercase tracking-[0.2em] text-amber-100">{course.mode}</span>
            </div>
            <p className="mt-3 text-sm text-stone-300">{course.description}</p>
            <div className="mt-5 grid gap-2 text-sm text-stone-300">
              <div className="rounded-2xl bg-black/20 p-3">Age group: <span className="text-white">{course.ages}</span></div>
              <div className="rounded-2xl bg-black/20 p-3">Schedule: <span className="text-white">{course.duration}</span></div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {course.highlights.map((item) => (
                <span key={item} className="rounded-full border border-white/10 px-3 py-1 text-xs text-stone-300">{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!expanded ? (
        <div className="mt-6">
          <Link href="/courses" className="inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
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
        title="Choose the branch that works best for your location."
        description="Both branches follow the same class approach and can help with admissions and batch guidance."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {branches.map((branch) => (
          <div key={branch.id} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-semibold text-white">{branch.name}</h3>
                <p className="mt-1 text-sm text-amber-100">{branch.vibe}</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-stone-300">{branch.hours}</span>
            </div>
            <div className="mt-5 space-y-3 text-sm text-stone-300">
              <p>{branch.address}</p>
              <p>{branch.phone}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={branch.mapUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-full bg-gradient-to-r from-amber-300 to-orange-300 px-4 py-2 text-sm font-semibold text-[#2b1812] hover:from-amber-200 hover:to-orange-200">
                Open map
              </a>
              {expanded ? (
                <a href={academyProfile.whatsapp} target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
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

export function GalleryPreview({ expanded = false, items = galleryHighlights }) {
  const displayItems = expanded ? items : items.slice(0, 3)
  return (
    <section className="container py-6 md:py-10">
      <SectionHeading
        eyebrow="Gallery"
        title="Classroom moments, events, and student activities."
        description="This gallery can be updated by the admin team as new class photos and event images are added."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {displayItems.map((item, index) => (
          <div key={item.title} className="group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className={`h-56 p-6 ${index % 2 === 0 ? 'bg-[linear-gradient(135deg,rgba(255,194,120,0.18),rgba(255,255,255,0.05))]' : 'bg-[linear-gradient(135deg,rgba(255,143,90,0.18),rgba(255,255,255,0.05))]'}`}>
              <div className="flex h-full items-end rounded-[1.5rem] border border-white/10 bg-black/10 p-4">
                <div className="w-full">
                  <p className="text-xs uppercase tracking-[0.32em] text-amber-100">Beat Drops</p>
                  <p className="mt-3 text-lg font-semibold text-white">{item.title}</p>
                  <div className="mt-4 h-16 rounded-2xl border border-white/10 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))]" />
                </div>
              </div>
            </div>
            <div className="p-5 text-sm leading-7 text-stone-300">{item.caption}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function PromoBanners({ items = banners }) {
  return (
    <section className="container py-6 md:py-10">
      <SectionHeading
        eyebrow="Promotions"
        title="Announcements and updates."
        description="Use this section for batch updates, seasonal notices, and class information."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {items.map((banner, index) => (
          <div key={banner.title} className={`rounded-[2rem] border border-white/10 p-6 backdrop-blur-sm ${index === 1 ? 'bg-[linear-gradient(135deg,rgba(255,191,117,0.18),rgba(255,255,255,0.04))]' : 'bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))]'}`}>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-100">Notice</p>
            <h3 className="mt-3 text-2xl font-semibold text-white">{banner.title}</h3>
            <p className="mt-2 text-sm leading-7 text-stone-300">{banner.subtitle}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function StudentLove({ items = testimonials }) {
  return (
    <section className="container py-6 md:py-10">
      <SectionHeading
        eyebrow="Testimonials"
        title="What students and parents like about the classes."
        description="A simple way to share trust-building feedback from the academy community."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.name + item.role} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="text-lg leading-8 text-stone-200">“{item.quote}”</p>
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="font-semibold text-white">{item.name}</p>
              <p className="text-sm text-stone-400">{item.role}</p>
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
        <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-6 shadow-2xl shadow-black/15 backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-100">Contact</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Need help with courses or admissions?</h2>
          <p className="mt-3 text-sm text-stone-300">Call, email, or message the academy to ask about batches, branches, timings, and admission steps.</p>
          <div className="mt-6 grid gap-3 text-sm text-stone-200">
            <a href={`tel:${academyProfile.phone.replace(/\s+/g, '')}`} className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10">{academyProfile.phone}</a>
            <a href={`mailto:${academyProfile.email}`} className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-white/10">{academyProfile.email}</a>
            <a href={academyProfile.whatsapp} target="_blank" rel="noreferrer" className="rounded-2xl border border-amber-200/20 bg-gradient-to-r from-amber-300 to-orange-300 p-4 font-medium text-[#2b1812] hover:from-amber-200 hover:to-orange-200">Chat on WhatsApp</a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <MiniContactCard icon={MapPin} title="Branches" text="Both Bhubaneswar branches are listed with direct Google Maps links." />
          <MiniContactCard icon={CalendarClock} title="Timings" text="Timings are assigned by the academy after inquiry so each learner can be matched to the right batch." />
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
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-100">Admission flow</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">Simple steps to get started.</h2>
      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-4 rounded-2xl border border-white/10 bg-black/10 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-amber-300 to-orange-300 text-sm font-semibold text-[#2b1812]">{index + 1}</div>
            <p className="text-sm leading-7 text-stone-300">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-6 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-100">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-stone-300 md:text-base">{description}</p>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
      <Icon className="h-5 w-5 text-amber-100" />
      <p className="mt-4 font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-stone-200">{text}</p>
    </div>
  )
}


function InsightCard({ title, text }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.08))] p-4 backdrop-blur-sm">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-stone-300">{text}</p>
    </div>
  )
}

function HighlightPanel({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))] p-6 shadow-xl shadow-black/10 backdrop-blur-xl">
      <Icon className="h-6 w-6 text-amber-100" />
      <h3 className="mt-4 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-stone-300">{text}</p>
    </div>
  )
}

function MiniContactCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.04))] p-6 shadow-xl shadow-black/10 backdrop-blur-xl">
      <Icon className="h-5 w-5 text-amber-100" />
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-stone-300">{text}</p>
    </div>
  )
}
