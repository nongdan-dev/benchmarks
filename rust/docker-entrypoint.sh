#!/bin/sh

echo "rust entrypoint"

if [ -e ./target/release/rust ]; then
  echo "rust binary already built"
else
  cargo build --release
fi

./target/release/rust
