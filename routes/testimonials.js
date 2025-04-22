const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const Testimonial = require('../database/models/TestimonialSchema');
const Doctor = require('../database/models/DoctorSchema');
const { default: mongoose } = require('mongoose');
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
      const testimonials = await Testimonial.find(query).populate('doctor', 'name image');

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

// by location
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
router.get('/search/testimonials/by-location', async (req, res) => {
  try {
    let location = req.query.location ? decodeURIComponent(req.query.location).trim() : undefined;
    if (!location) {
      return res.status(400).json({ message: 'Location parameter is required' });
    }

    // Build regex for partial, case-insensitive match
    const regexPattern = location.split(' ').join('\\s+');
    const query = { location: { $regex: regexPattern, $options: 'i' } };

    // Fetch testimonials matching the location
    const testimonials = await Testimonial.find(query)
      .populate('doctor', '_id name image')
      .lean();

    if (!testimonials.length) {
      return res.status(404).json({ message: 'No testimonials found for the given location' });
    }

    // Shuffle results
    shuffle(testimonials);

    // Respond
    res.status(200).json(testimonials);
  } catch (error) {
    console.error(error);
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
      const testimonials = await Testimonial.find({ doctor: doctorId }).populate('doctor', 'name image'); // Populate doctor name and image
  
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
        const testimonials = await Testimonial.find().populate('doctor', 'name image');
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // get all testimonials with doctors id array 
  router.post('/getAllTestimonials/DoctorArray', async (req, res) => {
    try {
      const { doctorIds } = req.body;
      if (!Array.isArray(doctorIds)) {
        return res.status(400).json({ message: 'doctorIds must be an array' });
      }
  
      // Validate ObjectId strings
      const validDoctorIds = doctorIds.filter(id => mongoose.Types.ObjectId.isValid(id));
      if (validDoctorIds.length === 0) {
        return res.status(400).json({ message: 'No valid doctor IDs' });
      }
  
      // Fetch all testimonials for the given doctors
      const allTestimonials = await Testimonial
        .find({ doctor: { $in: validDoctorIds } })
        .populate('doctor', '_id name image')
        .lean();
  
      // Group by doctor._id
      const byDoctor = allTestimonials.reduce((acc, t) => {
        const docId = t.doctor._id.toString();
        (acc[docId] = acc[docId] || []).push(t);
        return acc;
      }, {});
  
      // Fisher–Yates shuffle helper
      function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
  
      // 1. Shuffle the doctor IDs
      const doctorsShuffled = Object.keys(byDoctor);
      shuffle(doctorsShuffled);
  
      // 2. Build initial (one per doctor) and rest arrays
      const initial = [];
      const rest = [];
      for (const docId of doctorsShuffled) {
        const list = byDoctor[docId];
        shuffle(list);
        initial.push(list[0]);
        if (list.length > 1) rest.push(...list.slice(1));
      }
  
      // 3. Combine and then split at the 10-item mark
      const combined = initial.concat(rest);
      const prefix = combined.slice(0, 10);
      const suffix = combined.slice(10);
  
      // 4. Shuffle only the suffix
      shuffle(suffix);
  
      // 5. Return prefix + shuffled suffix
      return res.status(200).json(prefix.concat(suffix));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

  // Get a single testimonial by ID
  router.get('/:id', async (req, res) => {
    try {
      // Check if id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }
      
      const testimonial = await Testimonial.findById(req.params.id).populate('doctor', 'name image');
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