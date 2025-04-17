import { StandardMerkleTree, SimpleMerkleTree } from "@openzeppelin/merkle-tree";
import keccak256 from 'keccak256';
import crypto from 'crypto';
import { bytesToHex, utf8ToBytes } from '@ethereumjs/util';

export const name = "https://github.com/OpenZeppelin/merkle-tree"

export function rootBuildingSimple(leaves) {
  const tree = SimpleMerkleTree.of(leaves)
  const root = tree.root
  // console.log(tree.root)
  return tree
};

export function rootBuildingStandart(isSorted, leaves) {
  const tree = StandardMerkleTree.of(leaves, ["bytes31", "bytes31"], {sortLeaves: isSorted})
  const root = tree.root
  // console.log(tree.root)
  return tree
}

export function makeProof(tree, elem) {
  const targetHash = tree.leafHash(elem);
  const targetBuffer = Buffer.from(targetHash.slice(2), 'hex');

  const entries = Array.from(tree.entries());

  let low = 0, high = entries.length;
  while (low < high) {
      const mid = (low + high) >>> 1;
      const leafHash = tree.leafHash(entries[mid][1]);
      const cmp = Buffer.compare(
          Buffer.from(leafHash.slice(2), 'hex'),
          targetBuffer
      );
      if (cmp < 0) low = mid + 1;
      else high = mid;
  }

  if (low < entries.length &&
      tree.leafHash(entries[low][1]) === targetHash) {
      throw new Error("Element exists in tree");
  }

  const proofs = {
      targetHash,
      left: low > 0 ? tree.getProof(low - 1) : null,
      right: low < entries.length ? tree.getProof(low) : null
  };

  return proofs;
}