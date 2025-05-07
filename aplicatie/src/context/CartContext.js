import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { token } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });

  // 🧠 Salvează cart-ul în localStorage la fiecare modificare
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Verificare expirare token
  const isTokenExpired = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  };

  // ⛔ Golește coșul dacă tokenul este expirat sau inexistent
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken || isTokenExpired(storedToken)) {
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  }, [token]);

  // ➕ Adaugă produs în coș
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

  // ➖ Elimină un produs din coș
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item._id !== productId));
  };

  // 🧼 Golește complet coșul (ex: după comandă reușită)
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  // 🧠 Obține cantitatea unui produs din coș (folosit în ProductList pentru calcul stoc vizual)
  const getCartQuantity = (productId) => {
    const product = cartItems.find(item => item._id === productId);
    return product ? product.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getCartQuantity
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
