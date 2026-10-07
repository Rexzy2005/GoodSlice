/** Only content-addressed Next chunks and checked-in immutable public assets. */
export function safePrecachePath(value: string): boolean {
  const url = new URL(value, 'https://slyce.invalid');
  if (url.origin !== 'https://slyce.invalid' || url.search) return false;
  return url.pathname.startsWith('/_next/static/') || /^\/icons\/icon-(192|512)\.png$/.test(url.pathname) || url.pathname === '/offline.html';
}
