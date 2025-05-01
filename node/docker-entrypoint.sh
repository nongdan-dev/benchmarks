#!/bin/sh

echo "node entrypoint"

npm i
echo "framework=$FRAMEWORK cluster=$CLUSTER"

if [ $FRAMEWORK = "ultimate" ]; then
  if [ -d ./dist ]; then
    echo "node dist already built"
  else
    npm i
    npm run build
  fi
  node ./dist/index.js
else
  npm i
  npm start
fi
