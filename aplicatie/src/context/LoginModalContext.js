import React, { createContext, useContext, useState } from 'react';

const LoginModalContext = createContext();

export const LoginModalProvider = ({ children }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <LoginModalContext.Provider value={{ isLoginModalOpen, openLoginModal, closeLoginModal }}>
      {children}
    </LoginModalContext.Provider>
  );
};

export const useLoginModal = () => useContext(LoginModalContext);
