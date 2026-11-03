import { Arch, LinkButton, SectionHead } from '../components/ui';
import { INSTRUCTOR, ACADEMY } from '../config';
import { Check } from 'lucide-react';

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>About the academy</h1>
          <p className="lead">A riwaq is the covered walkway of a mosque or madrasa, where people sat in halaqas to learn. RIWAQUL ILM is that place, online.</p>
        </div>
      </section>

      <section className="section">
        <div className="container two-col">
          <div>
            <h2>Why we exist</h2>
            <p>Many Muslims recite Arabic every day and do not understand it. Most Arabic programmes are built for full-time students or children, and they ask for hours that working adults do not have.</p>
            <p>RIWAQUL ILM teaches one live class a week per course, backs it with recorded lessons and short practice, and keeps groups small. The aim is simple: that in a year, you understand more of your salah and your Qur'an than you do today.</p>
          </div>
          <div>
            <h2>How we teach</h2>
            <ul className="ticks">
              <li><Check size={18} /> Start from what you already know, then build one step at a time</li>
              <li><Check size={18} /> Real texts early: the Qur'an, du'a and everyday speech</li>
              <li><Check size={18} /> Speak aloud in every class, with gentle correction</li>
              <li><Check size={18} /> Quizzes you can retake, so mistakes are practice and not failure</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section teacher">
        <div className="container teacher-grid">
          <div className="teacher-portrait">
            <Arch><span className="ar-big" lang="ar">مُعَلِّم</span></Arch>
            <p className="portrait-note">Add your photo in <code>public/instructor.jpg</code></p>
          </div>
          <div>
            <h2>{INSTRUCTOR.name}</h2>
            <p className="muted">{INSTRUCTOR.title}</p>
            {INSTRUCTOR.bio.map((p) => <p key={p}>{p}</p>)}
            <h3 className="mt">Background</h3>
            <ul className="ticks">
              {INSTRUCTOR.credentials.map((c) => <li key={c}><Check size={18} /> {c}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="What you can expect from us" />
          <div className="ledger three">
            <div><h3>A steady rhythm</h3><p>The same day and time every week, so learning becomes a habit and not a project.</p></div>
            <div><h3>Honest progress</h3><p>You see your completed lessons and quiz scores, and we tell you when it is time to move up.</p></div>
            <div><h3>Adab in the classroom</h3><p>A respectful, patient space where beginners are never made to feel behind.</p></div>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container cta-in">
          <div>
            <h2>Join the next cohort of {ACADEMY.name}</h2>
            <p>Create a free account and pick a course.</p>
          </div>
          <div className="cta-actions"><LinkButton to="/register" variant="gold">Start learning</LinkButton></div>
        </div>
      </section>
    </>
  );
}
