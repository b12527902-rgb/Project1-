const axios = require('axios');

// Test script to debug the chat API endpoint
const API_BASE_URL = 'http://localhost:3001';

async function testChatAPI() {
  console.log('🔍 Testing Chat API Endpoint...\n');

  // Test 1: Health check
  try {
    console.log('1. Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check passed:', healthResponse.data.status);
    console.log('   Services:', healthResponse.data.services);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }

  // Test 2: Chat endpoint without auth (should return 401)
  try {
    console.log('\n2. Testing chat endpoint without auth...');
    const response = await axios.post(`${API_BASE_URL}/api/chat/message`, {
      message: 'Hello, world!'
    });
    console.log('❌ Unexpected success - should have failed with 401');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Correctly returned 401 for missing auth');
    } else {
      console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
    }
  }

  // Test 3: Chat endpoint with invalid auth token
  try {
    console.log('\n3. Testing chat endpoint with invalid auth...');
    const response = await axios.post(`${API_BASE_URL}/api/chat/message`, {
      message: 'Hello, world!'
    }, {
      headers: {
        'Authorization': 'Bearer invalid-token'
      }
    });
    console.log('❌ Unexpected success - should have failed with 401');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Correctly returned 401 for invalid auth');
    } else {
      console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
    }
  }

  // Test 4: Register a test user
  let authToken = null;
  try {
    console.log('\n4. Registering test user...');
    const registerResponse = await axios.post(`${API_BASE_URL}/api/auth/register`, {
      email: 'test@example.com',
      password: 'testpass123',
      fullName: 'Test User'
    });
    
    if (registerResponse.data.token) {
      authToken = registerResponse.data.token;
      console.log('✅ User registered successfully');
    } else {
      console.log('❌ Registration failed:', registerResponse.data);
      return;
    }
  } catch (error) {
    if (error.response?.status === 409) {
      console.log('⚠️  User already exists, trying to login...');
      
      // Try to login instead
      try {
        const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: 'test@example.com',
          password: 'testpass123'
        });
        
        if (loginResponse.data.token) {
          authToken = loginResponse.data.token;
          console.log('✅ User logged in successfully');
        } else {
          console.log('❌ Login failed:', loginResponse.data);
          return;
        }
      } catch (loginError) {
        console.log('❌ Login error:', loginError.response?.data || loginError.message);
        return;
      }
    } else {
      console.log('❌ Registration error:', error.response?.data || error.message);
      return;
    }
  }

  // Test 5: Chat endpoint with valid auth but missing message
  try {
    console.log('\n5. Testing chat endpoint with valid auth but missing message...');
    const response = await axios.post(`${API_BASE_URL}/api/chat/message`, {
      personality: 'mentor'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('❌ Unexpected success - should have failed with 400');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Correctly returned 400 for missing message');
      console.log('   Error details:', error.response.data);
    } else {
      console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
    }
  }

  // Test 6: Chat endpoint with valid auth and message
  try {
    console.log('\n6. Testing chat endpoint with valid auth and message...');
    const response = await axios.post(`${API_BASE_URL}/api/chat/message`, {
      message: 'Hello, this is a test message!',
      personality: 'mentor'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    if (response.data.response) {
      console.log('✅ Chat API working correctly!');
      console.log('   Response:', response.data.response.substring(0, 100) + '...');
      console.log('   Conversation ID:', response.data.conversationId);
    } else {
      console.log('❌ Unexpected response format:', response.data);
    }
  } catch (error) {
    console.log('❌ Chat API error:', error.response?.status, error.response?.data || error.message);
  }

  // Test 7: Test with empty message
  try {
    console.log('\n7. Testing chat endpoint with empty message...');
    const response = await axios.post(`${API_BASE_URL}/api/chat/message`, {
      message: '',
      personality: 'mentor'
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('❌ Unexpected success - should have failed with 400');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Correctly returned 400 for empty message');
      console.log('   Error details:', error.response.data);
    } else {
      console.log('❌ Unexpected error:', error.response?.status, error.response?.data);
    }
  }

  console.log('\n🎯 Test completed!');
}

// Run the test
testChatAPI().catch(console.error);
