import * as OZ from './OppenZeppelin/benchmark.js'
import * as EthMpt from './EtheriumJs/Mpt/benchmark.js'
import * as EthVerkle from './EtheriumJs/Verkle/benchmark.js'
import * as MerkleTreeJs from './MerkleTreeJs/benchmark.js'

const rootBuildingLeavesNum = [1000, 10000, 100000];

bench();

async function bench () {


  await rootBuildingBench
    ("sorted " + OZ.name, OZ.genLeaves, (leaves) =>  OZ.rootBuilding(true, leaves));
  await rootBuildingBench
    ("unsorted " + OZ.name, OZ.genLeaves, (leaves) => OZ.rootBuilding(false, leaves));
  await rootBuildingBench
    (EthMpt.name, EthMpt.genLeaves, EthMpt.rootBuilding);
  await rootBuildingBench
    (EthVerkle.name, EthVerkle.genLeaves, EthVerkle.rootBuilding);
  await rootBuildingBench
    ("sorted " + MerkleTreeJs.name, MerkleTreeJs.genLeaves, (leaves) => MerkleTreeJs.rootBuilding(true, leaves));
  await rootBuildingBench
    ("unsorted " + MerkleTreeJs.name, MerkleTreeJs.genLeaves, (leaves) => MerkleTreeJs.rootBuilding(false, leaves));
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

