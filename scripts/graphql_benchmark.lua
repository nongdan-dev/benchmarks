-- scripts/graphql_benchmark.lua

request = function()
  return wrk.format("POST", "/graphql", {
    ["Content-Type"] = "application/json"
  }, '{"query": "{ users { id name email } }"}')
end

done = function(summary, latency, requests)
  local filename = "/scripts/benchmark.csv"
  local file = assert(io.open(filename, "w+"))

  file:write("Metric,Value\n")
  file:write(string.format("Duration (s),%.2f\n", summary.duration / 1e6))
  file:write(string.format("Requests,%d\n", summary.requests))
  file:write(string.format("Requests/sec,%.2f\n", summary.requests / (summary.duration / 1e6)))
  file:write(string.format("Transfer/sec (bytes),%.2f\n", summary.bytes / (summary.duration / 1e6)))
  file:write(string.format("Transfer/sec (MB),%.2f\n", (summary.bytes / (summary.duration / 1e6)) / (1024 * 1024)))

  file:write(string.format("Latency P50 (ms),%.2f\n", latency:percentile(50.0)))
  file:write(string.format("Latency P90 (ms),%.2f\n", latency:percentile(90.0)))
  file:write(string.format("Latency P99 (ms),%.2f\n", latency:percentile(99.0)))
  file:write(string.format("Latency P99.99 (ms),%.2f\n", latency:percentile(99.99)))
  file:write(string.format("Latency Max (ms),%.2f\n", latency.max))
  file:write(string.format("tm99.9 (approx ms),%.2f\n", latency:percentile(99.9)))

  file:close()
end