// Weekly recurring live classes, published in West Africa Time (Africa/Lagos, UTC+1, no daylight saving).
// day: 0 = Sunday … 6 = Saturday. time: 24h "HH:MM" in WAT.
export const sessions = [
  { id: 's1', courseId: 'c1', day: 1, time: '20:00', mins: 60, topic: 'Letters and sounds' },
  { id: 's2', courseId: 'c1', day: 4, time: '20:00', mins: 60, topic: 'Reading practice' },
  { id: 's3', courseId: 'c2', day: 2, time: '20:30', mins: 60, topic: 'Words of the Qur’an' },
  { id: 's4', courseId: 'c2', day: 6, time: '09:00', mins: 60, topic: 'Short surah study' },
  { id: 's5', courseId: 'c3', day: 3, time: '20:00', mins: 75, topic: 'Sentence analysis' },
  { id: 's6', courseId: 'c3', day: 0, time: '17:00', mins: 75, topic: 'Grammar workshop' },
  { id: 's7', courseId: 'c4', day: 2, time: '19:00', mins: 60, topic: 'Roots and patterns' },
  { id: 's8', courseId: 'c4', day: 5, time: '19:30', mins: 60, topic: 'Verb forms' },
  { id: 's9', courseId: 'c5', day: 1, time: '21:00', mins: 45, topic: 'Speaking circle' },
  { id: 's10', courseId: 'c5', day: 6, time: '11:00', mins: 60, topic: 'Role-play session' },
  { id: 's11', courseId: 'c6', day: 5, time: '16:00', mins: 90, topic: 'Reading the matn' },
]

export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const WAT_OFFSET = 60 * 60 * 1000

/** Next start time (a real Date) of a weekly WAT session, on or after `from`. */
export function nextOccurrence(s, from = new Date()) {
  const [h, m] = s.time.split(':').map(Number)
  const watNow = new Date(from.getTime() + WAT_OFFSET)
  for (let i = 0; i < 8; i++) {
    const probe = new Date(watNow.getTime() + i * 86400000)
    if (probe.getUTCDay() !== s.day) continue
    const startUtc = Date.UTC(probe.getUTCFullYear(), probe.getUTCMonth(), probe.getUTCDate(), h, m) - WAT_OFFSET
    if (startUtc + s.mins * 60000 > from.getTime()) return new Date(startUtc)
  }
  return null
}

export const fmtTime = (d, tz) =>
  new Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: tz }).format(d)
export const fmtDay = (d, tz) =>
  new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: tz }).format(d)

export function countdown(to, now = new Date()) {
  const ms = to - now
  if (ms <= 0) return 'Live now'
  const mins = Math.floor(ms / 60000)
  const d = Math.floor(mins / 1440)
  const h = Math.floor((mins % 1440) / 60)
  const mm = mins % 60
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${mm}m`
  return `${mm} min`
}

const pad = (n) => String(n).padStart(2, '0')
const ics = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`

/** Download a recurring weekly calendar event (.ics) for a session. */
export function downloadIcs(session, title, link) {
  const start = nextOccurrence(session)
  const end = new Date(start.getTime() + session.mins * 60000)
  const body = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Riwaqul Ilm//EN', 'BEGIN:VEVENT',
    `UID:${session.id}@riwaqulilm`, `DTSTAMP:${ics(new Date())}`,
    `DTSTART:${ics(start)}`, `DTEND:${ics(end)}`, 'RRULE:FREQ=WEEKLY',
    `SUMMARY:${title} — Riwaqul Ilm`, `DESCRIPTION:${session.topic}. Join: ${link}`, `URL:${link}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `${session.id}-class.ics`
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
