// context/InfoModalContext.js
import React, { createContext, useContext, useState } from 'react';

const InfoModalContext = createContext();

export const useInfoModal = () => useContext(InfoModalContext);

export const InfoModalProvider = ({ children }) => {
  const [modal, setModal] = useState({ show: false, message: '', type: 'success' });

  const showModal = (message, type = 'success') => {
    setModal({ show: true, message, type });
  };

  const closeModal = () => setModal({ ...modal, show: false });

  return (
    <InfoModalContext.Provider value={{ showModal, closeModal }}>
      {children}
      {modal.show && (
        <div className="success-overlay">
          <div className="success-box">
            <button className="success-close" onClick={closeModal}>×</button>
            <div className="success-logo">
              <span className="art">Art</span><span className="hunt">Hunt</span>
            </div>
            <h3 className="success-message" style={{ color: modal.type === 'error' ? '#a00000' : '#000' }}>
              {modal.message}
            </h3>
          </div>
        </div>
      )}
      {children}
    </InfoModalContext.Provider>
  );
};
