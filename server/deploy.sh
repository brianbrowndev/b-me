#!/bin/bash
set -x #echo on

echo "Building package"
npm run build
echo "Syncing package"
rsync -a ./build/ /var/www/me/
