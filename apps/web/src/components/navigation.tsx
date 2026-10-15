'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from './icon';
const links: { href: string; label: string; icon: IconName }[] = [
  { href: '/play', label: 'Play', icon: 'play' },
  { href: '/tournament', label: 'Tournament', icon: 'trophy' }, { href: '/shop', label: 'Shop', icon: 'bag' },
  { href: '/leaderboard', label: 'Leaderboard', icon: 'chart' }, { href: '/rewards', label: 'Rewards', icon: 'gift' },
  { href: '/get-gd', label: 'Get G$', icon: 'leaf' }, { href: '/profile', label: 'Profile', icon: 'user' },
];
export function Navigation({ label = 'Main navigation', onNavigate }: { label?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  const navigation = useRef<HTMLElement>(null);
  useEffect(() => {
    const container = navigation.current;
    const selected = container?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!container || !selected || container.scrollWidth <= container.clientWidth) return;
    // Reveal the selected mobile destination without scrolling the page vertically.
    container.scrollLeft = selected.offsetLeft - container.offsetLeft - (container.clientWidth - selected.clientWidth) / 2;
  }, [pathname]);
  return <nav ref={navigation} className="navigation" aria-label={label}>{links.map(link => <Link key={link.href} href={link.href} onClick={() => onNavigate?.()} aria-current={(pathname === link.href || pathname.startsWith(link.href + '/')) ? 'page' : undefined}><Icon name={link.icon} /><span>{link.label}</span></Link>)}</nav>;
}
