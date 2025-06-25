const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5001;
const connectDB = require('./database/db');
const users = require("./routes/users");
const homeSection = require("./routes/homeSection");
// const blogsRouter = require("./routes/blogs");
const AssessmentSection = require("./routes/AssessmentSection");
const uploads = require("./routes/uploads");
const clinicRouter = require("./routes/clinicLocation");
const doctorsRouter = require("./routes/doctors");
const testimonialsRouter = require("./routes/testimonials");
const testRouter = require("./routes/tests");
const adminRouter = require("./routes/Admin");
const ClinicAdsRoutes = require("./routes/ClinicAdsRoutes");
app.use(cors());
app.use(express.json());

app.use('/api/users',users)
app.use('/api/homeSection',homeSection)
app.use('/api/AssessmentSection',AssessmentSection)
// app.use('/api/blogs',blogsRouter)
app.use('/api/uploads',uploads)
app.use('/api/clinicLocation',clinicRouter)
app.use('/api/doctors',doctorsRouter)
app.use('/api/testimonials',testimonialsRouter)
app.use('/api/tests', testRouter)
app.use('/api/admin', adminRouter)
app.use('/api/adsClinic', ClinicAdsRoutes)
app.use('/api/otp', require('./routes/otp.js'))

connectDB()

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})