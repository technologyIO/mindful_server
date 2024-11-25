const express = require("express");
const upload = require("../services/s3");



const uploads = express.Router();


uploads.post('/file', upload.single('image'), async (req, res) => {

    try {
      const imageUrl = req.file.location
      res.json({ result: imageUrl, message: "image uploaded successfully" })
    } catch (err) {
      res.json(err)
    }
  })

  uploads.post('/video', upload.single('video'), async (req, res) => {

    try {
      const imageUrl = req.file.location
      res.json({ result: imageUrl, message: "image uploaded successfully" })
    } catch (err) {
      res.json(err)
    }
  })


module.exports = uploads