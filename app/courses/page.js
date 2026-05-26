import { MarketingShell } from '@/components/site/marketing-shell'
import { CourseGrid, PageHero, PromoBanners } from '@/components/site/section-blocks'
import { getLiveSiteContent } from '@/lib/live-site-content'

async function App() {
  const liveContent = await getLiveSiteContent()

  return (
    <MarketingShell activePath="/courses">
      <PageHero
        eyebrow="Courses"
        title="Choose your discipline."
        description="From Indian classical foundations to modern contemporary instruments - every course follows a structured 6-level curriculum, taught in small batches."
      />
      <CourseGrid expanded items={liveContent.courses} />
      <PromoBanners items={liveContent.banners} />
    </MarketingShell>
  )
}

export default App
