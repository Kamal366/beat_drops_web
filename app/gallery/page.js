import { MarketingShell } from '@/components/site/marketing-shell'
import { GalleryPreview } from '@/components/site/section-blocks'
import { getLiveSiteContent } from '@/lib/live-site-content'

async function App() {
  const liveContent = await getLiveSiteContent()

  return (
    <MarketingShell activePath="/gallery">
      <GalleryPreview expanded items={liveContent.galleryItems} />
    </MarketingShell>
  )
}

export default App
