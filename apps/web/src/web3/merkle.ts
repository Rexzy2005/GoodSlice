import { concat, encodeAbiParameters, hexToBigInt, keccak256, type Address, type Hex } from 'viem';
/** Matches SlyceTournament: keccak256(bytes.concat(keccak256(abi.encode(id, player, amount)))). */
export function prizeLeaf(id: bigint, player: Address, amount: bigint): Hex {
  return keccak256(keccak256(encodeAbiParameters([{ type: 'uint256' }, { type: 'address' }, { type: 'uint128' }], [id, player, amount])));
}
/** OpenZeppelin MerkleProof uses sorted (commutative) pair hashing. */
function hashPair(a: Hex, b: Hex): Hex { return hexToBigInt(a) < hexToBigInt(b) ? keccak256(concat([a, b])) : keccak256(concat([b, a])); }
export function merkleTree(leaves: readonly Hex[]): { root: Hex; proofs: Hex[][] } {
  if (!leaves.length) throw new Error('At least one leaf is required');
  const proofs: Hex[][] = leaves.map(() => []);
  let layer = leaves.map((hash, index) => ({ hash, members: [index] }));
  while (layer.length > 1) {
    const next: typeof layer = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i]!, right = layer[i + 1];
      if (!right) { next.push(left); continue; } // An odd node is promoted unchanged.
      for (const member of left.members) proofs[member]!.push(right.hash);
      for (const member of right.members) proofs[member]!.push(left.hash);
      next.push({ hash: hashPair(left.hash, right.hash), members: [...left.members, ...right.members] });
    }
    layer = next;
  }
  return { root: layer[0]!.hash, proofs };
}
export function verifyProof(proof: readonly Hex[], root: Hex, leaf: Hex): boolean { return proof.reduce(hashPair, leaf) === root; }
