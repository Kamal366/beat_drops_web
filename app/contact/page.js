import { MarketingShell } from '@/components/site/marketing-shell'
import { BranchGrid, ContactPanel } from '@/components/site/section-blocks'

function App() {
  return (
    <MarketingShell activePath="/contact">
      <BranchGrid expanded />
      <ContactPanel />
    </MarketingShell>
  )
}

export default App
