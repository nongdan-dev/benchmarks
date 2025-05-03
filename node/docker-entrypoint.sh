#!/bin/sh

echo "node entrypoint"

npm i
echo "framework=$FRAMEWORK cluster=$CLUSTER"

if [ -d ./dist ]; then
  echo "node dist already built"
else
  npm i
  npm run build
fi
node ./dist/index.js
