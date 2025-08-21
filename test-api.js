import axios from 'axios';

async function testAPI() {
    try {
        console.log('Testing login endpoint...');
        const response = await axios.post('http://localhost:3001/api/auth/login', {
            email: 'developer@localhost',
            password: 'password123'
        });
        console.log('Login Success:', response.data);
    } catch (error) {
        console.error('Login Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('Full error:', error.response?.data);
    }

    try {
        console.log('\nTesting registration endpoint...');
        const response = await axios.post('http://localhost:3001/api/auth/register', {
            email: 'test@example.com',
            password: 'password123',
            fullName: 'Test User'
        });
        console.log('Registration Success:', response.data);
    } catch (error) {
        console.error('Registration Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
    }
}

testAPI();
