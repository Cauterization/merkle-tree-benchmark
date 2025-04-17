// benches/sparse_merkle_bench.rs
use fuel_merkle::{
    sparse::{MerkleTree, MerkleTreeKey},
};
use fuel_merkle::common::StorageMap;
use std::time::Instant;

struct BenchTable;

impl fuel_merkle::storage::Mappable for BenchTable {
    type Key = Self::OwnedKey;
    type OwnedKey = fuel_merkle::common::Bytes32;
    type OwnedValue = fuel_merkle::sparse::Primitive;
    type Value = Self::OwnedValue;
}

fn generate_entries(n: usize) -> Vec<(MerkleTreeKey, Vec<u8>)> {
    (0..n)
        .map(|i| {
            let mut key_bytes = [0u8; 32];
            let key_str = format!("key-{}", i);
            let key_str_bytes = key_str.as_bytes();
            let copy_len = key_str_bytes.len().min(32);
            key_bytes[..copy_len].copy_from_slice(&key_str_bytes[..copy_len]);
            
            let mut value = format!("value-{}", i).into_bytes();
            value.truncate(31);
            
            (
                MerkleTreeKey::new(key_bytes),
                value
            )
        })
        .collect()
}

fn build_sparse_tree<'a>(
    entries: &'a [(MerkleTreeKey, Vec<u8>)],
    storage: &'a mut StorageMap<BenchTable>
) -> MerkleTree<BenchTable, &'a mut StorageMap<BenchTable>> {
    let mut tree = MerkleTree::new(storage);
    
    for (key, value) in entries {
        tree.insert(*key, value).expect("Insertion failed");
    }
    
    tree
}

pub fn sparse_root_building_bench() {
    let counts = [1_000, 10_000, 100_000];
    println!("\n\n\nroot building Sparse Merkle tree https://github.com/FuelLabs/fuel-vm/tree/master/fuel-merkle/src");
    
    for count in counts {
        let entries = generate_entries(count);
        let mut storage = StorageMap::<BenchTable>::new();
        let start = Instant::now();
        let tree = build_sparse_tree(&entries, &mut storage);
        let _root = tree.root();
        let duration = start.elapsed();
        
        println!(
            "{} leaves: {:.2}ms",
            count,
            duration.as_secs_f64() * 1000.0,
        );
    }
}
