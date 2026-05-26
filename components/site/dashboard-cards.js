import Link from 'next/link'
import LogoutButton from '@/components/site/logout-button'
import SiteLogo from '@/components/site/site-logo'

export function DashboardShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#faf6ee_0%,#f4ecda_100%)] text-ink-900">
      <header className="border-b border-line bg-ivory/85 backdrop-blur-xl">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-5">
          <div>
            <SiteLogo compact />
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-maroon-700">Private Area</p>
            <h1 className="mt-3 font-display text-4xl font-medium tracking-[-0.03em] text-ink-900">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-500">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="btn-ghost">
              Public site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="container space-y-6 py-8">{children}</main>
    </div>
  )
}

export function MetricTile({ label, value }) {
  return (
    <div className="admin-panel p-5">
      <p className="text-sm text-ink-500">{label}</p>
      <p className="mt-3 font-display text-4xl font-medium capitalize text-maroon-700">{value}</p>
    </div>
  )
}

export function InfoCard({ title, children }) {
  return (
    <section className="admin-panel p-6">
      <h2 className="font-display text-3xl font-medium text-ink-900">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  )
}
