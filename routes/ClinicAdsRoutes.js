// routes/clinicAds.js
const express = require('express');
const router = express.Router();
const ClinicAds = require('../database/models/ClinicAdsSchema');


router.get('/', async (req, res) => {
  try {
    const clinics = await ClinicAds.find({});
    res.json(clinics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:locationCode', async (req, res) => {
  try {
    const { locationCode } = req.params;
    const clinic = await ClinicAds.findOne({ locationCode });
    if (!clinic) return res.status(404).json({ error: 'Not found' });
    res.json(clinic.services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:locationCode/:serviceType/:conditionKey', async (req, res) => {
  try {
    const { locationCode, serviceType, conditionKey } = req.params;
    const clinic = await ClinicAds.findOne(
      { locationCode },
      { [`services.${serviceType}.${conditionKey}`]: 1 }
    );
    if (!clinic || !clinic.services?.[serviceType]?.[conditionKey]) {
      return res.status(404).json({ error: 'Not found' });
    }
    res.json(clinic.services[serviceType][conditionKey]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:locationCode/:serviceType/:conditionKey', async (req, res) => {
  try {
    const { locationCode, serviceType, conditionKey } = req.params;
    const adObject = req.body;
    const result = await ClinicAds.updateOne(
      { locationCode },
      { $set: { [`services.${serviceType}.${conditionKey}`]: adObject } },
      { upsert: true }
    );
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:locationCode/:serviceType/:conditionKey', async (req, res) => {
  try {
    const { locationCode, serviceType, conditionKey } = req.params;
    const result = await ClinicAds.updateOne(
      { locationCode },
      { $unset: { [`services.${serviceType}.${conditionKey}`]: "" } }
    );
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/bulk', async (req, res) => {
    try {
      const all = req.body; // expect an object keyed by location codes
      const ops = Object.entries(all).map(([loc, services]) => ({
        updateOne: {
          filter: { locationCode: loc },
          update: { $set: { services } },
          upsert: true
        }
      }));
  
      if (ops.length === 0) {
        return res.status(400).json({ error: 'Empty payload' });
      }
  
      const result = await ClinicAds.bulkWrite(ops);
      res.json({ success: true, result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
