import { MarketingShell } from '@/components/site/marketing-shell'
import { AboutStory, ContactPanel, PageHero, StudentLove } from '@/components/site/section-blocks'
import { getLiveSiteContent } from '@/lib/live-site-content'

async function App() {
  const liveContent = await getLiveSiteContent()

  return (
    <MarketingShell activePath="/about">
      <PageHero
        eyebrow="About Beat Drops"
        title="Regular music classes with a friendly, structured learning environment."
        description="Beat Drops Music Class helps students build confidence and consistency through guided practice and teacher support."
      />
      <AboutStory expanded />
      <StudentLove items={liveContent.testimonials} />
      <ContactPanel />
    </MarketingShell>
  )
}

export default App
