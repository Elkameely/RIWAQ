import { useState } from 'react';
import CourseCard from '../components/CourseCard';
import { COURSES } from '../data/courses';
import { waLink } from '../services/whatsapp';

const FILTERS = ['All', 'Beginner', 'Intermediate'];

export default function Courses() {
  const [f, setF] = useState('All');
  const list = COURSES.filter((c) => f === 'All' || c.level.startsWith(f));
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Arabic courses</h1>
          <p className="lead">Six courses in a clear order. Not sure where to begin? Message us and we will point you to the right one.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="chips" role="tablist" aria-label="Filter by level">
            {FILTERS.map((x) => (
              <button key={x} role="tab" aria-selected={f === x} className={f === x ? 'on' : ''} onClick={() => setF(x)}>{x}</button>
            ))}
          </div>
          <div className="course-grid">
            {list.map((c) => <CourseCard key={c.slug} course={c} />)}
          </div>
          <p className="center-link muted">
            Unsure of your level? <a href={waLink('Assalamu alaykum, please help me choose a course.')} target="_blank" rel="noreferrer">Ask on WhatsApp</a>
          </p>
        </div>
      </section>
    </>
  );
}
