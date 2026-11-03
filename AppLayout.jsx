import { useEffect, useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, BookOpen, CalendarDays, FolderOpen, ClipboardCheck, LineChart, Award, CreditCard, Settings, LogOut, Menu, X, MessageCircle } from 'lucide-react'
import { Logo } from '../../components/Brand'
import { useApp } from '../../lib/AppContext'
import { initials } from '../../lib/progress'
import { waLink } from '../../data/site'

const nav = [
  ['/app', 'Overview', LayoutDashboard, true],
  ['/app/courses', 'My courses', BookOpen],
  ['/app/schedule', 'Schedule', CalendarDays],
  ['/app/resources', 'Resources', FolderOpen],
  ['/app/quizzes', 'Quizzes', ClipboardCheck],
  ['/app/progress', 'Progress', LineChart],
  ['/app/certificates', 'Certificates', Award],
  ['/app/billing', 'Billing', CreditCard],
  ['/app/settings', 'Settings', Settings],
]
const tabs = [nav[0], nav[1], nav[2], nav[4]]

export default function AppLayout() {
  const { user, ready, signOut } = useApp()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  useEffect(() => { setOpen(false); window.scrollTo(0, 0) }, [pathname])

  if (!ready) return <div className="boot">Loading your classroom…</div>
  if (!user) return <Navigate to="/login" replace state={{ from: pathname }} />

  const item = ([to, label, I, end]) => (
    <NavLink key={to} to={to} end={end}><I size={19} /><span>{label}</span></NavLink>
  )

  return (
    <div className="app">
      <aside className={'side' + (open ? ' open' : '')}>
        <div className="side-top">
          <Logo light />
          <button className="side-close" onClick={() => setOpen(false)} aria-label="Close menu"><X size={22} /></button>
        </div>
        <nav aria-label="Dashboard">{nav.map(item)}</nav>
        <div className="side-foot">
          <a href={waLink('Assalamu alaykum, I need help with my account.')} target="_blank" rel="noreferrer"><MessageCircle size={18} /> Ask for help</a>
          <button onClick={signOut}><LogOut size={18} /> Sign out</button>
        </div>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}

      <div className="app-main">
        <header className="app-top">
          <button className="menu-btn" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <Link to="/" className="app-site">Back to website</Link>
          <Link to="/app/settings" className="avatar" aria-label="Your profile">{initials(user.name)}</Link>
        </header>
        <div className="app-content"><Outlet /></div>
      </div>

      <nav className="tabbar" aria-label="Quick navigation">
        {tabs.map(([to, label, I, end]) => (
          <NavLink key={to} to={to} end={end}><I size={20} /><span>{label}</span></NavLink>
        ))}
        <button onClick={() => setOpen(true)}><Menu size={20} /><span>More</span></button>
      </nav>
    </div>
  )
}
