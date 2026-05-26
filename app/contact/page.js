import { MarketingShell } from '@/components/site/marketing-shell'
import { BranchGrid, ContactPanel, PageHero } from '@/components/site/section-blocks'

function App() {
  return (
    <MarketingShell activePath="/contact">
      <PageHero
        eyebrow="Branches"
        title="Choose the branch that works best for you."
        description="Both branches follow the same class approach and mentors. Either team can help you with admissions and batch guidance."
      />
      <BranchGrid expanded />
      <ContactPanel />
    </MarketingShell>
  )
}

export default App
