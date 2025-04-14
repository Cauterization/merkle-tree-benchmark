import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import crypto from 'crypto';
import { utf8ToBytes } from '@ethereumjs/util';

export const name = "https://github.com/OpenZeppelin/merkle-tree"

export function genLeaves(numLeaves) {
  const leaves = Array.from([]);
    for (let i = 0; i < numLeaves; i++) {
      const value = utf8ToBytes(`value-${i}`).slice(0, 31);
      leaves.push(value)
    }
    return leaves;
}

export function rootBuilding(isSorted, leaves) {
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: isSorted });
  const root = tree.getRoot();
  // console.log(root)
  return (root.toString('hex'))
};

