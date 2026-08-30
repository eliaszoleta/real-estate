import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';
import { url } from '../../utils/routes';

const styles = {
  header: { background: 'white', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 1px 4px rgba(15,30,23,0.05)' },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logo: { display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', fontWeight: 800, fontSize: 20, color: 'var(--text)', flexShrink: 0 },
  logoIcon: { width: 34, height: 34, background: 'linear-gradient(135deg, var(--primary), var(--primary-mid))', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 8px rgba(18,53,36,0.30)' },
  nav: { display: 'flex', alignItems: 'center', gap: 4 },
  navLink: { padding: '8px 14px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 500, color: '#475569', transition: 'all 0.15s' },
  cta: { background: 'var(--primary)', color: 'white', padding: '9px 18px', borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 600, marginLeft: 8, whiteSpace: 'nowrap' },
};

const navItems = [
  { label: 'Estimator', href: url('/') },
  { label: 'Home Values by State', href: url('/#state-values') },
  { label: 'FAQ', href: url('/#faq') },
  { label: 'About', href: url('/about') },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <a href={url('/')} style={{ ...styles.logo, fontSize: isMobile ? 16 : 20 }} aria-label="HomeValueCal — Home Value Estimator">
          <span style={styles.logoIcon} aria-hidden="true"><Home size={18} color="white" strokeWidth={2.3} /></span>
          HomeValueCal
        </a>

        {isMobile ? (
          <button
            onClick={() => setMenuOpen((m) => !m)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 4px', fontSize: 22, color: 'var(--text)', lineHeight: 1 }}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        ) : (
          <nav style={styles.nav}>
            {navItems.map((n) => (
              <a key={n.href} href={n.href} style={styles.navLink}>{n.label}</a>
            ))}
            <a href={url('/')} style={styles.cta}>Get My Estimate →</a>
          </nav>
        )}
      </div>

      {isMobile && menuOpen && (
        <div style={{ padding: '12px 24px 20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4, background: 'white' }}>
          {navItems.map((n) => (
            <a key={n.href} href={n.href} style={{ ...styles.navLink, display: 'block', padding: '10px 12px' }}>{n.label}</a>
          ))}
          <a href={url('/')} style={{ ...styles.cta, display: 'block', textAlign: 'center', marginLeft: 0, marginTop: 8 }}>Get My Estimate →</a>
        </div>
      )}
    </header>
  );
}
