const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    default: 'text'
  },
  patientName: {
    type: String,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  condition: {
    type: String,
  },
  treatment: {
    type: String,
  },
  location: {
    type: String,
  },
  title: {
    type: String,
  },
  shortQuote: {
    type: String,
  },
  videoUrl: {
    type: String
  },
  fullTestimonial: {
    type: String,
  }
},
{ timestamps: true });

const Testimonial = mongoose.model('Testimonial', TestimonialSchema);

module.exports = Testimonial;
