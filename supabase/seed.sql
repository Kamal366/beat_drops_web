insert into public.branches (name, slug, address, map_url, phone, whatsapp)
values
  (
    'Sailashree Vihar Branch',
    'sailashree-vihar',
    'Saswat Vihar, Plot 30, Sailashree Vihar, Patia, Bhubaneswar, Odisha 751021, India',
    'https://share.google/LcP3OTrMPt39hqVHx',
    '+91 9439395040',
    'https://wa.me/919439395040'
  ),
  (
    'Gothapatna Branch',
    'gothapatna',
    'Acropolis Apartment, B-202, Gothapatna, Bhubaneswar, Odisha 751003, India',
    'https://share.google/zD7h4vyygHiHiPxEn',
    '+91 9439395040',
    'https://wa.me/919439395040'
  )
on conflict (slug) do update
set
  name = excluded.name,
  address = excluded.address,
  map_url = excluded.map_url,
  phone = excluded.phone,
  whatsapp = excluded.whatsapp;

insert into public.courses (title, slug, description, mode, age_group, display_order)
values
  ('Hindustani Vocal', 'hindustani-vocal', 'Voice culture, swara control, raga learning and performance growth.', 'One-to-one / Group', 'Ages 8+', 1),
  ('Light Vocal & Performance', 'light-vocal-performance', 'Melody, microphone confidence and expressive singing for stage-ready students.', 'One-to-one / Group', 'Ages 10+', 2),
  ('Keyboard & Piano Foundations', 'keyboard-piano-foundations', 'Keyboard coordination, reading basics and accompaniment skills from scratch.', 'One-to-one', 'Ages 6+', 3),
  ('Guitar Essentials 1', 'guitar-essentials', 'Chords, strumming, songs and live-performance readiness - acoustic & electric.', 'One-to-one / Group', 'Ages 9+', 4),
  ('Tabla & Rhythm Training', 'tabla-rhythm-training', 'Taal clarity, rhythm control and accompaniment practice across gharanas.', 'One-to-one / Group', 'Ages 8+', 5),
  ('Kids Music Foundation', 'kids-music-foundation', 'A playful entry path into rhythm, listening and confidence. Perfect first step.', 'Small group', 'Ages 4-8', 6)
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  mode = excluded.mode,
  age_group = excluded.age_group,
  display_order = excluded.display_order;

insert into public.banners (title, subtitle, cta_label, cta_link, sort_order)
values
  ('Beginner Tabla - May 2026', 'Weekday evenings • 12 seats • Saheed Nagar Centre', 'Reserve a seat', '/admission', 1),
  ('Open Demo Saturday', 'Try any course free this Saturday • 4 PM onwards • Patia Studio', 'Book your slot', '/admission', 2),
  ('Annual Recital - Swaranjali', 'Student showcase • 14 June 2026 • Rabindra Mandap', 'Get invite', '/admission', 3)
on conflict (title) do update
set
  subtitle = excluded.subtitle,
  cta_label = excluded.cta_label,
  cta_link = excluded.cta_link,
  sort_order = excluded.sort_order;

insert into public.testimonials (name, role, quote, rating)
values
  ('Parents & learners', 'Community feedback theme', 'Beat Drops blends structured teaching with an encouraging environment that makes students want to keep improving.', 5),
  ('Young performers', 'Student journey theme', 'The academy experience focuses on regular practice, confidence, and personal attention.', 5),
  ('Busy adults', 'Flexible learning theme', 'Batch flexibility and a premium learning vibe make it easy to continue music seriously.', 5)
on conflict (quote) do nothing;

insert into public.users (email, full_name, role, is_active)
values ('beatdrops2022@gmail.com', 'Beat Drops Admin', 'admin', true)
on conflict (email) do update set role = 'admin', is_active = true;

-- After the first Google login, auth_user_id will be linked automatically by the trigger because the email already exists.

-- Run this after the first Google login by the owner email:
-- update public.users set role = 'admin' where email = 'beatdrops2022@gmail.com';
