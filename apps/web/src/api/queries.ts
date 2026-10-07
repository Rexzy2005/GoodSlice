'use client';
import { useQuery } from '@tanstack/react-query';
import { api } from './client';
import type { LeaderboardScope } from './contracts';
export function useLeaderboard(scope: LeaderboardScope) { return useQuery({ queryKey: ['leaderboard', scope], queryFn: ({ signal }) => api.leaderboard(scope, signal) }); }
export function useShop() { return useQuery({ queryKey: ['shop'], queryFn: ({ signal }) => api.shopItems(signal) }); }
export function useSession() { return useQuery({ queryKey: ['session'], queryFn: ({ signal }) => api.session(signal) }); }
// User-scoped queries must include the authenticated identity; connection alone is insufficient.
export function useInventory(playerId: string | undefined) { return useQuery({ queryKey: ['inventory', playerId], queryFn: ({ signal }) => api.inventory(signal), enabled: !!playerId }); }
export function useRewards(playerId: string | undefined) { return useQuery({ queryKey: ['rewards', playerId], queryFn: ({ signal }) => api.rewards(signal), enabled: !!playerId }); }
