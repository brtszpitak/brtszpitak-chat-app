const http = require('http');
http
  .get('http://localhost:3001/health', (r) => {
    const ok = r.statusCode === 200;
    console.log('SMOKE', ok ? 'OK' : 'FAIL');
    process.exit(ok ? 0 : 1);
  })
  .on('error', (e) => {
    console.error('SMOKE error:', e.message);
    process.exit(1);
  });
