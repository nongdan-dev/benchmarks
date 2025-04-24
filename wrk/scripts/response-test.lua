local M = {}

local done = false
function M.response(status, headers, body)
  if not done then
    done = true
    print(body)
  end
end

return M
