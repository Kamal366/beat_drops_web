import { MarketingShell } from '@/components/site/marketing-shell'
import { GalleryPreview, PageHero } from '@/components/site/section-blocks'
import { getLiveSiteContent } from '@/lib/live-site-content'

async function App() {
  const liveContent = await getLiveSiteContent()

  return (
    <MarketingShell activePath="/gallery">
      <PageHero eyebrow="Gallery" title="Inside the academy." description="Moments from class, recitals and festival performances." />
      <GalleryPreview expanded items={liveContent.galleryItems} />
    </MarketingShell>
  )
}

export default App
