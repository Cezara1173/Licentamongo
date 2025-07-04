const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const { sendConfirmationEmail, sendResetEmail } = require('./utils/emailService');
const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your_jwt_secret'; 


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


mongoose.connect('mongodb://localhost:27017/local', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));


const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token' });

    req.userId = decoded.userId;
    next();
  });
};


app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();

    await sendConfirmationEmail(email, username);

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
        likedArtists: user.likedArtists || [], 
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Eroare server la autentificare." });
  }
});

//forgot password
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'Emailul nu există.' });

  const token = jwt.sign({ userId: user._id }, 'reset_secret_key', { expiresIn: '15m' });

  const resetLink = `http://localhost:3000/reset-password/${token}`;
  await sendResetEmail(email, user.username, resetLink);

  res.json({ message: 'Emailul de resetare a fost trimis.' });
});

app.post('/api/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    
    const decoded = jwt.verify(token, 'reset_secret_key');
    const userId = decoded.userId;

    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilizatorul nu a fost găsit.' });

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Parola a fost resetată cu succes.' });
  } catch (err) {
    console.error('Eroare la resetarea parolei:', err.message);
    res.status(400).json({ message: 'Token invalid sau expirat.' });
  }
});


app.get('/api/protected', verifyToken, (req, res) => {
  res.json({ message: 'This is a protected route', userId: req.userId });
});



app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().populate('artist', 'name');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('artist', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/api/products/search', async (req, res) => {
  const searchTerm = req.query.q;
  try {
    const products = await Product.find({
      name: { $regex: searchTerm, $options: 'i' }
    }).populate('artist', 'name');

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.delete('/api/products/:id', verifyToken, async (req, res) => {
  try {
    
    const user = await User.findById(req.userId);
    if (!user || user.email !== 'admin@yahoo.com') {
      return res.status(403).json({ message: 'Doar administratorul poate șterge produse.' });
    }

    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Produsul nu a fost găsit.' });
    }

    res.status(200).json({ message: 'Produsul a fost șters cu succes.' });
  } catch (err) {
    console.error('Eroare la ștergere produs:', err);
    res.status(500).json({ message: 'Eroare server la ștergerea produsului.' });
  }
});
 


app.post('/api/orders', verifyToken, async (req, res) => {
  try {
    const order = new Order({
      userId: req.userId,
      products: req.body.products.map(product => ({
        productId: product.productId || product._id,
        quantity: product.quantity,
        price: product.price,
      })),
      totalPrice: req.body.totalPrice,
      orderStatus: req.body.orderStatus || 'Finalizată',
      createdAt: new Date(),
      updatedAt: new Date(),
      shippingAddress: req.body.shippingAddress || {},
      paymentMethod: req.body.paymentMethod || 'PayPal',
      paymentStatus: req.body.paymentStatus || 'Plătit',
    });

    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: ` Produsul cu ID ${item.productId} nu a fost găsit.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: ` Stoc insuficient pentru produsul "${product.name}".` });
      }
    }

    const newOrder = await order.save();

    for (const item of newOrder.products) {
      const productId = new mongoose.Types.ObjectId(item.productId);
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      if (!updatedProduct) {
        console.warn(` Produsul ${item.productId} nu a fost găsit pentru scădere stoc.`);
      } else {
        console.log(` Stoc actualizat pentru "${updatedProduct.name}" → stoc rămas: ${updatedProduct.stock}`);
      }
    }

    res.status(201).json({ message: 'Comandă înregistrată cu succes.', order: newOrder });
  } catch (err) {
    console.error(" Eroare la salvarea comenzii:", err);
    res.status(500).json({ message: 'Eroare server la salvarea comenzii.' });
  }
});

app.get('/api/orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/api/orders/me', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('products.productId', 'name image')
      .sort({ createdAt: -1 }); 

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



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


app.get('/api/artists/:id/artworks', async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).send('Artist not found');
    res.json(artist.artworkIds);
  } catch (error) {
    res.status(500).send(error);
  }
});


app.get('/api/expositions', async (req, res) => {
  try {
    const expositions = await Exposition.find().populate('artists', 'name');
    res.json(expositions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.put('/api/artists/:id/bio', verifyToken, async (req, res) => {
  const { bio } = req.body;
  const artistId = req.params.id;

  try {
    const user = await User.findById(req.userId);
    if (!user || user.email !== 'admin@yahoo.com') {
      return res.status(403).json({ message: 'Doar adminul poate edita bio-ul.' });
    }

    const artist = await Artist.findByIdAndUpdate(artistId, { bio }, { new: true });
    if (!artist) return res.status(404).json({ message: 'Artistul nu a fost găsit.' });

    res.json(artist);
  } catch (err) {
    res.status(500).json({ message: 'Eroare la actualizarea bio-ului.' });
  }
});


app.get('/api/expositions/:id', async (req, res) => {
  try {
    const exposition = await Exposition.findById(req.params.id).populate('artists', 'name image');
    if (!exposition) return res.status(404).json({ message: 'Exposition not found' });

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


app.post('/api/like-artist', verifyToken, async (req, res) => {
  const userId = req.userId;
  const artistId = req.body.artistId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    
    const artistIdString = artistId.toString();

    if (!user.likedArtists.some(id => id.toString() === artistIdString)) {
      user.likedArtists.push(artistIdString);
      await user.save();
    }

    res.json({ message: 'Artist liked successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.post('/api/unlike-artist', verifyToken, async (req, res) => {
  const userId = req.userId;
  const artistId = req.body.artistId;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const artistIdString = artistId.toString();

    user.likedArtists = user.likedArtists.filter(
      id => id.toString() !== artistIdString
    );

    await user.save();

    res.json({ message: 'Artist unliked successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


app.get('/api/recomandate', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const likedArtistIds = user.likedArtists.map(id => id.toString());
    console.log('User liked artists:', likedArtistIds);

    
    const allExpositions = await Exposition.find().populate('artists', '_id');

    const recomandate = allExpositions.filter(expo => {
      const matchCount = expo.artists.filter(artist =>
        likedArtistIds.includes(artist._id.toString())
      ).length;

      return matchCount >= 3; 
    });
  
    console.log('Recommended expositions:', recomandate.map(e => e.title));
    res.json(recomandate);
  } catch (err) {
    console.error('Error in /api/recomandate:', err);
    res.status(500).json({ message: err.message });
  }
});


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


app.delete('/api/comments/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.email !== 'admin@yahoo.com') {
      return res.status(403).json({ message: 'Doar administratorul poate șterge comentarii.' });
    }

    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment) {
      return res.status(404).json({ message: 'Comentariul nu a fost găsit.' });
    }

    res.status(200).json({ message: 'Comentariul a fost șters cu succes.' });
  } catch (err) {
    console.error('Eroare la ștergerea comentariului:', err);
    res.status(500).json({ message: 'Eroare server la ștergerea comentariului.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

