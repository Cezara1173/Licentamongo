import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });

  // 🔄 Salvează cartul în localStorage la fiecare modificare
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // 🔐 Verifică dacă token-ul este expirat
  const isTokenExpired = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // 🔁 La schimbarea tokenului, dacă e expirat/gol => goliți coșul
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken || isTokenExpired(storedToken)) {
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  }, [token]);

  // ➕ Adaugă un produs în coș
  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ➖ Elimină produsul după id
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item._id !== productId));
  };

  // 🧹 Golește coșul complet
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// 🎯 Hook custom pentru acces
export const useCart = () => useContext(CartContext);
