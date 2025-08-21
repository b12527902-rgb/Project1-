require('dotenv').config();
const axios = require('axios');

async function testGeminiAPI() {
    try {
        console.log('🔍 Testing Google Gemini API...');
        console.log('API Key configured:', !!process.env.GEMINI_API_KEY);
        console.log('API Key length:', process.env.GEMINI_API_KEY?.length || 0);
        
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
            console.log('❌ No valid Gemini API key found');
            console.log('📝 Please set GEMINI_API_KEY in your .env file');
            console.log('🌐 Get your API key from: https://makersuite.google.com/app/apikey');
            return;
        }
        
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{
                    parts: [{ text: 'Hello! Please respond with a brief greeting and tell me you are Google Gemini AI.' }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 100,
                    topP: 0.8,
                    topK: 10
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('✅ Gemini API call successful!');
        console.log('Response:', response.data.candidates[0].content.parts[0].text);
        
    } catch (error) {
        console.error('❌ Gemini API Error:');
        console.error('Status:', error.response?.status);
        console.error('Status Text:', error.response?.statusText);
        console.error('Error Data:', JSON.stringify(error.response?.data, null, 2));
        
        if (error.response?.status === 400) {
            console.log('💡 This might be due to an invalid API key or request format');
        } else if (error.response?.status === 403) {
            console.log('💡 This might be due to API access restrictions or invalid key');
        } else if (error.response?.status === 404) {
            console.log('💡 This might be due to incorrect API endpoint or model name');
        }
        
        console.log('\n📝 To fix this:');
        console.log('1. Go to https://makersuite.google.com/app/apikey');
        console.log('2. Create or get your Gemini API key');
        console.log('3. Add it to backend/.env as: GEMINI_API_KEY=your_key_here');
    }
}

testGeminiAPI();
