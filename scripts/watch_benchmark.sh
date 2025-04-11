#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SUMMARIZE_SCRIPT="$SCRIPT_DIR/summarize_csv.sh"
INTERVAL=60  # Thời gian chờ giữa các lần chạy, đơn vị: giây

echo "👀 Watching for benchmark updates every $INTERVAL seconds..."
echo "📍 Summarizing using: $SUMMARIZE_SCRIPT"
echo

while true; do
    echo "⏱️ $(date '+%Y-%m-%d %H:%M:%S') - Running benchmark summary..."
    bash "$SUMMARIZE_SCRIPT" && echo "✅ Benchmark summary updated successfully!"
    echo "⏳ Waiting $INTERVAL seconds before next update..."
    echo "--------------------------------------------"
    sleep "$INTERVAL"
done
