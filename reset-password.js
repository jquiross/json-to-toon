import mongoose from 'mongoose';
import User from './backend/models/User.model.js';
import bcrypt from 'bcryptjs';

const resetPassword = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/json-to-toon');
    console.log('Connected to MongoDB');
    
    const email = 'jeremyquiros03@gmail.com';
    const newPassword = '123456'; // Nueva contraseña temporal
    
    console.log(`\n🔍 Resetting password for: ${email}`);
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log(`✅ User found: ${user.username}`);
    
    // Hash new password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password directly
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    
    console.log(`✅ Password reset successfully!`);
    console.log(`🔑 New password: ${newPassword}`);
    console.log(`💡 You can now login with:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${newPassword}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

resetPassword();