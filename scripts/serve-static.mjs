import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';

const root = path.resolve(process.cwd(), 'out');
const port = Number(process.env.PORT || 3000);
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

function resolveRequestPath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const relative = decoded === '/' ? 'index.html' : decoded.replace(/^\/+/, '');
  const candidate = path.resolve(root, relative);
  if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) return null;

  const candidates = [candidate, `${candidate}.html`, path.join(candidate, 'index.html')];
  return candidates.find(file => fs.existsSync(file) && fs.statSync(file).isFile()) || null;
}

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname;
  const filePath = resolveRequestPath(pathname);
  if (!filePath) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  const contentType = contentTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
  const body = fs.readFileSync(filePath);
  const acceptsGzip = /\bgzip\b/.test(request.headers['accept-encoding'] || '');
  const compressible = /^(text\/|application\/(javascript|json|xml))/.test(contentType);
  const headers = {
    'Content-Type': contentType,
    'Cache-Control': pathname.startsWith('/_next/static/')
      ? 'public, max-age=31536000, immutable'
      : 'public, max-age=0, must-revalidate',
  };

  if (acceptsGzip && compressible) {
    headers['Content-Encoding'] = 'gzip';
    headers.Vary = 'Accept-Encoding';
    response.writeHead(200, headers);
    response.end(zlib.gzipSync(body));
    return;
  }

  response.writeHead(200, headers);
  response.end(body);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Static export available at http://127.0.0.1:${port}`);
});
