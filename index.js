const http = require('http');
const httpProxy = require('http-proxy');
const url = require('url');

const TARGET_URL = 'https://www.google.com';

const proxy = httpProxy.createProxyServer({
  target: TARGET_URL,
  changeOrigin: true,
  followRedirects: true,
  secure: false,
});

proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Proxy error occurred');
});
const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

proxy.on('proxyReq', (proxyReq, req, res, options) => {
  const requestUrl = url.parse(req.url);
  const pathname = requestUrl.pathname.toLowerCase();

  if (pathname.endsWith('.css')) {
    proxyReq.setHeader('Content-Type', 'text/css');
  } else if (pathname.endsWith('.js')) {
    proxyReq.setHeader('Content-Type', 'application/javascript');
  } else if (pathname.endsWith('.png') || pathname.endsWith('.jpg') || pathname.endsWith('.jpeg') || pathname.endsWith('.gif')) {
    proxyReq.setHeader('Content-Type', 'image/*');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});