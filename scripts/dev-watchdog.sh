#!/bin/bash
cd /Users/elena/Projects/kochfit-redesign
for i in $(seq 1 60); do
  if ! lsof -ti :3400 >/dev/null 2>&1; then
    echo "$(date +%H:%M:%S) dev down -> restart"
    npm run dev > logs/dev-server.log 2>&1 &
    sleep 8
  fi
  sleep 15
done
echo "watchdog finished"
