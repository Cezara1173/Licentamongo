import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginModal.css';

const ResetPasswordForm = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/reset-password/${token}`, {
        newPassword,
      });
      setMessage(res.data.message);

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Eroare la resetarea parolei.');
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-box">
        <div className="login-logo">
          <span className="art">Art</span><span className="hunt">Hunt</span>
        </div>
        <h2 className="login-title">Setează o parolă nouă</h2>

        <input
          type="password"
          autoComplete="new-password"
          placeholder="Parola nouă"
          className="login-input"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button className="login-button" onClick={handleReset}>
          Resetează parola
        </button>

        {message && <p style={{ marginTop: '20px', color: '#333', textAlign: 'center' }}>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordForm;
