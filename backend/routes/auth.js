const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/login');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');

router.post('/login', login);
router.post('/register', register);

// Protected profile route
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // exclude password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// PUT change password (authenticated)
router.put('/password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }
    const bcrypt = require('bcryptjs');
    const user = await User.findById(req.user.id);
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update display name
router.put('/name', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) return res.status(400).json({ message: 'Name required' });
    await User.findByIdAndUpdate(req.user.id, { name: name.trim() });
    res.json({ message: 'Name updated' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// POST forgot password — generates a reset token and logs it
// In production this would email the token; for now returns it in response
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const User = require('../models/User');
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    // Always return success to prevent email enumeration
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent.' });

    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + 3600000; // 1 hour

    // Store token on user — we add these fields temporarily
    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await user.save();

    // In production: send email with reset link
    // For now: return token so developer can test
    res.json({
      message: 'If that email exists, a reset link has been sent.',
      // Remove next line in production:
      dev_token: process.env.NODE_ENV !== 'production' ? token : undefined,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password required' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Token is invalid or has expired' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;