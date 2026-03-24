import { MarketingShell } from '@/components/site/marketing-shell'
import LoginPanel from '@/components/site/login-panel'
import { PageHero } from '@/components/site/section-blocks'

function App() {
  return (
    <MarketingShell activePath="/login">
      <PageHero
        eyebrow="Secure Login"
        title="Google Sign-In for students and administrators."
        description="Students can view their course and class details after admission. Admins can manage leads, media, and testimonials once the remaining Supabase credentials are connected."
      />
      <section className="container py-6 md:py-10">
        <LoginPanel />
      </section>
    </MarketingShell>
  )
}

export default App
