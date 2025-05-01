import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useSearch } from './SearchContext';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const { user, logout } = useAuth();
  const { searchTerm, setSearchTerm } = useSearch();
  const [isSticky, setIsSticky] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${isSticky ? 'sticky' : ''}`}>
      <div className="navbar-left">
        <h1 className="logo">
          <span className="art">Art</span>
          <span className="hunt">Hunt</span>
        </h1>
      </div>

      <div className="navbar-center">
        <input
          className="search-bar"
          type="text"
          placeholder="Caută..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="navbar-right">
        <ul className="navbar-links">
          <li><Link to="/productlist">Products</Link></li>
          <li><Link to="/artists">Artists</Link></li>
          <li><Link to="/expositions">Expositions</Link></li>
          {user && (
        <li><Link to="/favorites">Favorites</Link></li> 
         )}
          {user && (
            <li><Link to="/cart">Cart</Link></li>
          )}
        </ul>

        {user ? (
          <div className="navbar-user">
            <span className="welcome-message">Welcome, {user.username || user.email}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="navbar-login-register">
            <span className="login-message">Please login or register</span>
            <ul className="auth-buttons">
              <li>
                <button className="styled-login-btn" onClick={onLoginClick}>Log In</button>
              </li>
              <li>
                <button className="styled-register-link" onClick={onRegisterClick}>Sign Up</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
