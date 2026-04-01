const http = require('http');
const fs = require('fs');
const path = require('path');
const root = '/Users/litingkway/Downloads/proj_townhall';
const mime = { '.html':'text/html','.css':'text/css','.js':'text/javascript',
               '.jpeg':'image/jpeg','.jpg':'image/jpeg','.png':'image/png',
               '.svg':'image/svg+xml','.ico':'image/x-icon' };
http.createServer((req, res) => {
  let fp = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (fp.endsWith('/')) fp += 'index.html';
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(fp)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(4321, '127.0.0.1', () => console.log('Server running on port 4321'));
