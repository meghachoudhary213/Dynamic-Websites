import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../config/db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jabalpur_nexus_key_2026';

// Middleware to verify Admin JWT
export const verifyAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. Authorization token missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await User.findOne({ email: decoded.email });
    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden. Administrative privileges required.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired authorization token.' });
  }
};

// Token Verification Middleware (Admin or Student)
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. Token missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

// Simple in-memory cache for simulated OTPs
const otpCache = new Map();

// User Registration Route (Students)
router.post('/register', async (req, res) => {
  const { email, password, role, name, phone, otp } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }

  // If OTP was sent, check and verify it
  if (otp) {
    const cachedOtp = otpCache.get(email.toLowerCase()) || otpCache.get(phone);
    if (!cachedOtp || cachedOtp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code.' });
    }
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'student';

    const newUser = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: userRole,
      name,
      phone
    });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Clear verified OTP
    if (otp) {
      otpCache.delete(email.toLowerCase());
      if (phone) otpCache.delete(phone);
    }

    return res.json({
      success: true,
      token,
      role: newUser.role,
      user: {
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        phone: newUser.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Generate and Send Simulated OTP
router.post('/generate-otp', async (req, res) => {
  const { email, phone } = req.body;
  if (!email && !phone) {
    return res.status(400).json({ success: false, message: 'Provide email or phone to generate verification OTP.' });
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  
  if (email) otpCache.set(email.toLowerCase(), generatedOtp);
  if (phone) otpCache.set(phone, generatedOtp);

  // Set timeout to expire in 5 minutes
  setTimeout(() => {
    if (email) otpCache.delete(email.toLowerCase());
    if (phone) otpCache.delete(phone);
  }, 300000);

  console.log(`🔐 [JABALPUR OTP ORACLE] Generated simulated OTP: ${generatedOtp} for ${email || phone}`);

  return res.json({
    success: true,
    message: `Verification OTP successfully generated and sent to ${email || phone}!`,
    otp: generatedOtp // Returned directly for frictionless testing and wow user experiences!
  });
});

// Password Reset Endpoint
router.post('/reset-password', async (req, res) => {
  const { email, phone, otp, newPassword } = req.body;
  if (!email || !phone || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'Provide Email, Mobile, OTP code, and New Password.' });
  }

  // Verify cached OTP
  const cachedOtp = otpCache.get(email.toLowerCase()) || otpCache.get(phone);
  if (!cachedOtp || cachedOtp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid or expired verification OTP code.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No registered student matches this email address.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // In fallback mode or Mongoose, let's update password
    user.password = hashedPassword;
    
    // Write back to DB
    if (User.findOneAndUpdate) {
      // In custom wrapper or mongoose
      await User.findOneAndUpdate({ email: email.toLowerCase() }, { password: hashedPassword });
    } else {
      await user.save();
    }

    // Clear verified OTP
    otpCache.delete(email.toLowerCase());
    otpCache.delete(phone);

    console.log(`🔒 [JABALPUR RESET ENGINE] Password successfully reset for user ${email}`);

    return res.json({
      success: true,
      message: 'Password successfully updated! You can now log in with your new credentials.'
    });
  } catch (err) {
    console.error('Password reset error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update database record.' });
  }
});

// Login Route (Admin & Students)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      role: user.role,
      user: {
        email: user.email,
        role: user.role,
        name: user.name || '',
        phone: user.phone || ''
      },
      admin: user.role === 'admin' ? {
        email: user.email,
        role: user.role
      } : null
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Get current admin user
router.get('/me', verifyAdmin, async (req, res) => {
  return res.json({
    success: true,
    admin: {
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Get current logged-in user (General)
router.get('/user/me', verifyToken, async (req, res) => {
  return res.json({
    success: true,
    user: {
      email: req.user.email,
      role: req.user.role
    }
  });
});

export default router;
