// models/User.js
const mongoose = require('mongoose');

const ClinicLocationSchema = new mongoose.Schema({
    addressTitle: {
        type: String,
        required: true
    },
    mainTitle: {
        type: String,
    },
    city: {
        type: String,
    },
    slug: {
        type: String,
    },
    address: {
        type: String,
    },
    googleMapLink: {
        type: String,
    },
    images: {
        type: mongoose.Schema.Types.Mixed,
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
    },
    metaTitle: {              // New meta title field
        type: String,
    },
    metaDescription: {        // New meta description field
        type: String,
    },

},
    { timestamps: true });

const ClinicLocation = mongoose.model('ClinicLocationSchema', ClinicLocationSchema);

module.exports = ClinicLocation;
