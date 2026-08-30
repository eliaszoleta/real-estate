import React, { useState } from 'react';
import { Search, CheckCircle2, AlertCircle, Loader2, Home } from 'lucide-react';
import StepWrapper from './StepWrapper';
import { STATE_LIST } from '../../../data/states';
import { geocodeAddress, getProximity } from '../../../utils/api';

const inputStyle = {
  width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)', borderRadius: 8,
  fontSize: 14.5, color: 'var(--text)', background: 'white', outline: 'none',
};
const labelStyle = { display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 7 };

export default function LocationStep({ value, onNext, onBack }) {
  const [state, setState] = useState(value.state || '');
  const [address, setAddress] = useState(value.address || '');
  const [geo, setGeo] = useState(value.geo || null);
  const [proximity, setProximity] = useState(value.proximity || null);
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState(null);

  const handleLookup = async () => {
    if (!address.trim()) return;
    setStatus('loading');
    setError(null);
    try {
      const geoRes = await geocodeAddress(address);
      setGeo(geoRes.data);
      if (geoRes.data.state) {
        const match = STATE_LIST.find((s) => s.name.toLowerCase() === geoRes.data.state.toLowerCase());
        if (match) setState(match.code);
      }
      try {
        const proxRes = await getProximity(geoRes.data.lat, geoRes.data.lng);
        setProximity(proxRes.data);
      } catch {
        setProximity(null);
      }
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
      setGeo(null);
      setProximity(null);
    }
  };

  const handleNext = () => {
    onNext({ state, address, city: geo?.city || null, zip: geo?.zip || null, lat: geo?.lat || null, lng: geo?.lng || null, geo, proximity });
  };

  return (
    <StepWrapper
      illustration={<Home size={84} color="var(--primary)" strokeWidth={1.3} />}
      title="Where are you looking to buy?"
      subtitle="Home values vary a lot by state — and even more by neighborhood."
      onBack={onBack}
      onNext={handleNext}
      nextDisabled={!state}
      hideBack
    >
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>State *</label>
        <select value={state} onChange={(e) => setState(e.target.value)} style={inputStyle}>
          <option value="">Select a state…</option>
          {STATE_LIST.map((s) => (
            <option key={s.code} value={s.code}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={labelStyle}>Address or city (optional, but recommended)</label>
        <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 8 }}>
          We'll look up real nearby schools, grocery stores, and amenities to fine-tune your neighborhood estimate.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="e.g. 123 Main St, Austin TX or just Austin, TX"
            value={address}
            onChange={(e) => { setAddress(e.target.value); setStatus('idle'); }}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleLookup(); } }}
          />
          <button
            onClick={handleLookup}
            disabled={status === 'loading' || !address.trim()}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0 18px', border: 'none', borderRadius: 8, background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: 14 }}
          >
            {status === 'loading' ? <Loader2 size={15} className="spin" /> : <Search size={15} />}
            Look up
          </button>
        </div>

        {status === 'error' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 10, color: 'var(--danger)', fontSize: 13 }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        {status === 'done' && geo && (
          <div style={{ marginTop: 14, background: 'var(--primary-light)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: proximity ? 10 : 0 }}>
              <CheckCircle2 size={15} color="var(--primary)" />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-dark)' }}>{geo.displayName}</span>
            </div>
            {proximity && (
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12.5, color: 'var(--text-muted)' }}>
                <span><strong style={{ color: 'var(--text)' }}>{proximity.convenienceLabel}</strong> ({proximity.convenienceScore}/100 convenience score)</span>
                {Object.entries(proximity.amenities).filter(([, v]) => v.nearest !== null).map(([key, v]) => (
                  <span key={key}>{v.label}: {v.nearest} mi</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </StepWrapper>
  );
}
