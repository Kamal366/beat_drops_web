import { MarketingShell } from '@/components/site/marketing-shell'
import { GalleryPreview, PageHero, PromoBanners } from '@/components/site/section-blocks'

function App() {
  return (
    <MarketingShell activePath="/gallery">
      <PageHero
        eyebrow="Gallery"
        title="A vibrant showcase area ready for class moments, recitals, and promotions."
        description="The gallery module is designed for Supabase image storage so the academy can manage photos and ad banners from the admin dashboard."
      />
      <GalleryPreview expanded />
      <PromoBanners />
    </MarketingShell>
  )
}

export default App
