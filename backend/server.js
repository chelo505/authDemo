require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const Car = require('./models/Car');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};

app.post('/api/cars', authMiddleware, upload.array('images', 5), async (req, res) => {
  try {
    const { make, model, year, vinCode, price, description, mileage } = req.body;
    
    const imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);

    const car = new Car({
      userId: req.userId,
      make,
      model,
      year: parseInt(year),
      vinCode,
      price: parseFloat(price),
      description,
      mileage: parseInt(mileage),
      images: imageUrls
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    console.error('Error creating car:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/cars', async (req, res) => {
  try {
    const cars = await Car.find().sort({ createdAt: -1 });
    
    const carsWithStringIds = cars.map(car => ({
      ...car.toObject(),
      userId: car.userId.toString()
    }));
    
    res.json(carsWithStringIds);
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/cars/search', async (req, res) => {
  try {
    const { query, type } = req.query;
    let searchQuery = {};
    
    if (type === 'vin') {
      searchQuery = { vinCode: query };
    } else {
      searchQuery = { $text: { $search: query }};
    }

    const cars = await Car.find(searchQuery);
    res.json(cars);
  } catch (error) {
    console.error('Error searching cars:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/cars/:id', async (req, res) => {
  
})

app.get('/api/cars/user', authMiddleware, async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    console.error('Error fetching user cars:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/cars/:id', authMiddleware, async (req, res) => {
  try {
    const car = await Car.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!car) {
      return res.status(404).json({ message: 'Car not found or unauthorized' });
    }

    await car.remove();
    res.json({ message: 'Car listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/payment-demo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// User Model
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.json({ 
      user: { id: user._id, email: user.email },
      token 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    
    res.json({ 
      user: { id: user._id, email: user.email },
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 