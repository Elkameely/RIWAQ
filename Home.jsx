import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarClock, MonitorPlay, ClipboardCheck, LineChart, Award, MessageCircle, ChevronDown, Check, Sunset, Users, Languages, BookOpenCheck, Video } from 'lucide-react'
import { courses, getCourse } from '../data/courses'
import { sessions, nextOccurrence, countdown, fmtDay, fmtTime } from '../data/schedule'
import { site, plans, faqs, testimonials, waLink } from '../data/site'
import { CourseCard, WeekGrid } from '../components/Shared'
import { Ring, SectionHead, Mark, Bar } from '../components/Brand'
import { naira } from '../lib/progress'

function useNow(ms = 30000) {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), ms); return () => clearInterval(t) }, [ms])
  return now
}

export function nextClass(now = new Date()) {
  return sessions
    .map((s) => ({ s, at: nextOccurrence(s, now) }))
    .filter((x) => x.at)
    .sort((a, b) => a.at - b.at)[0]
}

function Hero() {
  const now = useNow()
  const n = nextClass(now)
  const c = getCourse(n.s.courseId)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1>Learn Arabic properly, in the hours you actually have.</h1>
          <p className="lead">
            Live evening and weekend classes for working adults, taught in clear English in small groups. Every lesson is recorded, every unit has a quiz, and your progress is always in front of you.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary btn-lg" to="/register">Start learning</Link>
            <Link className="btn btn-ghost btn-lg" to="/courses">Browse courses</Link>
          </div>
          <ul className="hero-facts">
            <li><Sunset size={20} /><span><b>Evenings and weekends</b>Classes after work, in West Africa Time</span></li>
            <li><MonitorPlay size={20} /><span><b>Nothing missed</b>Every class recorded with notes</span></li>
            <li><Award size={20} /><span><b>Certificate</b>Awarded on completing a course</span></li>
          </ul>
        </div>

        <div className="hero-stage" aria-hidden="false">
          <div className="arch">
            <div className="arch-inner">
              <span className="arch-word" lang="ar" dir="rtl">علم</span>
              <span className="arch-sub">ʿilm — knowledge</span>
            </div>
          </div>
          <div className="float-card next">
            <div className="fc-top"><span className="live-dot" /> Next live class</div>
            <b>{c.title}</b>
            <span>{n.s.topic}</span>
            <div className="fc-row">
              <span>{fmtDay(n.at, tz)}, {fmtTime(n.at, tz)}</span>
              <em>{countdown(n.at, now) === 'Live now' ? 'Live now' : 'in ' + countdown(n.at, now)}</em>
            </div>
          </div>
          <div className="float-card letters" lang="ar" dir="rtl">
            <span>ب</span><span>ت</span><span>ث</span>
          </div>
        </div>
      </div>
    </section>
  )
}

const features = [
  { icon: CalendarClock, t: 'Live classes that fit your day', d: 'Small groups meet on weekday evenings and weekend mornings. A timetable you can plan a job and a family around.' },
  { icon: MonitorPlay, t: 'Recorded lessons', d: 'Each class is recorded and posted with notes, so a late meeting or a sick child never puts you behind.' },
  { icon: ClipboardCheck, t: 'Quizzes after each unit', d: 'Short quizzes with instant marking and an explanation for every answer, so mistakes become lessons.' },
  { icon: LineChart, t: 'Progress you can see', d: 'Your dashboard shows completed lessons, quiz scores and what to study next, in one place.' },
  { icon: Users, t: 'A real study community', d: 'A WhatsApp group for each class for questions, reminders and encouragement between sessions.' },
  { icon: Languages, t: 'Taught in clear English', d: 'Explanations in plain English with Arabic examples from the Qur’an and daily life.' },
]

const path = [
  { c: 'c1', note: 'Letters, vowels, first words.' },
  { c: 'c2', note: 'Understand what you recite.' },
  { c: 'c3', note: 'Grammar and word patterns, taken together.', extra: 'c4' },
  { c: 'c6', note: 'Read the classical texts.' },
]

