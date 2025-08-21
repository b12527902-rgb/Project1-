const fs = require('fs');
const express = require('express');

// Write status to file
fs.writeFileSync('server-status.txt', 'Testing server startup...\n');

try {
  const app = express();
  const PORT = 3001;
  
  app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running!' });
  });
  
  const server = app.listen(PORT, () => {
    fs.appendFileSync('server-status.txt', `✅ Server started on port ${PORT}\n`);
    fs.appendFileSync('server-status.txt', `Time: ${new Date().toISOString()}\n`);
  });
  
  server.on('error', (error) => {
    fs.appendFileSync('server-status.txt', `❌ Server error: ${error.message}\n`);
  });
  
} catch (error) {
  fs.appendFileSync('server-status.txt', `❌ Startup error: ${error.message}\n`);
}
