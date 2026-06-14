import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const baseUrl = (process.env.SITEMAP_BASE_URL ?? 'https://quicktoolhub.com').replace(/\/+$/, '');
const lastmod = new Date().toISOString().slice(0, 10);

const toolsConfig = readFileSync(join(projectRoot, 'src/app/core/data/tools.config.ts'), 'utf8');
const blogConfig = readFileSync(join(projectRoot, 'src/app/core/data/mock-data.ts'), 'utf8');

const toolSlugs = extractValues(toolsConfig, 'slug');
const categories = Array.from(new Set(extractValues(toolsConfig, 'category').map((category) => category.toLowerCase()))).sort();
const blogSlugs = extractValues(blogConfig, 'slug');

const routes = [
  route('/', 'weekly', '1.0'),
  route('/tools', 'weekly', '0.9'),
  ...categories.map((category) => route(`/tools/category/${category}`, 'weekly', '0.8')),
  ...toolSlugs.map((slug) => route(`/tools/${slug}`, 'monthly', '0.7')),
  route('/blog', 'weekly', '0.6'),
  ...blogSlugs.map((slug) => route(`/blog/${slug}`, 'monthly', '0.5')),
  route('/about', 'monthly', '0.4'),
  route('/contact', 'monthly', '0.4'),
  route('/privacy-policy', 'yearly', '0.3'),
  route('/terms', 'yearly', '0.3'),
];

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...routes.map(toXml),
  '</urlset>',
  '',
].join('\n');

writeFileSync(join(projectRoot, 'public/sitemap.xml'), sitemap, 'utf8');
console.log(`Generated public/sitemap.xml with ${routes.length} URLs for ${baseUrl}`);

function extractValues(source, property) {
  const pattern = new RegExp(`${property}:\\s*'([^']+)'`, 'g');
  return Array.from(source.matchAll(pattern), (match) => match[1]);
}

function route(path, changefreq, priority) {
  return {
    loc: `${baseUrl}${path === '/' ? '/' : path}`,
    changefreq,
    priority,
  };
}

function toXml(item) {
  return [
    '  <url>',
    `    <loc>${escapeXml(item.loc)}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${item.changefreq}</changefreq>`,
    `    <priority>${item.priority}</priority>`,
    '  </url>',
  ].join('\n');
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
