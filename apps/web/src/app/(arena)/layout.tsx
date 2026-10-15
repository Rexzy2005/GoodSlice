import type { ReactNode } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from '../../components/providers';
export default function ArenaLayout({ children }: { children: ReactNode }) {
  return <Providers><main id="main" tabIndex={-1} className="playground-main">{children}</main></Providers>;
}
