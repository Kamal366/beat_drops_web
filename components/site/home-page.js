import { MarketingShell } from '@/components/site/marketing-shell'
import {
  AboutStory,
  BranchGrid,
  ContactPanel,
  CourseGrid,
  GalleryPreview,
  HeroSection,
  PromoBanners,
} from '@/components/site/section-blocks'
import { getLiveSiteContent } from '@/lib/live-site-content'

export default async function HomePage() {
  const liveContent = await getLiveSiteContent()

  return (
    <MarketingShell activePath="/">
      <HeroSection />
      <CourseGrid items={liveContent.courses} />
      <AboutStory />
      <BranchGrid />
      <PromoBanners items={liveContent.banners} />
      <GalleryPreview items={liveContent.galleryItems} />
      <ContactPanel />
    </MarketingShell>
  )
}
