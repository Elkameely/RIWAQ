# Riwaqul Ilm — Going live

The frontend runs today with no server (it stores data in the browser). This guide connects the four real services, in the order that keeps risk lowest.

| Step | Service | Free tier? | Time |
|---|---|---|---|
| 0 | Run it locally, edit your details | — | 10 min |
| 1 | Hosting: Vercel | Yes | 10 min |
| 2 | Database and Auth: Supabase | Yes | 45 min |
| 3 | Payments: Paystack | Pay per transaction | 60 min |
| 4 | Video, files, WhatsApp, email | Mostly | 30 min |

Why this stack: Supabase gives you Postgres, login, file storage and row-level security in one place. Paystack works with Nigerian cards and bank transfers. Vercel deploys straight from GitHub.

---

## Step 0 — Run it and make it yours

```bash
npm install
npm run dev        # opens http://localhost:5173
```

Open `src/data/site.js` and replace everything marked `EDIT`: WhatsApp number (digits only, e.g. `2348012345678`), email, instructor name and bio, meeting link, testimonials. Course content lives in `src/data/courses.js`, timetable in `src/data/schedule.js`, quizzes in `src/data/quizzes.js`.

Before launch, delete `demoLogin` in `src/lib/api.js` and the demo button in `src/pages/Public.jsx`.

---

## Step 1 — Host it on Vercel (do this first)

1. Create a free account at **github.com** and push this folder to a new repository.
2. Create a free account at **vercel.com**, choose **Add New → Project**, import the repository.
3. Framework preset: **Vite**. Build command `npm run build`, output `dist`. Deploy.
4. Your site is live at `something.vercel.app`.
5. **Custom domain:** buy a domain (for example `riwaqulilm.com`) from Namecheap or Qservers. In Vercel → Project → Settings → Domains, add it and copy the DNS records Vercel shows into your registrar.

The app uses `HashRouter`, so links work with no server config. If you want clean URLs (`/courses` rather than `/#/courses`), change `HashRouter` to `BrowserRouter` in `src/App.jsx` and add `vercel.json`:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```

---

## Step 2 — Database and login with Supabase

### 2.1 Create the project
1. Sign up at **supabase.com** → **New project**. Pick the region closest to your students (Europe West or South Africa).
2. Save the database password somewhere safe.
3. **SQL Editor → New query**, paste all of `docs/schema.sql`, press **Run**. This creates every table and the security rules (students can only read and write their own rows).

### 2.2 Add the keys to the app
In Supabase → **Project Settings → API**, copy the **Project URL** and the **anon public key**. Create `.env.local`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Never put the `service_role` key in the frontend. In Vercel, add the same two variables under Settings → Environment Variables.

```bash
npm install @supabase/supabase-js
```

Create `src/lib/supabase.js`:

```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
```

### 2.3 Swap the data layer
All data access goes through `src/lib/api.js`. Every function has a `// SUPABASE:` comment showing the replacement. Example for sign-up, sign-in and enrolment:

