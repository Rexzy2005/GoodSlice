// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { useOnlineStatus } from '../../src/web3/online-status';
afterEach(cleanup);
it('tracks connectivity changes and unsubscribes after unmount', () => {
  const online = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
  const remove = vi.spyOn(window, 'removeEventListener');
  const { result, unmount } = renderHook(useOnlineStatus);
  expect(result.current).toBe(true);
  online.mockReturnValue(false);
  act(() => window.dispatchEvent(new Event('offline')));
  expect(result.current).toBe(false);
  online.mockReturnValue(true);
  act(() => window.dispatchEvent(new Event('online')));
  expect(result.current).toBe(true);
  unmount();
  expect(remove).toHaveBeenCalledWith('online', expect.any(Function));
  expect(remove).toHaveBeenCalledWith('offline', expect.any(Function));
});
