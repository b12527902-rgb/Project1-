require('dotenv').config();
const axios = require('axios');

async function testOpenAIDirect() {
    try {
        console.log('Testing OpenAI API directly...');
        console.log('API Key length:', process.env.OPENAI_API_KEY?.length);
        console.log('API Key starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-'));
        
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: 'Hello! Can you say hi back?' }
                ],
                temperature: 0.7,
                max_tokens: 100
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('✅ OpenAI API call successful!');
        console.log('Response:', response.data.choices[0].message.content);
        
    } catch (error) {
        console.error('❌ OpenAI API Error:');
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
        console.error('Request Headers:', error.config?.headers);
    }
}

testOpenAIDirect();
