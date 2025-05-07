import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="profile-page"><p>Te rugăm să te autentifici pentru a vedea profilul.</p></div>;
  }

  const initial = user.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Stânga */}
        <div className="profile-left">
          <div className="profile-avatar">{initial}</div>
          <h2>Profilul tău</h2>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        {/* Dreapta */}
        <div className="profile-right">
          <Link to="/favorites" className="profile-link-btn">❤️ Favorites</Link>
          <Link to="/orders" className="profile-link-btn">🛒 Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
