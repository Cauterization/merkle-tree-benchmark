import { MapDB, utf8ToBytes } from '@ethereumjs/util'
import { VerkleTree } from '@ethereumjs/verkle'
import * as verkle from 'micro-eth-signer/verkle'

export const name =
  "https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/verkle";

export function genLeaves(numLeaves) {
  const leaves = Array.from([]);
  for (let i = 0; i < numLeaves; i++) {
    const paddedKey = new Uint8Array(31);
    paddedKey.set(utf8ToBytes(`key-${i}`), 0);
    const paddedValue = new Uint8Array(31);
    paddedValue.set(utf8ToBytes(`value-${i}`), 0);
    leaves.push([paddedKey, paddedValue])
  }
  return leaves;
}

// It doesn't work - root always 0x0000...
export async function rootBuilding(leaves) {
  const db = new MapDB();
  const tree = new VerkleTree({
        cacheSize: 0,
        db,
        useRootPersistence: false,
        verkleCrypto: verkle,
      });
  await tree.createRootNode(db);
  for (const [key, value] of leaves) {
    await tree.put(key, value);
  }
  // console.log(tree.root())
  return tree;
};
