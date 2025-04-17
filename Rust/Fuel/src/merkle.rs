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

fn build_merkle_tree(leaves: &[Vec<u8>]) -> MerkleTree {
    let mut tree = MerkleTree::new();
    
    for leaf in leaves {
        let mut hasher = Sha256::new();
        hasher.update(leaf);
        tree.push(&hasher.finalize());
    }
    
    // let root = tree.root();
    tree
}

pub fn merkle_root_building_bench() {
    let counts = [1_000, 10_000, 100_000];
    println!("\n\n\nroot building Merkle tree https://github.com/FuelLabs/fuel-vm/tree/master/fuel-merkle/src");
    
    for count in counts {
        let leaves = generate_leaves(count);
        let start = Instant::now();
        let _ = build_merkle_tree(&leaves);
        let duration = start.elapsed();
        println!(
            "{} leaves: {:.2}ms",
            count,
            duration.as_secs_f64() * 1000.0,
            // hex::encode(&root[..8]) // Show partial root for verification
        );
    }
}