import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { STATE_LIST, stateNameToSlug } from '../../data/states';
import { url } from '../../utils/routes';
import { formatCompact } from '../../utils/formatters';

export default function StateValueTable() {
  const [query, setQuery] = useState('');
  const filtered = STATE_LIST.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <section id="state-values" style={{ maxWidth: 1000, margin: '64px auto', padding: '0 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
          Median Home Value by State
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', maxWidth: 560, margin: '0 auto' }}>
          Typical value for a ~1,800 sqft single-family home in average condition.
        </p>
      </div>

      <div style={{ position: 'relative', maxWidth: 320, margin: '0 auto 20px' }}>
        <Search size={15} style={{ position: 'absolute', left: 13, top: 12, color: 'var(--text-subtle)' }} />
        <input
          placeholder="Search your state…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '100%', padding: '10px 14px 10px 36px', border: '1.5px solid var(--border)', borderRadius: 9, fontSize: 14 }}
        />
      </div>

      <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', padding: '11px 20px', background: 'var(--primary)', color: 'white', fontSize: 12.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          <span>State</span><span>Median Home Value</span>
        </div>
        <div style={{ maxHeight: 460, overflowY: 'auto' }}>
          {filtered.map((s, i) => (
            <a key={s.code} href={url(`/home-values/${stateNameToSlug(s.name)}`)}
              style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', padding: '11px 20px', fontSize: 13.5, background: i % 2 === 0 ? 'white' : '#fafbfa', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text)' }}>
              <span style={{ fontWeight: 600 }}>{s.name}</span>
              <span>{formatCompact(s.medianValueLow)}–{formatCompact(s.medianValueHigh)}</span>
            </a>
          ))}
          {filtered.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13.5 }}>No states match "{query}"</div>}
        </div>
      </div>
    </section>
  );
}
