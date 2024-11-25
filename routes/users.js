const express = require("express");
const User = require("../database/models/User");
const { register } = require("./users.controller");



const users = express.Router();

users.post('/register',register );



module.exports = users