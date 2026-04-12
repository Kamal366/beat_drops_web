import { MarketingShell } from '@/components/site/marketing-shell'
import { CourseGrid, PageHero, PromoBanners } from '@/components/site/section-blocks'
import { getLiveSiteContent } from '@/lib/live-site-content'

async function App() {
  const liveContent = await getLiveSiteContent()

  return (
    <MarketingShell activePath="/courses">
      <PageHero
        eyebrow="Courses"
        title="Courses in vocals, instruments, and rhythm training."
        description="Explore practical class options for beginners, continuing learners, and students preparing for performances."
      />
      <CourseGrid expanded items={liveContent.courses} />
      <PromoBanners items={liveContent.banners} />
    </MarketingShell>
  )
}

export default App
