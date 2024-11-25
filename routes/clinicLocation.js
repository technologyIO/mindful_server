const express = require("express");
const { getAll, addData, getData, updateData, deleteData, getAllContactDetails } = require("./clinicLocation.controller");



const clinicRouter = express.Router();

clinicRouter.get('/getAll',getAll );
clinicRouter.get('/getAllContactDetails',getAllContactDetails );
clinicRouter.post('/addData',addData );
clinicRouter.get('/getData/:city/:slug/clinic', getData)
clinicRouter.put('/updateData/clinic', updateData)
clinicRouter.delete('/deleteData/:id/clinic', deleteData)



module.exports = clinicRouter