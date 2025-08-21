const axios = require('axios');

// Test the chat API
async function testChatAPI() {
    console.log('🧪 Testing Chat API...');
    
    try {
        // First test: No authentication (should return 401)
        console.log('\n1. Testing without authentication:');
        try {
            const response = await axios.post('http://localhost:3001/api/chat/message', {
                message: 'Hello',
                personality: 'mentor'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('❌ Unexpected success:', response.status);
        } catch (error) {
            if (error.response) {
                console.log('✅ Expected auth error:', error.response.status, error.response.data);
            } else {
                console.log('❌ Connection error:', error.message);
                return;
            }
        }

        // Second test: Register a test user and get token
        console.log('\n2. Creating test user:');
        let authToken;
        try {
            const registerResponse = await axios.post('http://localhost:3001/api/auth/register', {
                email: `testuser${Date.now()}@example.com`,
                password: 'testpassword123',
                fullName: 'Test User'
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            authToken = registerResponse.data.token;
            console.log('✅ User registered successfully, got token');
        } catch (error) {
            console.log('❌ Registration failed:', error.response?.data || error.message);
            return;
        }

        // Third test: Send chat message with authentication
        console.log('\n3. Testing chat with authentication:');
        try {
            const chatResponse = await axios.post('http://localhost:3001/api/chat/message', {
                message: 'Hello, how are you?',
                personality: 'mentor'
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            console.log('✅ Chat API working! Response:', {
                status: chatResponse.status,
                responseLength: chatResponse.data.response?.length,
                conversationId: chatResponse.data.conversationId,
                personality: chatResponse.data.personality
            });
            console.log('🤖 AI Response:', chatResponse.data.response);
        } catch (error) {
            console.log('❌ Chat API failed:', error.response?.data || error.message);
            
            // Debug information
            if (error.response) {
                console.log('Status:', error.response.status);
                console.log('Response:', error.response.data);
            }
        }

    } catch (error) {
        console.log('❌ Test failed:', error.message);
    }
}

// Give the server time to start
setTimeout(testChatAPI, 2000);
