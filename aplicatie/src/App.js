import React, { useState } from 'react';
import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';
import { LoginModalProvider, useLoginModal } from './context/LoginModalContext';

import Navbar from './context/Navbar';
import Footer from './components/Footer';
import ProductList from './components/ProductList';
import ArtistList from './components/ArtistList';
import ExpositionList from './components/ExpositionList';
import ExpositionScrollDetail from './components/ExpositionScrollDetail';
import CartPage from './components/CartPage';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import ScrollToTop from './utils/ScrollToTop';
import HeroCarousel from './components/HeroCarousel';
import Favorites from './components/Favorites';
import ResetPasswordRequest from './components/ResetPasswordRequest';
import ResetPasswordForm from './components/ResetPasswordForm';

import './App.css';

const AppContent = () => {
  const { openLoginModal } = useLoginModal();

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/expositions" element={<ExpositionList />} />
        <Route path="/expositions/:id" element={<ExpositionScrollDetail />} />
        <Route path="/artists" element={<ArtistList onTriggerLoginModal={openLoginModal} />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/hero" element={<HeroCarousel />} />
        <Route path="/reset-password" element={<ResetPasswordRequest />} /> 
        <Route path="/reset-password/:token" element={<ResetPasswordForm />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

const AppWrapper = () => {
  const [showRegister, setShowRegister] = useState(false);
  const { openLoginModal } = useLoginModal();

  const openRegister = () => setShowRegister(true);
  const closeRegister = () => setShowRegister(false);

  return (
    <>
      <Navbar onLoginClick={openLoginModal} onRegisterClick={openRegister} />

      <div className="App">
        <AppContent />
      </div>

      <Footer />
      <LoginModal />

      {showRegister && (
        <RegisterModal
          key={`register-${Date.now()}`}
          onClose={closeRegister}
          onRegisterSuccess={closeRegister}
          onSwitchToLogin={() => {
            closeRegister();
            openLoginModal();
          }}
        />
      )}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <SearchProvider>
        <LoginModalProvider>
          <CartProvider>
            <AppWrapper />
          </CartProvider>
        </LoginModalProvider>
      </SearchProvider>
    </AuthProvider>
  );
};

export default App;
