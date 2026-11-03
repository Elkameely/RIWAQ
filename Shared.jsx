import { Link } from 'react-router-dom'
import { Clock, CalendarDays, Download, Video } from 'lucide-react'
import { courses, getCourse } from '../data/courses'
import { dayNames, downloadIcs, fmtTime, nextOccurrence } from '../data/schedule'
import { site, waLink } from '../data/site'
import { naira } from '../lib/progress'

export const toneOf = (courseId) => 'tone-' + (((+courseId.slice(1) - 1) % 6) + 1)

export function CourseCard({ course }) {
  return (
    <article className={'course-card ' + toneOf(course.id)}>
      <div className="course-arch">
        <span className="course-level">{course.level}</span>
        <span className="course-ar" lang="ar" dir="rtl">{course.arabic}</span>
      </div>
      <div className="course-body">
        <h3>{course.title}</h3>
        <p>{course.tagline}</p>
        <ul className="meta">
          <li><Clock size={15} /> {course.weeks} weeks</li>
          <li><CalendarDays size={15} /> {course.sessionsPerWeek} live {course.sessionsPerWeek > 1 ? 'classes' : 'class'} a week</li>
        </ul>
        <div className="course-foot">
          <b>{naira(course.price)}</b>
          <Link className="btn btn-ghost btn-sm" to={`/courses/${course.slug}`}>View course</Link>
        </div>
      </div>
    </article>
  )
}

const order = [1, 2, 3, 4, 5, 6, 0]
const userTz = () => Intl.DateTimeFormat().resolvedOptions().timeZone

/** Weekly timetable in WAT, with the viewer's own local time when it differs. */
export function WeekGrid({ sessions, mine, onJoin }) {
  const tz = userTz()
  const sameTz = tz === site.timezone || tz === 'Africa/Lagos'
  return (
    <div className="week" role="list">
      {order.map((d) => {
        const list = sessions.filter((s) => s.day === d).sort((a, b) => a.time.localeCompare(b.time))
        return (
          <div className="week-col" key={d} role="listitem">
            <h4>{dayNames[d]}</h4>
            {list.length === 0 && <p className="week-empty">No classes</p>}
            {list.map((s) => {
              const c = getCourse(s.courseId)
              const start = nextOccurrence(s)
              const isMine = !mine || mine.includes(s.courseId)
              return (
                <div className={'slot ' + toneOf(c.id) + (isMine ? '' : ' dim')} key={s.id}>
                  <b>{s.time} <small>{site.tzLabel}</small></b>
                  <span>{c.title}</span>
                  <em>{s.topic}</em>
                  {!sameTz && <small className="local">Your time: {fmtTime(start, tz)}</small>}
                  {onJoin && isMine && (
                    <span className="slot-actions">
                      <button className="icon-link" onClick={() => downloadIcs(s, c.title, site.liveRoomUrl)} title="Add to calendar"><Download size={14} /> Calendar</button>
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export const JoinButton = ({ small }) => (
  <a className={'btn btn-gold' + (small ? ' btn-sm' : '')} href={site.liveRoomUrl} target="_blank" rel="noreferrer">
    <Video size={16} /> Join live class
  </a>
)

export { waLink, courses }
