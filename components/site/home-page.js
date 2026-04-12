import { MarketingShell } from '@/components/site/marketing-shell'
import {
  AboutStory,
  BranchGrid,
  ContactPanel,
  CourseGrid,
  HeroSection,
  TrustStrip,
} from '@/components/site/section-blocks'
import { getLiveSiteContent } from '@/lib/live-site-content'

export default async function HomePage() {
  const liveContent = await getLiveSiteContent()

  return (
    <MarketingShell activePath="/">
      <HeroSection />
      <TrustStrip />
      <AboutStory />
      <CourseGrid items={liveContent.courses} />
      <BranchGrid />
      <ContactPanel />
    </MarketingShell>
  )
}
