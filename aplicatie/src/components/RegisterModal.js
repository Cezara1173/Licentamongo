import React, { useEffect, useState } from 'react';
import './RegisterModal.css';

const RegisterModal = ({ onClose, onRegisterSuccess, onSwitchToLogin, visible }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (visible) {
      setUsername('');
      setEmail('');
      setPassword('');
      setUsernameError('');
      setGeneralError('');
      setSuccessMessage('');
    }
  }, [visible]);

  const handleRegister = async () => {
    setUsernameError('');
    setGeneralError('');
    setSuccessMessage('');

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('Cont creat cu succes!');
        setTimeout(() => {
          setSuccessMessage('');
          onRegisterSuccess?.();
          onClose?.();
        }, 2000);
      } else {
        if (data.field === 'username') {
          setUsernameError('Acest username este deja folosit de un alt utilizator.');
        } else if (data.field === 'email') {
          setGeneralError(
            <>
              Contul deja există.{' '}
              <button onClick={onSwitchToLogin} className="link-button">Du-te la Log In</button>
            </>
          );
        } else {
          setGeneralError(data.message || 'Înregistrare eșuată.');
        }
      }
    } catch (err) {
      setGeneralError('Eroare de server, încearcă din nou mai târziu.');
    }
  };

  return (
    <div className="register-overlay">
      <div className="register-box">
        <button className="register-close" onClick={onClose}>×</button>
        <div className="register-logo">
          <span className="art">Art</span><span className="hunt">Hunt</span>
        </div>
        <h2 className="register-title">Sign up</h2>

        {successMessage && <div className="register-success">{successMessage}</div>}

        <input
          type="text"
          placeholder="Username"
          className={`register-input ${usernameError ? 'input-error' : ''}`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {usernameError && <p className="field-error">{usernameError}</p>}

        <input
          type="email"
          placeholder="Email"
          className="register-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="register-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {generalError && <p className="field-error">{generalError}</p>}

        <button className="register-button" onClick={handleRegister}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default RegisterModal;
