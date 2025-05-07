import React, { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import HeroCarousel from './HeroCarousel';
import InfoModal from './InfoModal';
import { useAuth } from '../context/AuthContext';
import { useSearch } from '../context/SearchContext';
import { useLoginModal } from '../context/LoginModalContext';
import { useCart } from '../context/CartContext';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [artistFilter, setArtistFilter] = useState('');
  const [artists, setArtists] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const { token } = useAuth();
  const { searchTerm } = useSearch();
  const { openLoginModal } = useLoginModal();
  const { cartItems, addToCart } = useCart();

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showStockModal, setShowStockModal] = useState(false);
  const [stockModalMessage, setStockModalMessage] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchArtists = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/artists');
      const data = await res.json();
      setArtists(data);
    } catch (err) {
      console.error('Error fetching artists:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchArtists();
  }, [lastUpdated]);

  useEffect(() => {
    const results = products
      .map(product => {
        const itemInCart = cartItems.find(item => item._id === product._id);
        const adjustedStock = itemInCart ? product.stock - itemInCart.quantity : product.stock;

        const artist = artists.find(a => a._id === product.artistId);

        return {
          ...product,
          stock: adjustedStock,
          artist: artist || null
        };
      })
      .filter(product => {
        const matchesSearch = (product.name || '').toLowerCase().includes((searchTerm || '').toLowerCase());
        const price = product.price || 0;
        const matchesPriceRange = price >= (minPrice || 0) && price <= (maxPrice || Infinity);
        const matchesArtist = !artistFilter || product.artistId === artistFilter;
        return matchesSearch && matchesPriceRange && matchesArtist;
      });

    setFilteredProducts(results);
  }, [products, artists, cartItems, searchTerm, minPrice, maxPrice, artistFilter]);

  const handleAddToCart = (product) => {
    if (!token) {
      openLoginModal();
      return;
    }

    const productInCart = cartItems.find(item => item._id === product._id);
    const cartQuantity = productInCart ? productInCart.quantity : 0;
    const adjustedStock = product.stock - cartQuantity;

    if (adjustedStock <= 0) {
      setStockModalMessage('Stoc epuizat!');
      setShowStockModal(true);
      return;
    }

    addToCart(product);
  };

  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setArtistFilter('');
  };

  const handleDeleteClick = (productId) => {
    setSelectedProductId(productId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${selectedProductId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setProducts(products.filter(p => p._id !== selectedProductId));
      } else {
        alert('Eroare la ștergere');
      }
    } catch (err) {
      console.error('Eroare rețea:', err);
    } finally {
      setShowDeleteModal(false);
      setSelectedProductId(null);
    }
  };

  const handleInstantDeleteComment = async (commentId) => {
    try {
      await fetch(`http://localhost:5000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLastUpdated(Date.now());
    } catch (err) {
      console.error('Eroare la ștergerea comentariului:', err);
    }
  };

  return (
    <>
      <div className="hero-banner-container">
        <img src="/images/hero-banner.jpg" alt="Hero Banner" className="hero-banner-image" />
        <div className="hero-banner-overlay">
          <div className="hero-banner-text">
            <h1 className="hero-heading">Explorează acum expozițiile ArtHunt…</h1>
            <p className="hero-subtext">
              Găsește arta care te inspiră vizitând una din galeriile noastre, cu lucrări de la artiști locali și internaționali. Să colecționezi artă autentică n-a fost niciodată mai simplu și mai plin de sens.
            </p>
          </div>
        </div>
      </div>

      <HeroCarousel />

      <div className="product-list">
        <div className="filter-controls">
          <button className="clear-filters-btn" onClick={clearFilters}>Clear filters</button>

          <label htmlFor="minPrice">Preț Minim:</label>
          <input type="number" id="minPrice" value={minPrice} onChange={e => setMinPrice(e.target.value)} />

          <label htmlFor="maxPrice">Preț Maxim:</label>
          <input type="number" id="maxPrice" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />

          <label htmlFor="artistFilter">Artist:</label>
          <select id="artistFilter" value={artistFilter} onChange={(e) => setArtistFilter(e.target.value)}>
            <option value="">Toți</option>
            {artists.map((artist) => (
              <option key={artist._id} value={artist._id}>{artist.name}</option>
            ))}
          </select>
        </div>

        {filteredProducts.length === 0 ? (
          <p>Nu am găsit produse care să corespundă căutării.</p>
        ) : (
          <div className="products">
            {filteredProducts.map(product => (
              <ProductItem
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onTriggerLoginModal={openLoginModal}
                onDeleteClick={handleDeleteClick}
                onRequestDeleteComment={handleInstantDeleteComment} // direct delete
              />
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <InfoModal
          message="Dorești să ștergi acest produs?"
          type="confirm"
          onConfirm={handleDeleteConfirm}
          onClose={() => setShowDeleteModal(false)}
        />
      )}

      {showStockModal && (
        <InfoModal
          message={stockModalMessage}
          type="info"
          onClose={() => setShowStockModal(false)}
        />
      )}
    </>
  );
};

export default ProductList;
