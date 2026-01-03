const mongoose = require('mongoose');
require('dotenv').config();

async function testDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mern_ecommerce');
    console.log('✅ MongoDB Connected');
    
    // Test User model
    const User = require('./models/User');
    console.log('✅ User model loaded');
    
    // Count users
    const count = await User.countDocuments();
    console.log(`📊 Total users in database: ${count}`);
    
    await mongoose.disconnect();
    console.log('✅ Disconnected');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
  }
}

testDB();