import { createMPT, createMerkleProof } from '@ethereumjs/mpt';
import { MapDB, bytesToUtf8, utf8ToBytes } from '@ethereumjs/util';
import crypto from 'crypto';

export const name = "https://github.com/ethereumjs/ethereumjs-monorepo/tree/master/packages/mpt";


export async function rootBuilding(leaves) {
  const trie = await createMPT({ db: new MapDB() });
  for (const [key, value] of leaves) {
    await trie.put(key, value);
  }
  // console.log(trie.root())
  return trie
};

export async function makeProof (trie, elem) {
  const proof = await createMerkleProof(trie, elem)
  return proof;
}