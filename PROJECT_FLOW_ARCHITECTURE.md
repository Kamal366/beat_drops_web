# Beat Drops Web: Setup, Build, Run, and Architecture Guide

This document explains:

- how to install, build, and run the project
- what the application architecture looks like
- how the main request flows work
- how to understand this codebase as a Java developer

## 1. Project Type

This is a `Next.js 14` application using the `App Router`.

Core stack:

- `Next.js` for UI, routing, server rendering, and API endpoints
- `React` for components
- `Supabase` for:
  - authentication
  - PostgreSQL database
  - role-based access patterns
- `Zod` for request/form validation
- `react-hook-form` for client-side form handling

If you come from Java/Spring Boot, the closest mental model is:

- `app/.../page.js` = controller + view combined
- `app/api/.../route.js` = REST controller
- `middleware.js` = servlet filter / Spring security pre-handler
- `lib/supabase/*.js` = infrastructure/config/database client factory
- `supabase/schema.sql` = database schema migration baseline
- `components/site/*.js` = frontend feature modules

## 2. Install, Build, and Run

Commands used for this project:

```bash
npm install
npm run build
npm start
```

What each command does:

1. `npm install`
   Downloads and installs all dependencies from `package.json`.

2. `npm run build`
   Creates the production build in `.next/`.

3. `npm start`
   Starts the production server on port `3000`.

Verified result:

- dependency install completed successfully
- production build completed successfully
- app responded with `HTTP 200` on `http://localhost:3000`

Important note:

- The project has `output: 'standalone'` in [next.config.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/next.config.js:1)
- Because of that, Next.js warns that production is better started with:

```bash
node .next/standalone/server.js
```

So the more correct production command for deployment-style execution is:

```bash
npm install
npm run build
node .next/standalone/server.js
```

For local development, the package also provides:

```bash
npm run dev
```

## 3. Package Scripts

Defined in [package.json](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/package.json:1):

- `dev` = runs local Next dev server on `0.0.0.0:3000`
- `build` = production build
- `start` = production server

## 4. High-Level Architecture

The app has 4 major layers.

### 4.1 Presentation Layer

Files:

- `app/...`
- `components/site/...`
- `components/ui/...`

Responsibilities:

- render public marketing pages
- render login page
- render student dashboard
- render admin dashboard UI
- send API requests from browser to backend endpoints

### 4.2 Routing Layer

Files:

- [app/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/page.js:1)
- [app/about/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/about/page.js:1)
- [app/courses/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/courses/page.js:1)
- [app/gallery/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/gallery/page.js:1)
- [app/admission/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/admission/page.js:1)
- [app/login/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/login/page.js:1)
- [app/student/dashboard/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/student/dashboard/page.js:1)
- [app/admin/dashboard/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/admin/dashboard/page.js:1)

Responsibilities:

- map URL to page/component
- server-side load required data
- decide what to show for authenticated or unauthenticated users

### 4.3 API Layer

Primary file:

- [app/api/[[...path]]/route.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/api/[[...path]]/route.js:1)

This is a catch-all API controller.

Instead of having many small files like:

- `/api/admission`
- `/api/admin/leads`
- `/api/admin/students`

the project routes all of them through one file and parses the path manually.

Java equivalent:

- similar to one controller class with multiple request mappings and path parsing
- or a front controller that dispatches internally

### 4.4 Data and Auth Infrastructure

Files:

- [lib/supabase/env.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/supabase/env.js:1)
- [lib/supabase/browser.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/supabase/browser.js:1)
- [lib/supabase/server.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/supabase/server.js:1)
- [lib/supabase/service.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/supabase/service.js:1)
- [middleware.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/middleware.js:1)

Responsibilities:

- read environment variables
- create browser-side Supabase client
- create server-side cookie-aware Supabase client
- create service-role Supabase client for privileged database access
- enforce route protection

## 5. Request Flow Overview

There are 5 important flows in this application:

