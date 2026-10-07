export type IconName = 'play' | 'trophy' | 'bag' | 'chart' | 'gift' | 'user' | 'arrow' | 'leaf' | 'home';
const paths: Record<IconName, string> = {
  play: 'm9 5 11 7-11 7V5Z', trophy: 'M8 3h8v7a4 4 0 0 1-8 0V3ZM8 5H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 2v6m-4 0h8',
  bag: 'M5 8h14l1 13H4L5 8Zm3 0V6a4 4 0 0 1 8 0v2', chart: 'M4 20V10m8 10V4m8 16v-7', gift: 'M3 8h18v4H3V8Zm2 4v9h14v-9M12 8v13m0-13C4 8 5 1 9 3c2 1 3 5 3 5Zm0 0c8 0 7-7 3-5-2 1-3 5-3 5Z',
  user: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2', arrow: 'M5 12h14m-6-6 6 6-6 6',
  leaf: 'M5 19C-1 7 10 3 21 3c0 11-4 21-16 16Zm0 0L16 8', home: 'm3 10 9-7 9 7M5 9v12h14V9m-10 12v-7h6v7',
};
export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
