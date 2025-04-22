#!/bin/sh

echo "hello from node entrypoint"
cd /app/node
npm i
npm start
