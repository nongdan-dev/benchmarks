#!/bin/bash

echo "🚀 Khởi động các dịch vụ..."

if [[ "$1" == "--build" ]]; then
  echo "🔧 Đang build lại images và khởi động container..."
  docker-compose -f docker/docker-compose.yml up -d --build
else
  echo "▶ Đang khởi động container (không build)..."
  docker-compose -f docker/docker-compose.yml up -d --no-build
fi

echo "⏳ Đợi dịch vụ khởi động..."
sleep 3

# Benchmark Node.js
echo ""
echo "📊 Bắt đầu benchmark Node.js..."
# docker-compose -f docker/docker-compose.yml exec wrk wrk -t4 -c200 -d30s --latency --timeout 10s http://node:3000 -s /scripts/stats.lua
docker-compose -f docker/docker-compose.yml exec wrk \wrk -t4 -c200 -d30s --latency -s /scripts/stats.lua http://node:3000
mv scripts/benchmark.csv scripts/benchmark_node.csv

# Benchmark Rust
echo ""
echo "📊 Bắt đầu benchmark Rust..."
# docker-compose -f docker/docker-compose.yml exec wrk wrk -t4 -c200 -d30s --latency --timeout 10s http://rust:3001 -s /scripts/stats.lua
docker-compose -f docker/docker-compose.yml exec wrk \wrk -t4 -c200 -d30s --latency -s /scripts/stats.lua http://rust:3001
mv scripts/benchmark.csv scripts/benchmark_rust.csv

echo ""
echo "✅ Kết thúc. Kết quả lưu tại: scripts/benchmark_node.csv và scripts/benchmark_rust.csv"
