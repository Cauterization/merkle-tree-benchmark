mod merkle;
mod sparse;


use merkle::merkle_root_building_bench;
use sparse::{sparse_root_building_bench, non_membership_proof_bench};

fn main() {
    merkle_root_building_bench();
    sparse_root_building_bench();
    non_membership_proof_bench();
}