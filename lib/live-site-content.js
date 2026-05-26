import { unstable_noStore as noStore } from 'next/cache'
import { createServiceSupabaseClient } from '@/lib/supabase/service'
import { hasSupabaseServiceEnv } from '@/lib/supabase/env'
import { banners as fallbackBanners, courses as fallbackCourses, galleryHighlights, testimonials as fallbackTestimonials } from '@/lib/site-data'

const fallbackCoursesBySlug = new Map(fallbackCourses.map((course) => [course.slug, course]))

export async function getLiveSiteContent() {
  noStore()

  if (!hasSupabaseServiceEnv()) {
    return {
      courses: fallbackCourses,
      banners: fallbackBanners,
      galleryItems: galleryHighlights,
      testimonials: fallbackTestimonials,
    }
  }

  const supabase = createServiceSupabaseClient()

  const [courseResponse, bannerResponse, galleryResponse, testimonialResponse] = await Promise.all([
    supabase
      .from('courses')
      .select('title, slug, description, mode, age_group, display_order')
      .eq('is_active', true)
      .order('display_order', { ascending: true }),
    supabase.from('banners').select('title, subtitle, image_url, cta_label, cta_link, sort_order').eq('is_active', true).order('sort_order', { ascending: true }),
    supabase.from('gallery_images').select('title, image_url, sort_order').eq('is_active', true).order('sort_order', { ascending: true }),
    supabase.from('testimonials').select('name, role, quote, rating').eq('is_active', true).order('created_at', { ascending: false }),
  ])

  return {
    courses:
      courseResponse.data?.length
        ? courseResponse.data.map((item) => ({
            ...fallbackCoursesBySlug.get(item.slug),
            slug: item.slug,
            title: fallbackCoursesBySlug.get(item.slug)?.title || item.title,
            mode: fallbackCoursesBySlug.get(item.slug)?.mode || item.mode || 'One-to-one / Group',
            ages: fallbackCoursesBySlug.get(item.slug)?.ages || item.age_group || 'All age groups',
            duration: fallbackCoursesBySlug.get(item.slug)?.duration || 'Batch schedule shared during enquiry',
            description: fallbackCoursesBySlug.get(item.slug)?.description || item.description || 'Course details will be shared by the academy.',
            highlights:
              fallbackCoursesBySlug.get(item.slug)?.highlights || [item.mode || 'Flexible format', item.age_group || 'All age groups', 'Guided training'],
          }))
        : fallbackCourses,
    banners:
      bannerResponse.data?.length
        ? bannerResponse.data.map((item) => ({
            title: item.title,
            subtitle: item.subtitle,
            image_url: item.image_url,
            cta_label: item.cta_label,
            cta_link: item.cta_link,
          }))
        : fallbackBanners,
    galleryItems:
      galleryResponse.data?.length
        ? galleryResponse.data.map((item, index) => ({
            title: item.title || `Beat Drops Moment ${index + 1}`,
            caption: 'Live gallery.',
            image_url: item.image_url,
          }))
        : galleryHighlights,
    testimonials:
      testimonialResponse.data?.length
        ? testimonialResponse.data.map((item) => ({
            name: item.name,
            role: item.role,
            quote: item.quote,
            rating: item.rating,
          }))
        : fallbackTestimonials,
  }
}
