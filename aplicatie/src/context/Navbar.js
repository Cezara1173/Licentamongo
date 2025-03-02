import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Link } from 'react-router-dom';

import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = () => {
    const scrollTop = window.scrollY;
    if (scrollTop > 100) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    <nav className="navbar">
      <h1>Product Store</h1>
      {user ? (
        <div className="navbar-user">
          <ul>
            <li><Link to="/expositions">Expositions</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/artists">Artists</Link></li>
            <li><Link to="/artworks">Artworks</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
          <span className="cezara">Welcome, {user.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div className="navbar-auth">
          <span>Please login or register</span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
