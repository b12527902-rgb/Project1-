#!/usr/bin/env node

/**
 * Quick Test Script for Chatty Web Architect
 * Run this script to test basic functionality
 */

import http from 'http';
import https from 'https';

const BACKEND_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:8080';

console.log('🧪 Quick Test for Chatty Web Architect');
console.log('=====================================\n');

// Test functions
async function testBackendHealth() {
  console.log('🔍 Testing Backend Health...');
  
  return new Promise((resolve) => {
    const req = http.get(`${BACKEND_URL}/health`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          console.log('✅ Backend is running');
          console.log(`   Environment: ${health.environment || 'unknown'}`);
          console.log(`   Uptime: ${Math.floor(health.uptime || 0)}s`);
          console.log(`   Version: ${health.version || '1.0.0'}`);
          resolve(true);
        } catch (error) {
          console.log('❌ Backend health check failed - invalid JSON response');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Backend is not running or not accessible');
      console.log(`   Error: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Backend health check timeout');
      req.destroy();
      resolve(false);
    });
  });
}

async function testBackendInfo() {
  console.log('\n📊 Testing Backend Info...');
  
  return new Promise((resolve) => {
    const req = http.get(`${BACKEND_URL}/info`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const info = JSON.parse(data);
          console.log('✅ Backend info endpoint working');
          console.log(`   Name: ${info.name}`);
          console.log(`   Version: ${info.version}`);
          console.log(`   Features: ${info.features?.length || 0} features available`);
          resolve(true);
        } catch (error) {
          console.log('❌ Backend info check failed');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Backend info endpoint failed');
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Backend info check timeout');
      req.destroy();
      resolve(false);
    });
  });
}

async function testDatabaseConnection() {
  console.log('\n🗄️ Testing Database Connection...');
  
  return new Promise((resolve) => {
    const req = http.get(`${BACKEND_URL}/api/subscriptions/plans`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const plans = JSON.parse(data);
          if (plans && typeof plans === 'object') {
            console.log('✅ Database connection working');
            console.log(`   Available plans: ${Object.keys(plans).length}`);
            resolve(true);
          } else {
            console.log('❌ Database connection failed - invalid response');
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Database connection failed - JSON parse error');
          resolve(false);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log('❌ Database connection failed');
      console.log(`   Error: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Database connection timeout');
      req.destroy();
      resolve(false);
    });
  });
}

async function testFrontendAccess() {
  console.log('\n🌐 Testing Frontend Access...');
  
  return new Promise((resolve) => {
    const req = http.get(FRONTEND_URL, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Frontend is accessible');
        console.log(`   Status: ${res.statusCode}`);
        console.log(`   Content-Type: ${res.headers['content-type']}`);
        resolve(true);
      } else {
        console.log(`❌ Frontend returned status: ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      console.log('❌ Frontend is not accessible');
      console.log(`   Error: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ Frontend access timeout');
      req.destroy();
      resolve(false);
    });
  });
}

async function testWebSocketConnection() {
  console.log('\n🔌 Testing WebSocket Connection...');
  
  return new Promise((resolve) => {
    const req = http.get(`${BACKEND_URL}/socket.io/`, (res) => {
      if (res.statusCode === 200 || res.statusCode === 400) {
        console.log('✅ WebSocket endpoint accessible');
        console.log(`   Status: ${res.statusCode}`);
        resolve(true);
      } else {
        console.log(`❌ WebSocket endpoint returned status: ${res.statusCode}`);
        resolve(false);
      }
    });
    
    req.on('error', (error) => {
      console.log('❌ WebSocket endpoint not accessible');
      console.log(`   Error: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      console.log('❌ WebSocket connection timeout');
      req.destroy();
      resolve(false);
    });
  });
}

async function runAllTests() {
  const results = {
    backend: await testBackendHealth(),
    info: await testBackendInfo(),
    database: await testDatabaseConnection(),
    frontend: await testFrontendAccess(),
    websocket: await testWebSocketConnection()
  };
  
  console.log('\n📊 Test Results Summary');
  console.log('=======================');
  console.log(`Backend Health: ${results.backend ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Backend Info: ${results.info ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Database: ${results.database ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Frontend: ${results.frontend ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`WebSocket: ${results.websocket ? '✅ PASS' : '❌ FAIL'}`);
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Your application is ready for testing.');
    console.log('\n📝 Next steps:');
    console.log('1. Open http://localhost:8080 in your browser');
    console.log('2. Register a new account');
    console.log('3. Test the chat functionality');
    console.log('4. Try the different AI personalities');
    console.log('5. Test the subscription features');
  } else {
    console.log('⚠️ Some tests failed. Please check:');
    console.log('1. Is the backend running? (npm run dev in backend folder)');
    console.log('2. Is the frontend running? (npm run dev in root folder)');
    console.log('3. Is PostgreSQL running and configured?');
    console.log('4. Check the TESTING_GUIDE.md for detailed instructions');
  }
  
  console.log('\n📚 For detailed testing, see TESTING_GUIDE.md');
}

// Run tests
runAllTests().catch(console.error); 