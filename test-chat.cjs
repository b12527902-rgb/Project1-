const axios = require('axios');

async function testChat() {
    try {
        console.log('Testing chat endpoint...');
        
        // First, let's register and get a token
        const testUser = {
            email: 'chattest-' + Date.now() + '@test.com',
            password: 'password123',
            fullName: 'Chat Test User'
        };
        
        console.log('1. Registering test user...');
        const registerRes = await axios.post('http://localhost:3001/api/auth/register', testUser, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        const token = registerRes.data.token;
        console.log('✅ User registered, token obtained');
        
        // Now test the chat
        console.log('2. Testing chat message...');
        const chatData = {
            message: 'Hello! Can you introduce yourself?',
            personality: 'mentor'
        };
        
        const chatRes = await axios.post('http://localhost:3001/api/chat/message', chatData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('✅ Chat successful!');
        console.log('Response:', chatRes.data.response);
        console.log('Conversation ID:', chatRes.data.conversationId);
        console.log('Personality:', chatRes.data.personality);
        
    } catch (error) {
        console.error('❌ Error occurred:');
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Error Data:', error.response?.data);
        console.error('Full Error:', error.message);
    }
}

testChat();
