import { createServiceSupabaseClient } from '@/lib/supabase/service'
import { hasSupabaseServiceEnv } from '@/lib/supabase/env'
import { banners as fallbackBanners, galleryHighlights, testimonials as fallbackTestimonials } from '@/lib/site-data'

export async function getLiveSiteContent() {
  if (!hasSupabaseServiceEnv()) {
    return {
      banners: fallbackBanners,
      galleryItems: galleryHighlights,
      testimonials: fallbackTestimonials,
    }
  }

  const supabase = createServiceSupabaseClient()

  const [bannerResponse, galleryResponse, testimonialResponse] = await Promise.all([
    supabase.from('banners').select('title, subtitle, image_url, cta_label, cta_link, sort_order').eq('is_active', true).order('sort_order', { ascending: true }),
    supabase.from('gallery_images').select('title, image_url, sort_order').eq('is_active', true).order('sort_order', { ascending: true }),
    supabase.from('testimonials').select('name, role, quote, rating').eq('is_active', true).order('created_at', { ascending: false }),
  ])

  return {
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
