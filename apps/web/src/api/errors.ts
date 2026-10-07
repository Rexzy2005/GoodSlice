export class ApiError extends Error {
  constructor(public readonly kind: 'unavailable' | 'network' | 'http' | 'invalid-response', message: string, public readonly status?: number) { super(message); this.name = 'ApiError'; }
}
