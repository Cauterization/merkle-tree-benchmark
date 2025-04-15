import { StandardMerkleTree, SimpleMerkleTree } from "@openzeppelin/merkle-tree";
import keccak256 from 'keccak256';
import crypto from 'crypto';
import { utf8ToBytes } from '@ethereumjs/util';

export const name = "https://github.com/OpenZeppelin/merkle-tree"

export function rootBuildingSimple(leaves) {
  const tree = SimpleMerkleTree.of(leaves)
  // console.log(tree.root)
  return tree
};

export function simpleMTProof (tree, elem) {
  try {tree.getProof(elem)} catch (e) {
    if (e != "InvalidArgumentError: Leaf is not in tree") throw e
  }
};

export function rootBuildingStandart(leaves) {
  const tree = StandardMerkleTree.of(leaves, ["bytes", "bytes31"])
  // console.log(tree.root)
  return tree
}

export function standartMpProof(tree, elem) {
  try {tree.getProof(elem)} catch (e) {
    if (e != "InvalidArgumentError: Leaf is not in tree") throw e
  }
};