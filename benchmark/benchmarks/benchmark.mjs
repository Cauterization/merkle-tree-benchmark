import * as OZ from './OppenZeppelin/benchmark.js'
import * as EthMpt from './EtheriumJs/Mpt/benchmark.js'
import * as EthVerkle from './EtheriumJs/Verkle/benchmark.js'
import * as MerkleTreeJs from './MerkleTreeJs/benchmark.js'
import { utf8ToBytes } from '@ethereumjs/util';

bench();

async function bench () {
  await rootBuildingBench
    ("SimpleMerkleTree " + OZ.name, OZ.rootBuildingSimple);
  await rootBuildingBench
    ("StandardMerkleTree " + OZ.name, OZ.rootBuildingStandart, genKVLeavesCommon);
  await rootBuildingBench
    (EthMpt.name, EthMpt.rootBuilding);
  await rootBuildingBench
    (EthVerkle.name, EthVerkle.rootBuilding, genKVLeavesCommon);
  await rootBuildingBench
    ("sorted " + MerkleTreeJs.name, (leaves) => MerkleTreeJs.rootBuilding(true, leaves));
  await rootBuildingBench
    ("unsorted " + MerkleTreeJs.name, (leaves) => MerkleTreeJs.rootBuilding(false, leaves));
}

async function rootBuildingBench (name, buildRoot, genLeaves = genLeavesCommon) {
  const rootBuildingLeavesNum = [1000, 10000, 100000];
  // const rootBuildingLeavesNum = [1000];

  console.log("\n\n\nroot building", name)
  for (const numLeaves of rootBuildingLeavesNum) {
      const leaves = genLeaves(numLeaves)
      const start = Date.now();
      await buildRoot(leaves);
      const duration = Date.now() - start;
      console.log(`${numLeaves} leaves: ${duration} ms"`)
  }
}

async function proofBench (name, buildTree, makeProof, genLeaves = genLeavesCommon, genNonMembers = genNonMembersCommon) {
  const proofLeavesNum = 10000
  const proofsNum = 1000
  console.log(`\n\n\nnon-membership proof (${proofsNum} proofs, ${proofLeavesNum} leaves)`, name)
  const leaves = genLeaves(proofLeavesNum);
  const tree = await buildTree(leaves);
  const nonMembers = genNonMembers(leaves, proofsNum);
  const start = Date.now();
  for (const nonMember in nonMembers) {
    makeProof()
  }
}

function genLeavesCommon(numLeaves) {
  const leaves = Array.from([]);
    for (let i = 0; i < numLeaves; i++) {
      const paddedValue = new Uint8Array(31);
      paddedValue.set(utf8ToBytes(`value-${i}`), 0);
      leaves.push(paddedValue)
    }
    return leaves;
}

function genKVLeavesCommon(numLeaves) {
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




function genNonMembersCommon(leaves, numNonMembers) {
  const nonMembers = [];
  for (let i = 0;; i++) {
    const value = utf8ToBytes(`non-member-${i}`).slice(0, 31);
    if (!leaves.has(value)) nonMembers.push(value);
    if (nonMembers.length() >= numNonMembers) return nonMembers;
  }
}