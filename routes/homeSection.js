const express = require("express");
const { addSection, updateSection, getSection } = require("./homeSection.controller");



const homeSection = express.Router();

homeSection.post('/addHomeSection',addSection );
homeSection.put('/udpateHomeSection',updateSection );
homeSection.get('/getHomeSection',getSection );



module.exports = homeSection