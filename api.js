// DATA LAYER. Every call the UI makes to "the backend" goes through this file.
// Right now it stores data in the browser (localStorage) so the whole app works with no server.
// To go live, re-implement each function with Supabase (the equivalent call is in each comment)
// and nothing else in the app has to change. See BACKEND_GUIDE.md.

import { COURSES, allLessons } from '../data/courses';

const KEY = 'riwaq.db.v1';
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()));
const now = () => new Date().toISOString();

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { users: [], enrolments: [], completed: [], results: [], session: null };
  } catch {
    return { users: [], enrolments: [], completed: [], results: [], session: null };
  }
};
const save = (db) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* storage unavailable: app still works for this visit */
  }
  return db;
};
// Memory fallback so the app keeps working if storage is blocked.
let mem = null;
const read = () => (mem = mem || load());
const write = (db) => ((mem = db), save(db));

async function hash(text) {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return btoa(unescape(encodeURIComponent(text)));
  }
}

const publicUser = (u) => u && { id: u.id, name: u.name, email: u.email, phone: u.phone, createdAt: u.createdAt };

// supabase.auth.signUp({ email, password, options: { data: { name, phone } } })
export async function signUp({ name, email, phone, password }) {
  const db = read();
  const e = email.trim().toLowerCase();
  if (db.users.some((u) => u.email === e)) throw new Error('An account with this email already exists. Try signing in.');
  const user = { id: uid(), name: name.trim(), email: e, phone: phone?.trim() || '', passHash: await hash(password), createdAt: now() };
  db.users.push(user);
  db.session = user.id;
  write(db);
  return publicUser(user);
}

// supabase.auth.signInWithPassword({ email, password })
export async function signIn({ email, password }) {
  const db = read();
  const u = db.users.find((x) => x.email === email.trim().toLowerCase());
  if (!u || u.passHash !== (await hash(password))) throw new Error('Email or password is not right. Check both and try again.');
  db.session = u.id;
  write(db);
  return publicUser(u);
}

// supabase.auth.signOut()
export async function signOut() {
  const db = read();
  db.session = null;
  write(db);
}

// supabase.auth.getSession()
export async function getSession() {
  const db = read();
  return publicUser(db.users.find((u) => u.id === db.session));
}

// supabase.from('profiles').update({ name, phone }).eq('id', userId)
export async function updateProfile(userId, { name, phone }) {
  const db = read();
  const u = db.users.find((x) => x.id === userId);
  if (u) {
    u.name = name.trim() || u.name;
    u.phone = phone?.trim() || '';
    write(db);
  }
  return publicUser(u);
}

// Three selects: enrolments, lesson_progress, quiz_results (all filtered by user id, enforced by RLS)
export async function getStudentData(userId) {
  const db = read();
  return {
    enrolments: db.enrolments.filter((x) => x.userId === userId),
    completed: db.completed.filter((x) => x.userId === userId),
    results: db.results.filter((x) => x.userId === userId),
  };
}

// supabase.from('enrolments').insert({ user_id, course_id, status })  (status 'pending' until Paystack confirms)
export async function enroll(userId, courseId, status = 'active') {
  const db = read();
  if (!db.enrolments.some((x) => x.userId === userId && x.courseId === courseId)) {
    db.enrolments.push({ userId, courseId, status, at: now() });
    write(db);
  }
}

// supabase.from('lesson_progress').upsert / delete
export async function setLessonDone(userId, lessonId, done) {
  const db = read();
  db.completed = db.completed.filter((x) => !(x.userId === userId && x.lessonId === lessonId));
  if (done) db.completed.push({ userId, lessonId, at: now() });
  write(db);
}

// supabase.from('quiz_results').insert({ user_id, quiz_id, score, total })
export async function saveResult(userId, quizId, score, total) {
  const db = read();
  db.results.push({ userId, quizId, score, total, at: now() });
  write(db);
}

// Demo only: creates a sample student with some progress so every screen has something to show.
export async function seedDemo() {
  const db = read();
  let u = db.users.find((x) => x.email === 'demo@riwaqulilm.com');
  if (!u) {
    u = { id: uid(), name: 'Amina Yusuf', email: 'demo@riwaqulilm.com', phone: '', passHash: await hash('demo1234'), createdAt: now() };
    db.users.push(u);
    const days = (n) => new Date(Date.now() - n * 864e5).toISOString();
    ['foundations', 'nahw'].forEach((c) => db.enrolments.push({ userId: u.id, courseId: c, status: 'active', at: days(20) }));
    const f = allLessons(COURSES[0]);
    f.forEach((l, i) => db.completed.push({ userId: u.id, lessonId: l.id, at: days(14 - i * 1.7) }));
    allLessons(COURSES[3]).slice(0, 3).forEach((l, i) => db.completed.push({ userId: u.id, lessonId: l.id, at: days(5 - i) }));
    db.results.push({ userId: u.id, quizId: 'q-alphabet', score: 4, total: 5, at: days(9) });
    db.results.push({ userId: u.id, quizId: 'q-nahw', score: 3, total: 5, at: days(2) });
  }
  db.session = u.id;
  write(db);
  return publicUser(u);
}
