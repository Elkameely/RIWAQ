import { courses, getCourse, lessonsOf } from '../data/courses'
import { getQuiz, quizzes } from '../data/quizzes'

export const courseProgress = (course, data) => {
  const lessons = lessonsOf(course)
  const done = lessons.filter((l) => data.done[l.id]).length
  return { done, total: lessons.length, pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0 }
}

export const bestScore = (quizId, data) => {
  const a = data.attempts.filter((x) => x.quizId === quizId)
  if (!a.length) return null
  return Math.max(...a.map((x) => Math.round((x.score / x.total) * 100)))
}

/** A course is complete when every lesson is done and its quiz (if any) is passed. */
export const courseComplete = (course, data) => {
  const p = courseProgress(course, data)
  if (p.pct < 100) return false
  if (!course.quizId) return true
  return (bestScore(course.quizId, data) ?? 0) >= getQuiz(course.quizId).pass
}

export const overall = (data) => {
  const enrolled = data.enrolled.map(getCourse).filter(Boolean)
  const lessons = enrolled.flatMap(lessonsOf)
  const done = lessons.filter((l) => data.done[l.id]).length
  return { done, total: lessons.length, pct: lessons.length ? Math.round((done / lessons.length) * 100) : 0 }
}

export const quizAverage = (data) => {
  if (!data.attempts.length) return null
  const sum = data.attempts.reduce((s, a) => s + (a.score / a.total) * 100, 0)
  return Math.round(sum / data.attempts.length)
}

/** First lesson not yet completed in the first unfinished enrolled course. */
export const nextLesson = (data) => {
  for (const id of data.enrolled) {
    const c = getCourse(id)
    if (!c) continue
    const l = lessonsOf(c).find((x) => !data.done[x.id])
    if (l) return { course: c, lesson: l }
  }
  return null
}

/** Lessons completed per day for the last 7 days (oldest first). */
export const weekActivity = (data) => {
  const out = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    const next = new Date(d.getTime() + 86400000)
    const n = Object.values(data.done).filter((iso) => {
      const t = new Date(iso)
      return t >= d && t < next
    }).length
    out.push({ label: d.toLocaleDateString('en-GB', { weekday: 'short' }), n })
  }
  return out
}

/** Consecutive days (ending today or yesterday) with at least one lesson. */
export const streak = (data) => {
  const days = new Set(Object.values(data.done).map((iso) => new Date(iso).toDateString()))
  let s = 0
  const d = new Date()
  if (!days.has(d.toDateString())) d.setDate(d.getDate() - 1)
  while (days.has(d.toDateString())) {
    s++
    d.setDate(d.getDate() - 1)
  }
  return s
}

export const completedCourses = (data) => data.enrolled.map(getCourse).filter((c) => c && courseComplete(c, data))
export const allQuizzes = quizzes
export const allCourses = courses
export const naira = (n) => '₦' + n.toLocaleString('en-NG')
export const initials = (name = '') => name.split(' ').filter(Boolean).slice(0, 2).map((s) => s[0]).join('').toUpperCase()
