import Link from 'next/link'
import { Music3, PhoneCall } from 'lucide-react'
import { academyProfile } from '@/lib/site-data'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/courses', label: 'Courses' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/admission', label: 'Admission' },
  { href: '/contact', label: 'Contact' },
]

export function MarketingShell({ activePath, children }) {
  return (
    <div className="min-h-screen overflow-hidden bg-transparent text-stone-100">
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="container flex flex-col gap-3 py-3 text-xs text-stone-300 sm:flex-row sm:items-center sm:justify-between">
          <div className="inline-flex items-center gap-2 text-amber-100">
            <span>Music classes for kids, teens, and adults in Bhubaneswar.</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-stone-300">
            <a href={`tel:${academyProfile.phone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-2 hover:text-white">
              <PhoneCall className="h-4 w-4" />
              {academyProfile.phone}
            </a>
            <a href={academyProfile.whatsapp} target="_blank" rel="noreferrer" className="hover:text-white">
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#140f0e]/80 backdrop-blur-xl">
        <div className="container py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link href="/" className="inline-flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 via-orange-300 to-rose-300 shadow-lg shadow-orange-950/30">
                <Music3 className="h-5 w-5 text-[#2b1812]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold uppercase tracking-[0.25em] text-amber-100">Beat Drops</p>
                <p className="truncate text-sm text-stone-400">Music Class • Bhubaneswar</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 lg:flex">
              {navItems.map((item) => {
                const isActive = activePath === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      isActive ? 'bg-amber-200 text-[#24140f]' : 'text-stone-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login" className="inline-flex rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-stone-100 hover:bg-white/10">
                Login
              </Link>
              <Link href="/admission" className="inline-flex rounded-full bg-gradient-to-r from-amber-300 to-orange-300 px-4 py-2 text-sm font-semibold text-[#2b1812] shadow-lg shadow-orange-950/20 hover:from-amber-200 hover:to-orange-200">
                Enquire Now
              </Link>
            </div>
          </div>

          <div className="mt-4 lg:hidden">
            <nav className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {navItems.map((item) => {
                const isActive = activePath === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                      isActive ? 'bg-amber-200 text-[#24140f]' : 'border border-white/10 bg-white/5 text-stone-200'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
            <div className="mt-3 flex gap-2 sm:hidden">
              <Link href="/login" className="inline-flex flex-1 justify-center rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-stone-100 hover:bg-white/10">
                Login
              </Link>
              <Link href="/admission" className="inline-flex flex-1 justify-center rounded-full bg-gradient-to-r from-amber-300 to-orange-300 px-4 py-2 text-sm font-semibold text-[#2b1812] hover:from-amber-200 hover:to-orange-200">
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>
      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#120d0c]/90">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-100">Beat Drops Music Class</p>
          <h3 className="max-w-xl text-2xl font-semibold text-white">Music training with simple admissions and easy student access.</h3>
          <p className="max-w-2xl text-sm text-stone-400">Beat Drops helps families find the right branch, enquire about classes, and stay connected after admission.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Quick links</p>
            <div className="flex flex-col gap-2 text-sm text-stone-400">
              {navItems.slice(0, 6).map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-white">Contact</p>
            <div className="space-y-2 text-sm text-stone-400">
              <p>{academyProfile.phone}</p>
              <p>{academyProfile.email}</p>
              <a href={academyProfile.whatsapp} target="_blank" rel="noreferrer" className="inline-flex text-amber-100 hover:text-white">Open WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
