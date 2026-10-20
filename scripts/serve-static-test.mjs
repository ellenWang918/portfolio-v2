// Deliberately has no SPA fallback: fresh project visits must resolve real files.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/client/', import.meta.url));
const base = process.env.GITHUB_PAGES === 'true' ? '/portfolio-v2/' : '/';
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ttf': 'font/ttf', '.mp4': 'video/mp4' };

createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1');
    const pathname = decodeURIComponent(url.pathname);
    if (!['GET', 'HEAD'].includes(request.method) || !pathname.startsWith(base)) {
      response.writeHead(404).end();
      return;
    }
    let file = path.resolve(root, pathname.slice(base.length));
    const relative = path.relative(root, file);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      response.writeHead(404).end();
      return;
    }
    if ((await stat(file)).isDirectory()) {
      if (!url.pathname.endsWith('/')) {
        response.writeHead(301, { location: `${url.pathname}/${url.search}` }).end();
        return;
      }
      file = path.join(file, 'index.html');
    }
    const body = await readFile(file);
    response.writeHead(200, { 'content-type': types[path.extname(file)] ?? 'application/octet-stream' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(404).end();
  }
}).listen(4175, '127.0.0.1');
