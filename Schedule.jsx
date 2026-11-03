import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, Radio } from 'lucide-react';
import { CLASSES, upcoming, fmtDay, fmtTime, localTz, tzShort, downloadICS, isLive, countdown } from '../data/schedule';
import { ACADEMY } from '../config';

export function ScheduleList({ app = false }) {
  const [mode, setMode] = useState('local');
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const tz = mode === 'local' ? localTz() : ACADEMY.timezone;
  const list = upcoming(CLASSES, now);

  return (
    <>
      <div className="tz-toggle" role="group" aria-label="Time zone">
        <button className={mode === 'local' ? 'on' : ''} onClick={() => setMode('local')}>My time ({tzShort(now, localTz()) || localTz()})</button>
        <button className={mode === 'wat' ? 'on' : ''} onClick={() => setMode('wat')}>Academy time ({ACADEMY.timezoneLabel})</button>
      </div>
      <ul className="sched">
        {list.map((c) => {
          const live = isLive(c, now);
          return (
            <li key={c.id} className={live ? 'is-live' : ''}>
              <div className="sched-when">
                <strong>{fmtTime(c.start, tz)}</strong>
                <span>{fmtDay(c.start, tz)}</span>
              </div>
              <div className="sched-what">
                <h3>{c.title}</h3>
                <p>{c.minutes} minutes · {live ? <b className="live-pill"><Radio size={13} /> Live now</b> : countdown(c.start, now)}</p>
              </div>
              <div className="sched-act">
                {app ? (
                  <>
                    <a className={`btn btn-sm ${live ? 'btn-gold' : 'btn-primary'}`} href={ACADEMY.classLink} target="_blank" rel="noreferrer">Join class</a>
                    <button className="btn btn-sm btn-ghost" onClick={() => downloadICS(c, ACADEMY.classLink)}><CalendarPlus size={15} /> Add to calendar</button>
                  </>
                ) : c.course ? (
                  <Link className="btn btn-sm btn-ghost" to={`/courses/${c.course}`}>View course</Link>
                ) : (
                  <span className="muted small">All students</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function Schedule() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Class schedule</h1>
          <p className="lead">Live classes every week, shown in your own time zone. Enrolled students get the join link on their dashboard.</p>
        </div>
      </section>
      <section className="section">
        <div className="container narrow">
          <ScheduleList />
        </div>
      </section>
    </>
  );
}
