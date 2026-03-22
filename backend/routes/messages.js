const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const Profile = require('../models/Profile');
const authMiddleware = require('../middlewares/authMiddleware');

// GET all conversations for current user (grouped by other user)
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    // Group into conversations by other user
    const conversationMap = {};
    for (const msg of messages) {
      const otherId = msg.sender.toString() === userId ? msg.receiver.toString() : msg.sender.toString();
      if (!conversationMap[otherId]) {
        conversationMap[otherId] = { lastMessage: msg, unread: 0 };
      }
      if (!msg.read && msg.receiver.toString() === userId) {
        conversationMap[otherId].unread++;
      }
    }

    // Populate user details
    const conversations = await Promise.all(
      Object.entries(conversationMap).map(async ([otherId, data]) => {
        const user    = await User.findById(otherId).select('name userName userType');
        const profile = await Profile.findOne({ user: otherId }).select('avatar');
        return { user, profile, lastMessage: data.lastMessage, unread: data.unread };
      })
    );

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET messages with a specific user
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id },
      ]
    }).sort({ createdAt: 1 });

    // Mark received messages as read
    await Message.updateMany(
      { sender: req.params.userId, receiver: req.user.id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST send a message
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    if (!receiverId || !content) return res.status(400).json({ message: 'Receiver and content required' });
    const message = new Message({ sender: req.user.id, receiver: receiverId, content });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;