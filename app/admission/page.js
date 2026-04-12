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
        title="Share your details and the academy will get back to you."
        description="Choose a course and branch, add learner details, and submit the enquiry form for follow-up."
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
