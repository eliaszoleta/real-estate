import React from 'react';
import { Home, Mail } from 'lucide-react';
import { url } from '../../utils/routes';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--primary-dark)', color: '#cfe0d6', padding: '48px 24px 28px', marginTop: 40 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
              <span style={{ width: 30, height: 30, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Home size={16} color="var(--primary-dark)" strokeWidth={2.3} />
              </span>
              <span style={{ fontWeight: 800, fontSize: 17, color: 'white' }}>HomeValueCal</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: '#a9c2b4', maxWidth: 260 }}>
              A free, data-backed calculator for estimating what a home is worth — by state, size, condition, and neighborhood.
            </p>
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Explore</div>
            {[['Estimator', '/'], ['Home Values by State', '/#state-values'], ['FAQ', '/#faq']].map(([label, href]) => (
              <a key={label} href={url(href)} style={{ display: 'block', fontSize: 13.5, color: '#a9c2b4', marginBottom: 9 }}>{label}</a>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Company</div>
            {[['About', '/about'], ['Contact', '/contact'], ['Privacy Policy', '/privacy-policy'], ['Terms of Service', '/terms-of-service']].map(([label, href]) => (
              <a key={label} href={url(href)} style={{ display: 'block', fontSize: 13.5, color: '#a9c2b4', marginBottom: 9 }}>{label}</a>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'white', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Data Sources</div>
            <p style={{ fontSize: 12.5, lineHeight: 1.7, color: '#a9c2b4' }}>
              Public median home value data, transparent market adjustments, and live OpenStreetMap location data.
            </p>
            <a href="mailto:hello@homevaluecal.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--accent)', marginTop: 10 }}>
              <Mail size={13} /> hello@homevaluecal.com
            </a>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, fontSize: 12, color: '#7f9a8a' }}>
          <span>© {new Date().getFullYear()} HomeValueCal. All rights reserved.</span>
          <span>Estimates are for informational purposes only and are not an appraisal or guarantee of price.</span>
        </div>
      </div>
    </footer>
  );
}
