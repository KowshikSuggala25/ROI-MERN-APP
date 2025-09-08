import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import User model
import User from '../models/User.js';

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/roi-mern');
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