import * as OZ from './OppenZeppelin/benchmark.js'
import * as EthMpt from './EtheriumJs/Mpt/benchmark.js'
import * as EthVerkle from './EtheriumJs/Verkle/benchmark.js'
import * as MerkleTreeJs from './MerkleTreeJs/benchmark.js'
import { utf8ToBytes } from '@ethereumjs/util';

main ();

async function main() {
  await rootBuildingBenches();
  await proofBenches();
}

async function proofBenches() {
  // There is no native exclusion proof in OZ, , however it can be implemented if tree is sorted
  await proofBench(OZ.name, (leaves) => OZ.rootBuildingStandart(true, leaves), OZ.makeProof, genKVLeavesCommon, genKVNonMembersCommon)

  // There is native exclusion proof in EthMpt
  await proofBench (EthMpt.name, EthMpt.rootBuilding, EthMpt.makeProof, genKVLeavesCommon, genKVNonMembersCommon)

  // Eth verkle doesn't support proofs at all

  // There is no exclusion proof in MerkleTreeJs, however it can be implemented if tree is sorted
}

async function rootBuildingBenches () {
  await rootBuildingBench ("SimpleMerkleTree " + OZ.name, OZ.rootBuildingSimple);
  await rootBuildingBench ("sorted + StandardMerkleTree " + OZ.name, (leaves) => OZ.rootBuildingStandart(true, leaves), genKVLeavesCommon);
  await rootBuildingBench ("unsorted + StandardMerkleTree " + OZ.name, (leaves) => OZ.rootBuildingStandart(false, leaves), genKVLeavesCommon);
  await rootBuildingBench (EthMpt.name, EthMpt.rootBuilding);
  await rootBuildingBench (EthVerkle.name, EthVerkle.rootBuilding, genKVLeavesCommon);
  await rootBuildingBench ("sorted " + MerkleTreeJs.name, (leaves) => MerkleTreeJs.rootBuilding(true, leaves));
  await rootBuildingBench ("unsorted " + MerkleTreeJs.name, (leaves) => MerkleTreeJs.rootBuilding(false, leaves));
}

async function proofBench (name, buildTree, makeProof, genLeaves = genLeavesCommon, genNonMembers = genNonMembersCommon) {
  const proofLeavesNum = 10000
  const proofsNum = 1000
  console.log(`\n\n\nnon-membership proof (${proofsNum} proofs, ${proofLeavesNum} leaves)`, name)
  const leaves = genLeaves(proofLeavesNum);
  const tree = await buildTree(leaves);
  const nonMembers = genNonMembers(leaves, proofsNum);
  const start = Date.now();
  for (const nonMember of nonMembers) {
    makeProof(tree, nonMember);
  }
  const duration = Date.now() - start;
  console.log(`${duration} ms"`)
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

function genLeavesCommon(numLeaves) {
  const leaves = Array.from([]);
    for (let i = 0; i < numLeaves; i++) {
      const paddedValue = new Uint8Array(31);
      paddedValue.set(utf8ToBytes(`${i}-value`), 0);
      leaves.push(paddedValue)
    }
    return leaves;
}

function genKVLeavesCommon(numLeaves) {
  const leaves = Array.from([]);
  for (let i = 0; i < numLeaves; i++) {
    const paddedKey = new Uint8Array(31);
    paddedKey.set(utf8ToBytes(`${i}-key`), 0);
    const paddedValue = new Uint8Array(31);
    paddedValue.set(utf8ToBytes(`${i}-value`), 0);
    leaves.push([paddedKey, paddedValue])
  }
  return leaves;
}

function genNonMembersCommon(leaves, numNonMembers) {
  const nonMembers = Array.from([]);
  for (let i = 0;; i++) {
    const paddedValue = new Uint8Array(31);
    paddedValue.set(utf8ToBytes(`${i}-non-member`).slice(0, 31));
    if (!leaves.includes(paddedValue)) nonMembers.push(paddedValue);
    if (nonMembers.length >= numNonMembers) return nonMembers;
  }
}

function genKVNonMembersCommon(leaves, numNonMembers) {
  const nonMembers = Array.from([]);
  for (let i = 0;; i++) {
    const paddedKey = new Uint8Array(31);
    paddedKey.set(utf8ToBytes(`${i}-non-member`).slice(0, 31));
    const paddedValue = new Uint8Array(31);
    paddedValue.set(utf8ToBytes(`${i}-non-member`).slice(0, 31));
    const kv = [paddedKey, paddedValue ]
    if (!leaves.includes(kv)) nonMembers.push(kv);
    if (nonMembers.length >= numNonMembers) return nonMembers;
  }
}

