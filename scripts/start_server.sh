#!/bin/bash

# Di chuyển về thư mục gốc dự án
cd "$(dirname "$0")/.."

# Tìm port trống trong khoảng 1000–9000
for port in {8000..9000}; do
    if ! lsof -i :$port >/dev/null; then
        echo "🚀 Starting server on port $port"
        xdg-open "http://localhost:$port/scripts/summary_chart.html" &>/dev/null || echo "👉 Mở http://localhost:$port/scripts/summary_chart.html trong trình duyệt"
        python3 -m http.server "$port"
        break
    fi
done
