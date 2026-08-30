export function formatPrice(n) {
  if (n == null || Number.isNaN(n)) return '$0';
  return `$${Math.round(n).toLocaleString('en-US')}`;
}

export function formatPriceRange(low, high) {
  return `${formatPrice(low)} – ${formatPrice(high)}`;
}

export function formatCompact(n) {
  if (n == null || Number.isNaN(n)) return '$0';
  if (n >= 1000000) return `$${(n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1)}M`;
  if (n >= 1000) return `$${Math.round(n / 1000)}K`;
  return `$${Math.round(n)}`;
}
