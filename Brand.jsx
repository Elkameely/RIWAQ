import { Link } from 'react-router-dom'
import { site } from '../data/site'

/** The mark: an arch (the riwaq) holding an eight-pointed star. */
export function Mark({ size = 38, bg = 'var(--emerald-900)', line = 'var(--gold-300)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <path d="M5 39V18C5 9.5 11.5 2.5 20 2.5S35 9.5 35 18v21z" fill={bg} />
      <g fill="none" stroke={line} strokeWidth="1.4">
        <rect x="13.5" y="15" width="13" height="13" />
        <rect x="13.5" y="15" width="13" height="13" transform="rotate(45 20 21.5)" />
      </g>
    </svg>
  )
}

export function Logo({ light = false, to = '/' }) {
  return (
    <Link to={to} className={'logo' + (light ? ' logo-light' : '')} aria-label={`${site.name} home`}>
      <Mark bg={light ? 'rgba(255,255,255,.08)' : 'var(--emerald-900)'} line={light ? 'var(--gold-300)' : 'var(--gold-300)'} />
      <span className="logo-text">
        <span className="logo-ar" lang="ar" dir="rtl">{site.arabic}</span>
        <span className="logo-en">{site.name}</span>
      </span>
    </Link>
  )
}

/** Soft ring chart. */
export function Ring({ pct, size = 96, stroke = 9, label }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${pct}% complete`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--mint-200)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--emerald-600)" strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="ring-label"><b>{pct}%</b>{label && <small>{label}</small>}</span>
    </div>
  )
}

export const Bar = ({ pct, tone }) => (
  <div className={'bar' + (tone ? ' bar-' + tone : '')} role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
    <span style={{ width: pct + '%' }} />
  </div>
)

export const SectionHead = ({ title, children, align }) => (
  <header className={'section-head' + (align === 'center' ? ' center' : '')}>
    <h2>{title}</h2>
    {children && <p>{children}</p>}
  </header>
)
