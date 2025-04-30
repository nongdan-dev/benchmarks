#!/bin/sh

echo "node entrypoint"

npm i
echo "platform=$PLATFORM cluster=$CLUSTER"

if [ $PLATFORM = "ultimate" ]; then
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
