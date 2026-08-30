import React from 'react';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

export default function StepWrapper({
  illustration, title, subtitle, children,
  onBack, onNext, nextLabel = 'Continue', nextDisabled = false, loading = false, hideBack = false,
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        {illustration && <div style={{ flexShrink: 0, width: 84, height: 84, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {React.cloneElement(illustration, { size: 84 })}
        </div>}
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{title}</h2>
          {subtitle && <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>{children}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, borderTop: '1px solid var(--border-subtle)', paddingTop: 20 }}>
        {!hideBack ? (
          <button
            onClick={onBack}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '11px 18px', border: '1.5px solid var(--border)', borderRadius: 8, background: 'white', fontWeight: 600, fontSize: 14, color: 'var(--text-muted)' }}
          >
            <ArrowLeft size={15} /> Back
          </button>
        ) : <span />}
        <button
          onClick={onNext}
          disabled={nextDisabled || loading}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 24px', border: 'none', borderRadius: 8,
            background: nextDisabled ? '#9fb3a8' : 'var(--primary)', color: 'white', fontWeight: 700, fontSize: 14.5,
            cursor: nextDisabled || loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.85 : 1,
          }}
        >
          {loading ? <><Loader2 size={16} className="spin" /> Estimating…</> : <>{nextLabel} <ArrowRight size={15} /></>}
        </button>
      </div>
    </div>
  );
}
