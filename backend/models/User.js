const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  userType: {
    type: String,
    enum: ['influencer', 'brand'],
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    unique: true
  },
});

// Pre-save hook to generate username
userSchema.pre('save', async function (next) {
  if (!this.userName) {
    const firstName = this.name.split(' ')[0].toLowerCase();
    let randomNum = Math.floor(1000 + Math.random() * 9000);
    let newUserName = `@${firstName}${randomNum}`;

    let existingUser = await this.constructor.findOne({ userName: newUserName });
    while (existingUser) {
      randomNum = Math.floor(1000 + Math.random() * 9000);
      newUserName = `@${firstName}${randomNum}`;
      existingUser = await this.constructor.findOne({ userName: newUserName });
    }

    this.userName = newUserName;
  }
  next();
});


module.exports = mongoose.model('User', userSchema);
