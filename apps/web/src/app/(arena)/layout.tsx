import type { ReactNode } from 'react';
import { Providers } from '../../components/providers';
import { SignInGate } from '../../web3/sign-in-gate';
export default function ArenaLayout({ children }: { children: ReactNode }) {
  return <Providers><SignInGate><main id="main" tabIndex={-1} className="playground-main">{children}</main></SignInGate></Providers>;
}
