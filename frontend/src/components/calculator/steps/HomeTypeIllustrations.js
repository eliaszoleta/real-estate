import React from 'react';

// Flat-style "elevation sketch" illustrations, one per home type, used as
// hover/selected previews and on the results screen. Hand-drawn SVG (no
// stock photos) so the app stays fast and license-free — see the note on
// the results screen: these are illustrative, not a photo of a specific listing.

const GREEN = '#123524';
const GREEN_MID = '#1f5c3d';
const GREEN_LIGHT = '#cfe4d8';
const GOLD = '#c8983f';
const GOLD_LIGHT = '#f0deb3';
const CREAM = '#f5f8f6';
const INK = '#0f1e17';

function Scene({ children }) {
  return (
    <svg width="100%" height="100%" viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="150" fill={CREAM} />
      <rect x="0" y="122" width="240" height="28" fill={GREEN_LIGHT} opacity="0.55" />
      {children}
    </svg>
  );
}

export function SingleFamilyPreview() {
  return (
    <Scene>
      <rect x="55" y="78" width="130" height="46" fill="#ffffff" stroke={INK} strokeWidth="2" />
      <path d="M45 80 120 45 195 80Z" fill={GREEN_MID} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <rect x="65" y="96" width="20" height="18" fill={GREEN_LIGHT} stroke={INK} strokeWidth="1.5" />
      <rect x="110" y="98" width="18" height="26" fill={GOLD} stroke={INK} strokeWidth="1.5" />
      <rect x="150" y="96" width="20" height="18" fill={GREEN_LIGHT} stroke={INK} strokeWidth="1.5" />
      <rect x="150" y="70" width="10" height="16" fill={GREEN} stroke={INK} strokeWidth="1.3" />
    </Scene>
  );
}

export function CondoPreview() {
  return (
    <Scene>
      <rect x="60" y="35" width="120" height="89" fill="#ffffff" stroke={INK} strokeWidth="2" />
      <rect x="60" y="30" width="120" height="8" fill={GREEN} stroke={INK} strokeWidth="1.5" />
      {[0, 1, 2].map((row) => (
        <React.Fragment key={row}>
          {[0, 1, 2, 3].map((col) => (
            <rect key={col} x={72 + col * 26} y={50 + row * 24} width="16" height="14" fill={col % 2 === 0 ? GREEN_LIGHT : GOLD_LIGHT} stroke={INK} strokeWidth="1.2" />
          ))}
        </React.Fragment>
      ))}
      <rect x="112" y="104" width="16" height="20" fill={GOLD_LIGHT} stroke={INK} strokeWidth="1.5" />
    </Scene>
  );
}

export function TownhousePreview() {
  return (
    <Scene>
      {[0, 1, 2].map((i) => (
        <React.Fragment key={i}>
          <rect x={45 + i * 52} y="65" width="48" height="59" fill={i === 1 ? '#ffffff' : GREEN_LIGHT} opacity={i === 1 ? 1 : 0.7} stroke={INK} strokeWidth="2" />
          <path d={`M${41 + i * 52} 67 h56 l-28 -22 z`} fill={i === 1 ? GOLD : GREEN_MID} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <rect x={54 + i * 52} y="98" width="14" height="26" fill={i === 1 ? GOLD_LIGHT : GREEN} stroke={INK} strokeWidth="1.3" />
          <rect x={74 + i * 52} y="82" width="12" height="12" fill="#ffffff" stroke={INK} strokeWidth="1.2" />
        </React.Fragment>
      ))}
    </Scene>
  );
}

export function MultiFamilyPreview() {
  return (
    <Scene>
      <rect x="50" y="72" width="140" height="52" fill="#ffffff" stroke={INK} strokeWidth="2" />
      <line x1="120" y1="72" x2="120" y2="124" stroke={INK} strokeWidth="2" />
      <path d="M40 75 120 40 200 75Z" fill={GREEN_MID} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <rect x="88" y="98" width="14" height="26" fill={GOLD} stroke={INK} strokeWidth="1.4" />
      <rect x="138" y="98" width="14" height="26" fill={GOLD_LIGHT} stroke={INK} strokeWidth="1.4" />
      <rect x="64" y="88" width="16" height="14" fill={GREEN_LIGHT} stroke={INK} strokeWidth="1.3" />
      <rect x="160" y="88" width="16" height="14" fill={GREEN_LIGHT} stroke={INK} strokeWidth="1.3" />
    </Scene>
  );
}

export function MobileHomePreview() {
  return (
    <Scene>
      <rect x="35" y="90" width="170" height="30" fill="#ffffff" stroke={INK} strokeWidth="2" />
      <rect x="35" y="82" width="170" height="10" fill={GREEN_MID} stroke={INK} strokeWidth="1.8" />
      <rect x="35" y="120" width="170" height="6" fill={INK} opacity="0.15" />
      <rect x="50" y="96" width="22" height="16" fill={GREEN_LIGHT} stroke={INK} strokeWidth="1.4" />
      <rect x="95" y="96" width="22" height="16" fill={GOLD_LIGHT} stroke={INK} strokeWidth="1.4" />
      <rect x="150" y="96" width="18" height="24" fill={GOLD} stroke={INK} strokeWidth="1.4" />
      {[45, 90, 135, 180].map((x) => <rect key={x} x={x} y="120" width="4" height="6" fill={INK} opacity="0.3" />)}
    </Scene>
  );
}

export const HOME_TYPE_PREVIEWS = {
  single_family: SingleFamilyPreview,
  condo: CondoPreview,
  townhouse: TownhousePreview,
  multi_family: MultiFamilyPreview,
  mobile_home: MobileHomePreview,
};
