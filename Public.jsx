import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom'
import { Clock, CalendarDays, Check, GraduationCap, MessageCircle, Mail, Send, PlayCircle, FileText, ClipboardList, Eye, EyeOff } from 'lucide-react'
import { courses, getCourse, levels, lessonsOf } from '../data/courses'
import { sessions } from '../data/schedule'
import { site, waLink } from '../data/site'
import { CourseCard, WeekGrid, toneOf } from '../components/Shared'
import { Logo, SectionHead } from '../components/Brand'
import { naira } from '../lib/progress'
import { useApp } from '../lib/AppContext'
import { Plans } from './Home'

const PageHead = ({ title, children, ar }) => (
  <section className="page-head">
    <div className="container">
      {ar && <span className="page-head-ar" lang="ar" dir="rtl">{ar}</span>}
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  </section>
)

/* ───────── Courses ───────── */
export function Courses() {
  const [level, setLevel] = useState('All')
  const [q, setQ] = useState('')
  const list = useMemo(
    () => courses.filter((c) => (level === 'All' || c.level === level) && (c.title + c.tagline + c.arabic).toLowerCase().includes(q.toLowerCase())),
    [level, q],
  )
  return (
    <>
      <PageHead title="Arabic courses" ar="الدورات">Choose a level, read the outline, and join a small live group. Every course includes recordings, notes, quizzes and a certificate.</PageHead>
      <section className="section">
        <div className="container">
          <div className="filters">
            <div className="chips" role="group" aria-label="Filter by level">
              {levels.map((l) => (
                <button key={l} className={'chip' + (level === l ? ' on' : '')} onClick={() => setLevel(l)}>{l}</button>
              ))}
            </div>
            <input className="input search" type="search" placeholder="Search courses" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search courses" />
          </div>
          {list.length ? (
            <div className="grid-3">{list.map((c) => <CourseCard key={c.id} course={c} />)}</div>
          ) : (
            <p className="empty">No course matches “{q}”. Clear the search or choose another level.</p>
          )}
        </div>
      </section>
      <Plans />
    </>
  )
}

export function CourseDetail() {
  const { slug } = useParams()
  const c = getCourse(slug)
  const { user, data, enroll, say } = useApp()
  const nav = useNavigate()
  if (!c) return <Navigate to="/courses" replace />
  const lessons = lessonsOf(c)
  const hrs = Math.round(lessons.reduce((s, l) => s + l.minutes, 0) / 60)
  const mySessions = sessions.filter((s) => s.courseId === c.id)
  const enrolled = user && data.enrolled.includes(c.id)
  const join = async () => {
    if (!user) return nav('/register', { state: { from: `/courses/${c.slug}` } })
    await enroll(c.id)
    say(`You are enrolled in ${c.title}.`)
    nav('/app/courses/' + c.id)
  }
  const Icon = { v: PlayCircle, p: FileText, q: ClipboardList }
  return (
    <>
      <section className={'detail-head ' + toneOf(c.id)}>
        <div className="container detail-grid">
          <div>
            <span className="chip on static">{c.level}</span>
            <h1>{c.title}</h1>
            <p className="lead">{c.description}</p>
            <ul className="meta meta-light">
              <li><Clock size={16} /> {c.weeks} weeks</li>
              <li><CalendarDays size={16} /> {c.sessionsPerWeek} live per week</li>
              <li><PlayCircle size={16} /> {lessons.length} lessons, about {hrs} hours</li>
            </ul>
          </div>
          <aside className="enroll">
            <span className="enroll-ar" lang="ar" dir="rtl">{c.arabic}</span>
            <p className="enroll-price"><b>{naira(c.price)}</b> one-off</p>
            {enrolled ? (
              <Link className="btn btn-gold btn-block" to={'/app/courses/' + c.id}>Continue course</Link>
            ) : (
              <button className="btn btn-gold btn-block" onClick={join}>{user ? 'Enrol in this course' : 'Create account to enrol'}</button>
            )}
            <a className="btn btn-outline-light btn-block" href={waLink(`Assalamu alaykum, I have a question about "${c.title}".`)} target="_blank" rel="noreferrer"><MessageCircle size={16} /> Ask about this course</a>
            <small>{site.features.payments ? 'Pay securely online.' : 'Online payment opens soon. Your seat is confirmed on WhatsApp.'}</small>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container detail-body">
          <div>
            <h2>What you will be able to do</h2>
            <ul className="outcomes">{c.outcomes.map((o) => <li key={o}><Check size={18} />{o}</li>)}</ul>

            <h2 className="mt">Course outline</h2>
            <div className="outline">
              {c.modules.map((m, i) => (
                <details key={m.id} open={i === 0}>
                  <summary><b>{m.title}</b><small>{m.lessons.length} lessons</small></summary>
                  <ul>
                    {m.lessons.map((l) => {
                      const I = Icon[l.type]
                      return <li key={l.id}><I size={16} />{l.title}<small>{l.minutes} min</small></li>
                    })}
                  </ul>
                </details>
              ))}
            </div>
          </div>
          <aside className="detail-side">
            <h3>Live class times</h3>
            <ul className="times">
              {mySessions.map((s) => (
                <li key={s.id}><b>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][s.day]}</b> {s.time} {site.tzLabel}<small>{s.topic}, {s.mins} min</small></li>
              ))}
            </ul>
            <h3>Related courses</h3>
            <ul className="related">
              {courses.filter((x) => x.id !== c.id && x.level === c.level).slice(0, 3).map((x) => <li key={x.id}><Link to={`/courses/${x.slug}`}>{x.title}</Link></li>)}
            </ul>
          </aside>
        </div>
      </section>
    </>
  )
}

