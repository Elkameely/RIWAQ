import { useState } from 'react';
import { MessageCircle, Mail } from 'lucide-react';
import { ACADEMY } from '../config';
import { waLink } from '../services/whatsapp';

export default function Contact() {
  const [f, setF] = useState({ name: '', level: 'Complete beginner', message: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  // Sends the form as a WhatsApp message. No server needed.
  const submit = (e) => {
    e.preventDefault();
    const text = `Assalamu alaykum, my name is ${f.name}. My Arabic level: ${f.level}. ${f.message}`;
    window.open(waLink(text), '_blank', 'noopener');
  };

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Talk to us</h1>
          <p className="lead">The quickest way to reach us is WhatsApp. We reply within a day.</p>
        </div>
      </section>
      <section className="section">
        <div className="container two-col">
          <form className="form" onSubmit={submit}>
            <h2>Send a message</h2>
            <label>Your name<input required value={f.name} onChange={set('name')} autoComplete="name" /></label>
            <label>Your Arabic level
              <select value={f.level} onChange={set('level')}>
                <option>Complete beginner</option>
                <option>I can read the Qur'an slowly</option>
                <option>I know some words and grammar</option>
                <option>Intermediate</option>
              </select>
            </label>
            <label>How can we help?<textarea rows="5" required value={f.message} onChange={set('message')} placeholder="Tell us your goal and which evenings suit you." /></label>
            <button className="btn btn-primary" type="submit"><MessageCircle size={18} /> Send on WhatsApp</button>
            <p className="muted small">This opens WhatsApp with your message ready to send.</p>
          </form>
          <div>
            <h2>Other ways to reach us</h2>
            <ul className="contact-list">
              <li><MessageCircle size={20} /><div><strong>WhatsApp</strong><a href={waLink()} target="_blank" rel="noreferrer">Chat with the academy</a></div></li>
              <li><Mail size={20} /><div><strong>Email</strong><a href={`mailto:${ACADEMY.email}`}>{ACADEMY.email}</a></div></li>
            </ul>
            {ACADEMY.whatsappGroup && <a className="btn btn-ghost" href={ACADEMY.whatsappGroup} target="_blank" rel="noreferrer">Join the students' group</a>}
          </div>
        </div>
      </section>
    </>
  );
}
