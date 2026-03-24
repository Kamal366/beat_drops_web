import { MarketingShell } from '@/components/site/marketing-shell'
import AdmissionForm from '@/components/site/admission-form'
import { AdmissionProcess, PageHero } from '@/components/site/section-blocks'

function App() {
  return (
    <MarketingShell activePath="/admission">
      <PageHero
        eyebrow="Admissions"
        title="Start your Beat Drops journey with a fast admission inquiry."
        description="Submit your class preference, branch choice, and learner details. The academy can review, contact, and convert each inquiry into an active student."
      />
      <section className="container py-6 md:py-10">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <AdmissionProcess />
          <AdmissionForm />
        </div>
      </section>
    </MarketingShell>
  )
}

export default App
