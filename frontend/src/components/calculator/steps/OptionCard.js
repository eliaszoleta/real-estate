import React from 'react';
import { Check } from 'lucide-react';

export default function OptionCard({ label, description, selected, onClick, compact = false, onMouseEnter, onMouseLeave, onFocus }) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus || onMouseEnter}
      style={{
        textAlign: 'left', width: '100%', padding: compact ? '10px 12px' : '13px 14px',
        border: `1.5px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 9, background: selected ? 'var(--primary-light)' : 'white',
        cursor: 'pointer', transition: 'all 0.12s', position: 'relative',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div>
          <div style={{ fontSize: compact ? 13.5 : 14.5, fontWeight: 600, color: 'var(--text)' }}>{label}</div>
          {description && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3, lineHeight: 1.4 }}>{description}</div>}
        </div>
        {selected && (
          <div style={{ flexShrink: 0, width: 18, height: 18, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Check size={12} color="white" strokeWidth={3} />
          </div>
        )}
      </div>
    </button>
  );
}
