import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, ArrowLeft, Share2, Printer, Check, Info, Home as HomeIcon, Image as ImageIcon } from 'lucide-react';
import { formatPrice, formatPriceRange } from '../../utils/formatters';
import { HOME_TYPE_PREVIEWS } from './steps/HomeTypeIllustrations';

export default function ResultsScreen({ result, live, onReset }) {
  const [shared, setShared] = useState(false);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, []);

  if (!result) return null;

  const {
    stateName, city, squareFootage, pricePerSqftLow, pricePerSqftHigh,
    breakdown = [], valueLow, valueHigh, neighborhoodLabel, locationMultiplier,
    homeType, homeTypeLabel, conditionLabel, ageLabel, bedrooms, bathrooms,
  } = result;

  const PreviewImage = HOME_TYPE_PREVIEWS[homeType] || HOME_TYPE_PREVIEWS.single_family;

  // Prefer a real comp photo as the hero image whenever a listings API is
  // connected and returned one; otherwise fall back to the illustration.
  const comps = live?.comps || [];
  const heroPhoto = comps.find((c) => c.photoUrl) || null;
  const remainingComps = heroPhoto ? comps.filter((c) => c !== heroPhoto) : comps;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch {
      window.prompt('Copy this link:', window.location.href);
    }
  };

  const marketNote = locationMultiplier >= 1.15
    ? `This area runs about ${Math.round((locationMultiplier - 1) * 100)}% above its state's typical value.`
    : locationMultiplier <= 0.9
    ? `This area runs about ${Math.round((1 - locationMultiplier) * 100)}% below its state's typical value.`
    : `This area is close to the typical value for ${stateName}.`;

  return (
    <>
      <Helmet>
        <title>Your Home Value Estimate — {stateName} | HomeValueCal</title>
        <meta name="description" content={`Estimated value for a ${squareFootage.toLocaleString()} sqft home in ${stateName}: ${formatPriceRange(valueLow, valueHigh)}.`} />
      </Helmet>

      <div style={{ padding: '32px 16px 48px', background: 'var(--bg)', minHeight: '100vh' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>

          <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border)', marginBottom: 20 }}>

            <div style={{ background: `linear-gradient(135deg, var(--primary), var(--primary-mid))`, padding: '30px 32px', color: 'white' }}>
              <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Estimated Home Value {city ? `· ${city}, ${stateName}` : `· ${stateName}`}
              </div>
              <div style={{ fontSize: 'clamp(32px, 7vw, 46px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 10, letterSpacing: '-1px' }}>
                {formatPrice(valueLow)} – {formatPrice(valueHigh)}
              </div>
              <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13, opacity: 0.9 }}>
                <span>{squareFootage.toLocaleString()} sqft</span>
                <span>${pricePerSqftLow}–${pricePerSqftHigh}/sqft</span>
                <span>{homeTypeLabel}</span>
              </div>
            </div>

            <div style={{ padding: '24px 28px 8px' }}>
              {heroPhoto ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                    <ImageIcon size={13} /> A real comparable listing near you
                  </div>
                  <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img src={heroPhoto.photoUrl} alt={heroPhoto.address || 'Comparable listing'} style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 6, marginBottom: 4 }}>
                    {heroPhoto.address ? `${heroPhoto.address} · ` : ''}A real nearby comparable, not a photo of your exact home.
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                    <ImageIcon size={13} /> What a home like this typically looks like
                  </div>
                  <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <PreviewImage />
                  </div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 6, marginBottom: 4 }}>
                    Illustrative sketch based on your answers — not a photo of an actual listing. Connect a listings
                    API (see README) to show a real comparable photo here instead.
                  </div>
                </>
              )}
            </div>

            <div style={{ padding: '20px 28px 26px' }}>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
                {[
                  ['Bedrooms', bedrooms],
                  ['Bathrooms', bathrooms],
                  ['Condition', conditionLabel],
                  ['Age', ageLabel],
                ].filter(([, v]) => v || v === 0).map(([label, v]) => (
                  <div key={label} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 13px', fontSize: 12.5 }}>
                    <span style={{ color: 'var(--text-muted)' }}>{label}: </span>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>{v}</span>
                  </div>
                ))}
              </div>

              {remainingComps.length > 0 && (
                <div style={{ marginBottom: 22 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Other Comparable Listings</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                    {remainingComps.map((c, i) => (
                      <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', fontSize: 12 }}>
                        {c.photoUrl && <img src={c.photoUrl} alt={c.address || 'Comparable listing'} style={{ width: '100%', height: 90, objectFit: 'cover' }} />}
                        <div style={{ padding: '8px 10px' }}>
                          <div style={{ fontWeight: 700, color: 'var(--text)' }}>{c.price ? formatPrice(c.price) : '—'}</div>
                          <div style={{ color: 'var(--text-muted)' }}>{c.bedrooms || '–'}bd / {c.bathrooms || '–'}ba{c.squareFootage ? ` · ${c.squareFootage.toLocaleString()} sqft` : ''}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>
                  <HomeIcon size={13} /> Value Breakdown
                </div>
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
                  {breakdown.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: i < breakdown.length - 1 ? '1px solid var(--border-subtle)' : 'none', fontSize: 13.5, background: i % 2 === 0 ? 'white' : '#fafbfa' }}>
                      <span style={{ color: '#374151' }}>{item.label}</span>
                      <span style={{ fontWeight: 600, color: 'var(--text)' }}>{formatPriceRange(item.low, item.high)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'var(--primary-light)', borderRadius: 10, padding: '13px 16px', marginBottom: 20, fontSize: 13, color: 'var(--primary-dark)', display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <MapPin size={14} style={{ marginTop: 2, flexShrink: 0 }} />
                <span>{marketNote} Neighborhood tier: <strong>{neighborhoodLabel}</strong>.</span>
              </div>

              <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                  <Info size={14} color="var(--accent-dark)" />
                  <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--accent-dark)' }}>Before you make an offer</span>
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: '#6b5323', lineHeight: 1.7 }}>
                  <li>Ask your agent for a comparative market analysis (CMA) based on recent sales within a half-mile.</li>
                  <li>Get a licensed home inspection before closing — condition assumptions here are self-reported.</li>
                  <li>Check recent sold prices, not just active listings, for a realistic offer price.</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onReset} style={btnStyle}><ArrowLeft size={14} /> New Estimate</button>
            <button onClick={handleShare} style={btnStyle}>{shared ? <><Check size={14} /> Copied!</> : <><Share2 size={14} /> Share</>}</button>
            <button onClick={() => window.print()} style={btnStyle}><Printer size={14} /> Print</button>
          </div>

          <p style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--text-subtle)', marginTop: 16, maxWidth: 540, margin: '16px auto 0' }}>
            This estimate is for informational purposes only and is not an appraisal. Actual market value depends on recent comparable sales — get a CMA from a local agent or a licensed appraisal before making an offer.
          </p>
        </div>
      </div>
    </>
  );
}

const btnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', border: '1.5px solid var(--border)',
  borderRadius: 8, background: 'white', cursor: 'pointer', fontWeight: 600, fontSize: 13.5, color: '#374151',
};
