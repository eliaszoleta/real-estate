import React, { useState } from 'react';
import { Minus, Plus, Ruler } from 'lucide-react';
import StepWrapper from './StepWrapper';

const labelStyle = { fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.03em' };

function Stepper({ value, onChange, min = 0, max = 10, step = 1, suffix = '' }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, border: '1.5px solid var(--border)', borderRadius: 9, padding: '6px 10px' }}>
      <button
        onClick={() => onChange(Math.max(min, Math.round((value - step) * 10) / 10))}
        style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Minus size={14} />
      </button>
      <span style={{ fontSize: 16, fontWeight: 700, minWidth: 44, textAlign: 'center' }}>{value}{suffix}</span>
      <button
        onClick={() => onChange(Math.min(max, Math.round((value + step) * 10) / 10))}
        style={{ width: 30, height: 30, borderRadius: 7, border: 'none', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export default function SizeRoomsStep({ value, onNext, onBack }) {
  const [squareFootage, setSquareFootage] = useState(value.squareFootage || 1800);
  const [bedrooms, setBedrooms] = useState(value.bedrooms ?? 3);
  const [bathrooms, setBathrooms] = useState(value.bathrooms ?? 2);

  return (
    <StepWrapper
      illustration={<Ruler size={84} color="var(--primary)" strokeWidth={1.3} />}
      title="Size & rooms"
      subtitle="Square footage and room count are the biggest drivers of value."
      onBack={onBack}
      onNext={() => onNext({ squareFootage, bedrooms, bathrooms })}
      nextDisabled={!squareFootage || squareFootage < 300}
    >
      <div style={{ marginBottom: 26 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={labelStyle}>Total Square Footage</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{Number(squareFootage).toLocaleString()} sqft</span>
        </div>
        <input
          type="range" min={400} max={6000} step={50}
          value={squareFootage}
          onChange={(e) => setSquareFootage(Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--primary)' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 4 }}>
          <span>400 sqft</span><span>6,000 sqft</span>
        </div>
        <input
          type="number" min={300} max={25000}
          value={squareFootage}
          onChange={(e) => setSquareFootage(Number(e.target.value))}
          style={{ marginTop: 10, width: 160, padding: '8px 10px', border: '1.5px solid var(--border)', borderRadius: 7, fontSize: 14 }}
        />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
        <div>
          <div style={labelStyle}>Bedrooms</div>
          <Stepper value={bedrooms} onChange={setBedrooms} min={0} max={8} />
        </div>
        <div>
          <div style={labelStyle}>Bathrooms</div>
          <Stepper value={bathrooms} onChange={setBathrooms} min={1} max={7} step={0.5} />
        </div>
      </div>
    </StepWrapper>
  );
}
