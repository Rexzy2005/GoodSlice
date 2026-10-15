'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navigation } from './navigation';
import { WalletControl } from '../web3/wallet-control';
import { useWallet } from '../web3/context';
import { Icon } from './icon';
export function MobileMenu() {
  const wallet = useWallet();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const close = () => { dialog.current?.close(); setOpen(false); };
  useEffect(() => { dialog.current?.close(); setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const media = window.matchMedia('(min-width: 721px)');
    const resize = () => { if (media.matches) close(); };
    media.addEventListener('change', resize);
    return () => { document.body.style.overflow = previous; media.removeEventListener('change', resize); };
  }, [open]);
  return <><button ref={trigger} className="mobile-menu-trigger" aria-label="Open menu" aria-haspopup="dialog" aria-expanded={open} aria-controls="mobile-menu" onClick={() => { dialog.current?.showModal(); setOpen(true); }}><Icon name="menu" /></button>
    <dialog id="mobile-menu" ref={dialog} className="mobile-menu" aria-labelledby="mobile-menu-title" onClose={() => { setOpen(false); trigger.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      <div className="mobile-menu-inner"><header><span id="mobile-menu-title" className="brand">slyce<span className="brand-dot">/</span></span><button className="mobile-menu-close" aria-label="Close menu" onClick={close} autoFocus><Icon name="close" /></button></header><section className="mobile-menu-wallet" aria-label="Wallet connection" onClickCapture={event => {
        // Release the native modal before RainbowKit opens its body-level portal.
        if (wallet.runtime === 'standard' && wallet.status !== 'unavailable' && event.target instanceof Element && event.target.closest('button')) close();
      }}><p className="eyebrow">YOUR WALLET</p><WalletControl /></section><p className="eyebrow">YOUR NIGHT MARKET</p><Navigation label="Mobile navigation" onNavigate={close} /><Link href="/" className="mobile-menu-home" onClick={close}><Icon name="home" /> Back to website</Link><small>Find your flow. Make the cut.</small></div>
    </dialog></>;
}
