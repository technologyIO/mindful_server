// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Replace 'your_mongodb_uri' with your MongoDB connection string
    await mongoose.connect(process.env.MONGO_URI, {
    //   useNewUrlParser: true,
    //   useUnifiedTopology: true,
    });

    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
