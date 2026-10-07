import { serverConfigSchema } from './schema';
/** Import only from server modules when authoritative backend work is enabled. */
export function getServerConfig() {
  if (typeof window !== 'undefined') throw new Error('Server configuration cannot run in a browser');
  const result = serverConfigSchema.safeParse({
    databaseUrl: process.env.DATABASE_URL,
    sessionSecret: process.env.SESSION_SECRET,
    resultsSignerPrivateKey: process.env.RESULTS_SIGNER_PRIVATE_KEY,
  });
  if (!result.success) throw new Error('Missing or invalid server configuration: ' + result.error.issues.map(issue => issue.path.join('.')).join(', '));
  return result.data;
}
