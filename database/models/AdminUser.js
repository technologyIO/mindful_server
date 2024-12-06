const mongoose = require('mongoose');

const AdminUser = new mongoose.Schema({
    // name: { type: String, required: true },
    email: { type: String, required: false },
    password: { type: String, required: true },
    role:{type:Number, required:false}
}, { timestamps: true });

const Adminuser = mongoose.model('Adminuser', AdminUser);

module.exports = Adminuser;

