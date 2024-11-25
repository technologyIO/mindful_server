const User = require("../database/models/User");


const register = async (req, res) => {
    const { name, email, password, role } = req.body;
  
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }
  
      user = new User({
        name,
        email,
        password,
        role,
      });
  
      await user.save();
     return  res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }



module.exports = {
     register,
 }