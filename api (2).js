// ─────────────────────────────────────────────────────────────
// DATA ACCESS LAYER
// The whole app talks to the backend ONLY through this file.
// Today it uses the browser's localStorage so the site works with no server.
// To go live, replace each function body with the Supabase call shown in
// the comment above it (full walkthrough in docs/SETUP_GUIDE.md).
// Every function is async so nothing else in the app has to change.
// ─────────────────────────────────────────────────────────────
import { lessonsOf, courses } from '../data/courses'

const K = { users: 'riwaq.users', session: 'riwaq.session', data: 'riwaq.data' }
const mem = {}
const read = (k, fallback) => {
  try {
    const v = window.localStorage.getItem(k)
    return v ? JSON.parse(v) : fallback
  } catch {
    return mem[k] ?? fallback
  }
}
const write = (k, v) => {
  mem[k] = v
  try {
    window.localStorage.setItem(k, JSON.stringify(v))
  } catch {
    /* storage unavailable: memory fallback is used */
  }
}
const wait = (ms = 250) => new Promise((r) => setTimeout(r, ms))
const uid = () => Math.random().toString(36).slice(2, 10)
const emptyData = () => ({ enrolled: [], done: {}, attempts: [], payments: [], activity: [] })

const allData = () => read(K.data, {})
const saveData = (userId, d) => write(K.data, { ...allData(), [userId]: d })

/* ---------- AUTH ---------- */

// SUPABASE: const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name, phone } } })
export async function signUp({ name, email, password, phone = '', goal = '' }) {
  await wait()
  const users = read(K.users, [])
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) throw new Error('An account with this email already exists. Try signing in.')
  // NOTE: storing a plain password is for this offline demo ONLY. Supabase Auth hashes passwords for you.
  const user = { id: uid(), name, email, password, phone, goal, createdAt: new Date().toISOString() }
  write(K.users, [...users, user])
  write(K.session, user.id)
  saveData(user.id, emptyData())
  return publicUser(user)
}

// SUPABASE: await supabase.auth.signInWithPassword({ email, password })
export async function signIn({ email, password }) {
  await wait()
  const u = read(K.users, []).find((x) => x.email.toLowerCase() === email.toLowerCase() && x.password === password)
  if (!u) throw new Error('Email or password is not correct. Check them and try again.')
  write(K.session, u.id)
  return publicUser(u)
}

// SUPABASE: await supabase.auth.signOut()
export async function signOut() {
  write(K.session, null)
}

// SUPABASE: const { data: { session } } = await supabase.auth.getSession()  → then select from `profiles`
export async function getSession() {
  const id = read(K.session, null)
  const u = read(K.users, []).find((x) => x.id === id)
  return u ? publicUser(u) : null
}

const publicUser = ({ password, ...u }) => u

// SUPABASE: await supabase.from('profiles').update(patch).eq('id', userId)
export async function updateProfile(userId, patch) {
  const users = read(K.users, [])
  const next = users.map((u) => (u.id === userId ? { ...u, ...patch } : u))
  write(K.users, next)
  return publicUser(next.find((u) => u.id === userId))
}

/* ---------- LEARNING DATA ---------- */

// SUPABASE: select from enrollments, lesson_progress, quiz_attempts, payments where user_id = userId
export async function getData(userId) {
  return allData()[userId] || emptyData()
}

// SUPABASE: await supabase.from('enrollments').insert({ user_id, course_id })
export async function enroll(userId, courseId) {
  const d = await getData(userId)
  if (!d.enrolled.includes(courseId)) d.enrolled = [...d.enrolled, courseId]
  saveData(userId, d)
  return d
}

// SUPABASE: upsert / delete on lesson_progress (user_id, lesson_id, completed_at)
export async function toggleLesson(userId, lessonId) {
  const d = await getData(userId)
  const done = { ...d.done }
  if (done[lessonId]) delete done[lessonId]
  else done[lessonId] = new Date().toISOString()
  const next = { ...d, done }
  saveData(userId, next)
  return next
}

// SUPABASE: await supabase.from('quiz_attempts').insert({ user_id, quiz_id, score, total, answers })
export async function saveAttempt(userId, attempt) {
  const d = await getData(userId)
  const next = { ...d, attempts: [...d.attempts, { ...attempt, id: uid(), date: new Date().toISOString() }] }
  saveData(userId, next)
  return next
}

/* ---------- DEMO ACCOUNT (offline preview only; delete when going live) ---------- */
export async function demoLogin() {
  const users = read(K.users, [])
  let u = users.find((x) => x.email === 'demo@riwaqulilm.com')
  if (!u) {
    u = { id: 'demo', name: 'Amina Yusuf', email: 'demo@riwaqulilm.com', password: 'demo1234', phone: '', goal: 'Understand the Qur’an', createdAt: new Date().toISOString() }
    write(K.users, [...users, u])
  }
  const day = (n) => new Date(Date.now() - n * 86400000).toISOString()
  const c1 = lessonsOf(courses[0]).map((l) => l.id)
  const c2 = lessonsOf(courses[1]).map((l) => l.id)
  const c3 = lessonsOf(courses[2]).map((l) => l.id)
  const done = {}
  c1.forEach((id, i) => (done[id] = day(40 - i * 2)))
  c2.slice(0, 7).forEach((id, i) => (done[id] = day(Math.max(0, 14 - i * 2))))
  c3.slice(0, 2).forEach((id, i) => (done[id] = day(i)))
  const attempts = [
    { id: 'a1', quizId: 'qz1', score: 5, total: 6, date: day(30) },
    { id: 'a2', quizId: 'qz1', score: 6, total: 6, date: day(24) },
    { id: 'a3', quizId: 'qz2', score: 4, total: 6, date: day(9) },
    { id: 'a4', quizId: 'qz2', score: 5, total: 6, date: day(5) },
    { id: 'a5', quizId: 'qz3', score: 4, total: 6, date: day(1) },
  ]
  saveData(u.id, {
    enrolled: ['c1', 'c2', 'c3'],
    done,
    attempts,
    payments: [{ id: 'p1', label: 'Arabic Foundations', amount: 35000, date: day(48), status: 'Paid (sample)' }],
    activity: [],
  })
  write(K.session, u.id)
  return publicUser(u)
}
