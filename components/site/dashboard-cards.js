import Link from 'next/link'

export function DashboardShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(10,15,35,1)_0%,rgba(4,7,18,1)_100%)] text-white">
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">Beat Drops Private Area</p>
            <h1 className="mt-2 text-2xl font-semibold text-white md:text-3xl">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">{subtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white">
              Public site
            </Link>
            <Link href="/login" className="rounded-full bg-fuchsia-500 px-4 py-2 text-sm font-semibold text-white hover:bg-fuchsia-400">
              Login
            </Link>
          </div>
        </div>
      </header>
      <main className="container space-y-6 py-8">{children}</main>
    </div>
  )
}

export function MetricTile({ label, value }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-3 text-3xl font-semibold capitalize text-white">{value}</p>
    </div>
  )
}

export function InfoCard({ title, children }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}
