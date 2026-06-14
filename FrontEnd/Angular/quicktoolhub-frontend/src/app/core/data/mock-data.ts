import { BlogPost } from '../models/blog-post.model';

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 201,
    title: 'How to count words online',
    slug: 'how-to-count-words-online',
    excerpt: 'A simple guide to checking word count, character count, and writing length before publishing.',
    content:
      '<p>Word counters are useful when you need to meet a publishing limit or keep writing concise.</p><h2>When to use it</h2><p>Use a word counter before submitting essays, articles, ads, or social posts.</p>',
    author: 'QuickToolHub',
    createdAt: '2026-06-04T08:00:00.000Z',
    categories: ['Text tools'],
    tags: ['Word Counter', 'Writing'],
    relatedToolSlugs: ['word-counter'],
  },
  {
    id: 202,
    title: 'How to format JSON online',
    slug: 'how-to-format-json-online',
    excerpt: 'Learn how JSON formatting helps you inspect API responses, config files, and structured data.',
    content:
      '<p>JSON is easier to debug when it is formatted with indentation and clear nesting.</p><h2>Common uses</h2><p>Use a JSON formatter to read API output, check config files, or minify data for compact storage.</p>',
    author: 'QuickToolHub',
    createdAt: '2026-06-01T08:00:00.000Z',
    categories: ['Developer tools'],
    tags: ['JSON', 'Formatter'],
    relatedToolSlugs: ['json-formatter'],
  },
  {
    id: 203,
    title: 'How to generate a strong password',
    slug: 'how-to-generate-a-strong-password',
    excerpt: 'A short checklist for creating stronger passwords with length, randomness, and mixed character sets.',
    content:
      '<p>Strong passwords are long, random, and unique for each account.</p><h2>What matters most</h2><p>Use at least 16 characters and avoid names, birthdays, or reused phrases.</p>',
    author: 'QuickToolHub',
    createdAt: '2026-05-28T08:00:00.000Z',
    categories: ['Developer tools'],
    tags: ['Password', 'Security'],
    relatedToolSlugs: ['password-generator'],
  },
];
