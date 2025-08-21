const fs = require('fs');
const path = require('path');

// Redirect console output to file
const logFile = path.join(__dirname, 'server.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.log = (...args) => {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] ${args.join(' ')}\n`;
  logStream.write(message);
  originalConsoleLog(...args);
};

console.error = (...args) => {
  const timestamp = new Date().toISOString();
  const message = `[${timestamp}] ERROR: ${args.join(' ')}\n`;
  logStream.write(message);
  originalConsoleError(...args);
};

console.log('Starting server with logging...');

// Start the server
require('./src/server.js');
