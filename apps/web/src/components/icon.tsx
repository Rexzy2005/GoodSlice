import { Menu, X, ArrowLeft, Timer, Heart, RotateCcw, CircleHelp, Minimize, Maximize, Pause, Play, Trophy, ShoppingBag, ChartNoAxesColumn, Gift, UserRound, ArrowUpRight, Leaf, House, Sparkles, Wallet, ShieldCheck, Clock, Scissors, ChevronRight, Settings, Volume2, VolumeX } from 'lucide-react';
const icons = { menu: Menu, close: X, back: ArrowLeft, timer: Timer, heart: Heart, reset: RotateCcw, help: CircleHelp, shrink: Minimize, expand: Maximize, pause: Pause, play: Play, trophy: Trophy, bag: ShoppingBag, chart: ChartNoAxesColumn, gift: Gift, user: UserRound, arrow: ArrowUpRight, leaf: Leaf, home: House, sparkles: Sparkles, wallet: Wallet, shield: ShieldCheck, clock: Clock, scissors: Scissors, chevron: ChevronRight, settings: Settings, sound: Volume2, muted: VolumeX };
export type IconName = keyof typeof icons;
export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const Component = icons[name];
  return <Component className={className} size={22} strokeWidth={1.8} aria-hidden="true" focusable="false" />;
}
