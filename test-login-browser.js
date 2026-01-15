fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'jeremyquiros03@gmail.com',
    password: '123456'
  })
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Response:', data);
  if (data.success) {
    console.log('✅ LOGIN SUCCESS!');
    console.log('User:', data.user.username);
  } else {
    console.log('❌ LOGIN FAILED!');
    console.log('Error:', data.message);
  }
})
.catch(error => {
  console.log('🚫 Network Error:', error);
});