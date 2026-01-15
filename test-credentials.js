import mongoose from 'mongoose';
import User from './backend/models/User.model.js';
import bcrypt from 'bcryptjs';

const testCredentials = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/json-to-toon');
    console.log('Connected to MongoDB');
    
    const email = 'jeremyquiros03@gmail.com';
    const testPassword = '123456';
    
    console.log(`\n🔍 Testing credentials for: ${email}`);
    console.log(`Password to test: ${testPassword}`);
    
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log(`✅ User found: ${user.username}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🟢 Active: ${user.isActive}`);
    console.log(`🔒 Has password: ${!!user.password}`);
    console.log(`📅 Created: ${user.createdAt}`);
    console.log(`🕐 Last login: ${user.lastLogin || 'Never'}`);
    
    // Test password comparison
    console.log(`\n🔐 Testing password comparison...`);
    const isPasswordValid = await user.comparePassword(testPassword);
    console.log(`Password match result: ${isPasswordValid}`);
    
    if (isPasswordValid) {
      console.log('✅ Credentials are correct! Login should work.');
    } else {
      console.log('❌ Password is incorrect.');
      
      // Let's also test bcrypt directly
      console.log('\n🧪 Testing bcrypt directly...');
      const directTest = await bcrypt.compare(testPassword, user.password);
      console.log(`Direct bcrypt test: ${directTest}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

testCredentials();