# ---- build metrics bootstrap (bundle) ----
FROM node:20-alpine AS metrics-build
WORKDIR /src

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
RUN pnpm add -D esbuild@0.24.2 prom-client@15.1.3

COPY metrics/src/bootstrap.cjs /src/bootstrap.cjs

RUN npx esbuild /src/bootstrap.cjs \
  --bundle \
  --platform=node \
  --format=cjs \
  --target=node20 \
  --outfile=/out/metrics-bootstrap.cjs


# ---- runtime ----
FROM node:20-alpine AS runtime

RUN apk add --no-cache tini

# non-root
RUN addgroup -S nodeapp && adduser -S -G nodeapp -u 10001 nodeapp

RUN mkdir -p /opt/metrics
COPY --from=metrics-build /out/metrics-bootstrap.cjs /opt/metrics/metrics-bootstrap.cjs

ENV NODE_OPTIONS="--require=/opt/metrics/metrics-bootstrap.cjs" \
    METRICS_ENABLED=true \
    METRICS_HOST=0.0.0.0 \
    METRICS_PORT=9464 \
    METRICS_PATH=/metrics

EXPOSE 9464

WORKDIR /app
USER 10001

ENTRYPOINT ["/sbin/tini","--"]
