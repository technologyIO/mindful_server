const express = require("express");
const Doctor = require("../database/models/DoctorSchema");



const router = express.Router();


router.post('/', async (req, res) => {
  try {
    // Find the doctor with the highest order value
    const highestOrderDoctor = await Doctor.findOne().sort({ order: -1 });
    const newOrder = highestOrderDoctor ? highestOrderDoctor.order + 1 : 1; // Increment by 1 or set to 1 if no doctors exist
    
    const doctor = new Doctor({
      ...req.body,
      order: newOrder, // Assign the new order
    });
    
    await doctor.save();
    res.status(201).json(doctor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

  // Get all doctors
  router.get('/', async (req, res) => {
    try {
      const doctors = await Doctor.find().sort({ order: 1 });  // Sort by order ascending
      res.status(200).json(doctors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Get a doctor by ID
  router.get('/:id', async (req, res) => {
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.status(200).json(doctor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Update a doctor by ID
  router.put('/:id', async (req, res) => {
    try {
      const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.status(200).json(doctor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Delete a doctor by ID
  router.delete('/:id', async (req, res) => {
    try {
      const doctor = await Doctor.findByIdAndDelete(req.params.id);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.status(200).json({ message: 'Doctor deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });


// Move doctor up
router.post('/move-up/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const doctorAbove = await Doctor.findOne({ order: { $lt: doctor.order } }).sort({ order: -1 });
    if (doctorAbove) {
      // Swap the orders
      const tempOrder = doctor.order;
      doctor.order = doctorAbove.order;
      doctorAbove.order = tempOrder;

      await doctor.save();
      await doctorAbove.save();

      res.status(200).json({ message: 'Doctor moved up', doctor });
    } else {
      res.status(400).json({ error: 'Doctor is already at the top' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Move doctor down
router.post('/move-down/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const doctorBelow = await Doctor.findOne({ order: { $gt: doctor.order } }).sort({ order: 1 });
    if (doctorBelow) {
      // Swap the orders
      const tempOrder = doctor.order;
      doctor.order = doctorBelow.order;
      doctorBelow.order = tempOrder;

      await doctor.save();
      await doctorBelow.save();

      res.status(200).json({ message: 'Doctor moved down', doctor });
    } else {
      res.status(400).json({ error: 'Doctor is already at the bottom' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search/doctors', async (req, res) => {
  try {
    const location = decodeURIComponent(req.query.location || '');
    const specialization = decodeURIComponent(req.query.specialization || '');

    // Build the query object based on the provided query parameters
    const query = {};

    if (location) {
      if (specialization) query.specialization = { $regex: specialization, $options: 'i' };
      if (location) query.location = { $regex: location, $options: 'i' };
      // query.location = location;
    }

    // if (specialization) {
    //   query.specialization = { $in: [specialization] }; // Check if the specialization exists in the array
    // }

    const doctors = await Doctor.find(query).sort({ order: 1 }); // Fetch and sort by order
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router