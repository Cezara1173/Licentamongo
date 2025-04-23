import React, { useState } from 'react';
import './LoginModal.css';
import { useLoginModal } from '../context/LoginModalContext';
import { useAuth } from '../context/AuthContext';

const LoginModal = () => {
  const { isLoginModalOpen, closeLoginModal } = useLoginModal();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    await login(email, password);
    closeLoginModal();
  };

  if (!isLoginModalOpen) return null; // ✅ Prevent showing modal by default

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
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