```js
import { supabase } from './supabase'

export async function signUp({ name, email, password, phone, goal }) {
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name: name, phone, goal } },   // the trigger copies this into `profiles`
  })
  if (error) throw error
  return { id: data.user.id, name, email, phone, goal }
}

export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error('Email or password is not correct. Check them and try again.')
  return getProfile(data.user.id)
}

export const signOut = () => supabase.auth.signOut()

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session ? getProfile(data.session.user.id) : null
}

async function getProfile(id) {
  const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
  return { id, name: data.full_name, email: (await supabase.auth.getUser()).data.user.email, phone: data.phone, goal: data.goal }
}

export async function getData(userId) {
  const [en, lp, qa, pay] = await Promise.all([
    supabase.from('enrollments').select('course_id').eq('user_id', userId),
    supabase.from('lesson_progress').select('lesson_id, completed_at').eq('user_id', userId),
    supabase.from('quiz_attempts').select('*').eq('user_id', userId).order('created_at'),
    supabase.from('payments').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
  ])
  return {
    enrolled: en.data.map((r) => r.course_id),
    done: Object.fromEntries(lp.data.map((r) => [r.lesson_id, r.completed_at])),
    attempts: qa.data.map((r) => ({ id: r.id, quizId: r.quiz_id, score: r.score, total: r.total, date: r.created_at })),
    payments: pay.data.map((r) => ({ id: r.id, label: r.course_id, amount: r.amount_ngn, date: r.created_at, status: r.status })),
    activity: [],
  }
}

export async function enroll(userId, courseId) {
  await supabase.from('enrollments').upsert({ user_id: userId, course_id: courseId })
  return getData(userId)
}
export async function toggleLesson(userId, lessonId) {
  const { data } = await supabase.from('lesson_progress').select('lesson_id').eq('user_id', userId).eq('lesson_id', lessonId)
  if (data.length) await supabase.from('lesson_progress').delete().eq('user_id', userId).eq('lesson_id', lessonId)
  else await supabase.from('lesson_progress').insert({ user_id: userId, lesson_id: lessonId })
  return getData(userId)
}
export async function saveAttempt(userId, a) {
  await supabase.from('quiz_attempts').insert({ user_id: userId, quiz_id: a.quizId, score: a.score, total: a.total })
  return getData(userId)
}
```

(`updateProfile` is a one-line `supabase.from('profiles').update(...)`.) Because the rest of the app only calls these functions, no page needs to change.

### 2.4 Load your course content
Courses, lessons, sessions and quizzes are static files today and that is fine to start with. When you want to edit them without redeploying, insert them into the `courses`, `lessons`, `sessions` and `quizzes` tables (Table Editor → Import CSV) and read them with `supabase.from('courses').select('*')`.

### 2.5 Auth settings
Supabase → **Authentication**:
- **Providers → Email**: keep on. Decide whether to require email confirmation (recommended for production).
- **URL Configuration**: set **Site URL** to your live domain and add `http://localhost:5173` under Redirect URLs.
- **Email templates**: change the sender name to Riwaqul Ilm. For reliable delivery in production, add a custom SMTP provider (Resend or Brevo both have free tiers).
- Optional: add **Google** sign-in under Providers (Supabase walks you through the Google Cloud steps).

### 2.6 Make yourself the admin
After you register on the live site, run in the SQL editor:

```sql
update public.profiles set role = 'admin' where id = (select id from auth.users where email = 'you@example.com');
```

---

## Step 3 — Payments with Paystack

Paystack supports Nigerian cards, bank transfer and USSD. **The browser must never decide that a payment succeeded.** The flow is:

1. Student clicks **Pay** → the browser opens Paystack's checkout popup.
2. Paystack tells **your server** (a webhook) that the payment succeeded.
3. Your server marks the payment successful and activates the enrolment.

### 3.1 Set up the account
1. Register at **paystack.com** and complete business verification (needed to go live; test mode works immediately).
2. **Settings → API Keys**: copy the **public key** (`pk_test_…`) and **secret key** (`sk_test_…`). The secret key never goes in the frontend.

### 3.2 Frontend: open checkout
```bash
npm install @paystack/inline-js
```
```js
import PaystackPop from '@paystack/inline-js'

export function payForCourse({ email, course, userId, onDone }) {
  const reference = `RI-${userId.slice(0, 6)}-${Date.now()}`
  new PaystackPop().newTransaction({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: course.price * 100,                 // Paystack uses kobo
    reference,
    metadata: { user_id: userId, course_id: course.id },
    onSuccess: () => onDone(reference),         // show "Confirming payment…" and refresh data
  })
}
```
Before opening checkout, insert a `payments` row with status `pending` and that `reference` (via a small Edge Function, since students cannot write to `payments`). Then set `site.features.payments = true` in `src/data/site.js` and call `payForCourse` from the Billing page and the course page.