function Plans() {
  return (
    <section className="section" id="plans">
      <div className="container">
        <SectionHead title="Simple fees, no surprises">Prices are in naira. Online payment is being switched on; until then we confirm your seat on WhatsApp.</SectionHead>
        <div className="plans">
          {plans.map((p) => (
            <article key={p.id} className={'plan' + (p.featured ? ' featured' : '')}>
              {p.featured && <span className="plan-badge">Most chosen</span>}
              <h3>{p.name}</h3>
              <p className="plan-price"><b>{naira(p.price)}</b> <span>{p.per}</span></p>
              <p className="plan-blurb">{p.blurb}</p>
              <ul>{p.features.map((f) => <li key={f}><Check size={16} />{f}</li>)}</ul>
              <a className={'btn ' + (p.featured ? 'btn-gold' : 'btn-ghost')} href={waLink(`Assalamu alaykum, I would like to reserve a seat on the "${p.name}" plan.`)} target="_blank" rel="noreferrer">Reserve on WhatsApp</a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
export { Plans }

export default function Home() {
  const [open, setOpen] = useState(0)
  return (
    <>
      <Hero />

      <section className="band">
        <div className="container band-grid">
          <span><Sunset size={18} /> Evening and weekend classes</span>
          <span><Users size={18} /> Small groups</span>
          <span><Video size={18} /> Every class recorded</span>
          <span><BookOpenCheck size={18} /> Qur’anic and modern Arabic</span>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div className="split-head">
            <h2>A classroom built around a working life</h2>
            <p>Most adults do not fail at Arabic for lack of effort. They fail because the class was at the wrong time, or too fast, or never explained why. We designed Riwaqul Ilm to remove those three problems.</p>
            <Link className="btn btn-ghost" to="/about">Meet the academy</Link>
          </div>
          <div className="features">
            {features.map(({ icon: I, t, d }) => (
              <article key={t} className="feature">
                <span className="feature-icon"><I size={22} /></span>
                <h3>{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-mint">
        <div className="container">
          <SectionHead title="One clear path, from the alphabet to the classics">Start where you are. Each stage prepares you for the next, so you always know what comes after this course.</SectionHead>
          <ol className="path">
            {path.map((p, i) => {
              const c = getCourse(p.c)
              const e = p.extra && getCourse(p.extra)
              return (
                <li key={p.c} className="path-step">
                  <span className="path-node">{i + 1}</span>
                  <div>
                    <h3><Link to={`/courses/${c.slug}`}>{c.title}</Link>{e && <> and <Link to={`/courses/${e.slug}`}>{e.title}</Link></>}</h3>
                    <p>{p.note}</p>
                    <small>{c.level}{e ? '' : ''} level, {c.weeks} weeks</small>
                  </div>
                  <span className="path-ar" lang="ar" dir="rtl">{c.arabic}</span>
                </li>
              )
            })}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="Courses open for enrolment">Six programmes across beginner, intermediate and advanced levels.</SectionHead>
          <div className="grid-3">
            {courses.slice(0, 3).map((c) => <CourseCard key={c.id} course={c} />)}
          </div>
          <p className="center-cta"><Link className="btn btn-primary" to="/courses">See all six courses</Link></p>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container split split-center">
          <div className="split-head light">
            <h2>Your dashboard keeps the whole course in one place</h2>
            <p>Join the live class with one tap, rewatch any recording, take the unit quiz, and see exactly how far you have come. It works the same on a phone during a commute as on a laptop at home.</p>
            <ul className="tick-list">
              <li><Check size={18} /> Timetable with calendar reminders</li>
              <li><Check size={18} /> Recorded lessons, notes and worksheets</li>
              <li><Check size={18} /> Instant-marked quizzes with explanations</li>
              <li><Check size={18} /> Certificates when you complete a course</li>
            </ul>
            <Link className="btn btn-gold" to="/register">Create your free account</Link>
          </div>
          <div className="mock" aria-hidden="true">
            <div className="mock-top"><Mark size={22} /> <b>Assalamu alaykum, Amina</b></div>
            <div className="mock-row">
              <div className="mock-card"><Ring pct={72} size={84} stroke={8} label="done" /><small>Overall progress</small></div>
              <div className="mock-card"><b className="mock-big">83%</b><small>Quiz average</small><Bar pct={83} /></div>
            </div>
            <div className="mock-card mock-wide">
              <small>Up next</small>
              <b>Nahw Made Simple</b>
              <span>Wednesday, 8:00 pm WAT</span>
              <i className="mock-btn"><Video size={14} /> Join live class</i>
            </div>
            <div className="mock-card mock-wide">
              <small>Continue learning</small>
              <b>Qur’anic Arabic: Commands and prohibitions</b>
              <Bar pct={64} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="The weekly timetable">All times are in West Africa Time (WAT). Where your device is in another time zone, we show your local time too.</SectionHead>
          <WeekGrid sessions={sessions} />
          <p className="center-cta"><Link className="btn btn-ghost" to="/timetable">Open full timetable</Link></p>
        </div>
      </section>

      <section className="section section-mint">
        <div className="container instructor">
          <div className="portrait">
            <div className="portrait-arch"><span lang="ar" dir="rtl">معلّم</span></div>
          </div>
          <div>
            <h2>Taught by a teacher who understands the adult learner</h2>
            <p>{site.instructor.bio[0]}</p>
            <p>{site.instructor.bio[1]}</p>
            <p className="byline"><b>{site.instructor.name}</b><span>{site.instructor.title}</span></p>
            <Link className="btn btn-primary" to="/about">About the academy</Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="What students say" />
          <div className="grid-3">
            {testimonials.map((t, i) => (
              <figure key={i} className="quote">
                <blockquote>“{t.text}”</blockquote>
                <figcaption><b>{t.name}</b><span>{t.role}</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <Plans />

      <section className="section section-mint">
        <div className="container faq-wrap">
          <SectionHead title="Questions before you join">Not here? Ask us on WhatsApp and we will reply the same day.</SectionHead>
          <div className="faq">
            {faqs.map((f, i) => (
              <div key={f.q} className={'faq-item' + (open === i ? ' open' : '')}>
                <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                  {f.q}<ChevronDown size={20} />
                </button>
                <div className="faq-a"><p>{f.a}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <div>
            <h2>Take your seat in the next class</h2>
            <p>Create an account in a minute, or message us for a free level assessment.</p>
          </div>
          <div className="cta-btns">
            <Link className="btn btn-gold btn-lg" to="/register">Create account</Link>
            <a className="btn btn-outline-light btn-lg" href={waLink('Assalamu alaykum, I would like a free level assessment.')} target="_blank" rel="noreferrer"><MessageCircle size={18} /> WhatsApp us</a>
          </div>
        </div>
      </section>
    </>
  )
}
