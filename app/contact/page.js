import { MarketingShell } from '@/components/site/marketing-shell'
import { BranchGrid, ContactPanel, PageHero } from '@/components/site/section-blocks'

function App() {
  return (
    <MarketingShell activePath="/contact">
      <PageHero
        eyebrow="Contact"
        title="Visit a branch or contact the academy directly."
        description="Get in touch to ask about classes, timings, availability, and admission guidance."
      />
      <BranchGrid expanded />
      <ContactPanel />
    </MarketingShell>
  )
}

export default App
