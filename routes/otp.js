const express = require('express');
const axios = require('axios');
const router = express.Router();
const Otp = require('../database/models/Otp'); // adjust the path if needed

const SMS_MAGIC_API_URL = 'https://api.sms-magic.com/v1/sms/send';
const SMS_MAGIC_API_KEY = 'fd5db3ce13ebf18160bd534f2e21bac2';
const sender_id = "MFLTMS";

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const sms_text = `Dear User, Your MindfulTMS Neurocare India OTP is ${otp}. It is valid for 10 min. If you did not request this, please ignore this msg.`;

  try {
    await axios.post(
      SMS_MAGIC_API_URL,
      {
        channel: 'sms',
        sender_id,
        mobile_number: phone,
        sms_text,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SMS_MAGIC_API_KEY}`,
          apiKey: SMS_MAGIC_API_KEY
        },
      }
    );

    // Remove any previous OTPs for this number
    await Otp.deleteMany({ phone });

    // Save new OTP
    const newOtp = new Otp({ phone, otp });
    await newOtp.save();

    res.status(200).json({ success: true, message: 'OTP sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: err.message });
  }
});



// Verify OTP

router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const record = await Otp.findOne({ phone });

    if (!record) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found' });
    }

    if (record.otp === parseInt(otp)) {
      await Otp.deleteMany({ phone }); // cleanup after successful verification
      return res.json({ success: true, message: 'OTP verified' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error verifying OTP', error: err.message });
  }
});

module.exports = router;