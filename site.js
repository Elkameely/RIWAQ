// ─────────────────────────────────────────────────────────────
// SITE CONFIG — edit this file first. Everything marked EDIT is a
// placeholder you should replace with your real details.
// ─────────────────────────────────────────────────────────────
export const site = {
  name: 'Riwaqul Ilm',
  arabic: 'رواق العلم',
  tagline: 'Arabic, taught with depth — built around your working day.',
  // EDIT: WhatsApp number in international format, digits only (no + or spaces).
  whatsapp: '2340000000000',
  email: 'hello@riwaqulilm.com', // EDIT
  timezone: 'Africa/Lagos', // classes are published in West Africa Time (WAT, UTC+1)
  tzLabel: 'WAT',
  // EDIT: the meeting link students use to join live classes (Zoom / Google Meet).
  liveRoomUrl: 'https://zoom.us/',
  instructor: {
    name: 'Ustadh [Your Name]', // EDIT
    title: 'Founder & Lead Instructor', // EDIT
    // EDIT: replace with your real qualifications and experience.
    bio: [
      'Riwaqul Ilm began with a simple observation: most adults who want to learn Arabic do not lack discipline — they lack a course that fits around a job, a family and a long commute.',
      'Every programme is taught live in small evening and weekend groups, then backed by recordings, short quizzes and a clear written path, so a missed class never means falling behind.',
    ],
    credentials: [
      'Your ijazah, degree or certificate here',
      'Years of teaching Arabic to adult learners',
      'Specialisation (e.g. Nahw, Sarf, Qur’anic Arabic)',
    ],
  },
  // Feature flags — flip these as you connect each service.
  features: {
    payments: false, // set true once Paystack/Flutterwave is wired (see SETUP_GUIDE.md)
    certificates: true,
  },
  currency: '₦',
}

export const waLink = (text = 'Assalamu alaykum, I would like to know more about Riwaqul Ilm.') =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`

export const plans = [
  {
    id: 'course',
    name: 'Single course',
    price: 35000,
    per: 'per course',
    blurb: 'One course, start to finish, with live classes and every recording.',
    features: ['Live classes in a small group', 'Recorded lessons & PDF notes', 'Quizzes and a certificate', 'WhatsApp study group'],
  },
  {
    id: 'term',
    name: 'Full term',
    price: 85000,
    per: 'per 12 weeks',
    featured: true,
    blurb: 'Two courses in parallel — the usual choice for steady progress.',
    features: ['Everything in Single course', 'Two courses at once', 'Monthly 1-to-1 progress review', 'Priority class seats'],
  },
  {
    id: 'year',
    name: 'Academy year',
    price: 240000,
    per: 'per year',
    blurb: 'The whole journey from alphabet to confident reading.',
    features: ['Every course, all year', 'Termly assessments', 'Printed certificate on completion', 'Lifetime access to recordings'],
  },
]

// EDIT: replace with real words from real students before launch.
export const testimonials = [
  { name: 'Student name', role: 'Accountant, Lagos', text: 'Replace this with a real student’s words about how the evening classes fit around work.' },
  { name: 'Student name', role: 'Civil servant, Abuja', text: 'Replace this with a real student’s words about the recordings, quizzes or progress tracking.' },
  { name: 'Student name', role: 'Engineer, Ilorin', text: 'Replace this with a real student’s words about the instructor and the group.' },
]

export const faqs = [
  { q: 'I have never studied Arabic. Can I join?', a: 'Yes. Arabic Foundations starts from the shapes and sounds of the letters. If you are unsure of your level, send us a message on WhatsApp for a free placement chat.' },
  { q: 'When are the live classes?', a: 'Weekday evenings and weekend mornings, in West Africa Time. Each class is recorded, so you can catch up whenever your day allows.' },
  { q: 'What if I miss a class?', a: 'Every live class is recorded and posted to your dashboard, with notes and a short quiz, usually within a few hours.' },
  { q: 'Do I need to buy books?', a: 'No. Notes, worksheets and vocabulary lists are included in your dashboard as downloadable PDFs.' },
  { q: 'How do certificates work?', a: 'Finish all lessons in a course and pass its quizzes to unlock a certificate you can download, print and verify.' },
  { q: 'How do I pay?', a: 'Online payment by card and bank transfer is being switched on. Until then, message us on WhatsApp and we will confirm your seat manually.' },
]

export const wordsOfTheDay = [
  { ar: 'عِلْم', tr: 'ʿilm', en: 'knowledge' },
  { ar: 'صَبْر', tr: 'ṣabr', en: 'patience' },
  { ar: 'كِتَاب', tr: 'kitāb', en: 'book' },
  { ar: 'قَلَم', tr: 'qalam', en: 'pen' },
  { ar: 'مَدْرَسَة', tr: 'madrasa', en: 'school' },
  { ar: 'طَالِب', tr: 'ṭālib', en: 'student' },
  { ar: 'نُور', tr: 'nūr', en: 'light' },
]
