import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowRight } from 'lucide-react';
import { STATE_LIST, slugToStateCode } from '../../data/states';
import { url } from '../../utils/routes';
import { formatCompact } from '../../utils/formatters';

export default function StatePage({ slug }) {
  const code = slugToStateCode(slug);
  const state = STATE_LIST.find((s) => s.code === code);

  if (!state) {
    return (
      <div style={{ maxWidth: 640, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>State not found</h1>
        <a href={url('/')} style={{ color: 'var(--primary)', fontWeight: 600 }}>← Back to the estimator</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 20px 64px' }}>
      <Helmet>
        <title>Home Values in {state.name} (2026) | HomeValueCal</title>
        <meta name="description" content={`See median home values in ${state.name}: ${formatCompact(state.medianValueLow)}-${formatCompact(state.medianValueHigh)}. Get a free, personalized estimate for a specific home.`} />
      </Helmet>

      <h1 style={{ fontSize: 'clamp(26px, 4.5vw, 38px)', fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
        Home Values in {state.name}
      </h1>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.7 }}>
        A typical ~1,800 sqft single-family home in average condition in {state.name} is worth{' '}
        <strong style={{ color: 'var(--text)' }}>{formatCompact(state.medianValueLow)}–{formatCompact(state.medianValueHigh)}</strong>.
        Actual value depends heavily on the specific neighborhood, condition, and recent comparable sales.
      </p>

      <a href={url('/')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--primary)', color: 'white', padding: '13px 26px', borderRadius: 9, fontWeight: 700, fontSize: 15, marginBottom: 40 }}>
        Get My Personalized {state.name} Estimate <ArrowRight size={16} />
      </a>

      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 10 }}>Other states</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {STATE_LIST.filter((s) => s.code !== state.code).slice(0, 12).map((s) => (
            <a key={s.code} href={url(`/home-values/${s.name.toLowerCase().replace(/\s+/g, '-')}`)}
              style={{ fontSize: 13, padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 20, color: 'var(--text-muted)' }}>
              {s.name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
