local M = {}

function M.done(summary, latency, requests)
  function try_get_latency(i)
    -- wrk
    local ok, value = pcall(function() return latency(i) end)
    if ok then
      return value
    end
    -- wrk2
    return latency[i]
  end

  local size = #latency
  local latencies = {}
  for i = 1, size do
    latencies[i] = try_get_latency(i)
  end
  table.sort(latencies)

  function tm(n)
    local tail_count = math.floor(size * (100 - n) / 100)
    if tail_count == 0 then
      tail_count = 1
    end
    local sum = 0
    for i = size - tail_count + 1, size do
      sum = sum + latencies[i]
    end
    return sum / tail_count
  end

  local file = io.open('./output/benchmark.json', 'w+')
  function w(key, tpl, value, eof)
    file:write(('  "%s": %s'):format(key, tpl:format(value)))
    if not eof then
      file:write(',')
    end
    file:write('\n')
  end

  file:write('{')
  file:write('\n')

  w('duration', '%d', summary.duration)
  w('total_requests', '%d', summary.requests)

  local ec = summary.errors.connect
  local er = summary.errors.read
  local ew = summary.errors.write
  local es = summary.errors.status
  local et = summary.errors.timeout
  w('total_errors', '%d', ec + er + ew + es + et)
  w('errors_connect', '%d', ec)
  w('errors_read', '%d', er)
  w('errors_write', '%d', ew)
  w('errors_status', '%d', es)
  w('errors_timeout', '%d', et)

  w('requests_per_second', '%d', summary.requests / (summary.duration / 1e6))
  w('transfer_per_second', '%d', summary.bytes / (summary.duration / 1e6))

  w('latency_p50', '%d', latency:percentile(50.0))
  w('latency_p90', '%d', latency:percentile(90.0))
  w('latency_p99', '%d', latency:percentile(99.0))
  w('latency_p999', '%d', latency:percentile(99.9))
  w('latency_p9999', '%d', latency:percentile(99.99))
  w('latency_tm99', '%d', tm(99))
  w('latency_tm999', '%d', tm(99.9))
  w('latency_tm9999', '%d', tm(99.99))

  w('latency_min', '%d', latency.min)
  w('latency_max', '%d', latency.max)
  w('latency_avg', '%d', latency.mean)

  w('latency_stdev', '%d', latency.stdev, true)

  file:write('}')
  file:write('\n')

  file:close()
end

return M
