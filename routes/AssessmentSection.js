const express = require("express");
const { addSection, updateSection, getSection } = require("./AssessmentSection.controller");


const AssessmentSection = express.Router();

AssessmentSection.post('/addSection',addSection );
AssessmentSection.put('/udpateSection',updateSection );
AssessmentSection.get('/getSection',getSection );



module.exports = AssessmentSection