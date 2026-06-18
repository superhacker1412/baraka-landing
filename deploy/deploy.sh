#!/usr/bin/env bash
# Barakali Savdo — deploy script
# Run on the server from the repo folder: bash deploy/deploy.sh
set -euo pipefail

echo "==> git pull"
git pull origin main

echo "==> npm install"
npm install

echo "==> npm run build"
npm run build

echo "==> restart backend (memory.js)"
sudo systemctl restart barakali-backend

echo "==> reload nginx"
sudo nginx -t
sudo systemctl reload nginx

echo "==> done. backend status:"
sudo systemctl --no-pager --lines=5 status barakali-backend || true