1. Public page rendering
2. Admission form submission
3. Google login flow
4. Student dashboard loading
5. Admin dashboard loading and CRUD operations

## 6. Flow 1: Public Marketing Pages

Examples:

- `/`
- `/about`
- `/courses`
- `/gallery`
- `/contact`

The home route starts at [app/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/page.js:1), which renders `HomePage`.

Dynamic content source:

- [lib/live-site-content.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/live-site-content.js:1)

Behavior:

1. If Supabase service credentials are available:
   - read live courses
   - read banners
   - read gallery images
   - read testimonials
2. If not available:
   - use fallback static content from [lib/site-data.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/site-data.js:1)

This is a graceful fallback design.

Java equivalent:

- similar to a service method that first tries database-backed content and then falls back to hardcoded defaults when configuration is incomplete

## 7. Flow 2: Admission Form Submission

Relevant files:

- [app/admission/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/admission/page.js:1)
- [components/site/admission-form.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/components/site/admission-form.js:1)
- [lib/admission-schema.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/admission-schema.js:1)
- [app/api/[[...path]]/route.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/api/[[...path]]/route.js:1)

### 7.1 Client-side flow

1. User opens `/admission`
2. Server renders page and injects available course options
3. `AdmissionForm` handles user input with `react-hook-form`
4. Validation uses `Zod` schema from `lib/admission-schema.js`
5. On submit, browser sends:

```http
POST /api/admission
Content-Type: application/json
```

### 7.2 Server-side flow

Inside `route.js`, `handleAdmissionSubmission()`:

1. reads JSON body
2. validates with `admissionLeadSchema.safeParse(...)`
3. checks whether `SUPABASE_SERVICE_ROLE_KEY` exists
4. if missing:
   - returns `503`
   - explains secure backend save is not active yet
5. if present:
   - inserts a row into `admission_leads`
6. returns success JSON

### 7.3 Database write target

Table:

- `public.admission_leads`

Important columns:

- `full_name`
- `parent_name`
- `age`
- `phone_number`
- `email`
- `interested_course`
- `preferred_branch`
- `preferred_class_timing`
- `prior_music_experience`
- `message`
- `status`
- `source`

### 7.4 Java analogy

This flow is very close to:

- DTO validation using Bean Validation
- controller receives request body
- service persists entity
- returns JSON response

Difference:

- validation is done with `Zod` instead of annotations like `@Valid`
- DB access is done through Supabase client instead of JPA repository

## 8. Flow 3: Google Login and Session Establishment

Relevant files:

- [app/login/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/login/page.js:1)
- [components/site/login-panel.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/components/site/login-panel.js:1)
- [app/auth/callback/route.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/auth/callback/route.js:1)
- [lib/supabase/browser.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/supabase/browser.js:1)
- [lib/supabase/server.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/supabase/server.js:1)

### 8.1 Browser login flow

`LoginPanel` creates a browser Supabase client and calls:

- `supabase.auth.signInWithOAuth(...)`

It passes a callback URL like:

```text
/auth/callback?next=/student/dashboard
```

or

```text
/auth/callback?next=/admin/dashboard
```

### 8.2 Callback flow

In [app/auth/callback/route.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/auth/callback/route.js:1):

1. read `code` from query params
2. create server Supabase client
3. call `exchangeCodeForSession(code)`
4. Supabase sets session cookies
5. redirect user to requested page

### 8.3 Automatic user row creation

In [supabase/schema.sql](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/supabase/schema.sql:1):

- trigger `on_auth_user_created`
- function `handle_new_auth_user()`

When a new auth user is created in Supabase Auth:

1. trigger runs
2. inserts or updates row in `public.users`
3. links `auth.users.id` to `public.users.auth_user_id`

This is important because the app uses `public.users` as the application user profile table.

### 8.4 Java analogy

Equivalent concepts:

- OAuth login initiation = Spring Security OAuth client redirect
- callback route = authentication success endpoint
- session cookies = security context persistence
- trigger-based user sync = DB-level user provisioning hook

