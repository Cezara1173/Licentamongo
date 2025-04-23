import React, { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import HeroCarousel from './HeroCarousel';
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

  const { token } = useAuth(); // ✅ user removed
  const { searchTerm } = useSearch();
  const { openLoginModal } = useLoginModal();
  const { cartItems, addToCart } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const results = products.map(product => {
      const itemInCart = cartItems.find(item => item._id === product._id);
      const adjustedStock = itemInCart ? product.stock - itemInCart.quantity : product.stock;
      return { ...product, stock: adjustedStock };
    }).filter(product => {
      const matchesSearch = (product.name || '').toLowerCase().includes((searchTerm || '').toLowerCase());
      const price = product.price || 0;
      const matchesPriceRange = price >= (minPrice || 0) && price <= (maxPrice || Infinity);
      return matchesSearch && matchesPriceRange;
    });

    setFilteredProducts(results);
  }, [products, cartItems, searchTerm, minPrice, maxPrice]);

  const handleAddToCart = (product) => {
    if (!token) {
      openLoginModal();
      return;
    }

    const productInCart = cartItems.find(item => item._id === product._id);
    const cartQuantity = productInCart ? productInCart.quantity : 0;
    const adjustedStock = product.stock - cartQuantity;

    if (adjustedStock <= 0) {
      alert('Stoc epuizat!');
      return;
    }

    addToCart(product);
  };

  return (
    <>
      <div className="hero-banner-container">
        <img src="/images/hero-banner.jpg" alt="Hero Banner" className="hero-banner-image" />
        <div className="hero-banner-overlay">
          <div className="hero-banner-text">
            <h1 className="hero-heading">Explorează acum expozițiile ArtHunt…</h1>
            <p className="hero-subtext">
              Găsește arta care te inspiră vizitând una din galeriile noastre. Conținutul include artă modernă,
              contemporană, artiști locali și internaționali.
            </p>
          </div>
        </div>
      </div>

      <HeroCarousel />

      <div className="product-list">
        <div className="filter-controls">
          <label htmlFor="minPrice">Preț Minim:</label>
          <input type="number" id="minPrice" value={minPrice} onChange={e => setMinPrice(e.target.value)} />
          <label htmlFor="maxPrice">Preț Maxim:</label>
          <input type="number" id="maxPrice" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} />
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
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductList;
