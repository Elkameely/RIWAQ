import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Video, Download, PlayCircle, Flame, CheckCircle2, Trophy, Megaphone, Volume2 } from 'lucide-react'
import { useApp } from '../../lib/AppContext'
import { getCourse } from '../../data/courses'
import { getQuiz } from '../../data/quizzes'
import { sessions, nextOccurrence, countdown, fmtDay, fmtTime, downloadIcs } from '../../data/schedule'
import { site, wordsOfTheDay } from '../../data/site'
import { Ring, Bar } from '../../components/Brand'
import { toneOf } from '../../components/Shared'
import { overall, quizAverage, nextLesson, streak, courseProgress } from '../../lib/progress'

export const useNow = (ms = 30000) => {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), ms); return () => clearInterval(t) }, [ms])
  return now
}
export const speak = (text) => {
  try { const u = new SpeechSynthesisUtterance(text); u.lang = 'ar-SA'; u.rate = 0.8; window.speechSynthesis.cancel(); window.speechSynthesis.speak(u) } catch { /* not supported */ }
}
export const Page = ({ title, sub, children, action }) => (
  <>
    <div className="page-title">
      <div><h1>{title}</h1>{sub && <p>{sub}</p>}</div>
      {action}
    </div>
    {children}
  </>
)

export const upcoming = (data, now, n = 6) =>
  sessions
    .filter((s) => data.enrolled.includes(s.courseId))
    .map((s) => ({ s, at: nextOccurrence(s, now) }))
    .filter((x) => x.at)
    .sort((a, b) => a.at - b.at)
    .slice(0, n)

export default function Overview() {
  const { user, data } = useApp()
  const now = useNow()
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const ov = overall(data)
  const avg = quizAverage(data)
  const next = nextLesson(data)
  const up = upcoming(data, now)
  const first = up[0]
  const word = wordsOfTheDay[now.getDate() % wordsOfTheDay.length]
  const hour = now.getHours()
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <Page title={`Assalamu alaykum, ${user.name.split(' ')[0]}`} sub={`${greet}. Here is where your studies stand today.`}>
      {data.enrolled.length === 0 && (
        <div className="notice">
          <b>You have not enrolled in a course yet.</b>
          <span>Pick one to unlock live classes, recordings and quizzes.</span>
          <Link className="btn btn-gold btn-sm" to="/courses">Choose a course</Link>
        </div>
      )}

      <div className="dash-grid">
        {first && (
          <section className={'panel next-class ' + toneOf(first.s.courseId)}>
            <h2>Your next live class</h2>
            <b className="nc-title">{getCourse(first.s.courseId).title}</b>
            <span className="nc-topic">{first.s.topic}</span>
            <div className="nc-time">
              <div><b>{fmtDay(first.at, tz)}</b><span>{fmtTime(first.at, tz)} your time</span></div>
              <div><b>{countdown(first.at, now)}</b><span>to start</span></div>
            </div>
            <div className="nc-actions">
              <a className="btn btn-gold" href={site.liveRoomUrl} target="_blank" rel="noreferrer"><Video size={16} /> Join live class</a>
              <button className="btn btn-outline-light" onClick={() => downloadIcs(first.s, getCourse(first.s.courseId).title, site.liveRoomUrl)}><Download size={16} /> Add to calendar</button>
            </div>
          </section>
        )}

        <section className="panel stats">
          <div className="stat stat-ring"><Ring pct={ov.pct} size={92} /><span>Overall progress<small>{ov.done} of {ov.total} lessons</small></span></div>
          <div className="stat"><CheckCircle2 size={20} /><b>{avg === null ? '—' : avg + '%'}</b><span>Quiz average</span></div>
          <div className="stat"><Flame size={20} /><b>{streak(data)}</b><span>Day streak</span></div>
          <div className="stat"><Trophy size={20} /><b>{data.attempts.length}</b><span>Quizzes taken</span></div>
        </section>

        {next && (
          <section className="panel">
            <h2>Continue learning</h2>
            <p className="muted">{next.course.title}</p>
            <b className="big-line">{next.lesson.title}</b>
            <Bar pct={courseProgress(next.course, data).pct} />
            <Link className="btn btn-primary" to={`/app/courses/${next.course.id}?lesson=${next.lesson.id}`}><PlayCircle size={16} /> Resume lesson</Link>
          </section>
        )}

        <section className="panel">
          <h2>Coming up this week</h2>
          {up.length === 0 ? <p className="muted">No classes yet. Enrol in a course to see your timetable here.</p> : (
            <ul className="list">
              {up.slice(0, 4).map(({ s, at }) => (
                <li key={s.id} className={toneOf(s.courseId)}>
                  <i className="dot" />
                  <div><b>{getCourse(s.courseId).title}</b><span>{s.topic}</span></div>
                  <time>{fmtDay(at, tz)}<small>{fmtTime(at, tz)}</small></time>
                </li>
              ))}
            </ul>
          )}
          <Link className="text-link" to="/app/schedule">Full schedule</Link>
        </section>

        <section className="panel">
          <h2>Recent quiz results</h2>
          {data.attempts.length === 0 ? <p className="muted">Your results will appear here after your first quiz.</p> : (
            <ul className="list">
              {[...data.attempts].reverse().slice(0, 3).map((a) => {
                const p = Math.round((a.score / a.total) * 100)
                return <li key={a.id}><div><b>{getQuiz(a.quizId)?.title}</b><span>{new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span></div><span className={'score ' + (p >= 70 ? 'ok' : 'low')}>{p}%</span></li>
              })}
            </ul>
          )}
          <Link className="text-link" to="/app/quizzes">All quizzes</Link>
        </section>

        <section className="panel word">
          <h2>Word of the day</h2>
          <span className="word-ar" lang="ar" dir="rtl">{word.ar}</span>
          <b>{word.en}</b><span className="muted">{word.tr}</span>
          <button className="icon-link" onClick={() => speak(word.ar)}><Volume2 size={16} /> Hear it</button>
        </section>

        <section className="panel announce">
          <h2><Megaphone size={18} /> From your teacher</h2>
          <p>Remember to review the last recording before your next class. A fifteen-minute review makes the live session far more useful.</p>
        </section>
      </div>
    </Page>
  )
}
