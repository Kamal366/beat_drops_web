import Link from 'next/link'
import { MessageCircle, Music3, PhoneCall } from 'lucide-react'
import { academyProfile } from '@/lib/site-data'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Locations' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/admission', label: 'Enquiry' },
]

export function MarketingShell({ activePath, children }) {
  return (
    <div className="page-shell text-ink-900">
      <header className="sticky top-0 z-50 border-b border-line/80 bg-ivory/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[linear-gradient(135deg,#6e1423,#4a0e1a)] text-gold-300 shadow-soft">
              <Music3 className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-display text-lg font-semibold tracking-[-0.02em] text-ink-900">
                Beat <span className="text-maroon-700">Drops</span>
              </p>
              <p className="truncate text-xs text-ink-500">Music Academy • Bhubaneswar</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-ink-700 lg:flex" aria-label="Primary">
            {navItems.map((item) => {
              const isActive = activePath === item.href
              return (
                <Link key={item.href} href={item.href} className={isActive ? 'text-maroon-700' : 'hover:text-maroon-700'}>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="hidden rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-700 hover:border-gold-500 sm:inline-flex">
              Admin
            </Link>
            <Link href="/admission" className="btn-brand px-4 py-2.5">
              Book a Demo
            </Link>
          </div>
        </div>

        <div className="container pb-3 lg:hidden">
          <nav className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden" aria-label="Primary mobile">
            {navItems.map((item) => {
              const isActive = activePath === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                    isActive ? 'bg-maroon-700 text-white' : 'border border-line bg-white/80 text-ink-700'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <div className="border-b border-line/70 bg-white/45">
        <div className="container flex flex-col gap-2 py-3 text-sm text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Bhubaneswar • Two branches • Ages 5+ • 1:1 and small-group batches</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href={`tel:${academyProfile.phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-2 hover:text-maroon-700">
              <PhoneCall className="h-4 w-4" />
              {academyProfile.phone}
            </a>
            <a href={`mailto:${academyProfile.email}`} className="hover:text-maroon-700">
              {academyProfile.email}
            </a>
          </div>
        </div>
      </div>

      <main id="main-content">{children}</main>
      <Footer />

      <a
        href={`${academyProfile.whatsapp}?text=${encodeURIComponent('Hello Beat Drops, I would like to enquire about music classes.')}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 inline-flex h-14 w-14 items-center justify-center rounded-full bg-maroon-700 text-white shadow-float transition hover:-translate-y-0.5 hover:bg-maroon-800"
      >
        <MessageCircle className="h-5 w-5" />
      </a>
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-8 bg-maroon-900 text-gold-100 md:mt-12">
      <div className="container grid gap-10 py-14 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300">Beat Drops Music Academy</p>
          <h2 className="font-display text-3xl font-medium text-white">Discover your rhythm. A premium music academy based in Bhubaneswar.</h2>
          <p className="max-w-xl text-sm leading-7 text-gold-100/80">
            Teaching tradition, modern instruments and performance, with guided admissions across both branches.
          </p>
        </div>

        <div>
          <h3 className="font-display text-lg text-white">Courses</h3>
          <div className="mt-4 grid gap-2 text-sm text-gold-300">
            {[
              'Hindustani Vocal',
              'Light Vocal & Performance',
              'Keyboard & Piano',
              'Guitar Essentials',
              'Tabla & Rhythm',
              'Kids Music Foundation',
            ].map((item) => (
              <Link key={item} href="/courses" className="hover:text-white">
                {item}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg text-white">Contact</h3>
          <div className="mt-4 grid gap-2 text-sm text-gold-300">
            <p>{academyProfile.phone}</p>
            <a href={academyProfile.whatsapp} target="_blank" rel="noreferrer" className="hover:text-white">
              WhatsApp us
            </a>
            <p>{academyProfile.email}</p>
            <p>Bhubaneswar, Odisha</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
