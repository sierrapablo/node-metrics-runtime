# node-metrics-runtime

A minimal Node.js runtime base image that exposes Prometheus metrics **by default**.

## What you get
- `/metrics` on port `9464` out-of-the-box (process/runtime metrics via prom-client)
- Alpine-based
- Non-root runtime (`uid=10001`)
- Works with APIs and SSR (metrics server runs on a separate port)

## Quick start

```dockerfile
FROM sierrapablo/node-metrics-runtime:24-runtime
WORKDIR /app
COPY . .
EXPOSE 3000 9464
CMD ["node","dist/index.js"]
```

Prometheus scrapes:
- `http://<container>:9464/metrics`

## Configuration
Environment variables:
- `METRICS_ENABLED` (default `true`)
- `METRICS_PORT` (default `9464`)
- `METRICS_PATH` (default `/metrics`)
- `METRICS_HOST` (default `0.0.0.0`)
- `METRICS_AUTH_TOKEN` (optional: requires `Authorization: Bearer <token>`)
