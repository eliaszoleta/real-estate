import React, { useState } from 'react';
import StepWrapper from './StepWrapper';
import OptionCard from './OptionCard';
import { HOME_TYPE_PREVIEWS } from './HomeTypeIllustrations';
import { HOME_TYPES } from '../../../data/options';

export default function HomeTypeStep({ value, onNext, onBack }) {
  const [homeType, setHomeType] = useState(value.homeType || 'single_family');
  const [hovered, setHovered] = useState(null);

  const previewType = hovered || homeType;
  const previewInfo = HOME_TYPES.find((h) => h.value === previewType);
  const PreviewImage = HOME_TYPE_PREVIEWS[previewType];

  return (
    <StepWrapper
      illustration={PreviewImage ? <div style={{ width: 84, height: 84, borderRadius: '50%', overflow: 'hidden', border: '1px solid var(--border)' }}><PreviewImage /></div> : null}
      title="What kind of home are you looking for?"
      subtitle="Different property types carry different typical values for the same square footage."
      onBack={onBack}
      onNext={() => onNext({ homeType })}
    >
      {PreviewImage && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, padding: '12px 16px',
          background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10,
        }}>
          <div style={{ width: 150, height: 94, flexShrink: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <PreviewImage />
          </div>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text)' }}>{previewInfo?.label}</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>{previewInfo?.description}</div>
            <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginTop: 4 }}>{hovered ? 'Previewing' : 'Selected'} · illustrative sketch, not an actual listing photo</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }} onMouseLeave={() => setHovered(null)}>
        {HOME_TYPES.map((t) => (
          <OptionCard
            key={t.value}
            label={t.label}
            description={t.description}
            selected={homeType === t.value}
            onClick={() => setHomeType(t.value)}
            onMouseEnter={() => setHovered(t.value)}
          />
        ))}
      </div>
    </StepWrapper>
  );
}
