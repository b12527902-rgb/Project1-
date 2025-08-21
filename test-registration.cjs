const axios = require('axios');

async function testRegistration() {
    try {
        console.log('Testing registration endpoint...');
        
        const testData = {
            email: 'unique-' + Date.now() + '@test.com',
            password: 'password123',
            fullName: 'New Test User'
        };
        
        console.log('Sending data:', testData);
        
        const response = await axios.post('http://localhost:3001/api/auth/register', testData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Success! Status:', response.status);
        console.log('Response:', response.data);
        
    } catch (error) {
        console.error('Error occurred:');
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Error Data:', error.response?.data);
        console.error('Full Error:', error.message);
    }
}

testRegistration();
