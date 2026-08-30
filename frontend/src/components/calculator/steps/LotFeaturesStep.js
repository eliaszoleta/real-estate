import React, { useState } from 'react';
import { Trees } from 'lucide-react';
import StepWrapper from './StepWrapper';
import OptionCard from './OptionCard';
import { LOT_SIZE_OPTIONS, EXTRA_FEATURES } from '../../../data/options';

const sectionLabel = { fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 10, marginTop: 22, textTransform: 'uppercase', letterSpacing: '0.03em' };

export default function LotFeaturesStep({ value, onNext, onBack }) {
  const [lotSize, setLotSize] = useState(value.lotSize || 'small_lot');
  const [extraFeatures, setExtraFeatures] = useState(value.extraFeatures || []);

  const toggleFeature = (key) => {
    setExtraFeatures((prev) => prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]);
  };

  return (
    <StepWrapper
      illustration={<Trees size={84} color="var(--primary)" strokeWidth={1.3} />}
      title="Lot & features"
      subtitle="Optional add-ons — skip anything that doesn't apply."
      onBack={onBack}
      onNext={() => onNext({ lotSize, extraFeatures })}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Lot Size</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 8 }}>
        {LOT_SIZE_OPTIONS.map((s) => (
          <OptionCard key={s.value} label={s.label} selected={lotSize === s.value} onClick={() => setLotSize(s.value)} compact />
        ))}
      </div>

      <div style={sectionLabel}>Features (select any)</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 8 }}>
        {EXTRA_FEATURES.map((f) => (
          <OptionCard key={f.value} label={f.label} selected={extraFeatures.includes(f.value)} onClick={() => toggleFeature(f.value)} compact />
        ))}
      </div>
    </StepWrapper>
  );
}
