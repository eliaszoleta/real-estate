export const BASE = process.env.PUBLIC_URL || '';
export const url = (path) => `${BASE}${path}`;

export function getPathname() {
  const raw = window.location.pathname;
  const stripped = raw.startsWith(BASE) ? raw.slice(BASE.length) : raw;
  return stripped.replace(/\/$/, '') || '/';
}
