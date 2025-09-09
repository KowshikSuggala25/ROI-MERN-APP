import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import User model
import User from '../models/User.js';

const createAdminUser = async () => {
  try {
    // Check if MONGODB_URI is configured
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri || mongoUri.includes('username:password')) {
      console.error('❌ MongoDB connection string not configured!');
      console.error('Please set up MongoDB Atlas:');
      console.error('1. Go to https://cloud.mongodb.com');
      console.error('2. Create a free cluster');
      console.error('3. Get your connection string');
      console.error('4. Update MONGODB_URI in your .env file');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Delete existing admin and test users to start fresh
    await User.deleteMany({ email: { $in: ['admin@test.com', 'user@test.com'] } });
    console.log('Removed existing admin and test users');

    // Create admin user with explicit password hashing
    const adminPassword = 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedAdminPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@test.com',
      password: hashedAdminPassword,
      role: 'admin',
      walletBalance: 100000,
      kycStatus: 'approved',
      isActive: true
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully');

    // Create test user
    const userPassword = 'user123';
    const userSalt = await bcrypt.genSalt(10);
    const hashedUserPassword = await bcrypt.hash(userPassword, userSalt);

    const testUser = new User({
      name: 'Test User',
      email: 'user@test.com',
      password: hashedUserPassword,
      role: 'user',
      walletBalance: 10000,
      kycStatus: 'approved',
      isActive: true
    });

    await testUser.save();
    console.log('✅ Test user created successfully');

    // Verify the admin user can be found and password works
    const verifyAdmin = await User.findOne({ email: 'admin@test.com' });
    if (verifyAdmin) {
      const passwordMatch = await bcrypt.compare('admin123', verifyAdmin.password);
      console.log('✅ Admin verification:', passwordMatch ? 'Password matches' : '❌ Password does not match');
      console.log('✅ Admin role:', verifyAdmin.role);
      console.log('✅ Admin active:', verifyAdmin.isActive);
    }

    console.log('\n=== Demo Credentials ===');
    console.log('Admin: admin@test.com / admin123');
    console.log('User: user@test.com / user123');
    console.log('========================\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

createAdminUser();