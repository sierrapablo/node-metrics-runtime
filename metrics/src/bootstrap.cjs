'use strict';

const http = require('http');
const client = require('prom-client');

const enabled = (process.env.METRICS_ENABLED ?? 'true').toLowerCase() === 'true';
if (!enabled) {
  module.exports = {};
  return;
}

const host = process.env.METRICS_HOST || '0.0.0.0';
const port = Number(process.env.METRICS_PORT || '9464');
const path = process.env.METRICS_PATH || '/metrics';

client.collectDefaultMetrics();

const server = http.createServer(async (req, res) => {
  if (req.url !== path) {
    res.statusCode = 404;
    return res.end('Not Found');
  }

  const token = process.env.METRICS_AUTH_TOKEN;
  if (token) {
    const auth = req.headers['authorization'] || '';
    if (auth !== `Bearer ${token}`) {
      res.statusCode = 401;
      return res.end('Unauthorized');
    }
  }

  try {
    res.statusCode = 200;
    res.setHeader('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  } catch {
    res.statusCode = 500;
    res.end('Metrics error');
  }
});

server.listen(port, host);
server.on('error', () => {});
