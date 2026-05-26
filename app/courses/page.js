import { MarketingShell } from '@/components/site/marketing-shell'
import { CourseGrid, PromoBanners } from '@/components/site/section-blocks'
import { getLiveSiteContent } from '@/lib/live-site-content'

async function App() {
  const liveContent = await getLiveSiteContent()

  return (
    <MarketingShell activePath="/courses">
      <CourseGrid expanded items={liveContent.courses} />
      <PromoBanners items={liveContent.banners} />
    </MarketingShell>
  )
}

export default App
