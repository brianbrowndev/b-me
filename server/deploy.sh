#!/bin/bash
set -x #echo on

echo "Building package"
npm run build
echo "Syncing package"
rm -rf /var/www/me/*
rsync -a ./build/ /var/www/me/
