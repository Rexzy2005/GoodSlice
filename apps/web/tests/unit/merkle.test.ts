import { expect, it } from 'vitest';
import { merkleTree, prizeLeaf, verifyProof } from '../../src/web3/merkle';
const players = ['0x328809Bc894f92807417D2dAD6b7C998c1aFdac6', '0x1D96F2f6BeF1202E4Ce1Ff6Dad0c2CB002861d3e', '0xea475d60c118d7058beF4bDd9c32bA51139a74e0'] as const;
it('hashes leaves exactly like SlyceTournament (cross-checked with cast)', () => {
  expect(prizeLeaf(1n, players[0], 12n * 10n ** 18n)).toBe('0x55be902428b8cfd3b26832f4eee92ed7d15b32121d1eac553498ea363eb8dd49');
});
it('builds verifiable proofs for odd and even trees', () => {
  for (const count of [1, 2, 3]) {
    const leaves = players.slice(0, count).map((player, index) => prizeLeaf(1n, player, BigInt(index + 1)));
    const { root, proofs } = merkleTree(leaves);
    leaves.forEach((leaf, index) => expect(verifyProof(proofs[index]!, root, leaf)).toBe(true));
    expect(verifyProof(proofs[0]!, root, prizeLeaf(1n, players[0], 99n))).toBe(false);
  }
});
