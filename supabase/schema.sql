create extension if not exists pgcrypto;

create table if not exists public.branches (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  address text not null,
  map_url text,
  phone text,
  whatsapp text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  slug text not null unique,
  description text,
  mode text,
  age_group text,
  display_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'student' check (role in ('admin', 'student')),
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admission_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  parent_name text not null,
  age int not null,
  phone_number text not null,
  email text not null,
  interested_course text not null,
  preferred_branch text not null,
  preferred_class_timing text not null,
  prior_music_experience text,
  message text,
  status text not null default 'new_lead' check (status in ('new_lead', 'contacted', 'trial_scheduled', 'admitted', 'inactive')),
  source text default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  lead_id uuid references public.admission_leads(id) on delete set null,
  full_name text not null,
  parent_name text,
  age int,
  phone_number text,
  email text,
  course_id uuid references public.courses(id) on delete set null,
  branch_id uuid references public.branches(id) on delete set null,
  class_timing text,
  admission_status text not null default 'admitted' check (admission_status in ('admitted', 'inactive', 'hold')),
  is_active boolean not null default true,
  joined_on date default current_date,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  attendance_date date not null,
  status text not null default 'present' check (status in ('present', 'absent', 'late')),
  notes text,
  marked_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (student_id, attendance_date)
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_path text not null,
  image_url text,
  branch_id uuid references public.branches(id) on delete set null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  subtitle text,
  image_path text,
  image_url text,
  cta_label text,
  cta_link text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  quote text not null unique,
  rating int check (rating between 1 and 5),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (auth_user_id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', new.email), 'student')
  on conflict (email) do update
    set auth_user_id = excluded.auth_user_id,
        full_name = excluded.full_name,
        updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.users
    where auth_user_id = auth.uid()
      and role = 'admin'
      and is_active = true
  );
$$;

alter table public.users enable row level security;
alter table public.admission_leads enable row level security;
alter table public.students enable row level security;
alter table public.attendance enable row level security;
alter table public.gallery_images enable row level security;
alter table public.banners enable row level security;
alter table public.testimonials enable row level security;

drop policy if exists "Public can create admission leads" on public.admission_leads;
create policy "Public can create admission leads"
  on public.admission_leads
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can read all admission leads" on public.admission_leads;
create policy "Admins can read all admission leads"
  on public.admission_leads
  for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Admins can update admission leads" on public.admission_leads;
create policy "Admins can update admission leads"
  on public.admission_leads
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile"
  on public.users
  for select
  to authenticated
  using (auth.uid() = auth_user_id or public.is_admin());

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
  on public.users
  for update
  to authenticated
  using (auth.uid() = auth_user_id or public.is_admin())
  with check (auth.uid() = auth_user_id or public.is_admin());

drop policy if exists "Students can read own student row" on public.students;
create policy "Students can read own student row"
  on public.students
  for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.users
      where public.users.id = students.user_id
        and public.users.auth_user_id = auth.uid()
    )
  );

drop policy if exists "Admins manage students" on public.students;
create policy "Admins manage students"
  on public.students
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Students can read own attendance" on public.attendance;
create policy "Students can read own attendance"
  on public.attendance
  for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.students
      join public.users on public.users.id = public.students.user_id
      where public.students.id = attendance.student_id
        and public.users.auth_user_id = auth.uid()
    )
  );

drop policy if exists "Admins manage attendance" on public.attendance;
create policy "Admins manage attendance"
  on public.attendance
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public can read testimonials" on public.testimonials;
create policy "Public can read testimonials"
  on public.testimonials
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Admins manage testimonials" on public.testimonials;
create policy "Admins manage testimonials"
  on public.testimonials
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public can read banners" on public.banners;
create policy "Public can read banners"
  on public.banners
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Admins manage banners" on public.banners;
create policy "Admins manage banners"
  on public.banners
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Public can read gallery images" on public.gallery_images;
create policy "Public can read gallery images"
  on public.gallery_images
  for select
  to anon, authenticated
  using (is_active = true);

drop policy if exists "Admins manage gallery images" on public.gallery_images;
create policy "Admins manage gallery images"
  on public.gallery_images
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
