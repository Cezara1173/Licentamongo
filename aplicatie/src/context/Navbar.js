import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';  // Correct import path for your context
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth(); // Access user and logout from AuthContext
  const [ setIsSticky] = useState(false);
  const navigate = useNavigate(); // Used for redirection after logging out

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

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logging out
  };

  return (
    <nav className="navbar sticky">

      <h1>
        <span className="art">Art</span>
        <span className="hunt">Hunt</span>
      </h1>
      <div className="navbar-content">
        <input className="search-bar" type="text" placeholder="Search products..." />
        <div className="navbar-auth">
          {user ? (
            // Navbar for logged-in users
            <div className="navbar-user">
              <li><Link to="/products">Products</Link></li>
              <span className="welcome-message">Welcome, {user.username || user.email}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            // Navbar for non-logged-in users
            <div className="navbar-login-register">
              <span>Please login or register</span>
              <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
