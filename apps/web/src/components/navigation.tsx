'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, type IconName } from './icon';
const links: { href: string; label: string; icon: IconName }[] = [
  { href: '/', label: 'Home', icon: 'home' }, { href: '/play', label: 'Play', icon: 'play' },
  { href: '/tournament', label: 'Tournament', icon: 'trophy' }, { href: '/shop', label: 'Shop', icon: 'bag' },
  { href: '/leaderboard', label: 'Leaderboard', icon: 'chart' }, { href: '/rewards', label: 'Rewards', icon: 'gift' },
  { href: '/get-gd', label: 'Get G$', icon: 'leaf' }, { href: '/profile', label: 'Profile', icon: 'user' },
];
export function Navigation() {
  const pathname = usePathname();
  return <nav className="navigation" aria-label="Main navigation">{links.map(link => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}><Icon name={link.icon} /><span>{link.label}</span></Link>)}</nav>;
}
