#!/bin/bash

API_TYPE="$1"    # Thêm tham số API_TYPE (restful hoặc graphql)
CONTAINER_NAME="$2"
DURATION="$3"
OUTPUT_FORMAT="${4:-csv}"


OUTPUT_DIR="$(dirname "$0")/../output"
mkdir -p "$OUTPUT_DIR"
OUTPUT_FILE="${OUTPUT_DIR}/capture_usage_${API_TYPE}_${CONTAINER_NAME}.${OUTPUT_FORMAT}"


# Kiểm tra tham số API_TYPE
if [ "$API_TYPE" == "restful" ]; then
  echo "Monitoring RESTful API for container $CONTAINER_NAME"
elif [ "$API_TYPE" == "graphql" ]; then
  echo "Monitoring GraphQL API for container $CONTAINER_NAME"
else
  echo "Unknown API type. Please specify either 'restful' or 'graphql'."
  exit 1
fi

if [ "$OUTPUT_FORMAT" == "csv" ]; then
  echo "timestamp,cpu_percent,mem_usage_mb,mem_limit_mb,mem_percent" > "$OUTPUT_FILE"
fi


parse_mem_in_mb() {
  local VALUE=$1
  local UNIT=$(echo "$VALUE" | sed 's/[0-9.\ ]//g')
  local NUM=$(echo "$VALUE" | sed 's/[^0-9.]//g')

  case "$UNIT" in
    kB|KiB) echo "$(awk "BEGIN {print $NUM / 1024}")" ;;
    MB|MiB) echo "$NUM" ;;
    GB|GiB) echo "$(awk "BEGIN {print $NUM * 1024}")" ;;
    *) echo "$NUM" ;;
  esac
}

start_time=$(date +%s)

while [ $(($(date +%s) - start_time)) -lt "$DURATION" ]; do
  TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
  
  # Lấy thông tin stats từ container
  STATS=$(docker stats --no-stream --format "{{.CPUPerc}},{{.MemUsage}},{{.MemPerc}}" "$CONTAINER_NAME")
  
  CPU=$(echo "$STATS" | cut -d',' -f1 | tr -d '%')
  MEM_USAGE_RAW=$(echo "$STATS" | cut -d',' -f2)

  # Chia nhỏ thông tin về bộ nhớ
  RAW_USAGE=$(echo "$MEM_USAGE_RAW" | awk -F'/' '{print $1}' | xargs)
  RAW_LIMIT=$(echo "$MEM_USAGE_RAW" | awk -F'/' '{print $2}' | xargs)

  MEM_USAGE=$(parse_mem_in_mb "$RAW_USAGE")
  MEM_LIMIT=$(parse_mem_in_mb "$RAW_LIMIT")

  MEM_PERCENT=$(echo "$STATS" | cut -d',' -f3 | tr -d '%')


  if [ "$OUTPUT_FORMAT" == "csv" ]; then
    echo "$TIMESTAMP,$CPU,$MEM_USAGE,$MEM_LIMIT,$MEM_PERCENT" >> "$OUTPUT_FILE"
  else
    echo "{\"timestamp\": \"$TIMESTAMP\", \"cpu_percent\": $CPU, \"mem_usage_mb\": $MEM_USAGE, \"mem_limit_mb\": $MEM_LIMIT, \"mem_percent\": $MEM_PERCENT}" >> "$OUTPUT_FILE"
  fi

  sleep 1
done
