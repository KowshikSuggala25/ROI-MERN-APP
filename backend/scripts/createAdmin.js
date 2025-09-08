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
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/roi-mern');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@test.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      
      // Update existing admin to ensure correct role and password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      existingAdmin.password = hashedPassword;
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      existingAdmin.kycStatus = 'approved';
      existingAdmin.walletBalance = 100000; // Give admin some balance for testing
      
      await existingAdmin.save();
      console.log('Admin user updated successfully');
    } else {
      // Create new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      const adminUser = new User({
        name: 'System Administrator',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
        walletBalance: 100000,
        kycStatus: 'approved',
        isActive: true
      });

      await adminUser.save();
      console.log('Admin user created successfully');
    }

    // Also create a test user if it doesn't exist
    const existingUser = await User.findOne({ email: 'user@test.com' });
    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('user123', salt);

      const testUser = new User({
        name: 'Test User',
        email: 'user@test.com',
        password: hashedPassword,
        role: 'user',
        walletBalance: 10000,
        kycStatus: 'approved',
        isActive: true
      });

      await testUser.save();
      console.log('Test user created successfully');
    } else {
      console.log('Test user already exists');
    }

    console.log('\n=== Demo Credentials ===');
    console.log('Admin: admin@test.com / admin123');
    console.log('User: user@test.com / user123');
    console.log('========================\n');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

createAdminUser();