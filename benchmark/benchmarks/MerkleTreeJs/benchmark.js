import { MerkleTree } from 'merkletreejs';
import crypto from 'crypto';
import { utf8ToBytes } from '@ethereumjs/util'
export const name =
  "https://github.com/merkletreejs/merkletreejs/tree/master/src";

export function genLeaves(numLeaves) {
  const leaves = Array.from([]);
  for (let i = 0; i < numLeaves; i++) {
    const paddedValue = new Uint8Array(31);
    paddedValue.set(utf8ToBytes(`value-${i}`), 0);
    leaves.push(paddedValue)
  }
  return leaves;
}

export async function rootBuilding(isSorted, leaves) {
  const tree = new MerkleTree(leaves, sha256, { sortPairs: isSorted });
  const root = tree.getRoot();
  // console.log(root)
  return tree
};

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest();
}

