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

module.exports = router;