/* ───────── Timetable ───────── */
export function Timetable() {
  return (
    <>
      <PageHead title="Weekly timetable" ar="الجدول">Every live class, in West Africa Time. Sign in to add classes to your calendar and join with one tap.</PageHead>
      <section className="section"><div className="container"><WeekGrid sessions={sessions} /></div></section>
    </>
  )
}

/* ───────── About ───────── */
export function About() {
  const i = site.instructor
  return (
    <>
      <PageHead title="About Riwaqul Ilm" ar="رواق العلم">A riwaq is the covered arcade of a mosque or madrasa, where students sat in circles to learn. We have kept the circle and moved it online.</PageHead>
      <section className="section">
        <div className="container instructor">
          <div className="portrait"><div className="portrait-arch"><span lang="ar" dir="rtl">علم</span></div></div>
          <div>
            <h2>Our approach</h2>
            <p>Riwaqul Ilm is an online Arabic academy for adults with full lives. We teach the language of the Qur’an and of the classical tradition, and we teach it in a way that respects your time.</p>
            <ul className="outcomes">
              <li><Check size={18} />Small live groups, so every student is heard</li>
              <li><Check size={18} />Grammar explained from first principles, always with examples</li>
              <li><Check size={18} />Weekly rhythm: one live class, one recording, one quiz</li>
              <li><Check size={18} />Honest progress tracking, with nothing hidden behind jargon</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="section section-mint">
        <div className="container instructor flip">
          <div>
            <h2>Your instructor</h2>
            <p className="byline big"><b>{i.name}</b><span>{i.title}</span></p>
            {i.bio.map((p) => <p key={p}>{p}</p>)}
            <h3 className="mt-s">Qualifications and experience</h3>
            <ul className="outcomes">{i.credentials.map((c) => <li key={c}><GraduationCap size={18} />{c}</li>)}</ul>
          </div>
          <div className="portrait"><div className="portrait-arch gold"><span lang="ar" dir="rtl">معلّم</span></div></div>
        </div>
      </section>
      <section className="cta">
        <div className="container cta-inner">
          <div><h2>Come and sit with us</h2><p>Ask a question, or book a free level assessment.</p></div>
          <div className="cta-btns">
            <Link className="btn btn-gold btn-lg" to="/courses">See courses</Link>
            <a className="btn btn-outline-light btn-lg" href={waLink()} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp us</a>
          </div>
        </div>
      </section>
    </>
  )
}

