#!/usr/bin/env bash
set -euo pipefail

IMAGE="${1:-node-metrics-runtime:dev}"

CID="$(docker run -d -p 9464:9464 "${IMAGE}")"
cleanup() { docker rm -f "$CID" >/dev/null 2>&1 || true; }
trap cleanup EXIT

sleep 1

curl -fsS "http://localhost:9464/metrics" | head -n 20
echo "OK: /metrics reachable"
