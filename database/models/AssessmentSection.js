// models/User.js
const mongoose = require('mongoose');

const AssessmentSectionSchema = new mongoose.Schema({
  section1: {
    type:mongoose.Schema.Types.Mixed,
  },
  section2: {
    type:mongoose.Schema.Types.Mixed,
  },
  section3: {
    type:mongoose.Schema.Types.Mixed,
  },


  
  
},
  { timestamps: true });

const AssessmentSection = mongoose.model('AssessmentSection', AssessmentSectionSchema);

module.exports = AssessmentSection;
