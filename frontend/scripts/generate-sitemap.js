// Generates public/sitemap.xml before every build.
// Plain CommonJS (no ESM imports) so it can run directly via `node` in the
// prebuild step, before Babel/webpack are involved.

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://homevaluecal.com';

const STATE_SLUGS = [
  'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut',
  'delaware', 'washington-dc', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois',
  'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana', 'maine', 'maryland',
  'massachusetts', 'michigan', 'minnesota', 'mississippi', 'missouri', 'montana',
  'nebraska', 'nevada', 'new-hampshire', 'new-jersey', 'new-mexico', 'new-york',
  'north-carolina', 'north-dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania',
  'rhode-island', 'south-carolina', 'south-dakota', 'tennessee', 'texas', 'utah',
  'vermont', 'virginia', 'washington', 'west-virginia', 'wisconsin', 'wyoming',
];

const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.4', changefreq: 'monthly' },
  { path: '/contact', priority: '0.4', changefreq: 'monthly' },
  { path: '/privacy-policy', priority: '0.2', changefreq: 'yearly' },
  { path: '/terms-of-service', priority: '0.2', changefreq: 'yearly' },
];

const today = new Date().toISOString().split('T')[0];

const urls = [
  ...STATIC_ROUTES.map((r) => ({ loc: r.path, priority: r.priority, changefreq: r.changefreq })),
  ...STATE_SLUGS.map((slug) => ({ loc: `/home-values/${slug}`, priority: '0.7', changefreq: 'monthly' })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const outPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml);
console.log(`Sitemap written to ${outPath} (${urls.length} URLs)`);
