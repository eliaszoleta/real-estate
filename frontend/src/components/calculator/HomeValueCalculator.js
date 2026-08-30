import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, MapPin, TrendingUp, ShieldOff, Zap } from 'lucide-react';
import { postEstimate } from '../../utils/api';
import LocationStep from './steps/LocationStep';
import HomeTypeStep from './steps/HomeTypeStep';
import SizeRoomsStep from './steps/SizeRoomsStep';
import ConditionAgeStep from './steps/ConditionAgeStep';
import LotFeaturesStep from './steps/LotFeaturesStep';
import NeighborhoodStep from './steps/NeighborhoodStep';
import ResultsScreen from './ResultsScreen';

const STEPS = ['location', 'type', 'size', 'condition', 'features', 'neighborhood', 'results'];
const PROGRESS_LABELS = ['Location', 'Home Type', 'Size', 'Condition', 'Features', 'Neighborhood'];

export default function HomeValueCalculator() {
  const cardRef = useRef(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);
  const [live, setLive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentStep = STEPS[stepIndex];

  useEffect(() => {
    if (stepIndex === 0 || !cardRef.current) return;
    const navbarHeight = 70;
    const top = cardRef.current.getBoundingClientRect().top + window.scrollY - navbarHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }, [stepIndex]);

  const goBack = () => setStepIndex((i) => Math.max(0, i - 1));

  const advance = (patch) => {
    const merged = { ...form, ...patch };
    setForm(merged);
    setError(null);
    setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
    return merged;
  };

  const handleNeighborhoodNext = async (patch) => {
    const merged = { ...form, ...patch };
    setForm(merged);
    setError(null);
    setLoading(true);
    try {
      const res = await postEstimate({
        state: merged.state,
        city: merged.city,
        address: merged.address,
        lat: merged.lat,
        lng: merged.lng,
        homeType: merged.homeType,
        squareFootage: merged.squareFootage,
        bedrooms: merged.bedrooms,
        bathrooms: merged.bathrooms,
        condition: merged.condition,
        age: merged.age,
        lotSize: merged.lotSize,
        extraFeatures: merged.extraFeatures,
        neighborhoodTier: merged.neighborhoodTier,
      });
      setResult(res.data);
      setLive(res.live);
      setStepIndex(STEPS.indexOf('results'));
    } catch (err) {
      setError(err.message || 'Estimate failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({});
    setResult(null);
    setLive(null);
    setError(null);
    setStepIndex(0);
  };

  if (currentStep === 'results' && result) {
    return <ResultsScreen result={result} live={live} onReset={handleReset} />;
  }

  return (
    <>
      <Helmet>
        <title>Home Value Estimator 2026 | HomeValueCal</title>
        <meta name="description" content="Free home value estimator. Get an instant, state-specific estimate of what a home is worth — by size, condition, and neighborhood. No signup required." />
        <meta property="og:title" content="Home Value Estimator 2026 | HomeValueCal" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div style={{ background: 'linear-gradient(160deg, var(--primary-light) 0%, #ffffff 60%)', minHeight: '100vh', padding: '28px 16px 48px' }}>
        {currentStep === 'location' && (
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <div style={{ display: 'inline-block', background: 'var(--accent-light)', color: 'var(--accent-dark)', padding: '5px 16px', borderRadius: 20, fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
              Free · Instant · No signup required
            </div>
            <h1 style={{ fontSize: 'clamp(24px, 4.5vw, 40px)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.2, marginBottom: 10 }}>
              What's That Home{' '}
              <span style={{ color: 'var(--primary)' }}>Really Worth?</span>
            </h1>
            <p style={{ fontSize: 15.5, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto' }}>
              A real, data-backed value estimate for any home you're considering — before you make an offer.
            </p>
          </div>
        )}

        <div ref={cardRef} style={{
          maxWidth: 780, margin: '0 auto', background: 'white', borderRadius: 16,
          boxShadow: 'var(--shadow-md)', overflow: 'hidden', border: '1px solid var(--border)',
        }}>
          <div style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', padding: '16px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 6, flexWrap: 'wrap' }}>
              {PROGRESS_LABELS.map((label, i) => (
                <span key={label} style={{ fontSize: 11.5, fontWeight: 600, color: i <= stepIndex ? 'var(--primary)' : 'var(--text-subtle)' }}>
                  {label}
                </span>
              ))}
            </div>
            <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(stepIndex / (PROGRESS_LABELS.length - 1)) * 100}%`, background: 'var(--primary)', borderRadius: 2, transition: 'width 0.3s ease' }} />
            </div>
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fef2f2', borderBottom: '1px solid #fecaca', padding: '11px 24px', color: 'var(--danger)', fontSize: 13.5 }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}

          <div style={{ padding: '28px 28px 24px' }}>
            {currentStep === 'location' && <LocationStep value={form} onNext={advance} onBack={goBack} />}
            {currentStep === 'type' && <HomeTypeStep value={form} onNext={advance} onBack={goBack} />}
            {currentStep === 'size' && <SizeRoomsStep value={form} onNext={advance} onBack={goBack} />}
            {currentStep === 'condition' && <ConditionAgeStep value={form} onNext={advance} onBack={goBack} />}
            {currentStep === 'features' && <LotFeaturesStep value={form} onNext={advance} onBack={goBack} />}
            {currentStep === 'neighborhood' && <NeighborhoodStep value={form} onNext={handleNeighborhoodNext} onBack={goBack} loading={loading} />}
          </div>
        </div>

        {currentStep === 'location' && (
          <div style={{ maxWidth: 780, margin: '20px auto 0', display: 'flex', justifyContent: 'center', gap: 28, flexWrap: 'wrap' }}>
            {[
              { Icon: MapPin, label: 'All 50 states', color: 'var(--primary)' },
              { Icon: TrendingUp, label: 'Condition & market driven', color: 'var(--accent-dark)' },
              { Icon: ShieldOff, label: 'No email required', color: '#7c3aed' },
              { Icon: Zap, label: 'Instant results', color: '#2563eb' },
            ].map(({ Icon, label, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
                <Icon size={14} color={color} /> {label}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
