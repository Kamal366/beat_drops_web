import { MarketingShell } from '@/components/site/marketing-shell'
import { CourseGrid, PageHero, PromoBanners } from '@/components/site/section-blocks'

function App() {
  return (
    <MarketingShell activePath="/courses">
      <PageHero
        eyebrow="Courses"
        title="Flexible programs for vocals, instruments, stage confidence, and long-term growth."
        description="Explore carefully designed programs for beginners and advancing learners with one-to-one and group class options."
      />
      <CourseGrid expanded />
      <PromoBanners />
    </MarketingShell>
  )
}

export default App