/* ───────── Contact (opens WhatsApp with the message pre-filled) ───────── */
export function Contact() {
  const [f, setF] = useState({ name: '', interest: 'Not sure yet', msg: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    const text = `Assalamu alaykum, my name is ${f.name}. I am interested in: ${f.interest}. ${f.msg}`.trim()
    window.open(waLink(text), '_blank', 'noopener')
  }
  return (
    <>
      <PageHead title="Contact us" ar="تواصل معنا">The quickest way to reach us is WhatsApp. We reply the same day.</PageHead>
      <section className="section">
        <div className="container contact">
          <form className="card form" onSubmit={submit}>
            <h2>Send us a message</h2>
            <label>Your name<input className="input" required value={f.name} onChange={set('name')} autoComplete="name" /></label>
            <label>What are you interested in?
              <select className="input" value={f.interest} onChange={set('interest')}>
                <option>Not sure yet</option>
                {courses.map((c) => <option key={c.id}>{c.title}</option>)}
                <option>Free level assessment</option>
              </select>
            </label>
            <label>Message<textarea className="input" rows="4" value={f.msg} onChange={set('msg')} placeholder="Tell us a little about your Arabic so far." /></label>
            <button className="btn btn-primary" type="submit"><Send size={16} /> Continue in WhatsApp</button>
            <small className="hint">This opens WhatsApp with your message ready to send.</small>
          </form>
          <div className="contact-side">
            <a className="card contact-card" href={waLink()} target="_blank" rel="noreferrer"><MessageCircle size={24} /><div><b>WhatsApp</b><span>Fastest reply</span></div></a>
            <a className="card contact-card" href={`mailto:${site.email}`}><Mail size={24} /><div><b>Email</b><span>{site.email}</span></div></a>
            <div className="card contact-card"><Clock size={24} /><div><b>Office hours</b><span>Mon to Sat, 9:00 am to 9:00 pm {site.tzLabel}</span></div></div>
          </div>
        </div>
      </section>
    </>
  )
}

/* ───────── Auth ───────── */
function AuthShell({ title, sub, children, foot }) {
  return (
    <section className="auth">
      <div className="auth-art">
        <Logo light />
        <div>
          <span className="auth-ar" lang="ar" dir="rtl">اطلبوا العلم</span>
          <p>Seek knowledge. Study with a small group, on a schedule you can keep.</p>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-card">
          <Link to="/" className="auth-back">Back to website</Link>
          <h1>{title}</h1>
          <p className="sub">{sub}</p>
          {children}
          <p className="auth-foot">{foot}</p>
        </div>
      </div>
    </section>
  )
}

const PasswordField = ({ value, onChange, label = 'Password', auto }) => {
  const [show, setShow] = useState(false)
  return (
    <label>{label}
      <span className="pw">
        <input className="input" type={show ? 'text' : 'password'} required minLength={6} value={value} onChange={onChange} autoComplete={auto} />
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? 'Hide password' : 'Show password'}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
      </span>
    </label>
  )
}

export function Login() {
  const { signIn, demo, user, say } = useApp()
  const nav = useNavigate()
  const loc = useLocation()
  const [f, setF] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const to = loc.state?.from || '/app'
  if (user) return <Navigate to="/app" replace />
  const go = async (fn, ok) => {
    setBusy(true); setErr('')
    try { await fn(); say(ok); nav(to) } catch (e) { setErr(e.message); setBusy(false) }
  }
  return (
    <AuthShell title="Welcome back" sub="Sign in to your student dashboard." foot={<>New here? <Link to="/register">Create an account</Link></>}>
      <form className="form" onSubmit={(e) => { e.preventDefault(); go(() => signIn(f), 'Signed in.') }}>
        <label>Email<input className="input" type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" /></label>
        <PasswordField value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} auto="current-password" />
        {err && <p className="error" role="alert">{err}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <div className="or"><span>or preview the platform</span></div>
      <button className="btn btn-ghost btn-block" disabled={busy} onClick={() => go(demo, 'Signed in to the demo account.')}>Open demo student account</button>
    </AuthShell>
  )
}

export function Register() {
  const { signUp, user, say } = useApp()
  const nav = useNavigate()
  const loc = useLocation()
  const [f, setF] = useState({ name: '', email: '', phone: '', goal: 'Understand the Qur’an', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to="/app" replace />
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr('')
    try { await signUp(f); say('Welcome to Riwaqul Ilm. Your account is ready.'); nav(loc.state?.from || '/app') } catch (x) { setErr(x.message); setBusy(false) }
  }
  return (
    <AuthShell title="Create your account" sub="Free to create. Choose a course whenever you are ready." foot={<>Already a student? <Link to="/login">Sign in</Link></>}>
      <form className="form" onSubmit={submit}>
        <label>Full name<input className="input" required value={f.name} onChange={set('name')} autoComplete="name" /></label>
        <label>Email<input className="input" type="email" required value={f.email} onChange={set('email')} autoComplete="email" /></label>
        <label>WhatsApp number<input className="input" type="tel" value={f.phone} onChange={set('phone')} placeholder="+234 …" autoComplete="tel" /></label>
        <label>Why do you want to learn Arabic?
          <select className="input" value={f.goal} onChange={set('goal')}>
            <option>Understand the Qur’an</option><option>Read classical texts</option><option>Speak for travel or work</option><option>Teach others</option><option>General interest</option>
          </select>
        </label>
        <PasswordField value={f.password} onChange={set('password')} label="Password (6+ characters)" auto="new-password" />
        {err && <p className="error" role="alert">{err}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      </form>
    </AuthShell>
  )
}

export function NotFound() {
  return (
    <section className="page-head"><div className="container">
      <span className="page-head-ar" lang="ar" dir="rtl">٤٠٤</span>
      <h1>We could not find that page</h1>
      <p>The link may be old. Go back to the <Link to="/">home page</Link> or see the <Link to="/courses">courses</Link>.</p>
    </div></section>
  )
}
