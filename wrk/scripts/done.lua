local M = {}

function M.done(summary, latency, requests)
  local file = io.open("./output/benchmark.json", "w+")
  file:write("{\n")

  file:write(string.format('"duration": %.2f,\n', summary.duration / 1e6))
  file:write(string.format('"total_requests": %d,\n', summary.requests))
  file:write(string.format('"requests_per_second": %.2f,\n', summary.requests / (summary.duration / 1e6)))
  file:write(string.format('"transfer_per_second": %.2f,\n', summary.bytes / (summary.duration / 1e6)))

  file:write(string.format('"latency_p50": %.2f,\n', latency:percentile(50.0)))
  file:write(string.format('"latency_p90": %.2f,\n', latency:percentile(90.0)))
  file:write(string.format('"latency_p99": %.2f,\n', latency:percentile(99.0)))
  file:write(string.format('"latency_p9999": %.2f,\n', latency:percentile(99.99)))

  file:write(string.format('"latency_min": %.2f,\n', latency.min))
  file:write(string.format('"latency_max": %.2f,\n', latency.max))
  file:write(string.format('"latency_avg": %.2f\n', latency.mean))

  file:write("}\n")
  file:close()
end

return M
