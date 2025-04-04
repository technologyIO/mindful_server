const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  about: {
    type: String,
  },
  profession_background: {
    type: mongoose.Schema.Types.Mixed,
  },
  language_spoken: {
    type: mongoose.Schema.Types.Mixed,
  },
  specialization: {
    type: mongoose.Schema.Types.Mixed,
  },
  experience: {
    type: Number,
  },
  image: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  website: {
    type: String,
  },
  availability: {
    type: mongoose.Schema.Types.Mixed,
  },
  description: {
    type: String,
  },
  metaTitle: {              // New meta title field
    type: String,
  },
  metaDescription: {        // New meta description field
    type: String,
  },
  order: {
    type: Number,
    required: true,
    default: 0,  // Default order
  }
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', DoctorSchema);

module.exports = Doctor;
