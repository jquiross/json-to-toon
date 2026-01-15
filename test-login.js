import mongoose from 'mongoose';
import User from './backend/models/User.model.js';

const testLogin = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/json-to-toon');
    console.log('Connected to MongoDB');
    
    const email = 'jeremyquiros03@gmail.com';
    const testPassword = 'password123'; // Cambia esto por tu password real
    
    console.log(`\n🔍 Testing login for: ${email}`);
    
    // Find user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log(`✅ User found: ${user.username}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🟢 Active: ${user.isActive}`);
    console.log(`🔒 Has password: ${!!user.password}`);
    
    // Test password comparison
    console.log(`\n🔐 Testing password...`);
    const isPasswordValid = await user.comparePassword(testPassword);
    console.log(`Password valid: ${isPasswordValid}`);
    
    if (isPasswordValid) {
      console.log('✅ Login should work!');
    } else {
      console.log('❌ Password is incorrect');
      console.log('💡 Try using the password you used when registering');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

testLogin();