## 9. Flow 4: Middleware Route Protection

File:

- [middleware.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/middleware.js:1)

Protected routes:

- `/student/dashboard`
- `/admin/dashboard`

Flow:

1. request hits middleware before page rendering
2. middleware creates Supabase server client using request cookies
3. it calls `supabase.auth.getUser()`
4. if route is protected and user is missing:
   - redirect to `/login?next=...`
5. else continue

Java equivalent:

- this is the nearest match to a security filter in Spring Security

Important detail:

- middleware only checks whether user is logged in
- admin role validation happens later inside the admin page/API logic

So there are 2 security levels:

1. authentication check in middleware
2. authorization check in admin page and admin API

## 10. Flow 5: Student Dashboard

Relevant file:

- [app/student/dashboard/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/student/dashboard/page.js:1)

Server-side loading flow:

1. create cookie-aware server Supabase client
2. call `supabase.auth.getUser()`
3. load matching row from `public.users`
4. create service-role client
5. load matching student from `public.students`
6. join branch and course details
7. load attendance from `public.attendance`
8. render student dashboard page

Matching logic:

- first by `user_id`
- fallback by `email`

That is useful during onboarding because a student record may exist before explicit user linking is complete.

Dashboard outputs:

- admission status
- enrolled course
- assigned branch
- present class count
- profile details
- attendance list

Java analogy:

- this behaves like a server-rendered MVC page which aggregates data from several tables before rendering

## 11. Flow 6: Admin Dashboard

Relevant files:

- [app/admin/dashboard/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/admin/dashboard/page.js:1)
- [components/site/admin-dashboard-client.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/components/site/admin-dashboard-client.js:1)
- [app/api/[[...path]]/route.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/api/[[...path]]/route.js:1)

### 11.1 Access validation

The admin page first checks:

1. public Supabase config exists
2. user is signed in
3. `users` table exists
4. signed-in user has role `admin`

If any of those fail, the page renders a guided error state instead of crashing.

### 11.2 Client-side admin behavior

`AdminDashboardClient` is a browser component that:

1. loads bootstrap data from:

```http
GET /api/admin/bootstrap
```

2. displays tabs for:
   - leads
   - students
   - attendance
   - gallery
   - banners
   - testimonials
3. sends CRUD requests to the backend

Examples:

- `PATCH /api/admin/leads/{id}`
- `POST /api/admin/students`
- `PATCH /api/admin/students/{id}`
- `DELETE /api/admin/students/{id}`
- `POST /api/admin/attendance`

### 11.3 Backend admin API flow

All admin requests go through `handleAdminEntity(...)`.

That method:

1. calls `requireAdmin(request)`
2. validates authenticated user
3. loads matching `users` row
4. checks role is `admin`
5. dispatches request by entity name in URL

Supported admin entities:

- `bootstrap`
- `leads`
- `students`
- `gallery`
- `banners`
- `testimonials`
- `attendance`

### 11.4 Bootstrap payload

`handleAdminBootstrap()` loads:

- all leads
- all students
- gallery items
- banners
- testimonials
- recent attendance
- summary metrics by branch and course

This is similar to an admin dashboard aggregation service in Java.

## 12. API Endpoint Map

Because API is centralized in one route file, the effective endpoints are:

### Public endpoints

- `POST /api/admission`

### Admin endpoints

- `GET /api/admin/bootstrap`
- `PATCH /api/admin/leads/:id`
- `DELETE /api/admin/leads/:id`
- `POST /api/admin/students`
- `PATCH /api/admin/students/:id`
- `DELETE /api/admin/students/:id`
- `POST /api/admin/gallery`
- `PATCH /api/admin/gallery/:id`
- `DELETE /api/admin/gallery/:id`
- `POST /api/admin/banners`
- `PATCH /api/admin/banners/:id`
- `DELETE /api/admin/banners/:id`
- `POST /api/admin/testimonials`
- `PATCH /api/admin/testimonials/:id`
- `DELETE /api/admin/testimonials/:id`
- `POST /api/admin/attendance`
- `PATCH /api/admin/attendance/:id`
- `DELETE /api/admin/attendance/:id`

