import { MerkleTree } from 'merkletreejs';
import crypto from 'crypto';
import { utf8ToBytes } from '@ethereumjs/util'

export const name =
  "https://github.com/merkletreejs/merkletreejs/tree/master/src";

export async function rootBuilding(isSorted, leaves) {
  const tree = new MerkleTree(leaves, sha256, { sortPairs: isSorted });
  const root = tree.getRoot();
  // console.log(root)
  return tree
};

function sha256(data) {
  return crypto.createHash('sha256').update(data).digest();
}

