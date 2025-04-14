import * as OZ from './OppenZeppelin/benchmark.js'
import * as EthMpt from './EtheriumJs/Mpt/benchmark.js'
import * as EthVerkle from './EtheriumJs/Verkle/benchmark.js'
import * as MerkleTreeJs from './MerkleTreeJs/benchmark.js'
import { utf8ToBytes } from '@ethereumjs/util';

const rootBuildingLeavesNum = [1000, 10000];

bench();

async function bench () {
  await rootBuildingBench
    ("sorted " + OZ.name, genSortedLeaves, (leaves) =>  OZ.rootBuilding(true, leaves));
  await rootBuildingBench
    ("unsorted " + OZ.name, genLeaves, (leaves) => OZ.rootBuilding(false, leaves));
  await rootBuildingBench
    (EthMpt.name, genLeaves, EthMpt.rootBuilding);
  await rootBuildingBench
    (EthVerkle.name, EthVerkle.genLeaves, EthVerkle.rootBuilding);
  await rootBuildingBench
    ("sorted " + MerkleTreeJs.name, genSortedLeaves, (leaves) => MerkleTreeJs.rootBuilding(true, leaves));
  await rootBuildingBench
    ("unsorted " + MerkleTreeJs.name, genLeaves, (leaves) => MerkleTreeJs.rootBuilding(false, leaves));
}

async function rootBuildingBench (name, prebench, bench) {
  console.log("\n\n\nroot building", name)
  for (const numLeaves of rootBuildingLeavesNum) {
      const leaves = await prebench(numLeaves)
      const start = Date.now();
      await bench(leaves);
      const duration = Date.now() - start;
      console.log(`${numLeaves} leaves: ${duration} ms"`)
  }
}

function genLeaves(numLeaves) {
  const leaves = Array.from([]);
    for (let i = 0; i < numLeaves; i++) {
      const value = utf8ToBytes(`value-${i}`).slice(0, 31);
      leaves.push(value)
    }
    return leaves;
}

function genSortedLeaves (numLeaves) {
  const leaves = genLeaves(numLeaves);
  return  leaves.sort();
}