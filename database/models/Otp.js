// models/Otp.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  otp: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // expires in 10 mins
});

module.exports = mongoose.model('Otp', otpSchema);