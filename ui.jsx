import { Link } from 'react-router-dom';

export function Logo({ light = false, small = false }) {
  return (
    <span className={`logo ${light ? 'logo-light' : ''} ${small ? 'logo-small' : ''}`}>
      <svg viewBox="0 0 40 44" className="logo-mark" aria-hidden="true">
        <path d="M5 42V22C5 14 13 9 20 2c7 7 15 12 15 20v20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M12 42V24c0-4 4-7 8-11 4 4 8 7 8 11v18" fill="currentColor" opacity=".22" />
        <path d="M2 42h36" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="logo-text">
        <span className="logo-en">RIWAQUL ILM</span>
        <span className="logo-ar" lang="ar">رواق العلم</span>
      </span>
    </span>
  );
}

// A pointed arch. The outline is an SVG that stretches to any size without distorting the line weight.
export function Arch({ children, className = '', style }) {
  return (
    <div className={`arch ${className}`} style={style}>
      <svg className="arch-line" viewBox="0 0 200 300" preserveAspectRatio="none" aria-hidden="true">
        <path className="arch-fill" d="M2 298V128C2 72 62 34 100 2c38 32 98 70 98 126v170Z" />
        <path
          className="arch-stroke"
          vectorEffect="non-scaling-stroke"
          d="M2 298V128C2 72 62 34 100 2c38 32 98 70 98 126v170"
        />
      </svg>
      <div className="arch-body">{children}</div>
    </div>
  );
}

export function Ring({ pct, size = 64, stroke = 6, label }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="ring" style={{ width: size, height: size }} role="img" aria-label={`${pct}% complete`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--mist)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={pct === 100 ? 'var(--gold)' : 'var(--emerald)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span>{label ?? `${pct}%`}</span>
    </div>
  );
}

export function Bar({ pct }) {
  return (
    <div className="bar" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
      <i style={{ width: `${pct}%` }} />
    </div>
  );
}

export function SectionHead({ title, intro, center = false, light = false }) {
  return (
    <header className={`section-head ${center ? 'center' : ''} ${light ? 'light' : ''}`}>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </header>
  );
}

export function LinkButton({ to, children, variant = 'primary', ...rest }) {
  return (
    <Link to={to} className={`btn btn-${variant}`} {...rest}>
      {children}
    </Link>
  );
}
