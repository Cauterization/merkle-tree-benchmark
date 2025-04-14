// benches/merkle_bench.rs
// use criterion::{black_box, criterion_group, criterion_main, Criterion};
// use fuel_merkle::binary::in_memory::MerkleTree;
// use sha2::{Sha256, Digest};
// use std::time::Instant;

// fn generate_leaves(n: usize) -> Vec<Vec<u8>> {
//     (0..n)
//         .map(|i| format!("key-{}", i).into_bytes())
//         .collect()
// }

// fn build_tree(leaves: &[Vec<u8>]) -> (MerkleTree, [u8; 32]) {
//     let mut tree = MerkleTree::new();
    
//     for leaf in leaves {
//         let mut hasher = Sha256::new();
//         hasher.update(leaf);
//         tree.push(&hasher.finalize());
//     }
    
//     let root = tree.root(); // Direct array access
//     (tree, root)
// }

// fn bench_merkle(c: &mut Criterion) {
//     let mut group = c.benchmark_group("Fuel Merkle");
    
//     for count in [100, 1_000, 10_000].iter() {
//         group.bench_with_input(
//             format!("{} leaves", count),
//             count,
//             |b, &n| {
//                 let leaves = generate_leaves(n);
//                 b.iter(|| {
//                     let (_, root) = build_tree(black_box(&leaves));
//                     black_box(root);
//                 })
//             }
//         );
//     }
    
//     group.finish();
// }

// // Simple benchmark for direct timing
// pub fn run_simple_bench() {
//     let counts = [1_000, 10_000];
    
//     for count in counts {
//         let leaves = generate_leaves(count);
//         let start = Instant::now();
//         let (_, root) = build_tree(&leaves);
//         let duration = start.elapsed();
        
//         println!(
//             "Fuel Merkle - {} leaves: {:.2}ms | Root: {:?}",
//             count,
//             duration.as_secs_f64() * 1000.0,
//             hex::encode(&root[..8]) // Show partial root for verification
//         );
//     }
// }

// criterion_group!(benches, bench_merkle);
// criterion_main!(benches);