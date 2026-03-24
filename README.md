# Beat Drops Music Class MVP

A premium, mobile-first Next.js app for Beat Drops Music Class in Bhubaneswar with:
- public marketing website
- admission inquiry form
- Google login foundation for student/admin access
- Supabase-ready schema, seed data, and route protection structure

## Current implementation status

### Done now
- Beautiful public website pages:
  - `/`
  - `/about`
  - `/courses`
  - `/gallery`
  - `/admission`
  - `/contact`
  - `/login`
  - `/student/dashboard`
  - `/admin/dashboard`
- Public admission inquiry form with validation
- API route scaffold at `/api`
- Supabase-ready SQL schema and seed data in `/supabase`
- Middleware-based route protection for private dashboard routes
- Google OAuth callback route scaffold
- Vercel-ready env example

### Waiting for final Supabase activation
These flows are coded but require the remaining credential/config setup to work live:
- saving admission form directly into Supabase
- admin live dashboard summaries and lead management
- full Google Sign-In session flow
- gallery/banner storage upload management

## Environment variables needed

Create `.env.local` or set these in Vercel:

```env
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://pvpbnmslpkbiahvzkgps.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
# or use publishable key if your Supabase project uses it
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Supabase setup

### 1. Run schema
Open Supabase SQL Editor and run:
- `supabase/schema.sql`
- `supabase/seed.sql`

### 2. Google Auth
Inside Supabase:
- Authentication → Providers → Google
- enable Google provider
- add Google Client ID + Client Secret
- set redirect URLs for:
  - `http://localhost:3000/**`
  - your Vercel preview URL
  - your production domain

### 3. Promote the first admin
After `beatdrops2022@gamil.com` logs in once with Google, run:

```sql
update public.users set role = 'admin' where email = 'beatdrops2022@gamil.com';
```

### 4. Storage buckets
Create public buckets:
- `gallery`
- `banners`

Then add storage policies for authenticated admin uploads.

## Local development

```bash
yarn install
```

The app already runs under supervisor in this environment.

## Notes
- Admission form submits to `/api/admission`
- If `SUPABASE_SERVICE_ROLE_KEY` is missing, the API returns a helpful setup error instead of silently failing
- The code supports either:
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Suggested next enhancement
Once the remaining Supabase key is added, the next best step is:
1. live admin CRUD for leads/students/media
2. Supabase storage upload UI for gallery and banners
3. final branding assets and real testimonials
