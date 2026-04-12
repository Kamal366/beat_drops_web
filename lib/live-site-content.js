import { unstable_noStore as noStore } from 'next/cache'
import { createServiceSupabaseClient } from '@/lib/supabase/service'
import { hasSupabaseServiceEnv } from '@/lib/supabase/env'
import { banners as fallbackBanners, courses as fallbackCourses, galleryHighlights, testimonials as fallbackTestimonials } from '@/lib/site-data'

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
            slug: item.slug,
            title: item.title,
            mode: item.mode || 'One-to-one / Group',
            ages: item.age_group || 'All age groups',
            duration: 'Batch schedule shared during enquiry',
            description: item.description || 'Course details will be shared by the academy.',
            highlights: [item.mode || 'Flexible format', item.age_group || 'All age groups', 'Guided training'],
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
            caption: 'Live gallery image managed from the admin dashboard.',
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
