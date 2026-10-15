import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { serwist } from '@serwist/next/config';
const offline = await readFile(new URL('./public/offline.html', import.meta.url));
export default serwist({
  swSrc: 'src/pwa/sw.ts', swDest: 'public/sw.js', precachePrerendered: false,
  globPatterns: ['.next/static/**/*.{js,css,woff,woff2,png,svg,webp}', 'public/icons/*.png', 'public/game/chopping-board-v1.webp', 'public/game/fruit-splash-v1.webp', 'public/font/typography.css', 'public/font/SpaceGrotesk.ttf', 'public/font/Rajdhani-Medium.ttf', 'public/font/Rajdhani-Bold.ttf'],
  // Additional entries retain this literal path; auto-discovered HTML paths are rewritten.
  additionalPrecacheEntries: [{ url: '/offline.html', revision: createHash('sha256').update(offline).digest('hex') }],
});
