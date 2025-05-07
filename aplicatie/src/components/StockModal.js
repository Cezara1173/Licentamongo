import React from 'react';
import './InfoModal.css'; 

const StockModal = ({ onClose }) => {
  return (
    <div className="success-overlay">
      <div className="success-box">
        <button className="success-close" onClick={onClose}>×</button>
        <div className="success-logo">
          <span className="art">Art</span><span className="hunt">Hunt</span>
        </div>
        <div className="success-message">Stoc epuizat!</div>
        <div className="modal-button-row">
          <button className="confirm-btn" onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
};

export default StockModal;
