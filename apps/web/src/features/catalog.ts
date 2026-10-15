/** Display metadata for SlyceShop item ids (contracts/script/Deploy.s.sol). Prices and ownership are read on-chain. */
export interface BladeItem { readonly id: bigint; readonly name: string; readonly description: string; readonly colors: { readonly glow: number; readonly core: number } }
export const defaultBlade = { glow: 0xffcf72, core: 0xfffdf4 } as const;
export const bladeItems: readonly BladeItem[] = [
  { id: 101n, name: 'Ember blade', description: 'A red-hot trail for every cut.', colors: { glow: 0xe5383b, core: 0xffd2c4 } },
  { id: 102n, name: 'Sky blade', description: 'Cool blue streaks across the board.', colors: { glow: 0x3ba8ff, core: 0xe3f2ff } },
  { id: 103n, name: 'Leaf blade', description: 'A fresh green slash, straight from the canopy.', colors: { glow: 0x2fbf71, core: 0xdcffe9 } },
];
const equippedKey = 'slyce.blade.equipped';
export function readEquippedBlade(): bigint | null {
  try { const value = window.localStorage.getItem(equippedKey); return value && /^\d+$/.test(value) ? BigInt(value) : null; } catch { return null; }
}
export function writeEquippedBlade(id: bigint | null) {
  try { if (id === null) window.localStorage.removeItem(equippedKey); else window.localStorage.setItem(equippedKey, id.toString()); } catch { /* Equip lasts for this page only. */ }
}
