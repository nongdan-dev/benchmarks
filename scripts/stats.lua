-- Lua script để phân tích benchmark và ghi ra CSV

function done(summary, latency, requests)
  -- Thông tin latency
  local p50 = latency["50"] / 1000
  local p90 = latency["90"] / 1000
  local p99 = latency["99"] / 1000
  local p9999 = latency["99.99"] / 1000
  local max = latency["max"] / 1000
  local tm999 = (latency["99.9"] / latency["max"]) * 100
  local req_per_sec = summary.requests / (summary.duration / 1000000)
  local duration_sec = summary.duration / 1000000
  local transfer_per_sec = summary.bytes / duration_sec

  print("Latency P50: " .. p50 .. " ms")
  print("Latency P90: " .. p90 .. " ms")
  print("Latency P99: " .. p99 .. " ms")
  print("Latency P99.99: " .. p9999 .. " ms")
  print("Max latency: " .. max .. " ms")
  print("tm99.9: " .. tm999 .. "%")
  print("Requests per second: " .. req_per_sec)

  -- Ghi ra CSV với tên mặc định
  local file = io.open("/scripts/benchmark.csv", "w+")
  file:write("Metric,Value\n")
  file:write("Duration (s)," .. duration_sec .. "\n")
  file:write("Requests," .. summary.requests .. "\n")
  file:write("Requests/sec," .. req_per_sec .. "\n")
  file:write("Transfer/sec (bytes)," .. transfer_per_sec .. "\n")
  file:write("Latency P50 (ms)," .. p50 .. "\n")
  file:write("Latency P90 (ms)," .. p90 .. "\n")
  file:write("Latency P99 (ms)," .. p99 .. "\n")
  file:write("Latency P99.99 (ms)," .. p9999 .. "\n")
  file:write("Latency Max (ms)," .. max .. "\n")
  file:write("tm99.9 (%)," .. tm999 .. "\n")
  file:close()

  print("📄 Đã ghi kết quả vào /scripts/benchmark.csv")
end

return {}
