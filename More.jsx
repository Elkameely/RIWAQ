import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Video, Download, FileText, PlayCircle, Volume2, Printer, Lock, Award, Check, X, RotateCcw, CreditCard, MessageCircle, Clock } from 'lucide-react'
import { useApp } from '../../lib/AppContext'
import { courses, getCourse, lessonsOf } from '../../data/courses'
import { quizzes, getQuiz, resources, letters } from '../../data/quizzes'
import { sessions, dayNames, fmtDay, fmtTime, downloadIcs } from '../../data/schedule'
import { site, plans, waLink } from '../../data/site'
import { Ring, Bar, Mark } from '../../components/Brand'
import { WeekGrid, toneOf } from '../../components/Shared'
import { Page, upcoming, useNow, speak } from './Overview'
import { bestScore, courseComplete, courseProgress, naira, overall, weekActivity, completedCourses } from '../../lib/progress'

/** Wraps Arabic runs inside English text so they use the Arabic typeface. */
const Rich = ({ text }) =>
  text.split(/([\u0600-\u06FF][\u0600-\u06FF\u064B-\u065F\s]*[\u0600-\u06FF؟]?)/).map((part, i) =>
    /[\u0600-\u06FF]/.test(part) ? <span key={i} className="ar-run" lang="ar" dir="rtl">{part}</span> : part,
  )

