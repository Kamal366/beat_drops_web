import { MarketingShell } from '@/components/site/marketing-shell'
import { GalleryPreview, PageHero } from '@/components/site/section-blocks'
import { getLiveSiteContent } from '@/lib/live-site-content'

async function App() {
  const liveContent = await getLiveSiteContent()

  return (
    <MarketingShell activePath="/gallery">
      <PageHero eyebrow="Gallery" title="Photos from classes, events, and student activities." description="This page can be updated regularly to reflect the day-to-day life of the academy." />
      <GalleryPreview expanded items={liveContent.galleryItems} />
    </MarketingShell>
  )
}

export default App