### 3.3 Server: the webhook (Supabase Edge Function)
```bash
npm install -g supabase
supabase login
supabase functions new paystack-webhook
```
`supabase/functions/paystack-webhook/index.ts`:
```ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from 'node:crypto'

Deno.serve(async (req) => {
  const body = await req.text()
  const sig = req.headers.get('x-paystack-signature')
  const expected = createHmac('sha512', Deno.env.get('PAYSTACK_SECRET_KEY')!).update(body).digest('hex')
  if (sig !== expected) return new Response('Invalid signature', { status: 401 })

  const event = JSON.parse(body)
  if (event.event === 'charge.success') {
    const { reference, metadata, amount } = event.data
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
    await admin.from('payments').upsert({
      reference, user_id: metadata.user_id, course_id: metadata.course_id,
      amount_ngn: amount / 100, status: 'success',
    }, { onConflict: 'reference' })
    await admin.from('enrollments').upsert({ user_id: metadata.user_id, course_id: metadata.course_id, status: 'active' })
  }
  return new Response('ok')
})
```
```bash
supabase secrets set PAYSTACK_SECRET_KEY=sk_test_xxx
supabase functions deploy paystack-webhook --no-verify-jwt
```
In Paystack → **Settings → API Keys & Webhooks**, set the webhook URL to `https://<project-ref>.supabase.co/functions/v1/paystack-webhook`.

### 3.4 Test, then go live
Use Paystack's test cards in test mode, confirm the enrolment appears, then swap in live keys (`pk_live_`, `sk_live_`). Until verification is complete, keep using the WhatsApp payment option already built into the site.

---

## Step 4 — Video, files, certificates, WhatsApp

**Recorded lessons.** Record Zoom classes to the cloud, upload to **YouTube as Unlisted** (free) or **Bunny Stream / Vimeo** (private, domain-locked, better for paid content). Paste the embed URL into the lesson's `video` field (or `lessons.video_url`). For paid content prefer Bunny or Vimeo, because unlisted YouTube links can be shared.

**PDFs and worksheets.** Supabase → Storage → create a **private** bucket `resources`. Upload files, then generate short-lived links in the Resources page:
```js
const { data } = await supabase.storage.from('resources').createSignedUrl(path, 60)
window.open(data.signedUrl)
```

**Certificates.** The certificate screen already renders and prints to PDF. To make certificates verifiable, insert a row into `certificates` from an Edge Function when a course is completed, and add a public `/verify/:code` page that looks the code up. Keep issuing server-side so students cannot create their own.

**Live class links.** Put your permanent Zoom or Google Meet room in `site.liveRoomUrl`, or store a `join_url` per session.

**WhatsApp.** Today it uses click-to-chat links (`wa.me`), which need no setup. For automatic class reminders later, use the **WhatsApp Business Platform** (Meta Cloud API) or a provider such as Termii or Twilio, triggered by a scheduled Supabase function. Template messages must be approved by Meta first.

**Email.** Use Resend or Brevo for welcome and receipt emails.

---

## Launch checklist
- [ ] `site.js` details replaced, testimonials are real
- [ ] Demo login removed
- [ ] Supabase RLS policies enabled (they are in `schema.sql`) and tested with two accounts
- [ ] `service_role` and Paystack secret keys exist only in Supabase secrets
- [ ] Email confirmation and custom SMTP configured
- [ ] Custom domain with HTTPS
- [ ] Paystack live keys and webhook tested with a small real payment
- [ ] Privacy policy and refund policy pages added (students are paying you)
- [ ] Back up the database (Supabase → Database → Backups)

## Suggested order of work
1. Deploy to Vercel now and share the link for feedback.
2. Add Supabase (real accounts and progress).
3. Add recordings and PDFs.
4. Add Paystack once your business verification is approved.
5. Add an admin screen (list students, enrolments, payments) — a good next build.