### Student-facing private data endpoint logic

There is also server-side logic for student dashboard data access, though the dashboard page itself directly loads data server-side.

## 13. Database Architecture

Main schema file:

- [supabase/schema.sql](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/supabase/schema.sql:1)

Seed file:

- [supabase/seed.sql](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/supabase/seed.sql:1)

### 13.1 Main tables

`branches`

- academy branches
- address and contact info

`courses`

- available courses
- ordering and activation

`users`

- application user profile
- linked to `auth.users`
- stores `role`

`admission_leads`

- inquiry submissions from website

`students`

- enrolled learner records
- can link to lead and app user

`attendance`

- daily attendance by student

`gallery_images`

- public gallery content

`banners`

- homepage/marketing banner content

`testimonials`

- public feedback content

### 13.2 Relationship summary

- `students.user_id -> users.id`
- `students.lead_id -> admission_leads.id`
- `students.course_id -> courses.id`
- `students.branch_id -> branches.id`
- `attendance.student_id -> students.id`
- `attendance.marked_by -> users.id`
- `gallery_images.branch_id -> branches.id`
- `gallery_images.created_by -> users.id`

### 13.3 Security model

The schema enables Row Level Security on major tables.

Examples:

- public can insert admission leads
- authenticated users can read their own profile
- students can read their own student and attendance data
- admins can manage protected data

There is also a helper DB function:

- `public.is_admin()`

This checks whether the current authenticated user has admin role in `public.users`.

Java analogy:

- this is similar to moving part of authorization logic into the database layer

## 14. Supabase Client Strategy

The project uses 3 different Supabase clients for different trust levels.

### 14.1 Browser client

File:

- [lib/supabase/browser.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/supabase/browser.js:1)

Use case:

- login initiation in browser

Security level:

- low privilege
- uses public anon/publishable key

### 14.2 Server client

File:

- [lib/supabase/server.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/supabase/server.js:1)

Use case:

- reading current authenticated user from cookies during server rendering

Security level:

- authenticated user context

### 14.3 Service client

File:

- [lib/supabase/service.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/supabase/service.js:1)

Use case:

- privileged reads/writes for admin and server aggregation

Security level:

- highest privilege
- uses `SUPABASE_SERVICE_ROLE_KEY`

Java equivalent:

- this separation is like using different service accounts or datasource credentials for public, authenticated, and privileged operations

## 15. Environment Variables

Expected variables from README:

