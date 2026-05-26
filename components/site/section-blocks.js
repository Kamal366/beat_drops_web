import Link from 'next/link'
import { CalendarClock, MapPin, Mic2, Music2, Phone, ShieldCheck, Star, Users2 } from 'lucide-react'
import GalleryGridClient from '@/components/site/gallery-grid-client'
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
    <section className="section-shell">
      <div className="container">
        <div className="surface-card px-6 py-10 md:px-10 md:py-14">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="section-title max-w-4xl">{title}</h1>
          <p className="section-copy max-w-3xl">{description}</p>
        </div>
      </div>
    </section>
  )
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div className="container grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <span className="eyebrow">Bhubaneswar · Two branches · Ages 4+</span>
          <h1 className="mt-4 max-w-5xl font-display text-5xl font-medium leading-[0.98] tracking-[-0.04em] text-ink-900 sm:text-6xl xl:text-[4.5rem]">
            Discover your <em className="font-normal italic text-maroon-700">Rhythm</em>.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-700">
            A premium music academy in Bhubaneswar offering 1:1 and group classes in Hindustani Vocal, Tabla, Guitar, Keyboard, Light Vocal and Kids Music - taught by mentors who perform and teach for a living.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/admission" className="btn-brand">
              Enroll Now
            </Link>
            <Link href="/admission" className="btn-ghost">
              Book a Free Demo
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-ink-500">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['BD', 'SV', 'GP'].map((item) => (
                  <span key={item} className="grid h-8 w-8 place-items-center rounded-full border-2 border-ivory bg-[linear-gradient(135deg,#6e1423,#c8a96a)] text-[10px] font-semibold text-white">
                    {item}
                  </span>
                ))}
              </div>
              <span>Ages 4+ welcome · 1:1 & small group batches</span>
            </div>
            <div className="flex items-center gap-2 text-gold-700">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-ink-500">4.9 / 5</span>
            </div>
          </div>

          <div className="mt-10 grid gap-4 rounded-[28px] border border-line bg-white/60 p-4 backdrop-blur-sm sm:grid-cols-2 xl:grid-cols-4">
            {summaryStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl bg-white/80 px-4 py-5 shadow-soft">
                <p className="font-display text-3xl font-semibold text-maroon-700">{stat.value}</p>
                <p className="mt-1 text-sm text-ink-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[360px] sm:h-[420px] lg:h-[520px]">
          <div className="absolute left-[6%] top-0 flex h-[220px] w-[200px] rotate-[-6deg] flex-col justify-between rounded-[28px] border border-white/70 bg-[linear-gradient(155deg,#fff,#fff7e5)] p-5 shadow-float sm:w-[220px] lg:h-[260px] lg:w-[240px]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500">Percussion</p>
              <h3 className="mt-2 font-display text-2xl text-maroon-900">Tabla</h3>
            </div>
            <img className="hero-tabla-image" src="/images/tabla-pair.png" alt="Tabla pair" />
            <span className="inline-flex w-fit rounded-full bg-gold-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-maroon-800">Most loved</span>
          </div>

          <div className="absolute right-[4%] top-6 flex h-[240px] w-[220px] rotate-[5deg] flex-col justify-between rounded-[28px] border border-white/70 bg-[linear-gradient(155deg,#fff,#fbe8ec)] p-5 shadow-float sm:w-[240px] lg:h-[280px] lg:w-[260px]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500">Strings</p>
              <h3 className="mt-2 font-display text-2xl text-maroon-900">Guitar</h3>
            </div>
            <img className="hero-guitar-image" src="/images/acoustic-guitar.png" alt="Acoustic guitar" />
            <span className="inline-flex w-fit rounded-full bg-maroon-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-maroon-800">New batch</span>
          </div>

          <div className="absolute bottom-0 left-[28%] flex h-[170px] w-[240px] rotate-[-2deg] flex-col justify-between rounded-[28px] border border-white/70 bg-[linear-gradient(155deg,#fff,#f4ecda)] p-5 shadow-float sm:left-[32%] sm:w-[260px] lg:h-[200px] lg:w-[280px]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-ink-500">Vocal</p>
              <h3 className="mt-2 font-display text-2xl text-maroon-900">Hindustani</h3>
            </div>
            <div className="text-5xl">🎤</div>
            <span className="inline-flex w-fit rounded-full bg-gold-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-maroon-800">Heritage</span>
          </div>

          <div className="pointer-events-none absolute inset-0 hidden motion-safe:block">
            <span className="absolute left-1 top-24 font-display text-3xl text-gold-500/60 animate-drift">♪</span>
            <span className="absolute right-24 top-2 font-display text-4xl text-gold-500/60 animate-drift [animation-delay:1.2s]">♫</span>
            <span className="absolute bottom-24 right-3 font-display text-2xl text-maroon-500/50 animate-drift [animation-delay:2.2s]">♩</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export function AboutStory({ expanded = false }) {
  return (
    <section id="about" className="section-shell">
      <div className="container">
        <div className="about-compact-grid">
          <div>
            <span className="eyebrow">About Beat Drops</span>
            <h2 className="section-title">
              A space for sound, <em className="font-normal italic text-maroon-700">shaped slowly.</em>
            </h2>
            <p className="about-compact-copy">
              Beat Drops Music Academy was founded in Bhubaneswar with one belief - that great music is taught with patience, not pressure. Our mentors come from gharana lineages, conservatory training and active performing careers, and we keep batches small so every student is heard.
            </p>

            <div className="about-compact-points">
              <AboutPoint number="1" title="Mentor-led" text="Personal feedback every class." />
              <AboutPoint number="2" title="Clear levels" text="Six graded steps per course." />
              <AboutPoint number="3" title="Stage-ready" text="Recitals, exams and confidence building." />
              <AboutPoint number="4" title="Mock practicals" text="Exam-focused practice and guidance." />
              {expanded ? (
                <AboutPoint number="5" title="Patient teaching" text="A serious but welcoming environment that helps students listen, repeat, and grow steadily." />
              ) : null}
            </div>
          </div>

          <div className="about-mentor-card">
            <span className="about-mentor-eyebrow">Mentor&apos;s note</span>
            <p className="about-mentor-quote">
              &quot;You don&apos;t learn music by chasing perfection - you learn it by listening longer than you speak.&quot;
            </p>
            <div className="about-mentor-meta">
              <p className="about-mentor-name">Shri Nikunja Bihari Samal</p>
              <p className="about-mentor-role">Founder &amp; Head of Tabla · 10+ years teaching</p>
            </div>
            <div className="about-eq" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function AboutPoint({ number, title, text }) {
  return (
    <div className="about-point-row">
      <div className="about-point-number">{number}</div>
      <div>
        <h4>{title}</h4>
        <p>{text}</p>
      </div>
    </div>
  )
}

export function CourseGrid({ expanded = false, items = courses }) {
  const visibleCourses = expanded ? items : items.slice(0, 6)

  return (
    <section id="courses" className="section-shell">
      <div className="container">
        <div className="course-section-head">
          <div>
            <span className="eyebrow">Courses</span>
            <h2 className="section-title">
              Choose your <em className="font-normal italic text-maroon-700">course</em>.
            </h2>
            <p className="course-section-sub">
              From Indian classical foundations to modern contemporary instruments - every course follows a structured 6-level curriculum, taught in small batches.
            </p>
          </div>
          <div className="course-section-link hidden sm:block">
            <Link href="/admission">View curriculum &rarr;</Link>
          </div>
        </div>

        <div className="course-proto-grid">
          {visibleCourses.map((course) => (
            <Link key={course.slug} href={`/admission?course=${encodeURIComponent(course.title)}`} className="course-proto-card block">
              <div className="course-proto-head">
                <div className="course-proto-glyph">{getCourseGlyph(course.slug)}</div>
                <span className="course-proto-mode">{course.mode}</span>
              </div>

              <h3>{course.title}</h3>
              <p>{course.description}</p>

              <div className="course-proto-meta">
                <span className="course-proto-age">{course.ages}</span>
                <span>{course.duration}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function getCourseGlyph(slug) {
  switch (slug) {
    case 'hindustani-vocal':
      return '🎤'
    case 'light-vocal-performance':
      return '🎙️'
    case 'keyboard-piano-foundations':
      return '🎹'
    case 'guitar-essentials':
      return <GuitarGlyph />
    case 'tabla-rhythm-training':
      return <TablaGlyph />
    case 'kids-music-foundation':
      return '🎶'
    default:
      return '♪'
  }
}

function TablaGlyph() {
  return <img className="tabla-ic" src="/images/tabla-pair.png" alt="" aria-hidden="true" />
}

function GuitarGlyph() {
  return <img className="guitar-ic" src="/images/acoustic-guitar.png" alt="" aria-hidden="true" />
}

export function BranchGrid({ expanded = false }) {
  return (
    <section id="locations" className="section-shell">
      <div className="container">
        <SectionHeading
          eyebrow="Branches"
          title="Choose the branch that works best for you."
          description="Both branches follow the same class approach and mentors. Either team can help you with admissions and batch guidance."
        />

        <div className="grid gap-4 lg:grid-cols-2">
          {branches.map((branch) => (
            <article key={branch.id} className="surface-card p-6 md:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-display text-3xl font-medium text-ink-900">{branch.shortName}</h3>
                  <p className="mt-2 text-sm text-maroon-700">{branch.vibe}</p>
                </div>
                <span className="rounded-full border border-line bg-sand px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">
                  {branch.id === 'sailashree-vihar' ? 'Branch 1 · North Bhubaneswar' : 'Branch 2 · West Bhubaneswar'}
                </span>
              </div>

              <div className="mt-5 space-y-3 text-sm leading-7 text-ink-500">
                <p>{branch.address}</p>
                <p>Open every day • till 10 PM</p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <a href={branch.mapUrl} target="_blank" rel="noreferrer" className="btn-brand">
                  Open map
                </a>
                {expanded ? (
                  <a href={`tel:${branch.phone.replace(/\s+/g, '')}`} className="btn-ghost">
                    Call branch
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function GalleryPreview({ expanded = false, items = galleryHighlights }) {
  const displayItems = expanded ? items : items.slice(0, 4)

  return (
    <section id="gallery" className="section-shell">
      <div className="container">
        <SectionHeading
          eyebrow="Gallery"
          title="Inside the academy."
          description="Moments from class, recitals and festival performances."
        />

        <GalleryGridClient items={displayItems} expanded={expanded} />
      </div>
    </section>
  )
}

export function PromoBanners({ items = banners }) {
  return (
    <section className="section-shell">
      <div className="container">
        <SectionHeading
          eyebrow="What's on"
          title="Upcoming at the academy."
          description="New batches, free demo days, and student showcases - book early, seats are limited."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((banner, index) => (
            <article key={banner.title} className={index === 1 ? 'surface-deep p-6 md:p-7' : 'surface-card p-6 md:p-7'}>
              <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${index === 1 ? 'text-gold-300' : 'text-maroon-700'}`}>Notice</p>
              <h3 className={`mt-3 font-display text-3xl font-medium ${index === 1 ? 'text-white' : 'text-ink-900'}`}>{banner.title}</h3>
              <p className={`mt-3 text-sm leading-7 ${index === 1 ? 'text-gold-100/85' : 'text-ink-500'}`}>{banner.subtitle}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function StudentLove({ items = testimonials }) {
  return (
    <section className="section-shell">
      <div className="container">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trust-first proof points for parents, learners, and working adults."
          description="Premium education sells on credibility, not hype. These cards stay restrained and readable."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <article key={`${item.name}-${item.role}`} className="surface-card p-6 md:p-7">
              <div className="flex gap-1 text-gold-700">
                {Array.from({ length: Number(item.rating) || 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-5 text-lg leading-8 text-ink-700">“{item.quote}”</p>
              <div className="mt-6 border-t border-line pt-4">
                <p className="font-semibold text-ink-900">{item.name}</p>
                <p className="text-sm text-ink-500">{item.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ContactPanel() {
  return (
    <section className="section-shell pt-2">
      <div className="container grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="surface-deep p-6 md:p-8">
          <span className="eyebrow before:bg-gold-300 text-gold-300">Contact</span>
          <h2 className="mt-4 font-display text-4xl font-medium tracking-[-0.03em] text-white">Need help choosing a course or branch?</h2>
          <p className="mt-4 text-sm leading-7 text-gold-100/85">
            Call, email, or message the academy to ask about batches, free demos, timing flexibility, and admissions.
          </p>

          <div className="mt-6 grid gap-3 text-sm">
            <a href={`tel:${academyProfile.phone.replace(/\s+/g, '')}`} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 hover:bg-white/15">
              {academyProfile.phone}
            </a>
            <a href={`mailto:${academyProfile.email}`} className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 hover:bg-white/15">
              {academyProfile.email}
            </a>
            <a href={academyProfile.whatsapp} target="_blank" rel="noreferrer" className="btn-gold w-full">
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <MiniContactCard icon={MapPin} title="Locations" text="Each branch card includes a direct map link for quick navigation." />
          <MiniContactCard icon={CalendarClock} title="Timings" text="Batch timing is handled after enquiry so learners can be matched more personally." />
          <MiniContactCard icon={Users2} title="Support" text="The public funnel stays simple while admins manage follow-up from the private dashboard." />
          <MiniContactCard icon={Phone} title="Fast contact" text="Phone and WhatsApp remain visible because those are still the academy’s highest-conversion paths." />
        </div>
      </div>
    </section>
  )
}

export function AdmissionProcess() {
  const steps = [
    'Free 30-minute demo class with a senior mentor',
    'Personalised course path based on your goals',
    "No commitment until you've experienced the academy",
    'WhatsApp and call-back support, in English, Hindi and Odia',
  ]

  return (
    <div className="surface-card p-6 md:p-8">
      <span className="eyebrow">Enrol with us</span>
      <h2 className="mt-4 font-display text-4xl font-medium tracking-[-0.03em] text-ink-900">Tell us a little, we'll take it from there.</h2>
      <p className="mt-4 text-sm leading-7 text-ink-500">
        Submit the form and our admissions team will reach out within 24 hours to schedule your free demo class.
      </p>
      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-4 rounded-[24px] bg-sand p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-maroon-700 text-sm font-semibold text-white">
              {index + 1}
            </div>
            <p className="text-sm leading-7 text-ink-700">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-7 max-w-4xl">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title">{title}</h2>
      <p className="section-copy">{description}</p>
    </div>
  )
}

function MiniContactCard({ icon: Icon, title, text }) {
  return (
    <div className="surface-card p-6">
      <Icon className="h-5 w-5 text-maroon-700" />
      <h3 className="mt-4 font-display text-2xl font-medium text-ink-900">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-ink-500">{text}</p>
    </div>
  )
}

export function FeatureCard({ icon: Icon = Music2, title, text }) {
  return (
    <div className="surface-card p-5">
      <Icon className="h-5 w-5 text-maroon-700" />
      <p className="mt-4 font-semibold text-ink-900">{title}</p>
      <p className="mt-2 text-sm leading-7 text-ink-500">{text}</p>
    </div>
  )
}

export function PrivateFeatureGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <FeatureCard icon={Music2} title="Premium public funnel" text="The new design carries the prototype’s trust-led layout into production routes." />
      <FeatureCard icon={Users2} title="Qualified enquiries" text="The same form flow is preserved while the UX now prioritizes mobile discovery." />
      <FeatureCard icon={ShieldCheck} title="Admin protected" text="Private operations stay gated while inheriting the new visual system." />
      <FeatureCard icon={Mic2} title="Brand coherence" text="Public pages, private pages, and contact surfaces now share one language." />
    </div>
  )
}
