import React, { useState } from 'react';
import { Sparkles, MapPinned } from 'lucide-react';
import StepWrapper from './StepWrapper';
import OptionCard from './OptionCard';
import { NEIGHBORHOOD_TIERS } from '../../../data/options';

export default function NeighborhoodStep({ value, onNext, onBack, loading }) {
  const suggested = value.proximity?.suggestedTier;
  const [neighborhoodTier, setNeighborhoodTier] = useState(value.neighborhoodTier || suggested || 'established');

  return (
    <StepWrapper
      illustration={<MapPinned size={84} color="var(--primary)" strokeWidth={1.3} />}
      title="Neighborhood"
      subtitle="Hyper-local desirability moves value more than almost anything else."
      onBack={onBack}
      onNext={() => onNext({ neighborhoodTier })}
      nextLabel="Get My Estimate"
      loading={loading}
    >
      {suggested && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 9, padding: '10px 14px', marginBottom: 16, fontSize: 12.5, color: 'var(--accent-dark)' }}>
          <Sparkles size={14} />
          Based on the address you entered, we suggest <strong style={{ textTransform: 'capitalize' }}>&nbsp;{NEIGHBORHOOD_TIERS.find((t) => t.value === suggested)?.label}</strong>. Feel free to adjust it.
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10 }}>
        {NEIGHBORHOOD_TIERS.map((t) => (
          <OptionCard key={t.value} label={t.label} description={t.description} selected={neighborhoodTier === t.value} onClick={() => setNeighborhoodTier(t.value)} />
        ))}
      </div>
    </StepWrapper>
  );
}