/* ───────── Schedule ───────── */
export function Schedule() {
  const { data } = useApp()
  const now = useNow()
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  const up = upcoming(data, now, 8)
  return (
    <Page title="Class schedule" sub={`Live classes are set in West Africa Time. Your device is on ${tz.replace('_', ' ')}.`}>
      <section className="panel">
        <h2>Upcoming classes</h2>
        {up.length === 0 ? <p className="empty">You have no upcoming classes. <Link to="/courses">Enrol in a course</Link> to see its timetable.</p> : (
          <ul className="list list-big">
            {up.map(({ s, at }) => (
              <li key={s.id} className={toneOf(s.courseId)}>
                <i className="dot" />
                <div><b>{getCourse(s.courseId).title}</b><span>{s.topic}, {s.mins} min</span></div>
                <time>{fmtDay(at, tz)}<small>{fmtTime(at, tz)}</small></time>
                <span className="row-actions">
                  <button className="icon-link" onClick={() => downloadIcs(s, getCourse(s.courseId).title, site.liveRoomUrl)}><Download size={15} /> Calendar</button>
                  <a className="btn btn-primary btn-sm" href={site.liveRoomUrl} target="_blank" rel="noreferrer"><Video size={15} /> Join</a>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <h2 className="sub-h">The full week</h2>
      <WeekGrid sessions={sessions} mine={data.enrolled} onJoin />
    </Page>
  )
}

/* ───────── Resources ───────── */
export function Resources() {
  const { data, say } = useApp()
  const [tab, setTab] = useState('rec')
  const mine = data.enrolled.map(getCourse).filter(Boolean)
  const files = resources.filter((r) => data.enrolled.includes(r.courseId))
  const tabs = [['rec', 'Recorded lessons'], ['files', 'Study files'], ['alpha', 'Alphabet trainer']]
  return (
    <Page title="Learning resources" sub="Recordings, notes and tools to use between classes.">
      <div className="tabs" role="tablist">
        {tabs.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'on' : ''} onClick={() => setTab(k)}>{l}</button>)}
      </div>

      {tab === 'rec' && (mine.length === 0 ? <p className="empty">Enrol in a course to see its recorded lessons.</p> : mine.map((c) => (
        <section className="panel" key={c.id}>
          <h2>{c.title}</h2>
          <ul className="list">
            {lessonsOf(c).filter((l) => l.type === 'v').map((l) => (
              <li key={l.id}>
                <PlayCircle size={20} className={data.done[l.id] ? 'ck' : ''} />
                <div><b>{l.title}</b><span>{l.minutes} min{data.done[l.id] ? ', watched' : ''}</span></div>
                <Link className="btn btn-ghost btn-sm" to={`/app/courses/${c.id}?lesson=${l.id}`}>Watch</Link>
              </li>
            ))}
          </ul>
        </section>
      )))}

      {tab === 'files' && (files.length === 0 ? <p className="empty">Enrol in a course to see its notes and worksheets.</p> : (
        <section className="panel">
          <ul className="list">
            {files.map((r) => (
              <li key={r.id} className={toneOf(r.courseId)}>
                <FileText size={20} />
                <div><b>{r.title}</b><span>{getCourse(r.courseId).title}, {r.kind}, {r.size}</span></div>
                <button className="btn btn-ghost btn-sm" onClick={() => say('Connect file storage to enable downloads (see SETUP_GUIDE).')}><Download size={15} /> Download</button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {tab === 'alpha' && (
        <section className="panel">
          <h2>The 28 letters</h2>
          <p className="muted">Tap a letter to hear it. Audio uses your device’s Arabic voice where available.</p>
          <div className="alpha">
            {letters.map(([ch, name]) => (
              <button key={name} onClick={() => speak(ch)} aria-label={`Hear ${name}`}>
                <span lang="ar" dir="rtl">{ch}</span><small>{name}</small><Volume2 size={12} />
              </button>
            ))}
          </div>
        </section>
      )}
    </Page>
  )
}

/* ───────── Quizzes ───────── */
export function Quizzes() {
  const { data } = useApp()
  return (
    <Page title="Quizzes and assessments" sub="Short quizzes with instant marking. Retake as often as you like; your best score counts.">
      <div className="grid-3">
        {quizzes.map((z) => {
          const best = bestScore(z.id, data)
          const locked = !data.enrolled.includes(z.courseId)
          return (
            <article key={z.id} className={'panel quiz-card ' + toneOf(z.courseId)}>
              <small>{getCourse(z.courseId).title}</small>
              <h3>{z.title}</h3>
              <p className="muted">{z.blurb}</p>
              <ul className="meta"><li><Clock size={14} /> {z.minutes} min</li><li>{z.questions.length} questions</li><li>Pass mark {z.pass}%</li></ul>
              <div className="quiz-foot">
                {best !== null && <span className={'score ' + (best >= z.pass ? 'ok' : 'low')}>Best {best}%</span>}
                {locked ? <span className="locked"><Lock size={14} /> Enrol to unlock</span> : <Link className="btn btn-primary btn-sm" to={`/app/quizzes/${z.id}`}>{best === null ? 'Start quiz' : 'Retake'}</Link>}
              </div>
            </article>
          )
        })}
      </div>
    </Page>
  )
}

export function QuizRunner() {
  const { id } = useParams()
  const z = getQuiz(id)
  const { saveAttempt, data } = useApp()
  const nav = useNavigate()
  const [i, setI] = useState(0)
  const [pick, setPick] = useState(null)
  const [shown, setShown] = useState(false)
  const [answers, setAnswers] = useState([])
  const [done, setDone] = useState(false)
  if (!z) return <Navigate to="/app/quizzes" replace />
  if (!data.enrolled.includes(z.courseId)) return <Navigate to="/app/quizzes" replace />

  const q = z.questions[i]
  const score = answers.filter((a, n) => a === z.questions[n].answer).length
  const pct = Math.round((score / z.questions.length) * 100)

  const check = () => setShown(true)
  const next = async () => {
    const a = [...answers, pick]
    setAnswers(a)
    if (i + 1 < z.questions.length) { setI(i + 1); setPick(null); setShown(false) }
    else {
      const s = a.filter((x, n) => x === z.questions[n].answer).length
      await saveAttempt({ quizId: z.id, score: s, total: z.questions.length })
      setDone(true)
    }
  }
  const retry = () => { setI(0); setPick(null); setShown(false); setAnswers([]); setDone(false) }

  if (done)
    return (
      <Page title={z.title}>
        <section className="panel result">
          <Ring pct={pct} size={140} stroke={12} />
          <h2>{pct >= z.pass ? 'Well done, you passed.' : 'Not passed yet.'}</h2>
          <p>You answered {score} of {z.questions.length} correctly. The pass mark is {z.pass}%.</p>
          <ol className="review">
            {z.questions.map((x, n) => (
              <li key={n} className={answers[n] === x.answer ? 'right' : 'wrong'}>
                {answers[n] === x.answer ? <Check size={16} /> : <X size={16} />}
                <div><b><Rich text={x.prompt} /></b><span>{x.options[x.answer]}. {x.why}</span></div>
              </li>
            ))}
          </ol>
          <div className="result-actions">
            <button className="btn btn-primary" onClick={retry}><RotateCcw size={16} /> Retake quiz</button>
            <Link className="btn btn-ghost" to="/app/quizzes">All quizzes</Link>
            <Link className="btn btn-ghost" to="/app/progress">See progress</Link>
          </div>
        </section>
      </Page>
    )

  return (
    <Page title={z.title} sub={getCourse(z.courseId).title}>
      <section className="panel quiz">
        <div className="quiz-top"><span>Question {i + 1} of {z.questions.length}</span><Bar pct={(i / z.questions.length) * 100} /></div>
        {q.glyph && <span className="quiz-glyph" lang="ar" dir="rtl">{q.glyph}</span>}
        <h2 className="quiz-q"><Rich text={q.prompt} /></h2>
        <div className="options" role="radiogroup" aria-label="Answers">
          {q.options.map((o, n) => {
            let cls = 'opt'
            if (pick === n) cls += ' sel'
            if (shown && n === q.answer) cls += ' right'
            if (shown && pick === n && n !== q.answer) cls += ' wrong'
            return (
              <button key={n} role="radio" aria-checked={pick === n} className={cls} disabled={shown} onClick={() => setPick(n)}>
                <i>{'ABCD'[n]}</i>
                <span className={q.optAr ? 'ar-opt' : ''} lang={q.optAr ? 'ar' : undefined} dir={q.optAr ? 'rtl' : undefined}>{o}</span>
              </button>
            )
          })}
        </div>
        {shown && (
          <div className={'feedback ' + (pick === q.answer ? 'right' : 'wrong')} role="status">
            <b>{pick === q.answer ? 'Correct.' : 'Not quite.'}</b> {q.why}
          </div>
        )}
        <div className="quiz-actions">
          <button className="btn btn-ghost" onClick={() => nav('/app/quizzes')}>Leave quiz</button>
          {!shown ? <button className="btn btn-primary" disabled={pick === null} onClick={check}>Check answer</button>
            : <button className="btn btn-primary" onClick={next}>{i + 1 === z.questions.length ? 'See results' : 'Next question'}</button>}
        </div>
      </section>
    </Page>
  )
}

/* ───────── Progress ───────── */
export function Progress() {
  const { data } = useApp()
  const ov = overall(data)
  const week = weekActivity(data)
  const max = Math.max(3, ...week.map((w) => w.n))
  const attempts = data.attempts.slice(-8)
  return (
    <Page title="Your progress" sub="How far you have come, and where to focus next.">
      <div className="dash-grid">
        <section className="panel stats-one"><Ring pct={ov.pct} size={130} stroke={11} label="overall" /><div><h2>{ov.done} of {ov.total} lessons</h2><p className="muted">across {data.enrolled.length} enrolled {data.enrolled.length === 1 ? 'course' : 'courses'}</p></div></section>

        <section className="panel">
          <h2>Lessons this week</h2>
          <svg className="chart" viewBox="0 0 320 150" role="img" aria-label="Lessons completed per day this week">
            {week.map((w, n) => {
              const h = (w.n / max) * 100
              return (
                <g key={n} transform={`translate(${n * 45 + 8} 0)`}>
                  <rect x="0" y={110 - h} width="30" height={Math.max(h, 3)} rx="6" fill={w.n ? 'var(--emerald-600)' : 'var(--mint-200)'} />
                  {w.n > 0 && <text x="15" y={104 - h} textAnchor="middle" fontSize="11" fill="var(--ink)">{w.n}</text>}
                  <text x="15" y="132" textAnchor="middle" fontSize="11" fill="var(--muted)">{w.label}</text>
                </g>
              )
            })}
          </svg>
        </section>

        <section className="panel wide">
          <h2>Courses</h2>
          {data.enrolled.length === 0 ? <p className="empty">Enrol in a course to track it here.</p> : (
            <ul className="list">
              {data.enrolled.map(getCourse).filter(Boolean).map((c) => {
                const p = courseProgress(c, data)
                const qs = c.quizId ? bestScore(c.quizId, data) : null
                return (
                  <li key={c.id} className={'course-row ' + toneOf(c.id)}>
                    <div className="grow"><b>{c.title}</b><Bar pct={p.pct} /><span>{p.done} of {p.total} lessons{c.quizId ? `, quiz best ${qs === null ? 'not taken' : qs + '%'}` : ''}</span></div>
                    <b className="pct">{p.pct}%</b>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="panel wide">
          <h2>Quiz scores over time</h2>
          {attempts.length === 0 ? <p className="empty">Take a quiz to start your score history.</p> : (
            <svg className="chart" viewBox={`0 0 ${Math.max(320, attempts.length * 60)} 170`} role="img" aria-label="Quiz scores">
              <line x1="0" x2="100%" y1={20 + 110 * 0.3} y2={20 + 110 * 0.3} stroke="var(--gold-400)" strokeDasharray="4 4" />
              <text x="2" y={16 + 110 * 0.3} fontSize="10" fill="var(--gold-600)">pass 70%</text>
              {attempts.map((a, n) => {
                const p = Math.round((a.score / a.total) * 100)
                const h = (p / 100) * 110
                return (
                  <g key={a.id} transform={`translate(${n * 56 + 16} 0)`}>
                    <rect x="0" y={130 - h} width="34" height={h} rx="6" fill={p >= 70 ? 'var(--emerald-600)' : 'var(--gold-500)'} />
                    <text x="17" y={124 - h} textAnchor="middle" fontSize="11" fill="var(--ink)">{p}%</text>
                    <text x="17" y="150" textAnchor="middle" fontSize="10" fill="var(--muted)">{new Date(a.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</text>
                  </g>
                )
              })}
            </svg>
          )}
        </section>
      </div>
    </Page>
  )
}

/* ───────── Certificates ───────── */
function Certificate({ course, user, onClose }) {
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const code = `RI-${course.id.toUpperCase()}-${String(user.id).slice(0, 4).toUpperCase()}-${new Date().getFullYear()}`
  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Certificate">
      <div className="modal-bar no-print">
        <button className="btn btn-gold btn-sm" onClick={() => window.print()}><Printer size={16} /> Print or save as PDF</button>
        <button className="btn btn-outline-light btn-sm" onClick={onClose}><X size={16} /> Close</button>
      </div>
      <div className="cert">
        <div className="cert-inner">
          <Mark size={56} />
          <span className="cert-ar" lang="ar" dir="rtl">رواق العلم</span>
          <h2>Certificate of Completion</h2>
          <p>This certifies that</p>
          <b className="cert-name">{user.name}</b>
          <p>has successfully completed the course</p>
          <b className="cert-course">{course.title}</b>
          <span className="cert-course-ar" lang="ar" dir="rtl">{course.arabic}</span>
          <div className="cert-foot">
            <div><b>{date}</b><small>Date issued</small></div>
            <div><b>{site.instructor.name}</b><small>{site.instructor.title}</small></div>
            <div><b>{code}</b><small>Certificate number</small></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Certificates() {
  const { data, user } = useApp()
  const [view, setView] = useState(null)
  const mine = data.enrolled.map(getCourse).filter(Boolean)
  const done = completedCourses(data).map((c) => c.id)
  return (
    <Page title="Certificates" sub="Complete every lesson and pass the course quiz to unlock your certificate.">
      {mine.length === 0 && <p className="empty">Enrol in a course to work towards a certificate.</p>}
      <div className="grid-3">
        {mine.map((c) => {
          const ok = done.includes(c.id)
          const p = courseProgress(c, data)
          const qs = c.quizId ? bestScore(c.quizId, data) : 100
          const pass = c.quizId ? getQuiz(c.quizId).pass : 0
          return (
            <article key={c.id} className={'panel cert-card ' + toneOf(c.id) + (ok ? ' ok' : '')}>
              {ok ? <Award size={32} /> : <Lock size={28} />}
              <h3>{c.title}</h3>
              {ok ? (
                <><p className="muted">Ready to download.</p><button className="btn btn-gold btn-sm" onClick={() => setView(c)}>View certificate</button></>
              ) : (
                <ul className="todo">
                  <li className={p.pct === 100 ? 'ok' : ''}>{p.pct === 100 ? <Check size={14} /> : <i />} Finish all lessons ({p.done}/{p.total})</li>
                  {c.quizId && <li className={(qs ?? 0) >= pass ? 'ok' : ''}>{(qs ?? 0) >= pass ? <Check size={14} /> : <i />} Pass the quiz at {pass}% {qs !== null && `(best ${qs}%)`}</li>}
                </ul>
              )}
            </article>
          )
        })}
      </div>
      {view && <Certificate course={view} user={user} onClose={() => setView(null)} />}
    </Page>
  )
}

/* ───────── Billing ───────── */
export function Billing() {
  const { data, say } = useApp()
  return (
    <Page title="Billing" sub="Fees, payment history and receipts.">
      {!site.features.payments && (
        <div className="notice">
          <b>Online payment is opening soon.</b>
          <span>Until then, pay by bank transfer and send your receipt on WhatsApp. We confirm your seat the same day.</span>
          <a className="btn btn-gold btn-sm" href={waLink('Assalamu alaykum, I would like to make a payment for my course.')} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Pay via WhatsApp</a>
        </div>
      )}
      <div className="plans plans-app">
        {plans.map((p) => (
          <article key={p.id} className={'plan' + (p.featured ? ' featured' : '')}>
            <h3>{p.name}</h3>
            <p className="plan-price"><b>{naira(p.price)}</b> <span>{p.per}</span></p>
            <button className="btn btn-ghost btn-block" disabled={!site.features.payments} onClick={() => say('Payment checkout starts here once Paystack is connected.')}><CreditCard size={16} /> {site.features.payments ? 'Pay online' : 'Card payment soon'}</button>
          </article>
        ))}
      </div>
      <section className="panel">
        <h2>Payment history</h2>
        {data.payments.length === 0 ? <p className="empty">No payments yet. Receipts will appear here.</p> : (
          <table className="table">
            <thead><tr><th>Date</th><th>Item</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>{data.payments.map((p) => <tr key={p.id}><td>{new Date(p.date).toLocaleDateString('en-GB')}</td><td>{p.label}</td><td>{naira(p.amount)}</td><td>{p.status}</td></tr>)}</tbody>
          </table>
        )}
      </section>
    </Page>
  )
}

/* ───────── Settings ───────── */
export function SettingsPage() {
  const { user, updateProfile, signOut, say } = useApp()
  const nav = useNavigate()
  const [f, setF] = useState({ name: user.name, phone: user.phone || '', goal: user.goal || '' })
  const [rem, setRem] = useState({ wa: true, email: true })
  return (
    <Page title="Settings" sub="Your profile and reminders.">
      <div className="dash-grid">
        <form className="panel form" onSubmit={async (e) => { e.preventDefault(); await updateProfile(f); say('Profile saved.') }}>
          <h2>Profile</h2>
          <label>Full name<input className="input" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
          <label>Email<input className="input" value={user.email} disabled /></label>
          <label>WhatsApp number<input className="input" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="+234 …" /></label>
          <label>Learning goal<input className="input" value={f.goal} onChange={(e) => setF({ ...f, goal: e.target.value })} /></label>
          <button className="btn btn-primary">Save changes</button>
        </form>
        <section className="panel">
          <h2>Reminders</h2>
          {[['wa', 'WhatsApp class reminders', 'A message 30 minutes before each live class'], ['email', 'Email weekly summary', 'Your progress and next steps every Sunday']].map(([k, t, d]) => (
            <label className="toggle" key={k}>
              <span><b>{t}</b><small>{d}</small></span>
              <input type="checkbox" checked={rem[k]} onChange={() => { setRem({ ...rem, [k]: !rem[k] }); say('Reminder preference updated.') }} />
            </label>
          ))}
          <button className="btn btn-ghost" onClick={async () => { await signOut(); nav('/') }}>Sign out</button>
        </section>
      </div>
    </Page>
  )
}
