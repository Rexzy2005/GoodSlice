import { describe, expect, it, vi } from 'vitest';
import { leaderboardSchema } from '../../src/api/contracts';
import { requestValidated } from '../../src/api/http';
import { api } from '../../src/api/client';
describe('API trust boundary', () => {
  it('rejects invalid scores at the response boundary', async () => {
    const transport = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify([{ playerId: 'p', displayName: 'Player', score: -1, rank: 1 }])));
    await expect(requestValidated({ url: '/example', method: 'GET' }, leaderboardSchema, undefined, transport)).rejects.toMatchObject({ kind: 'invalid-response' });
    expect(transport.mock.calls[0]?.[1]).toMatchObject({ cache: 'no-store', credentials: 'same-origin' });
  });
  it('does not expose error-body details', async () => {
    const transport = vi.fn<typeof fetch>().mockResolvedValue(new Response('sensitive server detail', { status: 500 }));
    await expect(requestValidated({ url: '/example', method: 'GET' }, leaderboardSchema, undefined, transport)).rejects.toMatchObject({ kind: 'http', status: 500 });
  });
  it('does not manufacture data when the backend is absent', async () => { await expect(api.inventory()).rejects.toMatchObject({ kind: 'unavailable' }); await expect(api.startRound()).rejects.toMatchObject({ kind: 'unavailable' }); });
});

it('does not send an already-cancelled request', async () => {
  const controller = new AbortController();
  const reason = new DOMException('Route changed', 'AbortError');
  controller.abort(reason);
  const transport = vi.fn<typeof fetch>();
  await expect(requestValidated({ url: '/example', method: 'GET' }, leaderboardSchema, controller.signal, transport)).rejects.toBe(reason);
  expect(transport).not.toHaveBeenCalled();
});

it('preserves cancellation while reading the response body', async () => {
  const controller = new AbortController();
  const reason = new DOMException('Route changed', 'AbortError');
  const response = new Response('[]');
  vi.spyOn(response, 'json').mockImplementation(async () => {
    controller.abort(reason);
    throw controller.signal.reason;
  });
  const transport = vi.fn<typeof fetch>().mockResolvedValue(response);
  await expect(requestValidated({ url: '/example', method: 'GET' }, leaderboardSchema, controller.signal, transport)).rejects.toBe(reason);
});

it('discards a completed response if its owner has already cancelled', async () => {
  const controller = new AbortController();
  const reason = new DOMException('Route changed', 'AbortError');
  const response = new Response('[]');
  vi.spyOn(response, 'json').mockImplementation(async () => { controller.abort(reason); return []; });
  const transport = vi.fn<typeof fetch>().mockResolvedValue(response);
  await expect(requestValidated({ url: '/example', method: 'GET' }, leaderboardSchema, controller.signal, transport)).rejects.toBe(reason);
});
