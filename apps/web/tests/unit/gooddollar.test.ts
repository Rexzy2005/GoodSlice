import { describe, expect, it } from 'vitest';
import { chainConfigs, SupportedChains } from '@goodsdks/citizen-sdk';
import { goodDollarAvailability, goodDollarTokens } from '../../src/gooddollar/service';
describe('GoodDollar configuration', () => {
  it('pins the same G$ tokens the installed SDK uses on Celo', () => {
    for (const env of ['production', 'staging', 'development'] as const) {
      expect(goodDollarTokens[env].toLowerCase()).toBe(chainConfigs[SupportedChains.CELO].contracts[env]?.g$Contract.toLowerCase());
    }
  });
  it('blocks mismatched or non-Celo configuration', () => {
    expect(goodDollarAvailability({ network: 'celo', goodDollarEnv: 'production', gdAddress: goodDollarTokens.production }).status).toBe('ready');
    expect(goodDollarAvailability({ network: 'celo', goodDollarEnv: 'production', gdAddress: goodDollarTokens.development }).status).toBe('blocked');
    expect(goodDollarAvailability({ network: 'celo-sepolia', gdAddress: goodDollarTokens.production }).status).toBe('blocked');
  });
});
