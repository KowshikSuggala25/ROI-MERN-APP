import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // use `id` consistently
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// REGISTER
export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Role: only accept "user" or "admin"
    const validRoles = ['user', 'admin'];
    const userRole = validRoles.includes(role) ? role : 'user';

    // Create user
    const user = new User({
      name,
      email,
      password,
      role: userRole,
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(), // safe, excludes password
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

<<<<<<< HEAD
    // Find user and explicitly include password
    const user = await User.findOne({ email }).select('+password');
=======
    console.log('Login attempt for:', email); // Debug log
    // Find user by email
    const user = await User.findOne({ email });
>>>>>>> 464ae8ba7876a0013f32acf1907ac7be9bfe16d4
    if (!user || !user.isActive) {
      console.log('User not found or inactive:', email); // Debug log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

<<<<<<< HEAD
    // Compare password
=======
    console.log('User found:', user.email, 'Role:', user.role); // Debug log
    // Check password
>>>>>>> 464ae8ba7876a0013f32acf1907ac7be9bfe16d4
    const isValidPassword = await user.comparePassword(password);
    console.log('Password valid:', isValidPassword); // Debug log
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    console.log('Login successful for:', user.email); // Debug log
    res.json({
      message: 'Login successful',
      user: user.toJSON(), // safe version
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

// GET PROFILE
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // use `id` from JWT payload
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: user.toJSON() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id, // use `id` from JWT payload
      {
        name,
        phoneNumber,
        address,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
