import { MarketingShell } from '@/components/site/marketing-shell'
import { AboutStory, ContactPanel, StudentLove } from '@/components/site/section-blocks'
import { getLiveSiteContent } from '@/lib/live-site-content'

async function App() {
  const liveContent = await getLiveSiteContent()

  return (
    <MarketingShell activePath="/about">
      <AboutStory expanded />
      <StudentLove items={liveContent.testimonials} />
      <ContactPanel />
    </MarketingShell>
  )
}

export default App
