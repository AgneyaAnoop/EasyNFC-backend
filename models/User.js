// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const linkSchema = new mongoose.Schema({
  platform: String,
  url: String,
  isCustom: {
    type: Boolean,
    default: false
  },
  customTitle: String
});

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phoneNo: String,
  about: String,
  links: [linkSchema],
  urlSlug: {
    type: String,
    unique: true
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profiles: {
    type: [profileSchema],
    validate: [arrayLimit, 'Exceeds the limit of 5 profiles']
  },
  activeProfile: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

function arrayLimit(val) {
  return val.length <= 5;
}

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Fix: Changed mongoose.model to userSchema
module.exports = mongoose.model('User', userSchema);