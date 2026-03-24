import { MarketingShell } from '@/components/site/marketing-shell'
import { AboutStory, ContactPanel, PageHero, StudentLove } from '@/components/site/section-blocks'

function App() {
  return (
    <MarketingShell activePath="/about">
      <PageHero
        eyebrow="About Beat Drops"
        title="Where disciplined training meets a joyful performance culture."
        description="Beat Drops Music Class helps kids, teens, college students, and adults build confidence through structured musical learning in Bhubaneswar."
      />
      <AboutStory expanded />
      <StudentLove />
      <ContactPanel />
    </MarketingShell>
  )
}

export default App
