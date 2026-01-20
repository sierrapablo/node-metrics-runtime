#!/usr/bin/env bash
set -euo pipefail

IMAGE="${1:-node-metrics-runtime}"
TAG="${2:-dev}"

docker build -f images/runtime/Dockerfile -t "${IMAGE}:${TAG}" .
echo "Built ${IMAGE}:${TAG}"
