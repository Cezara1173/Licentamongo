const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret'; // Trebuie să fie o cheie secretă puternică

// Import models
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const Artist = require('./models/Artist');
const Exposition = require('./models/Exposition');
const Comment = require('./models/Comment');

app.use(cors({
  origin: ['http://localhost:3000', 'http://192.168.88.250:3000'],
  credentials: true
}));

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


// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token' });

    req.userId = decoded.userId;
    next();
  });
};

// Register
// Register
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User înregistrat cu succes' });
  } catch (err) {
    if (err.code === 11000) {
      const duplicatedField = Object.keys(err.keyPattern)[0];

      if (duplicatedField === 'username') {
        return res.status(400).json({
          field: 'username',
          message: 'Acest nume de utilizator este deja folosit.',
        });
      }

      if (duplicatedField === 'email') {
        return res.status(400).json({
          field: 'email',
          message: 'Adresa de email este deja folosită.',
        });
      }
    }

    res.status(500).json({ message: 'Eroare la înregistrare. Încearcă din nou.' });
  }
});


// Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Contul nu a fost găsit. Creează-ți un cont și devino membru ArtHunt!",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Parola introdusă nu este corectă.",
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Eroare server la autentificare." });
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
    if (!product) return res.status(404).json({ message: 'Product not found' });

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

// Get artist by ID
app.get('/api/artists/:id', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ message: 'Artist not found' });

    res.json(artist);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new artist
app.post('/api/artists', verifyToken, async (req, res) => {
  const artist = new Artist({
    name: req.body.name,
    birthYear: req.body.birthYear,
    nationality: req.body.nationality,
    bio: req.body.bio,
    image: req.body.image,
    artworkIds: req.body.artworkIds
  });

  try {
    const newArtist = await artist.save();
    res.status(201).json(newArtist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update artist
app.put('/api/artists/:id', verifyToken, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ message: 'Artist not found' });

    artist.name = req.body.name;
    artist.birthYear = req.body.birthYear;
    artist.nationality = req.body.nationality;
    artist.bio = req.body.bio;
    artist.image = req.body.image;
    artist.artworkIds = req.body.artworkIds;

    const updatedArtist = await artist.save();
    res.json(updatedArtist);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete artist
app.delete('/api/artists/:id', verifyToken, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ message: 'Artist not found' });

    await artist.remove();
    res.json({ message: 'Artist deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get artworks for artist
app.get('/api/artists/:id/artworks', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).send('Artist not found');
    res.json(artist.artworkIds);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get all expositions
app.get('/api/expositions', async (req, res) => {
  try {
    const expositions = await Exposition.find().populate('artists', 'name');
    res.json(expositions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single exposition with artist details
app.get('/api/expositions/:id', async (req, res) => {
  try {
    const exposition = await Exposition.findById(req.params.id).populate('artists', 'name image');
    if (!exposition) return res.status(404).json({ message: 'Exposition not found' });

    res.json(exposition);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create exposition
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

// Update exposition
app.put('/api/expositions/:id', verifyToken, async (req, res) => {
  try {
    const exposition = await Exposition.findById(req.params.id);
    if (!exposition) return res.status(404).json({ message: 'Exposition not found' });

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

// Delete exposition
app.delete('/api/expositions/:id', verifyToken, async (req, res) => {
  try {
    const exposition = await Exposition.findById(req.params.id);
    if (!exposition) return res.status(404).json({ message: 'Exposition not found' });

    await exposition.remove();
    res.json({ message: 'Exposition deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like artist
app.post('/api/like-artist', verifyToken, async (req, res) => {
  const userId = req.userId;
  const artistId = req.body.artistId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.likedArtists.includes(artistId)) {
      user.likedArtists.push(artistId);
      await user.save();
    }

    res.json({ message: 'Artist liked successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unlike artist
app.post('/api/unlike-artist', verifyToken, async (req, res) => {
  const userId = req.userId;
  const artistId = req.body.artistId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.likedArtists = user.likedArtists.filter(
      id => id.toString() !== artistId
    );

    await user.save();

    res.json({ message: 'Artist unliked successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get recommended expositions
app.get('/api/recomandate', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const likedArtistIds = user.likedArtists.map(id => id.toString());

    const allExpositions = await Exposition.find().populate('artists');

    const recomandate = allExpositions.filter(expo => {
      const matchCount = expo.artists.filter(artist =>
        likedArtistIds.includes(artist._id.toString())
      ).length;

      return matchCount >= 2;
    });

    res.json(recomandate);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new comment
app.post('/api/comments', verifyToken, async (req, res) => {
  const { productId, text } = req.body;

  try {
    const comment = new Comment({
      user: req.userId,
      product: productId,
      text
    });

    await comment.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username');

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create comment', error: err.message });
  }
});

// Get all comments for a product
app.get('/api/comments/:productId', async (req, res) => {
  try {
    const comments = await Comment.find({ product: req.params.productId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch comments', error: err.message });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

