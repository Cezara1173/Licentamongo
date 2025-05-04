import React, { useState } from 'react';
import './LoginModal.css'; // Refolosim stilul
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPasswordRequest = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Eroare la trimiterea emailului.');
    }
  };

  const handleClose = () => {
    navigate(-1); // Revine la pagina anterioară
  };

  return (
    <div className="login-overlay">
      <div className="login-box">
        <button className="login-close" onClick={handleClose}>×</button>

        <div className="login-logo">
          <span className="art">Art</span><span className="hunt">Hunt</span>
        </div>
        <h2 className="login-title">Resetare Parolă</h2>

        <input
          type="email"
          placeholder="Introdu emailul"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />

        <button className="login-button" onClick={handleSubmit}>
          Trimite link de resetare
        </button>

        {message && <p style={{ marginTop: '20px', color: '#333', textAlign: 'center' }}>{message}</p>}
      </div>
    </div>
  );
};

export default ResetPasswordRequest;
