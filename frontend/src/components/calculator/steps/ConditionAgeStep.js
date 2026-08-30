import React, { useState } from 'react';
import { Hammer } from 'lucide-react';
import StepWrapper from './StepWrapper';
import OptionCard from './OptionCard';
import { CONDITION_OPTIONS, AGE_OPTIONS } from '../../../data/options';

const sectionLabel = { fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 10, marginTop: 22, textTransform: 'uppercase', letterSpacing: '0.03em' };

export default function ConditionAgeStep({ value, onNext, onBack }) {
  const [condition, setCondition] = useState(value.condition || 'move_in_ready');
  const [age, setAge] = useState(value.age || '10_30');

  return (
    <StepWrapper
      illustration={<Hammer size={84} color="var(--primary)" strokeWidth={1.3} />}
      title="Condition & age"
      subtitle="Condition is the biggest lever after location and size."
      onBack={onBack}
      onNext={() => onNext({ condition, age })}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Overall Condition</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 10 }}>
        {CONDITION_OPTIONS.map((c) => (
          <OptionCard key={c.value} label={c.label} description={c.description} selected={condition === c.value} onClick={() => setCondition(c.value)} />
        ))}
      </div>

      <div style={sectionLabel}>Age</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
        {AGE_OPTIONS.map((a) => (
          <OptionCard key={a.value} label={a.label} selected={age === a.value} onClick={() => setAge(a.value)} compact />
        ))}
      </div>
    </StepWrapper>
  );
}
