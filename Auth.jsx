import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Logo, Arch } from '../components/ui';
import { useApp } from '../context/AppContext';

function Shell({ title, sub, children, foot }) {
  return (
    <section className="auth">
      <div className="auth-art" aria-hidden="true">
        <Arch><span className="ar-big" lang="ar">أهلاً وسهلاً</span><small>Welcome</small></Arch>
      </div>
      <div className="auth-form">
        <Logo small />
        <h1>{title}</h1>
        <p className="muted">{sub}</p>
        {children}
        <p className="auth-foot">{foot}</p>
      </div>
    </section>
  );
}

function useSubmit(fn, to) {
  const nav = useNavigate();
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const run = async (e) => {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await fn(new FormData(e.target));
      nav(to, { replace: true });
    } catch (x) {
      setErr(x.message);
      setBusy(false);
    }
  };
  return { run, err, busy };
}

export function Login() {
  const { signIn, demo } = useApp();
  const from = useLocation().state?.from || '/app';
  const { run, err, busy } = useSubmit((fd) => signIn({ email: fd.get('email'), password: fd.get('password') }), from);
  const nav = useNavigate();
  return (
    <Shell title="Welcome back" sub="Sign in to continue your lessons." foot={<>New here? <Link to="/register">Create an account</Link></>}>
      <form onSubmit={run} className="form">
        <label>Email<input name="email" type="email" required autoComplete="email" /></label>
        <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
        {err && <p className="error" role="alert">{err}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
      </form>
      <div className="demo-box">
        <p>Looking around? Open a sample student account with progress already filled in.</p>
        <button className="btn btn-ghost btn-block" onClick={async () => { await demo(); nav('/app'); }}>Try the demo student</button>
      </div>
    </Shell>
  );
}

export function Register() {
  const { signUp } = useApp();
  const from = useLocation().state?.from || '/app/courses';
  const { run, err, busy } = useSubmit((fd) => {
    if (fd.get('password').length < 8) throw new Error('Choose a password with at least 8 characters.');
    return signUp({ name: fd.get('name'), email: fd.get('email'), phone: fd.get('phone'), password: fd.get('password') });
  }, from);
  return (
    <Shell title="Create your account" sub="Free to join. Choose a course after you sign up." foot={<>Already a student? <Link to="/login">Sign in</Link></>}>
      <form onSubmit={run} className="form">
        <label>Full name<input name="name" required autoComplete="name" /></label>
        <label>Email<input name="email" type="email" required autoComplete="email" /></label>
        <label>WhatsApp number <span className="muted small">(optional, for class reminders)</span><input name="phone" type="tel" autoComplete="tel" placeholder="+234…" /></label>
        <label>Password<input name="password" type="password" required minLength={8} autoComplete="new-password" /></label>
        {err && <p className="error" role="alert">{err}</p>}
        <button className="btn btn-primary btn-block" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
      </form>
    </Shell>
  );
}
