import React, { useState } from 'react';
import './LoginModal.css';
import { useLoginModal } from '../context/LoginModalContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal } = useLoginModal();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [fieldError, setFieldError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async () => {
    const result = await login(email, password, setError); // trimite setError ca callback
    if (result?.success) {
      closeLoginModal();
      setError(null);
      setFieldError('');
    } else {
      setFieldError(result?.field || ''); // poate fi 'email' sau 'password'
    }
  };

  const goToResetPassword = () => {
    closeLoginModal();
    navigate('/reset-password');
  };

  if (!isLoginModalOpen) return null;

  return (
    <div className="login-overlay">
      <div className="login-box">
        <button className="login-close" onClick={closeLoginModal}>×</button>
        <div className="login-logo">
          <span className="art">Art</span><span className="hunt">Hunt</span>
        </div>
        <h2 className="login-title">Sign up or log in</h2>

        <input
          type="email"
          placeholder="Email"
          className={`login-input ${fieldError === 'email' ? 'login-input-error' : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="off"
        />
        {fieldError === 'email' && <div className="login-error-message">{error}</div>}

        <input
          type="password"
          placeholder="Password"
          className={`login-input ${fieldError === 'password' ? 'login-input-error' : ''}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
        />
        {fieldError === 'password' && <div className="login-error-message">{error}</div>}

        <div
          onClick={goToResetPassword}
          className="reset-password-link"
        >
          Resetare Parolă
        </div>

        <button className="login-button" onClick={handleLogin}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
