-- scripts/stats.lua

done = function(summary, latency, requests)
  local file = io.open("/app/scripts/benchmark.csv", "w+")

  file:write("Metric,Value\n")
  file:write("Duration (s)," .. string.format("%.2f", summary.duration / 1000000) .. "\n")
  file:write("Requests," .. summary.requests .. "\n")
  file:write("Requests/sec," .. string.format("%.2f", summary.requests / (summary.duration / 1000000)) .. "\n")
  file:write("Transfer/sec (bytes)," .. string.format("%.2f", summary.bytes / (summary.duration / 1000000)) .. "\n")

  file:write("Latency P50 (ms)," .. string.format("%.2f", latency:percentile(50.0)) .. "\n")
  file:write("Latency P90 (ms)," .. string.format("%.2f", latency:percentile(90.0)) .. "\n")
  file:write("Latency P99 (ms)," .. string.format("%.2f", latency:percentile(99.0)) .. "\n")
  file:write("Latency P99.99 (ms)," .. string.format("%.2f", latency:percentile(99.99)) .. "\n")
  file:write("Latency Max (ms)," .. string.format("%.2f", latency.max) .. "\n")

  -- ✅ Không lặp qua latency nữa
  -- Nếu cần, hãy tính tm99.9 từ P99.9 như một đại diện gần đúng:
  file:write("tm99.9 (approx ms)," .. string.format("%.2f", latency:percentile(99.9)) .. "\n")

  file:close()
end
