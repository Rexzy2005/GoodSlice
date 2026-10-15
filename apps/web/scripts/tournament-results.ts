/**
 * Operator tool (Node 24): ranks self-reported tournament scores and writes the prize claim file.
 *   RPC_URL=... TOURNAMENT=0x... ID=1 FROM_BLOCK=<deploy block> SHARES=50,30,20 node scripts/tournament-results.ts
 * Writes public/tournaments/<id>.json, then prints the postResults command. Redeploy the web app after posting.
 */
import { writeFileSync } from 'node:fs';
import { createPublicClient, getAddress, http, type Address } from 'viem';
import { celo } from 'viem/chains';
import { tournamentAbi } from '../src/web3/abis.ts';
import { merkleTree, prizeLeaf } from '../src/web3/merkle.ts';
const env = (name: string) => { const value = process.env[name]; if (!value) throw new Error('Missing ' + name); return value; };
const tournament = getAddress(env('TOURNAMENT'));
const id = BigInt(env('ID'));
const fromBlock = BigInt(env('FROM_BLOCK'));
const shares = (process.env.SHARES ?? '50,30,20').split(',').map(Number);
if (shares.some(share => !Number.isInteger(share) || share <= 0) || shares.reduce((a, b) => a + b, 0) > 100) throw new Error('SHARES must be positive integers totalling at most 100');
const client = createPublicClient({ chain: celo, transport: http(env('RPC_URL')) });
const { startTime, endTime, resultsPostedAt, pool, cancelled } = await client.readContract({ address: tournament, abi: tournamentAbi, functionName: 'getTournament', args: [id] });
if (cancelled) throw new Error('Tournament was cancelled; entrants should call refund');
if (resultsPostedAt !== 0n) throw new Error('Results already posted');
const latest = await client.getBlock();
if (latest.timestamp < endTime) throw new Error('Tournament has not ended');
const best = new Map<Address, { score: number; block: bigint }>();
for (let from = fromBlock; from <= latest.number; from += 10_000n) {
  const to = from + 9_999n < latest.number ? from + 9_999n : latest.number;
  const logs = await client.getContractEvents({ address: tournament, abi: tournamentAbi, eventName: 'ScoreSubmitted', args: { id }, fromBlock: from, toBlock: to });
  for (const log of logs) {
    const { player, score } = log.args; if (!player || score === undefined) continue;
    const current = best.get(player);
    if (!current || score > current.score) best.set(player, { score, block: log.blockNumber });
  }
}
// Highest score wins; ties go to whoever submitted it first.
const ranking = [...best].sort(([, a], [, b]) => b.score - a.score || Number(a.block - b.block)).slice(0, shares.length);
if (!ranking.length) throw new Error('No scores were submitted');
const winners = ranking.map(([player, entry], index) => ({ player, score: entry.score, amount: pool * BigInt(shares[index]!) / 100n })).filter(winner => winner.amount > 0n);
const { root, proofs } = merkleTree(winners.map(winner => prizeLeaf(id, winner.player, winner.amount)));
const payoutTotal = winners.reduce((sum, winner) => sum + winner.amount, 0n);
const file = { chainId: celo.id, tournament, id: id.toString(), root, payoutTotal: payoutTotal.toString(), startTime: startTime.toString(), endTime: endTime.toString(),
  claims: Object.fromEntries(winners.map((winner, index) => [winner.player.toLowerCase(), { rank: index + 1, score: winner.score, amount: winner.amount.toString(), proof: proofs[index] }])) };
writeFileSync(new URL('../public/tournaments/' + id + '.json', import.meta.url), JSON.stringify(file, null, 2) + '\n');
console.table(winners.map(winner => ({ player: winner.player, score: winner.score, amount: winner.amount.toString() })));
console.log(`\nPost on-chain (owner):\ncast send ${tournament} "postResults(uint256,bytes32,uint128)" ${id} ${root} ${payoutTotal} --rpc-url $RPC_URL --account <owner>`);
