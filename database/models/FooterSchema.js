// models/User.js
const mongoose = require('mongoose');

const FooterSchema = new mongoose.Schema({
  name: {
    type:mongoose.Schema.Types.Mixed,
  },
  area: {
    type:mongoose.Schema.Types.Mixed,
  },
  bgColor: {
    type:mongoose.Schema.Types.Mixed,
  },
  location: {
    type:mongoose.Schema.Types.Mixed,
  },
  whatsapp: {
    type:mongoose.Schema.Types.Mixed,
  },
  call: {
    type:mongoose.Schema.Types.Mixed,
  },
  officeOpen: {
    type:mongoose.Schema.Types.Mixed,
  },
  officeClose: {
    type:mongoose.Schema.Types.Mixed,
  },
  
},
  { timestamps: true });

const FooterSection = mongoose.model('FooterSection', FooterSchema);

module.exports = FooterSection;