```env
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Meaning:

- `NEXT_PUBLIC_BASE_URL`
  Used for OAuth redirect callback construction.

- `NEXT_PUBLIC_SUPABASE_URL`
  Supabase project base URL.

- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  Public browser/server auth operations.

- `SUPABASE_SERVICE_ROLE_KEY`
  Secure server-only privileged access.

## 16. What Is Static vs Dynamic

Static/fallback content:

- branch details
- default course catalog
- default banners
- default testimonials

Dynamic/live content:

- admission leads
- users
- students
- attendance
- gallery images
- live banners
- live testimonials
- live course list

This means the app can still render a respectable marketing site before the full backend is activated.

## 17. Where to Start Reading as a Java Developer

Recommended order:

1. [package.json](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/package.json:1)
   Understand scripts and dependencies.

2. [app/layout.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/layout.js:1)
   Understand root HTML shell.

3. [middleware.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/middleware.js:1)
   Understand authentication guard.

4. [app/api/[[...path]]/route.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/api/[[...path]]/route.js:1)
   Understand backend flow and all CRUD endpoints.

5. [lib/supabase/*.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/supabase/env.js:1)
   Understand connection and auth strategy.

6. [supabase/schema.sql](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/supabase/schema.sql:1)
   Understand actual domain model.

7. [app/student/dashboard/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/student/dashboard/page.js:1)
   Understand authenticated page rendering.

8. [app/admin/dashboard/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/admin/dashboard/page.js:1)
   Understand role-based access flow.

9. [components/site/admin-dashboard-client.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/components/site/admin-dashboard-client.js:1)
   Understand browser-side admin CRUD interactions.

## 18. Architectural Strengths

- clear separation between public auth client and service-role client
- graceful fallback when Supabase is not fully configured
- middleware-based route guarding
- database schema already models real academy operations
- admin dashboard supports operational CRUD from one place
- server-rendered pages keep private dashboard data off unnecessary client round-trips

## 19. Architectural Tradeoffs / Weak Points

- one large catch-all API file can become hard to maintain as features grow
- service-role client is used heavily, so backend trust boundaries must stay server-only
- no formal service/repository layer abstraction; logic is mostly in route/page files
- admin dashboard component is large and likely needs future splitting
- because this is JavaScript, there is less compile-time safety than a typical Java backend

If this project grows, a good next refactor would be:

1. split API handlers by domain
2. introduce service modules
3. move DB access into domain-specific files
4. add automated tests around auth and admin flows

## 20. Spring Boot Mapping Table

| This project | Spring/Java equivalent |
|---|---|
| `app/.../page.js` | MVC controller + template/rendered view |
| `app/api/.../route.js` | `@RestController` |
| `middleware.js` | security filter / interceptor |
| `lib/supabase/*.js` | config + client factory beans |
| `lib/admission-schema.js` | DTO validation rules |
| `supabase/schema.sql` | Flyway/Liquibase baseline SQL |
| `public.users` | application user table |
| `auth.users` | external identity store |
| `AdminDashboardClient` | frontend admin console calling REST APIs |

## 21. Short End-to-End Story

The simplest complete business story is:

1. public user opens the marketing site
2. user submits admission form
3. form is validated and stored in `admission_leads`
4. admin logs in with Google
5. middleware allows dashboard access because session exists
6. admin API checks that the user role is really `admin`
7. admin converts a lead into a `student`
8. student later logs in with Google
9. app links auth identity with `users`
10. student dashboard loads profile, course, branch, and attendance

That is the core architecture in one business flow.

## 22. Current Practical Status

Already working:

- project install
- production build
- production server startup
- public website rendering
- route structure
- admission form flow
- auth scaffolding
- admin/student dashboard structure
- Supabase schema and seed setup

Requires correct environment and Supabase setup to be fully live:

- Google Sign-In end-to-end
- secure persistence through service role
- live dashboard data
- full storage/media workflow

## 23. File Created By This Step

This explanation was saved in:

- [PROJECT_FLOW_ARCHITECTURE.md](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/PROJECT_FLOW_ARCHITECTURE.md:1)

## 24. Sequence-Style Flow Diagrams

These are not UML-perfect, but they explain the runtime flow in a backend-friendly way.

### 24.1 Admission Inquiry Flow

```text
Browser
  -> GET /admission
Next.js Page
  -> getLiveSiteContent()
  -> render AdmissionForm

User submits form
  -> POST /api/admission

API route.js
  -> parse JSON
  -> validate with Zod schema
  -> check SUPABASE_SERVICE_ROLE_KEY
  -> create service Supabase client
  -> insert into admission_leads
  -> return success JSON

Browser
  -> show success alert
```

### 24.2 Google Login Flow

```text
Browser /login
  -> click "Continue as student" or "Continue as admin"
  -> createBrowserSupabaseClient()
  -> supabase.auth.signInWithOAuth(google)
  -> redirect to Google

Google
  -> authenticates user
  -> redirects to /auth/callback?code=...&next=/student/dashboard

Callback route
  -> createServerSupabaseClient()
  -> exchangeCodeForSession(code)
  -> session cookie established
  -> redirect to next path
```

### 24.3 Student Dashboard Flow

```text
Browser
  -> GET /student/dashboard

middleware.js
  -> read auth cookie
  -> get current user
  -> if missing, redirect /login

student/dashboard/page.js
  -> createServerSupabaseClient()
  -> get authenticated user
  -> load public.users row
  -> createServiceSupabaseClient()
  -> load students row
  -> load attendance rows
  -> render dashboard HTML

Browser
  -> receives fully rendered page
```

### 24.4 Admin Dashboard Flow

```text
Browser
  -> GET /admin/dashboard

middleware.js
  -> verify user is signed in

admin/dashboard/page.js
  -> get current user
  -> load users row
  -> verify role = admin
  -> render AdminDashboardClient

AdminDashboardClient
  -> GET /api/admin/bootstrap

route.js
  -> requireAdmin(request)
  -> create service Supabase client
  -> query leads, students, banners, gallery, testimonials, attendance
  -> return dashboard JSON

Browser
  -> render tabs/forms/cards
```

### 24.5 Lead Conversion Flow

```text
Admin UI
  -> click "Convert to student"
  -> prefill student form using lead data
  -> POST /api/admin/students

route.js
  -> requireAdmin(request)
  -> resolve linked user by email if present
  -> insert into students
  -> if lead_id exists, update admission_leads.status = admitted
  -> return success JSON

Admin UI
  -> refresh dashboard data
```

## 25. Layered Architecture View

If we redraw this as a Java application, the layers would look like this:

```text
+------------------------------------------------------+
| Presentation Layer                                   |
| app/*.js, app/**/page.js, components/site/*.js       |
+------------------------------------------------------+
| Web / Routing Layer                                  |
| Next.js App Router, route.js, auth callback          |
+------------------------------------------------------+
| Security Layer                                       |
| middleware.js, Supabase session cookies, role checks |
+------------------------------------------------------+
| Application Logic Layer                              |
| admission handler, admin bootstrap, student loading  |
+------------------------------------------------------+
| Data Access / Integration Layer                      |
| lib/supabase/browser.js, server.js, service.js       |
+------------------------------------------------------+
| Data Layer                                           |
| Supabase Auth + PostgreSQL tables                    |
+------------------------------------------------------+
```

### 25.1 Equivalent Java package structure

If you rewrote this in Spring Boot, it would probably look something like:

```text
com.beatdrops
  controller
    AdmissionController
    AdminController
    AuthController
    StudentController
  service
    AdmissionService
    AdminDashboardService
    StudentDashboardService
    AuthService
  repository
    LeadRepository
    StudentRepository
    UserRepository
    AttendanceRepository
  security
    JwtOrSessionFilter
    RoleGuard
  config
    SupabaseConfig
  dto
    AdmissionLeadRequest
    StudentRequest
    AttendanceRequest
  entity
    User
    Student
    AdmissionLead
    Attendance
    Branch
    Course
```

This project does not physically separate everything that way, but the responsibilities map closely.

## 26. Request Lifecycle: End-to-End Understanding

When an HTTP request comes into this app, think of the lifecycle like this:

### 26.1 For a page request

Example:

```text
GET /student/dashboard
```

Lifecycle:

1. request enters Next.js
2. `middleware.js` runs first for protected routes
3. authentication is checked using cookies
4. if allowed, the page file runs on the server
5. page loads data using Supabase clients
6. React generates HTML on the server
7. HTML is returned to browser
8. browser hydrates interactive components if needed

This is a mix of:

- server-side rendering
- client-side enhancement

### 26.2 For an API request

Example:

```text
POST /api/admin/attendance
```

Lifecycle:

1. browser sends JSON request
2. catch-all API route receives request
3. route parses logical path
4. route authenticates and authorizes if needed
5. route runs business logic
6. route uses service-role client for DB update
7. route returns JSON
8. browser refreshes UI state

That is similar to a standard REST API lifecycle in Java.

## 27. Authentication vs Authorization

This distinction is important.

### Authentication

Question:

- who is the current user?

Handled by:

- Supabase Auth
- session cookies
- `supabase.auth.getUser()`
- `middleware.js`

### Authorization

Question:

- what is this user allowed to do?

Handled by:

- `public.users.role`
- `requireAdmin(request)` in API route
- role checks inside admin page
- database Row Level Security policies

So:

- login alone is not enough for admin access
- user must exist and have `role = admin`

This is very similar to:

- Spring Security authentication + role-based authorization

## 28. Data Ownership and Responsibility

Understanding which layer owns what is useful.

### Browser owns

- user interactions
- form input state
- button clicks
- calling fetch APIs
- showing messages

### Next.js server page owns

- initial page rendering
- authenticated page data fetching
- deciding what HTML to send first

### API route owns

- mutation logic
- admin CRUD processing
- request/response format
- validation and authorization decisions

### Supabase owns

- authentication identity
- PostgreSQL persistence
- row-level security
- user-session token validation

## 29. Why Some Logic Is in Pages and Some in API

This is one of the biggest conceptual differences from a classic Java backend.

In Spring Boot, you would usually put all backend logic behind REST endpoints or controllers.

In Next.js App Router:

- page files can execute server-side code directly
- API files are mainly used for browser-triggered mutations or JSON endpoints

In this project:

- dashboard reads are often done directly in page files
- create/update/delete operations are done via API calls

So the architecture is:

- server-rendered reads
- API-driven writes

That is a valid and common Next.js pattern.

## 30. Where Business Logic Lives Today

The business logic is mostly concentrated in these places:

- [app/api/[[...path]]/route.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/api/[[...path]]/route.js:1)
- [app/student/dashboard/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/student/dashboard/page.js:1)
- [app/admin/dashboard/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/admin/dashboard/page.js:1)
- [lib/live-site-content.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/live-site-content.js:1)

If you think in Java terms:

- `route.js` is doing some controller work and some service work together
- page files are doing some controller work and some read-service work together

This is why the project feels flatter than a Spring Boot codebase.

## 31. Suggested Mental Model for Reading This Codebase

Use this translation while reading:

### Public marketing pages

- think "server-rendered MVC pages"

### Login flow

- think "OAuth login redirect + callback controller"

### Middleware

- think "security filter chain"

### Admin API

- think "REST controller with role guard"

### Supabase service client

- think "privileged repository access"

### SQL schema

- think "entity model + security rules"

If you use this mapping, the project becomes much easier to understand.

## 32. Practical Reading Walkthrough

If you want to study the flow in one sitting, follow this exact order:

1. Read [PROJECT_FLOW_ARCHITECTURE.md](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/PROJECT_FLOW_ARCHITECTURE.md:1)
2. Read [middleware.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/middleware.js:1)
3. Read [app/auth/callback/route.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/auth/callback/route.js:1)
4. Read [lib/supabase/server.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/supabase/server.js:1)
5. Read [lib/supabase/service.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/lib/supabase/service.js:1)
6. Read [app/api/[[...path]]/route.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/api/[[...path]]/route.js:1)
7. Read [supabase/schema.sql](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/supabase/schema.sql:1)
8. Read [app/student/dashboard/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/student/dashboard/page.js:1)
9. Read [app/admin/dashboard/page.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/app/admin/dashboard/page.js:1)
10. Read [components/site/admin-dashboard-client.js](/Users/Kamal/Library/CloudStorage/OneDrive-Nagarro/VS_CODE_AHB_PROJECT/beat_drops_web/components/site/admin-dashboard-client.js:1)

## 33. Final Conceptual Summary

The cleanest way to understand this project is:

- it is not a separate frontend and backend project
- Next.js is acting as both:
  - UI server
  - backend request handler
- Supabase is acting as both:
  - authentication provider
  - database platform

So the total system is:

```text
Browser
  -> Next.js pages/components
  -> Next.js middleware/API
  -> Supabase Auth + PostgreSQL
```

If you come from Java, the closest equivalent is:

- one application combining MVC + REST + security
- backed by PostgreSQL
- with an external auth provider tightly integrated

That is the core architecture of this flow.
