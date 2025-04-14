#!/bin/bash

set -e

JS_BENCH_SCRIPT="benchmarks/benchmark.mjs"
RUST_BENCH_DIR="Fuel"

echo "Running Rust benchmarks..."
if [ -d "$RUST_BENCH_DIR" ]; then
    cd "$RUST_BENCH_DIR"
    cargo run || { echo "Rust benchmarks failed"; exit 1; }
    cd -
else
    echo "Error: Rust project directory not found at $RUST_BENCH_DIR"
    exit 1
fi

echo "Running JavaScript benchmarks..."
if [ -f "$JS_BENCH_SCRIPT" ]; then
    node --experimental-wasm-modules "$JS_BENCH_SCRIPT"
else
    echo "Error: JavaScript benchmark script not found at $JS_BENCH_SCRIPT"
    exit 1
fi

echo "All benchmarks completed successfully."