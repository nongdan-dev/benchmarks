request = function()
  return wrk.format("POST", "/graphql", {
    ["Content-Type"] = "application/json"
  }, '{"query": "{ users { id name email } }"}')
end
