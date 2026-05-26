import { MarketingShell } from '@/components/site/marketing-shell'
import AdmissionForm from '@/components/site/admission-form'
import { AdmissionProcess, PageHero } from '@/components/site/section-blocks'
import { getLiveSiteContent } from '@/lib/live-site-content'

async function App() {
  const liveContent = await getLiveSiteContent()

  return (
    <MarketingShell activePath="/admission">
      <PageHero
        eyebrow="Admissions"
        title="Tell us a little, we'll take it from there."
        description="Submit the enquiry form and the admissions team will reach out within 24 hours to schedule your free demo class."
      />
      <section className="container py-6 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <AdmissionProcess />
          <AdmissionForm courseOptions={liveContent.courses} />
        </div>
      </section>
    </MarketingShell>
  )
}

export default App
