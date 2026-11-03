-- Riwaqul Ilm — Supabase (Postgres) schema
-- Run this in Supabase → SQL Editor → New query → Run.

-- 1. Profiles: one row per student, linked to Supabase Auth ---------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  goal text,
  role text not null default 'student' check (role in ('student','instructor','admin')),
  created_at timestamptz not null default now()
);

-- Create a profile automatically whenever someone signs up
create function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone, goal)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
          new.raw_user_meta_data->>'phone',
          new.raw_user_meta_data->>'goal');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. Courses & lessons (content you manage) -------------------------------
create table public.courses (
  id text primary key,                -- e.g. 'c1'
  slug text unique not null,
  title text not null,
  arabic_title text,
  level text check (level in ('Beginner','Intermediate','Advanced')),
  price_ngn integer not null default 0,
  published boolean not null default true
);
create table public.lessons (
  id text primary key,                -- e.g. 'c1-m1-l1'
  course_id text not null references public.courses(id) on delete cascade,
  module_title text,
  title text not null,
  minutes integer,
  kind text check (kind in ('v','p','q')) default 'v',
  video_url text,                     -- YouTube/Vimeo/Bunny embed URL
  file_path text,                     -- Supabase Storage path for PDFs
  position integer not null default 0
);
create table public.sessions (        -- weekly live classes (WAT)
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  weekday smallint not null check (weekday between 0 and 6),
  start_time time not null,           -- Africa/Lagos
  minutes integer not null default 60,
  topic text,
  join_url text
);
create table public.quizzes (
  id text primary key,
  course_id text not null references public.courses(id) on delete cascade,
  title text not null,
  pass_mark integer not null default 70,
  questions jsonb not null            -- same shape as src/data/quizzes.js
);

-- 3. Student activity -----------------------------------------------------
create table public.enrollments (
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null references public.courses(id) on delete cascade,
  status text not null default 'active' check (status in ('pending','active','completed','cancelled')),
  created_at timestamptz not null default now(),
  primary key (user_id, course_id)
);
create table public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id text not null references public.quizzes(id) on delete cascade,
  score integer not null,
  total integer not null,
  created_at timestamptz not null default now()
);
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id text references public.courses(id),
  amount_ngn integer not null,
  provider text default 'paystack',
  reference text unique,              -- Paystack transaction reference
  status text not null default 'pending' check (status in ('pending','success','failed')),
  created_at timestamptz not null default now()
);
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id text not null references public.courses(id),
  code text unique not null,          -- shown on the certificate, used for verification
  issued_at timestamptz not null default now(),
  unique (user_id, course_id)
);

-- 4. Row Level Security: students only ever see their own rows ------------
alter table public.profiles        enable row level security;
alter table public.enrollments     enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quiz_attempts   enable row level security;
alter table public.payments        enable row level security;
alter table public.certificates    enable row level security;
alter table public.courses         enable row level security;
alter table public.lessons         enable row level security;
alter table public.sessions        enable row level security;
alter table public.quizzes         enable row level security;

create policy "own profile read"   on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id);

create policy "own enrollments read"   on public.enrollments for select using (auth.uid() = user_id);
create policy "own enrollments insert" on public.enrollments for insert with check (auth.uid() = user_id);

create policy "own progress all" on public.lesson_progress for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own attempts read"   on public.quiz_attempts for select using (auth.uid() = user_id);
create policy "own attempts insert" on public.quiz_attempts for insert with check (auth.uid() = user_id);
create policy "own payments read"   on public.payments for select using (auth.uid() = user_id);
create policy "own certificates read" on public.certificates for select using (auth.uid() = user_id);

-- Catalogue content is readable by everyone signed in or not
create policy "courses public read"  on public.courses  for select using (published);
create policy "lessons read if enrolled" on public.lessons for select using (
  exists (select 1 from public.enrollments e where e.user_id = auth.uid() and e.course_id = lessons.course_id and e.status = 'active'));
create policy "sessions read if enrolled" on public.sessions for select using (
  exists (select 1 from public.enrollments e where e.user_id = auth.uid() and e.course_id = sessions.course_id and e.status = 'active'));
create policy "quizzes read if enrolled" on public.quizzes for select using (
  exists (select 1 from public.enrollments e where e.user_id = auth.uid() and e.course_id = quizzes.course_id and e.status = 'active'));

-- NOTE: payments and certificates are written ONLY by trusted server code
-- (Paystack webhook / Edge Function using the service-role key), never from the browser.
