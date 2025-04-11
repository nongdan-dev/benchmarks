#!/bin/bash

set -e

# Xác định thư mục của script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NODE_DIR="$SCRIPT_DIR/../test_node"

# Thư mục log và csv đúng chuẩn (nằm ngoài scripts/)
LOG_DIR="$SCRIPT_DIR/../logs_node"
CSV_DIR="$SCRIPT_DIR/../csv_results"
mkdir -p "$LOG_DIR" "$CSV_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/benchmark_node_${TIMESTAMP}.log"
CSV_FILE="$CSV_DIR/benchmark_node_${TIMESTAMP}.csv"

START_TIME=$(date +%s)

log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

log "\n💡 Running Node API benchmark..."
STEP1_START=$(date +%s)
(cd "$NODE_DIR" && npx ts-node src/api.ts) >> "$LOG_FILE"
STEP1_END=$(date +%s)
STEP1_DURATION=$((STEP1_END - STEP1_START))

echo "📡 Waiting for WebSocket server..."
while ! nc -z 127.0.0.1 9001; do
  sleep 0.5
done

log "\n📡 Running Node WebSocket benchmark..."
STEP2_START=$(date +%s)
(cd "$NODE_DIR" && npx ts-node src/websocket.ts) >> "$LOG_FILE"
STEP2_END=$(date +%s)
STEP2_DURATION=$((STEP2_END - STEP2_START))

log "\n🛠️ Running Node CLI benchmark..."
STEP3_START=$(date +%s)
(cd "$NODE_DIR" && npx ts-node src/cli.ts) >> "$LOG_FILE"
STEP3_END=$(date +%s)
STEP3_DURATION=$((STEP3_END - STEP3_START))

END_TIME=$(date +%s)
TOTAL_DURATION=$((END_TIME - START_TIME))

log "\n✅ Node Benchmark completed in ${TOTAL_DURATION}s!"
log "📝 Log saved to $LOG_FILE"

# Save CSV
echo "step,duration(s),start_time,end_time" > "$CSV_FILE"
echo "node_api,$STEP1_DURATION,$STEP1_START,$STEP1_END" >> "$CSV_FILE"
echo "node_websocket,$STEP2_DURATION,$STEP2_START,$STEP2_END" >> "$CSV_FILE"
echo "node_cli,$STEP3_DURATION,$STEP3_START,$STEP3_END" >> "$CSV_FILE"
echo "total,$TOTAL_DURATION,$START_TIME,$END_TIME" >> "$CSV_FILE"

log "📊 CSV data saved to $CSV_FILE"
