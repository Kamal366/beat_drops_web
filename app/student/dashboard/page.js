import Link from 'next/link'
import { DashboardShell, InfoCard } from '@/components/site/dashboard-cards'

function App() {
  return (
    <DashboardShell title="Student Dashboard" subtitle="Student access is temporarily unavailable.">
      <InfoCard title="Login disabled">
        <p className="text-sm text-stone-300">Student login is disabled for now. Please contact Beat Drops directly for course, branch, or attendance updates.</p>
        <Link href="/contact" className="mt-4 inline-flex rounded-full bg-amber-200 px-4 py-2 text-sm font-semibold text-stone-950">Contact academy</Link>
      </InfoCard>
    </DashboardShell>
  )
}

export default App
