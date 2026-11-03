import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { PlayCircle, FileText, ClipboardList, CheckCircle2, Circle, ChevronLeft, ChevronRight, Check, Plus } from 'lucide-react'
import { courses, getCourse, lessonsOf } from '../../data/courses'
import { useApp } from '../../lib/AppContext'
import { Bar } from '../../components/Brand'
import { CourseCard, toneOf } from '../../components/Shared'
import { courseProgress } from '../../lib/progress'
import { Page } from './Overview'

export function MyCourses() {
  const { data } = useApp()
  const mine = data.enrolled.map(getCourse).filter(Boolean)
  const more = courses.filter((c) => !data.enrolled.includes(c.id))
  return (
    <Page title="My courses" sub="Your enrolled courses and everything still open to join.">
      {mine.length === 0 && <p className="empty">You are not enrolled in any course yet. Choose one below to begin.</p>}
      <div className="grid-3">
        {mine.map((c) => {
          const p = courseProgress(c, data)
          return (
            <Link key={c.id} to={`/app/courses/${c.id}`} className={'mycourse ' + toneOf(c.id)}>
              <span className="mc-ar" lang="ar" dir="rtl">{c.arabic}</span>
              <h3>{c.title}</h3>
              <small>{p.done} of {p.total} lessons</small>
              <Bar pct={p.pct} />
              <b>{p.pct === 100 ? 'Completed' : p.pct === 0 ? 'Start course' : 'Continue'}</b>
            </Link>
          )
        })}
      </div>
      {more.length > 0 && (
        <>
          <h2 className="sub-h">Open for enrolment</h2>
          <div className="grid-3">{more.map((c) => <CourseCard key={c.id} course={c} />)}</div>
        </>
      )}
    </Page>
  )
}

const typeIcon = { v: PlayCircle, p: FileText, q: ClipboardList }

export function Learn() {
  const { id } = useParams()
  const [sp] = useSearchParams()
  const { data, toggleLesson, enroll, say } = useApp()
  const nav = useNavigate()
  const course = getCourse(id)
  const lessons = useMemo(() => (course ? lessonsOf(course) : []), [course])
  const firstOpen = lessons.find((l) => !data.done[l.id]) || lessons[0]
  const [cur, setCur] = useState(sp.get('lesson') || null)
  if (!course) return <Navigate to="/app/courses" replace />

  if (!data.enrolled.includes(course.id))
    return (
      <Page title={course.title} sub={course.tagline}>
        <div className="notice">
          <b>You are not enrolled in this course.</b>
          <button className="btn btn-gold btn-sm" onClick={async () => { await enroll(course.id); say(`You are enrolled in ${course.title}.`) }}><Plus size={16} /> Enrol now</button>
        </div>
      </Page>
    )

  const lesson = lessons.find((l) => l.id === cur) || firstOpen
  const idx = lessons.indexOf(lesson)
  const p = courseProgress(course, data)
  const isDone = !!data.done[lesson.id]
  const go = (l) => l && setCur(l.id)

  return (
    <Page title={course.title} sub={`${p.done} of ${p.total} lessons complete`} action={course.quizId && <Link className="btn btn-ghost btn-sm" to={`/app/quizzes/${course.quizId}`}>Take the course quiz</Link>}>
      <div className="learn">
        <div className="learn-main">
          <div className={'player ' + toneOf(course.id)}>
            {lesson.video ? (
              <iframe title={lesson.title} src={lesson.video} allowFullScreen />
            ) : (
              <div className="player-empty">
                <span lang="ar" dir="rtl" className="player-ar">{course.arabic}</span>
                <PlayCircle size={56} />
                <p>{lesson.type === 'v' ? 'Recording appears here after the live class.' : 'Download the file from Resources.'}</p>
                <small>Add a video link to this lesson in <code>src/data/courses.js</code>, or connect your video host.</small>
              </div>
            )}
          </div>
          <div className="lesson-head">
            <div><small>{course.modules.find((m) => m.lessons.includes(lesson)).title}</small><h2>{lesson.title}</h2><span className="muted">{lesson.minutes} min</span></div>
            <button className={'btn ' + (isDone ? 'btn-ghost' : 'btn-primary')} onClick={() => { toggleLesson(lesson.id); if (!isDone) say('Lesson marked complete.') }}>
              {isDone ? <><Check size={16} /> Completed</> : 'Mark as complete'}
            </button>
          </div>
          <div className="lesson-nav">
            <button className="btn btn-ghost btn-sm" disabled={idx === 0} onClick={() => go(lessons[idx - 1])}><ChevronLeft size={16} /> Previous</button>
            <button className="btn btn-ghost btn-sm" disabled={idx === lessons.length - 1} onClick={() => go(lessons[idx + 1])}>Next <ChevronRight size={16} /></button>
          </div>
        </div>

        <aside className="curriculum">
          <Bar pct={p.pct} />
          {course.modules.map((m) => (
            <div key={m.id} className="cur-mod">
              <h3>{m.title}</h3>
              {m.lessons.map((l) => {
                const I = typeIcon[l.type]
                return (
                  <button key={l.id} className={'cur-lesson' + (l.id === lesson.id ? ' on' : '')} onClick={() => go(l)}>
                    {data.done[l.id] ? <CheckCircle2 size={18} className="ck" /> : <Circle size={18} />}
                    <span>{l.title}</span>
                    <I size={14} />
                  </button>
                )
              })}
            </div>
          ))}
        </aside>
      </div>
    </Page>
  )
}
