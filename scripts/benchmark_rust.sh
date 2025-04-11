#!/bin/bash

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_RUST_DIR="$SCRIPT_DIR/../logs_rust"
CSV_DIR="$SCRIPT_DIR/../csv_results"
mkdir -p "$LOG_RUST_DIR" "$CSV_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_RUST_DIR/benchmark_rust_${TIMESTAMP}.log"
CSV_FILE="$CSV_DIR/benchmark_rust_${TIMESTAMP}.csv"
START_TIME=$(date +%s)
RUST_DIR="../test_rust"
NODE_DIR="../test_node"

log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Load .env if available
if [ -f "$RUST_DIR/.env" ]; then
    export $(grep -v '^#' "$RUST_DIR/.env" | xargs)
fi

log "\n📦 Building Rust project..."
cargo build --manifest-path "$RUST_DIR/Cargo.toml" > /dev/null

log "\n🚀 Running Rust API benchmark..."
STEP1_START=$(date +%s)
DATABASE_URL=$DATABASE_URL \
    cargo run --manifest-path "$RUST_DIR/Cargo.toml" -- api >> "$LOG_FILE" &
RUST_API_PID=$!
sleep 1
curl -s http://127.0.0.1:8080/ping >> "$LOG_FILE"
kill $RUST_API_PID
STEP1_END=$(date +%s)
STEP1_DURATION=$((STEP1_END - STEP1_START))

log "\n🔌 Running Rust WebSocket benchmark (via Node client)..."
STEP2_START=$(date +%s)
cargo run --manifest-path "$RUST_DIR/Cargo.toml" -- websocket >> "$LOG_FILE" &
RUST_WS_PID=$!
sleep 1
npx ts-node "$NODE_DIR/src/websocket.ts" >> "$LOG_FILE"
kill $RUST_WS_PID
STEP2_END=$(date +%s)
STEP2_DURATION=$((STEP2_END - STEP2_START))

log "\n🛠️ Running Rust CLI benchmark..."
STEP3_START=$(date +%s)
cargo run --manifest-path "$RUST_DIR/Cargo.toml" -- cli >> "$LOG_FILE"
STEP3_END=$(date +%s)
STEP3_DURATION=$((STEP3_END - STEP3_START))

END_TIME=$(date +%s)
TOTAL_DURATION=$((END_TIME - START_TIME))

log "\n✅ Rust Benchmark completed in ${TOTAL_DURATION}s!"
log "📝 Log saved to $LOG_FILE"

# Save CSV
echo "step,duration(s),start_time,end_time" > "$CSV_FILE"
echo "rust_api,$STEP1_DURATION,$STEP1_START,$STEP1_END" >> "$CSV_FILE"
echo "rust_websocket,$STEP2_DURATION,$STEP2_START,$STEP2_END" >> "$CSV_FILE"
echo "rust_cli,$STEP3_DURATION,$STEP3_START,$STEP3_END" >> "$CSV_FILE"
echo "total,$TOTAL_DURATION,$START_TIME,$END_TIME" >> "$CSV_FILE"

log "📊 CSV data saved to $CSV_FILE"
