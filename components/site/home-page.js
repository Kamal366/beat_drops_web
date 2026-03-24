import { MarketingShell } from '@/components/site/marketing-shell'
import {
  AboutStory,
  BranchGrid,
  ContactPanel,
  CourseGrid,
  GalleryPreview,
  HeroSection,
  PromoBanners,
  StudentLove,
} from '@/components/site/section-blocks'
import { getLiveSiteContent } from '@/lib/live-site-content'

export default async function HomePage() {
  const liveContent = await getLiveSiteContent()

  return (
    <MarketingShell activePath="/">
      <HeroSection />
      <AboutStory />
      <CourseGrid />
      <BranchGrid />
      <GalleryPreview items={liveContent.galleryItems} />
      <PromoBanners items={liveContent.banners} />
      <StudentLove items={liveContent.testimonials} />
      <ContactPanel />
    </MarketingShell>
  )
}
