const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClinicAdsSchema = new Schema({
  // Location code (e.g. "gk", "hb", "wf")
  locationCode: { 
    type: String, 
    required: true, 
    unique: true 
  },
  // Holds all service types ("general", "psychiatrist", etc.)
  services: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

// Index the location for fast lookups
ClinicAdsSchema.index({ locationCode: 1 });

module.exports = mongoose.model('ClinicAds', ClinicAdsSchema);