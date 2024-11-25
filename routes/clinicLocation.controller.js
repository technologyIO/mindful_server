const ClinicLocation = require("../database/models/ClinicLocationSchema");



const getAll = async (req, res) => {
    try {
        const clinic = await ClinicLocation.find();
        res.json(clinic);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
const getAllContactDetails = async (req, res) => {
    try {
        const details = await ClinicLocation.find({}, 'details');
        res.json(details);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
const addData = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            msg: 'No data'
        });
    }

    try {
        const clinic = new ClinicLocation(body);

        await clinic.save();

        return res.json(clinic);

    } catch (err) {
        // console.error(err.message);
       return  res.status(500).json({message:err.message});
    }
}

const getData = async (req, res) => {
    const {city, slug } = req.params;
    try {
        const clinic = await ClinicLocation.findOne({ $or: [{city}, {slug}] });

        if (!clinic) {
            return res.status(404).json({
                msg: 'No clinic found'
            });
        }

        return res.json(clinic);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
const updateData = async (req, res) => {
    const { slug, city } = req.body;
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            msg: 'No data'
        });
    }

    try {
        const clinic = await ClinicLocation.findOneAndUpdate(
            { $or: [{city}, {slug}] },
            body,
            { new: true }
        );

        if (!clinic) {
            return res.status(404).json({
                msg: 'No clinic found'
            });
        }

        return res.json(clinic);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const deleteData = async (req, res) => {
    const { id } = req.params;

    try {
        const clinic = await ClinicLocation.findByIdAndDelete(id);

        if (!clinic) {
            return res.status(404).json({
                msg: 'No clinic found'
            });
        }

        return res.json({
            msg: 'Blog deleted successfully'
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


module.exports = {
    getAllContactDetails,
    addData,
    getData,
    getAll,
    updateData,
    deleteData
}
