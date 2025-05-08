import React, { createContext, useContext, useState } from 'react';

const StockModalContext = createContext();

export const StockModalProvider = ({ children }) => {
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);

  const openStockModal = () => setIsStockModalOpen(true);
  const closeStockModal = () => setIsStockModalOpen(false);

  return (
    <StockModalContext.Provider value={{ isStockModalOpen, openStockModal, closeStockModal }}>
      {children}
    </StockModalContext.Provider>
  );
};

export const useStockModal = () => useContext(StockModalContext);
