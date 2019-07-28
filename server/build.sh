#!/bin/bash
set -x
echo "Clearing packages"
rm -rf node_modules
echo "Installing packages"
npm install
echo "Building package"
npm run build
