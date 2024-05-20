const express=require("express");
const bcrypt=require('bcryptjs');
const router=express.Router();
const cors =require('cors');

const User=require("../models/AuthModel")
router.use(cors());


router.post('/register', async (req, res) => {
    try {
      const { name, id,email, password,year } = req.body;
      if (!name ||!id|| !email  || !password||!year) {
        
        return res.status(422).json({ error: "Please fill all the required fields" });
      }
  
      const existingUser = await User.findOne({ email });
      console.log(existingUser);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 12);
      
      const newUser = new User({
        name,
        id,
        email,
        year,
        password: hashedPassword
      });
  
      await newUser.save();
      alert("User registered successfully");
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

router.post('/login', async (req, res) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).json({ error: "Please fill in the required fields" });
      }
      
      const userLogin =  await User.findOne({ email });
      if (userLogin) {
          const isMatch = await bcrypt.compare(password, userLogin.password);
          if (!isMatch) {
              return res.status(400).json({ error: "Invalid Credentials" });
          } else {
              return res.json({name:userLogin.name,clg_id:userLogin.id,id:userLogin._id,year:userLogin.year});
          }
      } else {
          return res.status(400).json({ error: "Invalid Credentials" });
      }

  } catch (err) {
      console.log(err);
      return res.status(500).json({ error: "Server Error" });
  }
});



module.exports = router;
