import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { serwist } from '@serwist/next/config';
const offline = await readFile(new URL('./public/offline.html', import.meta.url));
export default serwist({
  swSrc: 'src/pwa/sw.ts', swDest: 'public/sw.js', precachePrerendered: false,
  globPatterns: ['.next/static/**/*.{js,css,woff,woff2,png,svg,webp}', 'public/icons/*.png'],
  // Additional entries retain this literal path; auto-discovered HTML paths are rewritten.
  additionalPrecacheEntries: [{ url: '/offline.html', revision: createHash('sha256').update(offline).digest('hex') }],
});
