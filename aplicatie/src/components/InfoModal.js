import React from 'react';
import './InfoModal.css';

const InfoModal = ({ message, onClose, type = 'success', showButton = true }) => {
  const getColor = () => {
    switch (type) {
      case 'error': return '#a00000';
      case 'warning': return '#e6a100';
      case 'info': return '#333';
      case 'success':
      default: return '#000';
    }
  };

  return (
    <div className="success-overlay">
      <div className="success-box">
        <button className="success-close" onClick={onClose}>×</button>
        <div className="success-logo">
          <span className="art">Art</span><span className="hunt">Hunt</span>
        </div>
        <h3 className="success-message" style={{ color: getColor() }}>{message}</h3>

        {showButton && (
          <div className="modal-button-row">
            <button className="confirm-btn" onClick={onClose}>OK</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoModal;
