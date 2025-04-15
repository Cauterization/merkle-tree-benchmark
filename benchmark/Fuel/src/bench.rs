// benches/merkle_bench.rs
use fuel_merkle::binary::in_memory::MerkleTree;
use sha2::{Sha256, Digest};
use std::time::Instant;


// Root building bench for merkle tree
fn generate_leaves(n: usize) -> Vec<Vec<u8>> {
    (0..n)
        .map(|i| {
            let mut bytes = format!("value-{}", i).into_bytes();
            bytes.truncate(31);
            bytes
        })
        .collect()
}

fn build_tree(leaves: &[Vec<u8>]) -> (MerkleTree, [u8; 32]) {
    let mut tree = MerkleTree::new();
    
    for leaf in leaves {
        let mut hasher = Sha256::new();
        hasher.update(leaf);
        tree.push(&hasher.finalize());
    }
    
    let root = tree.root(); // Direct array access
    (tree, root)
}

pub fn root_building_bench() {
    let counts = [1_000, 10_000, 100_000];
    println!("\n\n\nroot building Merkle tree https://github.com/FuelLabs/fuel-vm/tree/master/fuel-merkle/src");
    
    for count in counts {
        let leaves = generate_leaves(count);
        let start = Instant::now();
        let (_, _) = build_tree(&leaves);
        let duration = start.elapsed();
        println!(
            "{} leaves: {:.2}ms",
            count,
            duration.as_secs_f64() * 1000.0,
            // hex::encode(&root[..8]) // Show partial root for verification
        );
    }
}

// Non-membership proof bench for sparse tree
// fn generate_sparse_leaves(n: usize) -> Vec<(MerkleTreeKey, Vec<u8>)> {
//     let mut rng = rand::thread_rng();
//     (0..n)
//         .map(|i| {
//             let mut key_bytes = [0u8; 32];
//             rng.fill(&mut key_bytes);
//             let key = MerkleTreeKey::from_bytes(key_bytes);
            
//             let mut value = format!("value-{}", i).into_bytes();
//             value.truncate(31);
            
//             (key, value)
//         })
//         .collect()
// }

// Build sparse tree with proper initialization
// fn build_sparse_tree(entries: &[(MerkleTreeKey, Vec<u8>)]) -> SparseMerkleTree<MemoryStorage> {
//     // 1. Initialize in-memory storage
//     let storage = MemoryStorage::new();
    
//     // 2. Create tree with storage
//     let mut tree = SparseMerkleTree::new(storage);
    
//     // 3. Insert entries
//     for (key, value) in entries {
//         tree.update(*key, value.as_slice())
//             .expect("Failed to update tree");
//     }
    
//     tree
// }