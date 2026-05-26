import Link from 'next/link'
import { DashboardShell, InfoCard } from '@/components/site/dashboard-cards'

function App() {
  return (
    <DashboardShell title="Student Dashboard" subtitle="Student access is temporarily unavailable.">
      <InfoCard title="Login disabled">
        <p className="text-sm leading-7 text-ink-500">Student login is disabled for now. Please contact Beat Drops directly for course, branch, or attendance updates.</p>
        <Link href="/contact" className="btn-brand mt-4">
          Contact academy
        </Link>
      </InfoCard>
    </DashboardShell>
  )
}

export default App
