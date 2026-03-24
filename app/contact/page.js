import { MarketingShell } from '@/components/site/marketing-shell'
import { BranchGrid, ContactPanel, PageHero } from '@/components/site/section-blocks'

function App() {
  return (
    <MarketingShell activePath="/contact">
      <PageHero
        eyebrow="Contact"
        title="Visit either branch in Bhubaneswar or connect instantly on call, WhatsApp, or email."
        description="Both branches are positioned to serve different parts of the city while keeping the same Beat Drops teaching experience."
      />
      <BranchGrid expanded />
      <ContactPanel />
    </MarketingShell>
  )
}

export default App
