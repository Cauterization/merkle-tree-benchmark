import { createMPT } from '@ethereumjs/mpt';
import { MapDB, bytesToUtf8, utf8ToBytes } from '@ethereumjs/util';
import crypto from 'crypto';

export const name = "https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/mpt";

// export function genLeaves(numLeaves) {
//   const leaves = Array.from([]);
//   for (let i = 0; i < numLeaves; i++) {
//     const key = utf8ToBytes(`key-${i}`).slice(0, 31);
//     const value = utf8ToBytes(`value-${i}`).slice(0, 31);
//     leaves.push([key, value])
//   }
//   return leaves;

// }

export async function rootBuilding(leaves) {
  const trie = await createMPT({ db: new MapDB() });
  for (const [key, value] of leaves) {
    await trie.put(key, value);
  }
  const root = trie.root();
  // console.log(root)
  return (root.toString('hex'))
};
