insert into public.branches (name, slug, address, map_url, phone, whatsapp)
values
  (
    'Sailashree Vihar Branch',
    'sailashree-vihar',
    'Saswat Vihar, Plot 30, Sailashree Vihar, Patia, Bhubaneswar, Odisha 751021, India',
    'https://share.google/2X03rDa9ajdUiapKK',
    '+91 97768 15715',
    'https://wa.me/919776815715'
  ),
  (
    'Gothapatna Branch',
    'gothapatna',
    'Acropolis Apartment, B-202, Gothapatna, Bhubaneswar, Odisha 751003, India',
    'https://share.google/FVkgH5VhdrbfTsKcv',
    '+91 97768 15715',
    'https://wa.me/919776815715'
  )
on conflict (slug) do nothing;

insert into public.courses (title, slug, description, mode, age_group, display_order)
values
  ('Hindustani Vocal', 'hindustani-vocal', 'Voice culture, swara control, raga learning, and performance growth.', 'One-to-one / Group', '8 years to adult', 1),
  ('Light Vocal & Performance', 'light-vocal-performance', 'Melody, microphone confidence, and expressive singing.', 'One-to-one / Group', '10 years to adult', 2),
  ('Keyboard & Piano Foundations', 'keyboard-piano-foundations', 'Keyboard coordination, reading basics, and accompaniment skills.', 'One-to-one', '6 years to adult', 3),
  ('Guitar Essentials', 'guitar-essentials', 'Chords, strumming, songs, and live readiness.', 'One-to-one / Group', '9 years to adult', 4),
  ('Tabla & Rhythm Training', 'tabla-rhythm-training', 'Taal clarity, rhythm control, and accompaniment practice.', 'One-to-one / Group', '8 years to adult', 5),
  ('Kids Music Foundation', 'kids-music-foundation', 'A playful entry path into rhythm, listening, and confidence.', 'Small group', '4 to 8 years', 6)
on conflict (slug) do nothing;

insert into public.banners (title, subtitle, cta_label, cta_link, sort_order)
values
  ('Admissions Open', 'New weekday and weekend batches available in both branches.', 'Apply now', '/admission', 1),
  ('Student Login Ready', 'Google Sign-In dashboard for admitted learners.', 'Student login', '/login', 2),
  ('Admin Media Management', 'Gallery and promotional banner slots are prepared for Supabase storage.', 'Admin dashboard', '/admin/dashboard', 3)
on conflict do nothing;

insert into public.testimonials (name, role, quote, rating)
values
  ('Parents & learners', 'Community feedback theme', 'Beat Drops blends structured teaching with an encouraging environment that makes students want to keep improving.', 5),
  ('Young performers', 'Student journey theme', 'The academy experience focuses on regular practice, confidence, and personal attention.', 5),
  ('Busy adults', 'Flexible learning theme', 'Batch flexibility and a premium learning vibe make it easy to continue music seriously.', 5)
on conflict do nothing;

-- Run this after the first Google login by the owner email:
-- update public.users set role = 'admin' where email = 'beatdrops2022@gamil.com';
