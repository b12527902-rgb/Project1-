const http = require('http');

console.log('Testing server connection...');

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers: ${JSON.stringify(res.headers)}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response body:', data);
    console.log('✅ Server is running and responding!');
  });
});

req.on('error', (e) => {
  console.error(`❌ Problem with request: ${e.message}`);
  console.log('Server might not be running on port 3001');
});

req.end();
