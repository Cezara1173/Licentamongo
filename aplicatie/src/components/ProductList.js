import React, { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import CosCumparaturi from './CosCumparaturi';
import { useAuth } from '../context/AuthContext';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const { token } = useAuth();
  const userId = "60c72b2f4f1a2565b5cbd1d1"; // Exemplu de userId, în practică ar trebui obținut din context sau altă sursă.

  useEffect(() => {
    // Fetch products from the API or database
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products'); // URL relativ
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search term
    const results = products.filter(product =>{
      const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriceRange = product.price >= (minPrice || 0) && product.price <= (maxPrice || Infinity);
      return matchesSearchTerm && matchesPriceRange;
    });
    setFilteredProducts(results);
  }, [searchTerm, minPrice, maxPrice, products]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMinPriceChange = (event) => {
    setMinPrice(event.target.value);
  };

  const handleMaxPriceChange = (event) => {
    setMaxPrice(event.target.value);
  };
    


  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const itemExists = prevItems.find(item => item._id === product._id);
      if (itemExists) {
        return prevItems.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item._id !== productId)
    );
  };

    const handleCheckout = async () => {
    const orderData = {
      userId,
      products: cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
      orderStatus: 'pending',
      shippingAddress: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'USA'
      },
      paymentMethod: 'Credit Card',
      paymentStatus: 'Paid'
    };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        body: JSON.stringify(orderData)
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('Order created successfully:', data);
      alert('Comanda a fost finalizată cu succes!');
      setCartItems([]); // Golește coșul de cumpărături după finalizare
    } catch (error) {
      console.error('Error creating order:', error);
      alert('A apărut o problemă la finalizarea comenzii. Vă rugăm să încercați din nou.');
    }
  };

  return (
    <div className="product-list">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div>
        <label htmlFor="minPrice">Min Price:</label>
        <input
          type="number"
          id="minPrice"
          value={minPrice}
          onChange={handleMinPriceChange}
        />
        <label htmlFor="maxPrice">Max Price:</label>
        <input
          type="number"
          id="maxPrice"
          value={maxPrice}
          onChange={handleMaxPriceChange}
        />
      </div>
      <div className="products">
        {filteredProducts.map(product => (
          <ProductItem key={product._id} product={product} onAddToCart={handleAddToCart} />
        ))}
      </div>
      <CosCumparaturi cartItems={cartItems} onRemoveFromCart={handleRemoveFromCart} onCheckout={handleCheckout} />
    </div>
  );
};

export default ProductList;