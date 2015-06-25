#!/bin/sh

edp build -f
mv dist/lib/main.js dist/ei-logger.js
rm -rf dist/lib
