import { MarketingShell } from '@/components/site/marketing-shell'
import { GalleryPreview, PageHero, PromoBanners } from '@/components/site/section-blocks'
import { getLiveSiteContent } from '@/lib/live-site-content'

async function App() {
  const liveContent = await getLiveSiteContent()

  return (
    <MarketingShell activePath="/gallery">
      <PageHero
        eyebrow="Gallery"
        title="A quiet, premium showcase for class moments, recitals, and studio culture."
        description="The gallery module reads live media managed from the admin dashboard so Beat Drops can keep the website fresh and elegant."
      />
      <GalleryPreview expanded items={liveContent.galleryItems} />
      <PromoBanners items={liveContent.banners} />
    </MarketingShell>
  )
}

export default App
