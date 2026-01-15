import axios from 'axios';

const testLoginAPI = async () => {
  try {
    console.log('🔍 Testing login API endpoint...');
    console.log('Server: http://localhost:5000/api/auth/login');
    
    // Test data - usa tu email y password real
    const loginData = {
      email: 'jeremyquiros03@gmail.com',
      password: 'password123' // Cambia esto por tu password real
    };
    
    console.log(`\n📧 Testing login for: ${loginData.email}`);
    
    const response = await axios.post('http://localhost:5000/api/auth/login', loginData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('✅ Login successful!');
    console.log('📦 Response:');
    console.log('- Success:', response.data.success);
    console.log('- User:', response.data.user.username);
    console.log('- Token received:', !!response.data.token);
    
  } catch (error) {
    console.log('❌ Login failed!');
    
    if (error.response) {
      console.log('📊 Error details:');
      console.log('- Status:', error.response.status);
      console.log('- Message:', error.response.data?.message);
      console.log('- Full response:', error.response.data);
    } else if (error.request) {
      console.log('🚫 Network error: Cannot reach server');
      console.log('Make sure the server is running on port 5000');
    } else {
      console.log('🔥 Unexpected error:', error.message);
    }
  }
};

testLoginAPI();