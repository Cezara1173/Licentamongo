const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret'; // Trebuie să fie o cheie secretă puternică



app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.88.250:3000'],
  credentials: true
}));

// ✅ Body Parsers — these MUST be before routes
app.use(express.json());
app.use(cookieParser());


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/local', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Check connection
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

// Define User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Define Product schema and model
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brand: String,
  stock: Number,
  images: [String],
  attributes: {
    color: String,
    size: String,
    weight: String,
  },
}, { timestamps: true });  // Automatically adds createdAt and updatedAt


const Product = mongoose.model('Product', productSchema);

// Define Order schema and model
const orderSchema = new mongoose.Schema({
  userId: mongoose.ObjectId,
  products: [
    {
      productId: mongoose.ObjectId,
      quantity: Number,
      price: Number,
    },
  ],
  totalPrice: Number,
  orderStatus: String,
  createdAt: Date,
  updatedAt: Date,
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  paymentMethod: String,
  paymentStatus: String,
});

const Order = mongoose.model('Order', orderSchema);

// Define Artist schema and model
const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  birthYear: { type: Number, required: true },
  nationality: { type: String, required: true },
  bio: { type: String, required: true },
  artworkIds: [{ type: String, required: true }] // Storing artwork names or descriptions as an array of strings
});

const Artist = mongoose.model('Artist', artistSchema);

// Define Exposition schema and model
const expositionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Exposition = mongoose.model('Exposition', expositionSchema);

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    req.userId = decoded.userId;
    next();
  });
};

// Routes for User Authentication
// Register
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  console.log("🔥 Incoming request body:", req.body); 
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Protected route example
app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});

// Routes for Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.get('/api/products/search', async (req, res) => {
  const searchTerm = req.query.q;
  try {
    const products = await Product.find({ name: { $regex: searchTerm, $options: 'i' } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routes for Orders
app.post('/api/orders', verifyToken, async (req, res) => {
  const order = new Order({
    userId: new mongoose.Types.ObjectId(req.userId),
    products: req.body.products.map(product => ({
      productId: new mongoose.Types.ObjectId(product.productId),
      quantity: product.quantity,
      price: product.price,
    })),
    totalPrice: req.body.totalPrice,
    orderStatus: req.body.orderStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    paymentStatus: req.body.paymentStatus,
  });

  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/orders/:userId', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Routes for Artists
app.get('/api/artists', async (req, res) => {
  try {
    const artists = await Artist.find();
    res.json(artists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/artists/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }
    res.json(artist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/artists', verifyToken, async (req, res) => {
  const artist = new Artist({
    name: req.body.name,
    birthYear: req.body.birthYear,
    nationality: req.body.nationality,
    bio: req.body.bio,
    artworks: req.body.artworks
  });

  try {
    const newArtist = await artist.save();
    res.status(201).json(newArtist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put('/api/artists/:id', verifyToken, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    artist.name = req.body.name;
    artist.birthYear = req.body.birthYear;
    artist.nationality = req.body.nationality;
    artist.bio = req.body.bio;
    artist.artworks = req.body.artworks;

    const updatedArtist = await artist.save();
    res.json(updatedArtist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/artists/:id', verifyToken, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    await artist.remove();
    res.json({ message: 'Artist deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Fetch artworks for a specific artist
app.get('/api/artists/:id/artworks', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).send('Artist not found');
    res.json(artist.artworkIds);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Routes for Expositions
app.get('/api/expositions', async (req, res) => {
  try {
    const expositions = await Exposition.find().populate('artists');
    res.json(expositions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/expositions/:id', async (req, res) => {
  try {
    const exposition = await Exposition.findById(req.params.id).populate('artists');
    if (!exposition) {
      return res.status(404).json({ message: 'Exposition not found' });
    }
    res.json(exposition);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/expositions', verifyToken, async (req, res) => {
  const exposition = new Exposition({
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    location: req.body.location,
    image: req.body.image,
    artists: req.body.artists
  });

  try {
    const newExposition = await exposition.save();
    res.status(201).json(newExposition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


app.put('/api/expositions/:id', verifyToken, async (req, res) => {
  try {
    const exposition = await Exposition.findById(req.params.id);
    if (!exposition) {
      return res.status(404).json({ message: 'Exposition not found' });
    }

    exposition.title = req.body.title;
    exposition.description = req.body.description;
    exposition.startDate = req.body.startDate;
    exposition.endDate = req.body.endDate;
    exposition.location = req.body.location;
    exposition.image = req.body.image;
    exposition.artists = req.body.artists;

    const updatedExposition = await exposition.save();
    res.json(updatedExposition);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/api/expositions/:id', verifyToken, async (req, res) => {
  try {
    const exposition = await Exposition.findById(req.params.id);
    if (!exposition) {
      return res.status(404).json({ message: 'Exposition not found' });
    }

    await exposition.remove();
    res.json({ message: 'Exposition deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
