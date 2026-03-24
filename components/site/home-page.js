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

export default function HomePage() {
  return (
    <MarketingShell activePath="/">
      <HeroSection />
      <AboutStory />
      <CourseGrid />
      <BranchGrid />
      <GalleryPreview />
      <PromoBanners />
      <StudentLove />
      <ContactPanel />
    </MarketingShell>
  )
}
