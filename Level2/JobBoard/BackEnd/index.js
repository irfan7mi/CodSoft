const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoute');
const jobRoutes = require('./routes/jobRoute');
const applnRoutes = require('./routes/applnRoute');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "random#secret"
const savedJobRoutes = require('./routes/savedJobRoute');
const UserModel = require('./models/users');
const url = process.env.MONGO_URI || 'mongodb+srv://mi2268242:q0zQ2HuspFPfohf0@doorfood.gxuxa.mongodb.net/?retryWrites=true&w=majority&appName=bazario';
const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Welcome to DooRFooD API!' });
});

app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'favicon.ico'));
});

app.use(cors({ origin: 'https://job-board-client-blond.vercel.app' }));

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
}));



const createToken = (id) => {
  return jwt.sign({id}, JWT_SECRET)
}

app.post("/api/auth/login", async (req, res) => {
  const{email, password} = req.body
  try{
    let user = await UserModel.findOne({email})
    if (!user) {
      return res.json({success: false, message: "Admin doesn't exist!"})
    }
    const isMatch = bcrypt.compare(email, password)
    if (!isMatch) {
      return res.json({success: false, message: "Invalid credentials"})
    }
    const token = createToken(user._id)
    return res.send({success:true, message: "Login successfully", token})
  }
  catch (e) {
    console.log(e)
    res.send({success: false, message: "Error"})
  }
})

app.post("/api/auth/signup",async (req, res) => {
  const {name, mobile, email, password} = req.body
  try{
    const exist = await UserModel.findOne({email})
    if (exist) {
      return res.json({success:false, message:"User already exist!"})
    }
    if (!validator.isEmail(email)) {
      return res.json({success:false, message:"Please enter valid email address!"})
    }
    if (password.length<8) {
      return res.json({success:false, message:"Please enter strong password!"})
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    
    const newUser = new UserModel({
      name: name,
      mobile: mobile,
      email: email,
      password: hashedPassword,
      role: 'candidate' 
    })
    let user = await newUser.save()
    const token = createToken(user._id)
    return res.send({user: { success: true, name: user.name, email: user.email, role: user.role },
      token})
  }
  catch (e) {
    console.log(e)
    res.send({success:false, message: "Error"})
  }
})

mongoose.connect(url)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


app.use('/api/jobs', jobRoutes);
app.use('/api/application', applnRoutes);
app.use('/api/saved-jobs', savedJobRoutes);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});