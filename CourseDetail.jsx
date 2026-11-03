import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check, PlayCircle, FileQuestion } from 'lucide-react';
import { getCourse, formatPrice } from '../data/courses';
import { quizzesForCourse } from '../data/quizzes';
import { CLASSES, nextOccurrence, fmtDay, fmtTime, localTz, tzShort } from '../data/schedule';
import { ACADEMY, PAYMENTS_ENABLED } from '../config';
import { useApp } from '../context/AppContext';
import { waLink } from '../services/whatsapp';
import { useState } from 'react';

export default function CourseDetail() {
  const { slug } = useParams();
  const course = getCourse(slug);
  const { user, enrolledSlugs, enroll } = useApp();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  if (!course) return <div className="container section"><h1>Course not found</h1><Link to="/courses">Back to courses</Link></div>;

  const cls = CLASSES.find((c) => c.id === course.classId);
  const start = cls && nextOccurrence(cls);
  const tz = localTz();
  const enrolled = enrolledSlugs.has(course.slug);
  const quizzes = quizzesForCourse(course.slug);

  const onEnroll = async () => {
    if (!user) return nav('/register', { state: { from: `/courses/${course.slug}` } });
    setBusy(true);
    setErr('');
    try {
      await enroll(course.slug);
      nav(`/app/learn/${course.slug}`);
    } catch (e) {
      setErr(e.message);
      setBusy(false);
    }
  };

  return (
    <>
      <section className="page-hero course-hero">
        <div className="container hero-split">
          <div>
            <p className="crumb"><Link to="/courses">Courses</Link> / {course.level}</p>
            <h1>{course.title}</h1>
            <p className="ar-sub" lang="ar">{course.arabic}</p>
            <p className="lead">{course.summary}</p>
          </div>
          <aside className="enrol-box">
            <p className="price">{formatPrice(course.price, ACADEMY.currency)}</p>
            <p className="muted small">{PAYMENTS_ENABLED ? 'One payment, no subscription.' : 'Free while the academy opens. One payment, no subscription, once payments go live.'}</p>
            {enrolled ? (
              <Link className="btn btn-gold btn-block" to={`/app/learn/${course.slug}`}>Continue learning</Link>
            ) : (
              <button className="btn btn-gold btn-block" onClick={onEnroll} disabled={busy}>
                {busy ? 'Enrolling…' : user ? 'Enrol in this course' : 'Create account to enrol'}
              </button>
            )}
            {err && <p className="error">{err}</p>}
            <a className="btn btn-ghost-light btn-block" href={waLink(`Assalamu alaykum, I have a question about "${course.title}".`)} target="_blank" rel="noreferrer">Ask a question on WhatsApp</a>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container two-col wide-left">
          <div>
            <h2>What you will be able to do</h2>
            <ul className="ticks">
              {course.outcomes.map((o) => <li key={o}><Check size={18} /> {o}</li>)}
            </ul>

            <h2 className="mt">Syllabus</h2>
            {course.modules.map((m, i) => (
              <div key={m.title} className="syllabus">
                <h3>Module {i + 1}: {m.title}</h3>
                <ul>
                  {m.lessons.map((l) => (
                    <li key={l.id}><PlayCircle size={17} /><span>{l.title}</span><em>{l.minutes} min</em></li>
                  ))}
                </ul>
              </div>
            ))}
            {quizzes.length > 0 && (
              <p className="quiz-note"><FileQuestion size={17} /> Includes {quizzes.length} quiz{quizzes.length > 1 ? 'zes' : ''}: {quizzes.map((q) => q.title).join(', ')}.</p>
            )}
          </div>

          <aside className="facts">
            <h3>At a glance</h3>
            <dl>
              <dt>Level</dt><dd>{course.level}</dd>
              <dt>Length</dt><dd>{course.weeks} weeks</dd>
              <dt>Live class</dt>
              <dd>
                {cls ? `${fmtTime(start, ACADEMY.timezone)} ${ACADEMY.timezoneLabel}, ${cls.minutes} minutes` : 'To be announced'}
                {start && <><br /><span className="muted small">Your time: {fmtDay(start, tz)}, {fmtTime(start, tz)} {tzShort(start, tz)}</span></>}
              </dd>
              <dt>Recorded lessons</dt><dd>{course.lessonCount} ({Math.round(course.minutes / 60)} hours)</dd>
              <dt>Certificate</dt><dd>On completion</dd>
            </dl>
          </aside>
        </div>
      </section>
    </>
  );
}
