const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Testimonial = require('../database/models/TestimonialSchema');
const Doctor = require('../database/models/DoctorSchema');
const router = express.Router();

// bulk upload 

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

// Helper function to handle CSV or Excel file parsing
const parseFile = (filePath, fileType) => {
    return new Promise((resolve, reject) => {
        const testimonials = [];

        if (fileType === 'csv') {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (row) => {
                    testimonials.push(row);
                })
                .on('end', () => {
                    resolve(testimonials);
                })
                .on('error', (error) => {
                    reject(error);
                });
        } else if (fileType === 'xlsx') {
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const data = xlsx.utils.sheet_to_json(sheet);
            resolve(data);
        } else {
            reject(new Error('Unsupported file type'));
        }
    });
};

// Bulk upload route
router.post('/bulk-upload', upload.single('file'), async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const ext = path.extname(file.originalname).toLowerCase();
    const fileType = ext === '.csv' ? 'csv' : ext === '.xlsx' ? 'xlsx' : null;

    if (!fileType) {
        return res.status(400).json({ message: 'Unsupported file format. Please upload a CSV or Excel file.' });
    }

    try {
        // Parse the uploaded file
        const testimonialsData = await parseFile(file.path, fileType);
        // Iterate through the parsed data and create testimonials
        const testimonialsToInsert = [];

        for (const row of testimonialsData) {
            // Find the doctor by name (assuming you have unique doctor names)
            const doctor = await Doctor.findOne({ name: row['Doctor Name'].trim()});

            if (doctor) {
                // Create testimonial object from the row data
                const testimonial = {
                    patientName: row['Patient Name'],
                    condition: row['Condition'],
                    treatment: row['Treatment'],
                    title: row['Title'],
                    fullTestimonial: row['Full Text'],
                    videoUrl: row['Video Link'],
                    doctor: doctor._id, // Assign the doctor ID
                    location: row['Location'],
                    shortQuote: row['Title'] // Assuming the short quote is the same as the title
                };
                testimonialsToInsert.push(testimonial);
            }
        }
        // Bulk insert the testimonials
        if (testimonialsToInsert.length > 0) {
            await Testimonial.insertMany(testimonialsToInsert);
            res.status(201).json({ message: `${testimonialsToInsert.length} testimonials uploaded successfully` });
        } else {
            res.status(400).json({ message: 'No valid testimonials to upload' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        // Remove the uploaded file after processing
        fs.unlinkSync(file.path);
    }
});


router.get('/search/testimonials', async (req, res) => {
  try {
      // Extract query parameters and decode URI components
      const condition = req.query.condition ? decodeURIComponent(req.query.condition).trim() : undefined;
      const treatment = req.query.treatment ? decodeURIComponent(req.query.treatment).trim() : undefined;
      let location = req.query.location ? decodeURIComponent(req.query.location).trim() : undefined;

      // Normalize spaces in the location
      if (location) {
          location = location.replace(/\s+/g, ' '); // Replace multiple spaces with a single space
      }

      // Build the query object dynamically with case-insensitive and partial match
      const query = {};
      if (condition) query.condition = { $regex: condition, $options: 'i' };
      if (treatment) query.treatment = { $regex: treatment, $options: 'i' };
      if (location) query.location = { $regex: location, $options: 'i' };

      // console.log('Location:', location);
      // console.log('Query:', query);

      // Fetch testimonials matching the query
      const normalize = (text) =>
        text.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  
   
      if (condition) {
        // Normalize the query parameter
        const normalizedCondition = normalize(condition);
        query.condition = {
          $regex: normalizedCondition, // Match normalized condition
          $options: 'i', // Case-insensitive
        };
      }
  
      if (treatment) {
        // Normalize the query parameter
        const normalizedTreatment = normalize(treatment);
        query.treatment = {
          $regex: normalizedTreatment, // Match normalized treatment
          $options: 'i', // Case-insensitive
        };
      }
      const testimonials = await Testimonial.find(query).populate('doctor', 'name');

      // Check if testimonials exist
      if (!testimonials || testimonials.length === 0) {
          return res.status(404).json({ message: 'No testimonials found matching the criteria' });
      }

      // Respond with testimonials
      res.json(testimonials);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});





router.get('/doctor', async (req, res) => {
    try {
      const doctor = await Doctor.find({}, { name: 1 });
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
})
// get all testimonials by doctor
router.get('/doctor/:doctorId', async (req, res) => {
    try {
      const doctorId = req.params.doctorId;
      
      // Find all testimonials that match the doctor ID
      const testimonials = await Testimonial.find({ doctor: doctorId }).populate('doctor', 'name'); // Only populate doctor name
  
      if (!testimonials || testimonials.length === 0) {
        return res.status(404).json({ message: 'No testimonials found for this doctor' });
      }
  
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
// create testimonial
router.post('/', async (req, res) => {
    try {
      const newTestimonial = new Testimonial(req.body);
      const savedTestimonial = await newTestimonial.save();
      res.status(201).json(savedTestimonial);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Get all testimonials
  router.get('/', async (req, res) => {
    try {
        const testimonials = await Testimonial.find().populate('doctor', 'name');
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // Get a single testimonial by ID
  router.get('/:id', async (req, res) => {
    try {
      // Check if id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      
      const testimonial = await Testimonial.findById(req.params.id).populate('doctor', 'name');
      if (!testimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      return res.json(testimonial);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
  
  // Update a testimonial by ID
  router.put('/:id', async (req, res) => {
    try {
      const updatedTestimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('doctor');
      if (!updatedTestimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      res.json(updatedTestimonial);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  // Delete a testimonial by ID
  router.delete('/:id', async (req, res) => {
    try {
      const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);
      if (!deletedTestimonial) {
        return res.status(404).json({ message: 'Testimonial not found' });
      }
      res.json({ message: 'Testimonial deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router