import { MarketingShell } from '@/components/site/marketing-shell'
import { AboutStory, ContactPanel, PageHero, StudentLove } from '@/components/site/section-blocks'
import { getLiveSiteContent } from '@/lib/live-site-content'

async function App() {
  const liveContent = await getLiveSiteContent()

  return (
    <MarketingShell activePath="/about">
      <PageHero
        eyebrow="About Beat Drops"
        title="A space for sound, shaped slowly."
        description="Beat Drops Music Academy was founded in Bhubaneswar with one belief - that great music is taught with patience, not pressure."
      />
      <AboutStory expanded />
      <StudentLove items={liveContent.testimonials} />
      <ContactPanel />
    </MarketingShell>
  )
}

export default App
