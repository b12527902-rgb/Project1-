// Quick test to verify auth endpoints are working
const testAuth = async () => {
  console.log('🔍 Testing authentication endpoints...');
  
  try {
    // Test login (since user already exists)
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'testpass123'
      })
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (!response.ok) {
      console.error('❌ Auth endpoint error:', data);
    } else {
      console.log('✅ Auth endpoint working!');
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

testAuth();
