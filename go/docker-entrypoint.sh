#!/bin/sh

echo "go entrypoint"

if [ -e ./build/benchmarks-go ]
  then echo "go binary already built"
  else go build -ldflags="-s -w" -o ./build/benchmarks-go main.go
fi

./build/benchmarks-go
