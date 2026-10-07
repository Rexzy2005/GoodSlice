/// <reference lib="webworker" />
import { Serwist, NetworkOnly, type PrecacheEntry, type SerwistGlobalConfig } from 'serwist';
import { safePrecachePath } from './cache-policy';
declare global { interface WorkerGlobalScope extends SerwistGlobalConfig { __SW_MANIFEST: (PrecacheEntry | string)[] | undefined } }
declare const self: ServiceWorkerGlobalScope;
const worker = new Serwist({
  precacheEntries: (self.__SW_MANIFEST ?? []).filter(entry => safePrecachePath(typeof entry === 'string' ? entry : entry.url)),
  // Updates activate after existing tabs close; do not reload or replace a worker during play/payment.
  skipWaiting: false,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [{ matcher: ({ request }) => request.mode === 'navigate', handler: new NetworkOnly() }],
  fallbacks: { entries: [{ url: '/offline.html', matcher: ({ request }) => request.destination === 'document' }] },
});
worker.addEventListeners();
