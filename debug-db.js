import mongoose from 'mongoose';
import User from './backend/models/User.model.js';

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/json-to-toon');
    console.log('Connected to MongoDB');
    
    const users = await User.find({});
    console.log(`\n📊 Total users in database: ${users.length}`);
    
    if (users.length > 0) {
      console.log('\n👥 Users found:');
      users.forEach(user => {
        console.log(`- Username: ${user.username}`);
        console.log(`  Email: ${user.email}`);
        console.log(`  Active: ${user.isActive}`);
        console.log(`  Created: ${user.createdAt}`);
        console.log('---');
      });
    } else {
      console.log('\n❌ No users found in database');
      console.log('💡 Try registering a new account first');
    }
    
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

connectDB();