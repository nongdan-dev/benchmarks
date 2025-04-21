#!/bin/bash

# scripts/run_wrk.sh

echo "🚀 Đang khởi động benchmark..."

if [[ "$1" == "--build" ]]; then
  docker-compose -f docker/docker-compose.yml up -d --build
else
  docker-compose -f docker/docker-compose.yml up -d --no-build
fi

echo "⏳ Đợi dịch vụ sẵn sàng..."
sleep 3

# Thông số benchmark
THREADS=4
CONNECTIONS=200
DURATION=30s
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

#Benchmark Node.js
echo ""
echo "Benchmark Node.js..."
docker-compose -f docker/docker-compose.yml exec wrk \wrk -t$THREADS -c$CONNECTIONS -d$DURATION --latency -s /scripts/graphql_benchmark.lua http://node:3000/graphql
#  docker-compose -f docker/docker-compose.yml exec wrk \wrk -t4 -c200 -d30s --latency -s /scripts/graphql_benchmark.lua http://node:3000/graphql

if [ -f scripts/benchmark.csv ]; then
  mv scripts/benchmark.csv "scripts/benchmark_node_graphql.csv"
  # mv scripts/benchmark.csv "scripts/benchmark_node_${TIMESTAMP}.csv"
else
  echo "⚠ Không tìm thấy dữ liệu Node.js!"
fi

#Benchmark Rust
echo ""
echo "Benchmark Rust..."
docker-compose -f docker/docker-compose.yml exec wrk \wrk -t$THREADS -c$CONNECTIONS -d$DURATION --latency -s /scripts/graphql_benchmark.lua http://rust:3001/graphql
# docker-compose -f docker/docker-compose.yml exec wrk \wrk -t4 -c200 -d30s --latency -s /scripts/graphql_benchmark.lua http://rust:3001/graphql

if [ -f scripts/benchmark.csv ]; then
  mv scripts/benchmark.csv "scripts/benchmark_rust_graphql.csv"
  # mv scripts/benchmark.csv "scripts/benchmark_rust_${TIMESTAMP}.csv"
else
  echo "⚠ Không tìm thấy dữ liệu Rust!"
fi

echo ""
echo "Benchmark hoàn tất. Dữ liệu lưu tại:"
ls -1 scripts/benchmark_*.csv
