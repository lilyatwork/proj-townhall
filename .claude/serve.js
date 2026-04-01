const http = require('http');
const fs = require('fs');
const path = require('path');
const root = '/Users/litingkway/Downloads/proj_townhall';
const mime = { '.html':'text/html','.css':'text/css','.js':'text/javascript',
               '.jpeg':'image/jpeg','.jpg':'image/jpeg','.png':'image/png',
               '.mp4':'video/mp4','.webm':'video/webm',
               '.svg':'image/svg+xml','.ico':'image/x-icon' };

http.createServer((req, res) => {
  let fp = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  if (fp.endsWith('/')) fp += 'index.html';

  fs.stat(fp, (err, stat) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }

    const contentType = mime[path.extname(fp)] || 'application/octet-stream';
    const range = req.headers.range;

    // Range requests (needed for video seeking)
    if (range) {
      const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
      const chunkSize = end - start + 1;
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
      });
      fs.createReadStream(fp, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': stat.size,
        'Content-Type': contentType,
        'Accept-Ranges': 'bytes',
      });
      fs.createReadStream(fp).pipe(res);
    }
  });
}).listen(4321, '127.0.0.1', () => console.log('Server running on port 4321'));
