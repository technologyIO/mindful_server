// models/User.js
const mongoose = require('mongoose');

const HomeSectionSchema = new mongoose.Schema({
  heroSection: {
    type:mongoose.Schema.Types.Mixed,
  },
  section2: {
    type:mongoose.Schema.Types.Mixed,
  },
  section3: {
    type:mongoose.Schema.Types.Mixed,
  },
  section4: {
    type:mongoose.Schema.Types.Mixed,
  },
  section5: {
    type:mongoose.Schema.Types.Mixed,
  },
  section6: {
    type:mongoose.Schema.Types.Mixed,
  },
  section7: {
    type:mongoose.Schema.Types.Mixed,
  },
  section8: {
    type:mongoose.Schema.Types.Mixed,
  },
  section9: {
    type:mongoose.Schema.Types.Mixed,
  },
  section10: {
    type:mongoose.Schema.Types.Mixed,
  },

  
  
},
  { timestamps: true });

const HomeSection = mongoose.model('HomeSection', HomeSectionSchema);

module.exports = HomeSection;
