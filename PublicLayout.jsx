import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, MessageCircle, Mail } from 'lucide-react'
import { Logo } from './Brand'
import { site, waLink } from '../data/site'
import { useApp } from '../lib/AppContext'

export function WhatsAppFab() {
  return (
    <a className="wa-fab" href={waLink()} target="_blank" rel="noreferrer" aria-label="Chat with us on WhatsApp">
      <MessageCircle size={26} />
      <span>Chat on WhatsApp</span>
    </a>
  )
}

export default function PublicLayout() {
  const [open, setOpen] = useState(false)
  const { user } = useApp()
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])

  const links = [
    ['/courses', 'Courses'],
    ['/timetable', 'Timetable'],
    ['/about', 'About'],
    ['/contact', 'Contact'],
  ]

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="nav">
        <div className="container nav-inner">
          <Logo />
          <nav className={'nav-links' + (open ? ' open' : '')} aria-label="Main">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to}>{label}</NavLink>
            ))}
            <div className="nav-cta-mobile">
              {user ? <Link className="btn btn-primary" to="/app">My dashboard</Link> : (<><Link className="btn btn-ghost" to="/login">Sign in</Link><Link className="btn btn-primary" to="/register">Join the academy</Link></>)}
            </div>
          </nav>
          <div className="nav-cta">
            {user ? (
              <Link className="btn btn-primary btn-sm" to="/app">My dashboard</Link>
            ) : (
              <>
                <Link className="nav-signin" to="/login">Sign in</Link>
                <Link className="btn btn-primary btn-sm" to="/register">Join the academy</Link>
              </>
            )}
          </div>
          <button className="nav-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>
      <main id="main"><Outlet /></main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo light />
          <p className="footer-note">{site.tagline}</p>
          <div className="footer-contact">
            <a href={waLink()} target="_blank" rel="noreferrer"><MessageCircle size={16} /> WhatsApp us</a>
            <a href={`mailto:${site.email}`}><Mail size={16} /> {site.email}</a>
          </div>
        </div>
        <div>
          <h5>Learn</h5>
          <Link to="/courses">All courses</Link>
          <Link to="/timetable">Class timetable</Link>
          <Link to="/register">Create an account</Link>
          <Link to="/login">Student sign in</Link>
        </div>
        <div>
          <h5>Academy</h5>
          <Link to="/about">About and instructor</Link>
          <Link to="/contact">Contact</Link>
          <a href={waLink('Assalamu alaykum, I would like a free level assessment.')} target="_blank" rel="noreferrer">Free level assessment</a>
        </div>
      </div>
      <div className="container footer-base">
        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <span lang="ar" dir="rtl" className="ar">وَقُل رَّبِّ زِدْنِي عِلْمًا</span>
      </div>
    </footer>
  )
}
